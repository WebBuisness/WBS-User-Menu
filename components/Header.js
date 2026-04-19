'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Languages } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useLang } from '@/lib/i18n';

export default function Header({ showCart = true }) {
  const { count, mounted } = useCart();
  const { lang, toggle } = useLang();

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-neutral-900 safe-top">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition">
            <span className="font-display font-black text-sm text-black">DH</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-extrabold text-lg tracking-tight no-flip">Döner <span className="text-orange-500">House</span></span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 mt-0.5 no-flip">Serious taste</span>
          </div>
        </Link>

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
