import { createContext, useContext, useState, ReactNode } from 'react';

export interface AuditAnswer {
  questionId: string;
  answer: 'yes' | 'no' | 'partial' | 'na';
  notes?: string;
}

export interface AuditSession {
  referentialId: string;
  answers: AuditAnswer[];
  startedAt: Date;
  completedAt?: Date;
  userType?: 'citizen' | 'manager' | 'auditor';
}

interface AuditContextType {
  currentAudit: AuditSession | null;
  isAuthenticated: boolean;
  userType: 'citizen' | 'manager' | 'auditor' | null;
  startAudit: (referentialId: string) => void;
  answerQuestion: (questionId: string, answer: 'yes' | 'no' | 'partial' | 'na', notes?: string) => void;
  completeAudit: () => void;
  login: (userType: 'citizen' | 'manager' | 'auditor') => void;
  logout: () => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [currentAudit, setCurrentAudit] = useState<AuditSession | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'citizen' | 'manager' | 'auditor' | null>(null);

  const startAudit = (referentialId: string) => {
    setCurrentAudit({
      referentialId,
      answers: [],
      startedAt: new Date(),
      userType: userType || undefined
    });
  };

  const answerQuestion = (questionId: string, answer: 'yes' | 'no' | 'partial' | 'na', notes?: string) => {
    if (!currentAudit) return;

    setCurrentAudit(prev => {
      if (!prev) return null;
      
      const existingIndex = prev.answers.findIndex(a => a.questionId === questionId);
      const newAnswers = [...prev.answers];
      
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = { questionId, answer, notes };
      } else {
        newAnswers.push({ questionId, answer, notes });
      }

      return {
        ...prev,
        answers: newAnswers
      };
    });
  };

  const completeAudit = () => {
    if (!currentAudit) return;
    
    setCurrentAudit(prev => {
      if (!prev) return null;
      return {
        ...prev,
        completedAt: new Date()
      };
    });
  };

  const login = (type: 'citizen' | 'manager' | 'auditor') => {
    setIsAuthenticated(true);
    setUserType(type);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setCurrentAudit(null);
  };

  return (
    <AuditContext.Provider value={{
      currentAudit,
      isAuthenticated,
      userType,
      startAudit,
      answerQuestion,
      completeAudit,
      login,
      logout
    }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}
