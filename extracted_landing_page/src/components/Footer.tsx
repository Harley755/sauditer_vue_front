import { Shield, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const links = {
    product: [
      { label: 'Fonctionnalités', href: '#' },
      { label: 'Tarification', href: '#' },
      { label: 'Démo', href: '#' },
      { label: 'API', href: '#' }
    ],
    resources: [
      { label: 'Documentation', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Webinaires', href: '#' }
    ],
    company: [
      { label: 'À propos', href: '#' },
      { label: 'Carrières', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Partenaires', href: '#' }
    ],
    legal: [
      { label: 'Confidentialité', href: '#' },
      { label: 'Conditions', href: '#' },
      { label: 'Sécurité', href: '#' },
      { label: 'Conformité', href: '#' }
    ]
  };

  return (
    <footer className="relative border-t border-slate-800 bg-slate-900/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xl tracking-tight">CyberGRC</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              La plateforme SaaS de référence pour l'auto-évaluation et la gestion GRC en cybersécurité
            </p>
            <div className="space-y-2 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contact@cybergrc.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +33 1 23 45 67 89
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Paris, France
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white mb-4">Produit</h3>
            <ul className="space-y-2">
              {links.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Ressources</h3>
            <ul className="space-y-2">
              {links.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {links.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Légal</h3>
            <ul className="space-y-2">
              {links.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Certifications */}
        <div className="py-8 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            {['ISO 27001', 'SOC 2', 'RGPD', 'NIST'].map((cert, index) => (
              <div key={index} className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
                <span className="text-slate-400 text-sm">{cert}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © 2025 CyberGRC. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
              LinkedIn
            </a>
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
              Twitter
            </a>
            <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
