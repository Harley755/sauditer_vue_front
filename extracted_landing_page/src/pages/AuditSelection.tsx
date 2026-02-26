import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useAudit } from '../contexts/AuditContext';
import { referentials } from '../data/referentials';

export function AuditSelection() {
  const navigate = useNavigate();
  const { startAudit } = useAudit();

  const handleSelectReferential = (referentialId: string) => {
    startAudit(referentialId);
    navigate('/questionnaire');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au tableau de bord
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-white text-4xl lg:text-5xl mb-4">
            Choisissez un référentiel
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Sélectionnez le référentiel de conformité pour lequel vous souhaitez réaliser un audit
          </p>
        </motion.div>

        {/* Referentials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {referentials.map((referential, index) => (
            <motion.button
              key={referential.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectReferential(referential.id)}
              className="group bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-left hover:border-cyan-500/50 hover:bg-slate-900 transition-all"
            >
              {/* Icon & Badge */}
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${referential.color} rounded-xl flex items-center justify-center text-3xl`}>
                  {referential.icon}
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-white text-2xl mb-3">{referential.name}</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                {referential.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  {referential.questions.length} questions
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  ~30-45 min
                </div>
              </div>

              {/* Categories Preview */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[...new Set(referential.questions.map(q => q.category))].slice(0, 3).map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-slate-800/50 text-slate-400 text-xs rounded-md"
                  >
                    {category}
                  </span>
                ))}
                {[...new Set(referential.questions.map(q => q.category))].length > 3 && (
                  <span className="px-2 py-1 text-slate-500 text-xs">
                    +{[...new Set(referential.questions.map(q => q.category))].length - 3} autres
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 max-w-4xl mx-auto bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6"
        >
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-400 text-xl">💡</span>
            </div>
            <div>
              <h4 className="text-white mb-2">Besoin d'aide pour choisir ?</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Chaque référentiel correspond à des exigences spécifiques. L'ISO 27001 est idéal pour la gestion globale de la sécurité, 
                le RGPD pour la protection des données personnelles, NIS 2 pour les opérateurs de services essentiels, 
                SOC 2 pour les fournisseurs de services cloud, et PCI DSS pour le traitement des paiements par carte.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
