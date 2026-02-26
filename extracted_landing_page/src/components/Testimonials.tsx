import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sophie Durand',
    role: 'RSSI - Groupe Financier',
    company: 'BanquePlus',
    content: 'CyberGRC a transformé notre approche de la conformité. Nous avons réduit de 60% le temps consacré aux audits tout en améliorant notre posture de sécurité.',
    rating: 5,
    avatar: 'SD'
  },
  {
    name: 'Marc Lefebvre',
    role: 'Consultant Cybersécurité',
    company: 'SecureConsult',
    content: 'En tant qu\'auditeur, j\'apprécie particulièrement la flexibilité de la plateforme et la richesse de sa bibliothèque de contrôles. Un outil indispensable.',
    rating: 5,
    avatar: 'ML'
  },
  {
    name: 'Julie Martin',
    role: 'Directrice IT',
    company: 'TechCorp',
    content: 'L\'interface est intuitive et les rapports sont clairs. Même sans expertise approfondie en cybersécurité, nous pouvons gérer efficacement nos risques.',
    rating: 5,
    avatar: 'JM'
  }
];

export function Testimonials() {
  return (
    <section className="relative py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-400 text-sm uppercase tracking-wider">Témoignages</span>
          <h2 className="text-white text-4xl lg:text-5xl mt-4 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Découvrez comment CyberGRC aide les organisations à sécuriser leurs activités
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all relative"
            >
              <Quote className="absolute top-8 right-8 w-8 h-8 text-cyan-500/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-cyan-500 text-cyan-500" />
                ))}
              </div>

              <p className="text-slate-300 mb-6 leading-relaxed">
                {testimonial.content}
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="text-white">{testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  <div className="text-slate-500 text-sm">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-8 text-slate-400">
            <div className="text-center">
              <div className="text-white text-3xl mb-1">500+</div>
              <div className="text-sm">Organisations</div>
            </div>
            <div className="w-px h-12 bg-slate-800" />
            <div className="text-center">
              <div className="text-white text-3xl mb-1">10K+</div>
              <div className="text-sm">Audits réalisés</div>
            </div>
            <div className="w-px h-12 bg-slate-800" />
            <div className="text-center">
              <div className="text-white text-3xl mb-1">99.9%</div>
              <div className="text-sm">Disponibilité</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
