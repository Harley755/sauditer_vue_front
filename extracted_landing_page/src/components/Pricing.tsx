import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '0',
    period: 'Gratuit',
    description: 'Parfait pour découvrir la plateforme',
    features: [
      '1 audit par mois',
      'Rapports basiques',
      'Support communautaire',
      'Accès limité aux frameworks',
      'Export PDF'
    ],
    cta: 'Commencer gratuitement',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '99',
    period: '/ mois',
    description: 'Pour les professionnels et PME',
    features: [
      'Audits illimités',
      'Tous les frameworks (ISO 27001, NIST, RGPD)',
      'Tableaux de bord avancés',
      'Support prioritaire',
      'Gestion multi-utilisateurs (5)',
      'API access',
      'Rapports personnalisables',
      'Stockage 100 GB'
    ],
    cta: 'Essayer 14 jours gratuits',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Sur mesure',
    period: '',
    description: 'Pour les grandes organisations',
    features: [
      'Tout du plan Professional',
      'Utilisateurs illimités',
      'SSO & SAML',
      'Audit trails complets',
      'SLA garanti 99.9%',
      'Manager dédié',
      'Formation personnalisée',
      'Stockage illimité',
      'Déploiement on-premise disponible'
    ],
    cta: 'Contactez-nous',
    highlighted: false
  }
];

export function Pricing() {
  return (
    <section className="relative py-24 px-6 bg-slate-900/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm uppercase tracking-wider">Tarification</span>
          <h2 className="text-white text-4xl lg:text-5xl mt-4 mb-4">
            Un plan pour chaque besoin
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Commencez gratuitement, évoluez à votre rythme. Tous les plans incluent notre garantie satisfait ou remboursé de 30 jours
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl transition-all ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/10 scale-105'
                  : 'bg-slate-900/50 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Recommandé
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white text-2xl mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                {plan.price === 'Sur mesure' ? (
                  <div className="text-white text-3xl">{plan.price}</div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-white text-5xl">{plan.price}</span>
                    <span className="text-slate-400">€</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                    : 'border border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400">
            Besoin d'une configuration spécifique ?{' '}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Contactez notre équipe commerciale
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
