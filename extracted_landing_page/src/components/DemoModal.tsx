import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Building, Mail, Phone, Users, MessageSquare, CheckCircle } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

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

              {!submitted ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-white text-2xl mb-2">Demander une démo</h2>
                    <p className="text-slate-400">Découvrez CyberGRC avec un expert en cybersécurité</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 text-sm mb-2 block">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          placeholder="Jean"
                          required
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 text-sm mb-2 block">
                          Nom *
                        </label>
                        <input
                          type="text"
                          placeholder="Dupont"
                          required
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">
                        Email professionnel *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          placeholder="votre@entreprise.com"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="+33 6 12 34 56 78"
                          className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">
                        Entreprise *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Nom de votre entreprise"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">
                        Taille de l'entreprise *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                          required
                          className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
                        >
                          <option value="">Sélectionnez...</option>
                          <option value="1-10">1-10 employés</option>
                          <option value="11-50">11-50 employés</option>
                          <option value="51-200">51-200 employés</option>
                          <option value="201-500">201-500 employés</option>
                          <option value="501+">Plus de 500 employés</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm mb-2 block">
                        Message (optionnel)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                        <textarea
                          placeholder="Parlez-nous de vos besoins en cybersécurité..."
                          rows={4}
                          className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                    >
                      Envoyer la demande
                    </button>
                  </form>

                  <p className="mt-4 text-center text-slate-500 text-sm">
                    Un expert vous contactera sous 24h ouvrées
                  </p>
                </>
              ) : (
                // Success state
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-white text-2xl mb-2">Demande envoyée !</h3>
                  <p className="text-slate-400">
                    Merci pour votre intérêt. Un expert vous contactera très prochainement.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
