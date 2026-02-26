import { motion } from 'motion/react';
import { PlayCircle, CheckCircle } from 'lucide-react';

interface AuditCTAProps {
  onStartAudit?: () => void;
}

export function AuditCTA({ onStartAudit }: AuditCTAProps) {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-cyan-500/30 rounded-3xl backdrop-blur-sm"
        >
          <div className="text-center mb-12">
            <h2 className="text-white text-4xl lg:text-5xl mb-4">
              Prêt à commencer votre audit ?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Lancez votre première évaluation en moins de 5 minutes et obtenez un rapport détaillé de votre posture de sécurité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { step: '1', title: 'Créez votre compte', desc: 'Inscription rapide et gratuite' },
              { step: '2', title: 'Choisissez votre audit', desc: 'Sélectionnez le type d\'évaluation' },
              { step: '3', title: 'Obtenez vos résultats', desc: 'Rapport instantané et actionnable' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white">{item.step}</span>
                </div>
                <h3 className="text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStartAudit}
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Commencer un audit maintenant
            </button>
            <button className="px-8 py-4 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-800/50 transition-all flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Voir un exemple de rapport
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}