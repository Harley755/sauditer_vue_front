import { motion } from 'motion/react';
import { Shield, ChevronRight } from 'lucide-react';
import { CarouselText } from './CarouselText';

interface HeroProps {
  onLogin: () => void;
  onSignup: () => void;
  onDemo: () => void;
}

export function Hero({ onLogin, onSignup, onDemo }: HeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-500/5 rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xl tracking-tight">CyberGRC</span>
          </motion.div>

          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={onLogin}
              className="px-5 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Connexion
            </button>
            <button
              onClick={onSignup}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Commencer
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              Plateforme SaaS de Cybersécurité GRC
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white text-5xl lg:text-7xl mb-6 tracking-tight"
          >
            Auto-évaluation et gestion GRC simplifiées
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto"
          >
            Protégez votre organisation avec une plateforme complète de gouvernance, risques et conformité en cybersécurité
          </motion.p>

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <CarouselText />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onSignup}
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
            >
              Démarrer gratuitement
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onDemo}
              className="px-8 py-4 border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-900/50 transition-all"
            >
              Demander une démo
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}