import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { UserTypes } from '../components/UserTypes';
import { AuditCTA } from '../components/AuditCTA';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { Pricing } from '../components/Pricing';
import { Footer } from '../components/Footer';
import { LoginModal } from '../components/LoginModal';
import { SignupModal } from '../components/SignupModal';
import { DemoModal } from '../components/DemoModal';
import { useAudit } from '../contexts/AuditContext';

export function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [signupUserType, setSignupUserType] = useState<'citizen' | 'manager' | 'auditor' | null>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAudit();

  const handleSignup = (userType: 'citizen' | 'manager' | 'auditor') => {
    setSignupUserType(userType);
    setIsSignupOpen(true);
  };

  const handleLoginSuccess = (userType: 'citizen' | 'manager' | 'auditor') => {
    login(userType);
    setIsLoginOpen(false);
    navigate('/dashboard');
  };

  const handleSignupSuccess = (userType: 'citizen' | 'manager' | 'auditor') => {
    login(userType);
    setIsSignupOpen(false);
    navigate('/dashboard');
  };

  const handleStartAudit = () => {
    if (isAuthenticated) {
      navigate('/audit-selection');
    } else {
      setIsSignupOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero 
        onLogin={() => setIsLoginOpen(true)} 
        onSignup={() => setIsSignupOpen(true)}
        onDemo={() => setIsDemoOpen(true)}
      />
      <Features />
      <UserTypes onSignup={handleSignup} />
      <AuditCTA onStartAudit={handleStartAudit} />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
      
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => {
          setIsSignupOpen(false);
          setSignupUserType(null);
        }}
        onSuccess={handleSignupSuccess}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
        userType={signupUserType}
      />
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </div>
  );
}