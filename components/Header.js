'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Languages, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { useLang } from '@/lib/i18n';
import { formatOpeningHours } from '@/lib/utils';

export default function Header({ showCart = true, isOpen = true, schedule = null }) {
  const { count, mounted } = useCart();
  const { lang, toggle, t } = useLang();
  const [showHours, setShowHours] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-neutral-900 safe-top">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition">
              <span className="font-display font-black text-sm text-black">KB</span>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-extrabold text-lg tracking-tight no-flip">WBS <span className="text-orange-500">Menu Demo</span></span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 mt-0.5 no-flip">Serious taste</span>
            </div>
          </Link>

          {/* Status Indicator */}
          <div className="relative">
            <button
              onClick={() => setShowHours(!showHours)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition"
            >
              <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                {isOpen ? (t('open') || 'Open') : (t('closed') || 'Closed')}
              </span>
              <ChevronDown className={`w-3 h-3 text-neutral-500 transition ${showHours ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showHours && schedule && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 p-3 w-48 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl z-50 text-left"
                >
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {t('workingHours') || 'Working Hours'}
                  </p>
                  <pre className="text-[11px] font-sans text-neutral-300 leading-relaxed whitespace-pre-line">
                    {formatOpeningHours(schedule, lang)}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 transition text-sm font-medium"
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4 text-orange-500" />
            <span className="no-flip">{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>

          {showCart && (
            <Link
              href="/cart"
              className="relative w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.35 }}
                  className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-orange-500 text-black text-[11px] font-bold flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
