import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Lock, BarChart3, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    text: 'Conformité automatisée aux normes ISO 27001, NIST et RGPD',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    icon: Zap,
    text: 'Audits en temps réel avec rapports instantanés',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: Lock,
    text: 'Chiffrement de niveau entreprise pour vos données sensibles',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: BarChart3,
    text: 'Tableaux de bord intelligents et analytics prédictifs',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Users,
    text: 'Collaboration multi-équipes avec gestion des rôles avancée',
    color: 'from-pink-500 to-cyan-500'
  }
];

export function CarouselText() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const currentFeature = features[currentIndex];
  const Icon = currentFeature.icon;

  return (
    <div className="relative h-24 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <div className={`p-3 bg-gradient-to-br ${currentFeature.color} rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <p className="text-slate-300 text-lg max-w-2xl">
            {currentFeature.text}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-cyan-500 w-8' 
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
