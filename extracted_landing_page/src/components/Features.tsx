import { motion } from 'motion/react';
import { Shield, FileCheck, AlertTriangle, TrendingUp, Users, Lock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Auto-évaluation intelligente',
    description: 'Évaluez votre posture de sécurité en quelques clics avec notre IA avancée'
  },
  {
    icon: FileCheck,
    title: 'Conformité multi-normes',
    description: 'ISO 27001, NIST, RGPD, SOC 2 - Gérez toutes vos conformités en un seul endroit'
  },
  {
    icon: AlertTriangle,
    title: 'Gestion des risques',
    description: 'Identifiez, évaluez et mitigez les risques cyber de manière proactive'
  },
  {
    icon: TrendingUp,
    title: 'Analytics en temps réel',
    description: 'Visualisez vos métriques de sécurité avec des dashboards personnalisables'
  },
  {
    icon: Users,
    title: 'Collaboration intégrée',
    description: 'Travaillez en équipe avec des workflows adaptés à chaque rôle'
  },
  {
    icon: Lock,
    title: 'Sécurité garantie',
    description: 'Hébergement sécurisé avec chiffrement end-to-end et conformité certifiée'
  }
];

export function Features() {
  return (
    <section className="relative py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm uppercase tracking-wider">Fonctionnalités</span>
          <h2 className="text-white text-4xl lg:text-5xl mt-4 mb-4">
            Une plateforme complète pour votre cybersécurité
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Tous les outils dont vous avez besoin pour gérer efficacement votre gouvernance, vos risques et votre conformité
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-white text-xl mb-3">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
