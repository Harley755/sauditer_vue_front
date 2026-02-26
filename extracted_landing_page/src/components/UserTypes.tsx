import { motion } from 'motion/react';
import { User, ShieldCheck, SearchCheck, ArrowRight } from 'lucide-react';

interface UserTypesProps {
  onSignup: (userType: 'citizen' | 'manager' | 'auditor') => void;
}

export function UserTypes({ onSignup }: UserTypesProps) {
  const userTypes = [
    {
      id: 'citizen' as const,
      icon: User,
      title: 'Citoyen / Professionnel',
      description: 'Évaluez votre posture de sécurité personnelle ou celle de votre petite entreprise',
      features: [
        'Auto-évaluation guidée',
        'Rapports simplifiés',
        'Recommandations personnalisées',
        'Support communautaire'
      ],
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'manager' as const,
      icon: ShieldCheck,
      title: 'Responsable Sécurité',
      description: 'Gérez la conformité et les risques de votre organisation en toute simplicité',
      features: [
        'Tableaux de bord avancés',
        'Gestion multi-sites',
        'Rapports conformité',
        'Alertes en temps réel'
      ],
      color: 'from-blue-500 to-indigo-500',
      featured: true
    },
    {
      id: 'auditor' as const,
      icon: SearchCheck,
      title: 'Expert Auditeur',
      description: 'Réalisez des audits complets avec des outils professionnels de pointe',
      features: [
        'Méthodologies certifiées',
        'Rapports personnalisables',
        'Gestion clients multiples',
        'Bibliothèque de contrôles'
      ],
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section className="relative py-24 px-6 bg-slate-900/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm uppercase tracking-wider">Profils utilisateurs</span>
          <h2 className="text-white text-4xl lg:text-5xl mt-4 mb-4">
            Une solution adaptée à chaque profil
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Que vous soyez un particulier, un responsable sécurité ou un expert auditeur, nous avons la solution qui vous convient
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 bg-slate-900/50 border rounded-2xl hover:scale-105 transition-all ${
                  type.featured 
                    ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {type.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-full">
                      Populaire
                    </span>
                  </div>
                )}

                <div className={`w-14 h-14 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-white text-2xl mb-3">{type.title}</h3>
                <p className="text-slate-400 mb-6">{type.description}</p>

                <ul className="space-y-3 mb-8">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSignup(type.id)}
                  className={`w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 group ${
                    type.featured
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                      : 'border border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50'
                  }`}
                >
                  Créer un compte
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
