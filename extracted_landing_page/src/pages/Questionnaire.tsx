import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  MinusCircle, 
  AlertCircle,
  FileText,
  Save
} from 'lucide-react';
import { useAudit } from '../contexts/AuditContext';
import { referentials } from '../data/referentials';

export function Questionnaire() {
  const navigate = useNavigate();
  const { currentAudit, answerQuestion } = useAudit();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'yes' | 'no' | 'partial' | 'na' | null>(null);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  // Get current referential
  const referential = referentials.find(r => r.id === currentAudit?.referentialId);

  useEffect(() => {
    if (!currentAudit || !referential) {
      navigate('/audit-selection');
      return;
    }

    // Load existing answer if any
    const existingAnswer = currentAudit.answers.find(
      a => a.questionId === referential.questions[currentQuestionIndex].id
    );
    
    if (existingAnswer) {
      setSelectedAnswer(existingAnswer.answer);
      setNotes(existingAnswer.notes || '');
      setShowNotes(!!existingAnswer.notes);
    } else {
      setSelectedAnswer(null);
      setNotes('');
      setShowNotes(false);
    }
  }, [currentQuestionIndex, currentAudit, referential, navigate]);

  if (!currentAudit || !referential) {
    return null;
  }

  const currentQuestion = referential.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / referential.questions.length) * 100;

  const handleAnswer = (answer: 'yes' | 'no' | 'partial' | 'na') => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      answerQuestion(currentQuestion.id, selectedAnswer, notes);
      
      if (currentQuestionIndex < referential.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Complete audit and go to results
        navigate('/results');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSaveAndExit = () => {
    if (selectedAnswer) {
      answerQuestion(currentQuestion.id, selectedAnswer, notes);
    }
    navigate('/dashboard');
  };

  const answerOptions = [
    { value: 'yes' as const, label: 'Oui', icon: CheckCircle, color: 'emerald' },
    { value: 'partial' as const, label: 'Partiel', icon: MinusCircle, color: 'yellow' },
    { value: 'no' as const, label: 'Non', icon: XCircle, color: 'red' },
    { value: 'na' as const, label: 'N/A', icon: AlertCircle, color: 'slate' }
  ];

  // Get unique categories for progress tracking
  const categories = [...new Set(referential.questions.map(q => q.category))];
  const currentCategory = currentQuestion.category;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header with Progress */}
        <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleSaveAndExit}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Sauvegarder et quitter
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-slate-400 text-sm">
                  Question {currentQuestionIndex + 1} / {referential.questions.length}
                </div>
                <button
                  onClick={handleSaveAndExit}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Sauvegarder"
                >
                  <Save className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-600"
              />
            </div>

            {/* Referential Badge */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-2xl">{referential.icon}</span>
              <span className="text-white">{referential.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-sm">{currentCategory}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Question */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-white text-2xl mb-3 leading-relaxed">
                        {currentQuestion.question}
                      </h2>
                      {currentQuestion.description && (
                        <p className="text-slate-400 leading-relaxed">
                          {currentQuestion.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Answer Options */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {answerOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = selectedAnswer === option.value;
                      
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleAnswer(option.value)}
                          className={`
                            p-4 rounded-xl border-2 transition-all
                            ${isSelected
                              ? `border-${option.color}-500 bg-${option.color}-500/10`
                              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                            }
                          `}
                        >
                          <Icon className={`
                            w-8 h-8 mx-auto mb-2
                            ${isSelected ? `text-${option.color}-400` : 'text-slate-400'}
                          `} />
                          <div className={`
                            text-sm
                            ${isSelected ? `text-${option.color}-400` : 'text-slate-300'}
                          `}>
                            {option.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Ajouter des notes (optionnel)</span>
                  </button>

                  <AnimatePresence>
                    {showNotes && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Ajoutez des précisions, contexte ou actions à prévoir..."
                          rows={4}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-3 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Précédent
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {currentQuestionIndex < referential.questions.length - 1 ? (
                      <>
                        Suivant
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        Terminer l'audit
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
