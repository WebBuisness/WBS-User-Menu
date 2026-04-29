'use client';

import { motion } from 'framer-motion';

// ============================================================
//  FOOTER SETTINGS — Edit here to customize your footer
// ============================================================

const FOOTER_CONFIG = {
  brandName: 'WBS Menu Demo',
  tagline: 'Serious taste, real flavor.',
  tagline_ar: 'طعم حقيقي، نكهة أصيلة.',

  credits: {
    show: true,
    text: 'Built with',
    names: 'Baraa & Ziad Nahouli',
  },

  links: [
    // { label: 'Instagram', label_ar: 'انستقرام', href: 'https://instagram.com/karmeshbroasted' },
    // { label: 'WhatsApp', label_ar: 'واتساب', href: 'https://wa.me/966500000000' },
  ],

  year: new Date().getFullYear(),
};

// ============================================================

export default function Footer({ lang = 'en' }) {
  const isAr = lang === 'ar';

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-12 border-t border-neutral-900"
    >
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="font-display font-black text-xs text-black no-flip">KB</span>
          </div>
          <span className="font-display font-extrabold text-base tracking-tight no-flip">
            {FOOTER_CONFIG.brandName.split(' ')[0]}{' '}
            <span className="text-orange-500">{FOOTER_CONFIG.brandName.split(' ')[1]}</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xs text-neutral-500 text-center">
          {isAr ? FOOTER_CONFIG.tagline_ar : FOOTER_CONFIG.tagline}
        </p>

        {/* Links (uncomment in FOOTER_CONFIG to activate) */}
        {FOOTER_CONFIG.links.length > 0 && (
          <div className="flex items-center gap-5">
            {FOOTER_CONFIG.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-500 hover:text-orange-500 transition"
              >
                {isAr ? link.label_ar : link.label}
              </a>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="w-16 h-px bg-neutral-800" />

        {/* Credits */}
        {FOOTER_CONFIG.credits.show && (
          <p className="text-[11px] text-neutral-700 tracking-wider text-center">
            {FOOTER_CONFIG.credits.text}{' '}
            <span className="text-red-600">♥</span>{' by '}
            <span className="text-neutral-500 font-medium">{FOOTER_CONFIG.credits.names}</span>
          </p>
        )}

        {/* Year */}
        <p className="text-[10px] text-neutral-800 no-flip">
          © {FOOTER_CONFIG.year} {FOOTER_CONFIG.brandName}
        </p>
      </div>
    </motion.footer>
  );
}
