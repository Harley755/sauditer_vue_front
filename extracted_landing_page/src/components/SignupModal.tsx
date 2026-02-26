import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Building, Shield, ChevronRight } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userType: 'citizen' | 'manager' | 'auditor') => void;
  onSwitchToLogin: () => void;
  userType: 'citizen' | 'manager' | 'auditor' | null;
}

const userTypeInfo = {
  citizen: {
    title: 'Compte Citoyen / Professionnel',
    description: 'Pour les particuliers et petites entreprises',
    icon: User,
    color: 'from-cyan-500 to-blue-500'
  },
  manager: {
    title: 'Compte Responsable Sécurité',
    description: 'Pour les RSSI et responsables conformité',
    icon: Shield,
    color: 'from-blue-500 to-indigo-500'
  },
  auditor: {
    title: 'Compte Expert Auditeur',
    description: 'Pour les consultants et cabinets d\'audit',
    icon: Building,
    color: 'from-indigo-500 to-purple-500'
  }
};

export function SignupModal({ isOpen, onClose, onSuccess, onSwitchToLogin, userType }: SignupModalProps) {
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [selectedType, setSelectedType] = useState<'citizen' | 'manager' | 'auditor' | null>(userType);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organization: ''
  });

  const handleSelectType = (type: 'citizen' | 'manager' | 'auditor') => {
    setSelectedType(type);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      onSuccess(selectedType);
    }
  };

  const handleGoogleSignup = () => {
    if (selectedType) {
      onSuccess(selectedType);
    }
  };

  const handleBack = () => {
    setStep('select');
    setSelectedType(null);
  };

  // If userType is pre-selected, go directly to form
  if (userType && step === 'select') {
    setStep('form');
    setSelectedType(userType);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-8 relative my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {step === 'select' ? (
                <>
                  {/* Type Selection */}
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-white text-2xl mb-2">Créer un compte</h2>
                    <p className="text-slate-400">Choisissez le type de compte qui vous correspond</p>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(userTypeInfo).map(([type, info]) => {
                      const Icon = info.icon;
                      return (
                        <button
                          key={type}
                          onClick={() => handleSelectType(type as 'citizen' | 'manager' | 'auditor')}
                          className="w-full p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-left group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white mb-1">{info.title}</h3>
                              <p className="text-slate-400 text-sm">{info.description}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-6 text-center text-slate-400 text-sm">
                    Vous avez déjà un compte ?{' '}
                    <button 
                      type="button"
                      onClick={onSwitchToLogin} 
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Se connecter
                    </button>
                  </p>
                </>
              ) : (
                <>
                  {/* Signup Form */}
                  {selectedType && (
                    <>
                      <div className="text-center mb-8">
                        <button
                          onClick={handleBack}
                          className="text-slate-400 hover:text-white transition-colors text-sm mb-4 flex items-center gap-1 mx-auto"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180" />
                          Retour
                        </button>
                        <div className={`w-14 h-14 bg-gradient-to-br ${userTypeInfo[selectedType].color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                          {(() => {
                            const Icon = userTypeInfo[selectedType].icon;
                            return <Icon className="w-7 h-7 text-white" />;
                          })()}
                        </div>
                        <h2 className="text-white text-2xl mb-2">{userTypeInfo[selectedType].title}</h2>
                        <p className="text-slate-400">{userTypeInfo[selectedType].description}</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-300 text-sm mb-2 block">
                              Prénom
                            </label>
                            <input
                              type="text"
                              placeholder="Jean"
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              required
                              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-slate-300 text-sm mb-2 block">
                              Nom
                            </label>
                            <input
                              type="text"
                              placeholder="Dupont"
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              required
                              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                          </div>
                        </div>

                        {selectedType !== 'citizen' && (
                          <div>
                            <label className="text-slate-300 text-sm mb-2 block">
                              Organisation
                            </label>
                            <input
                              type="text"
                              placeholder="Nom de votre organisation"
                              value={formData.organization}
                              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                              required
                              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-slate-300 text-sm mb-2 block">
                            Email professionnel
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="email"
                              placeholder="votre@email.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                              className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-slate-300 text-sm mb-2 block">
                            Mot de passe
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="password"
                              placeholder="Minimum 8 caractères"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required
                              minLength={8}
                              className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                          </div>
                          <p className="text-slate-500 text-xs mt-1">
                            Au moins 8 caractères avec majuscules, chiffres et symboles
                          </p>
                        </div>

                        <div className="pt-2">
                          <label className="flex items-start gap-3 text-slate-400 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              required
                              className="w-4 h-4 rounded border-slate-700 bg-slate-800/50 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 mt-0.5"
                            />
                            <span>
                              J'accepte les{' '}
                              <a href="#" className="text-cyan-400 hover:text-cyan-300">
                                conditions d'utilisation
                              </a>{' '}
                              et la{' '}
                              <a href="#" className="text-cyan-400 hover:text-cyan-300">
                                politique de confidentialité
                              </a>
                            </span>
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                        >
                          Créer mon compte
                        </button>
                      </form>

                      <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-slate-500 text-sm">ou</span>
                        <div className="flex-1 h-px bg-slate-800" />
                      </div>

                      <div className="space-y-3">
                        <button 
                          type="button"
                          onClick={handleGoogleSignup}
                          className="w-full py-3 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800/50 transition-all flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          S'inscrire avec Google
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}