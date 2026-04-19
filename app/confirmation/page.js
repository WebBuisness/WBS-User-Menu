'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Home } from 'lucide-react';
import { useLang } from '@/lib/i18n';

function ConfirmationPage() {
  const { lang, t } = useLang();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const o = localStorage.getItem('dh_last_order');
    if (o) {
      try { setOrder(JSON.parse(o)); } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 px-5 pb-16">
      {/* Animated check */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="relative w-28 h-28 rounded-full bg-orange-500 flex items-center justify-center shadow-2xl shadow-orange-500/40"
      >
        <motion.div
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Check className="w-14 h-14 text-black" strokeWidth={3.5} />
        </motion.div>

        {[0,1,2].map(i => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-orange-500"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display font-extrabold text-3xl sm:text-4xl text-center mt-8 tracking-tight"
      >
        {t('orderPlaced')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="text-neutral-400 text-center mt-2 max-w-sm"
      >
        {t('orderConfirmed')}. Check WhatsApp for confirmation from our team.
      </motion.p>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-8 w-full max-w-md p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800"
        >
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">{t('orderNumber')}</p>
          <p className="font-display font-extrabold text-orange-500 text-2xl no-flip">#{order.orderNo}</p>

          <div className="h-px bg-neutral-800 my-4" />

          <div className="space-y-1.5 text-sm">
            {order.items.map((it, i) => {
              const nm = lang === 'ar' ? it.name_ar : it.name_en;
              const unit = it.isCombo ? it.price + (it.comboExtra || 2.7) : it.price;
              return (
                <div key={i} className="flex justify-between gap-2">
                  <span className="text-neutral-300 truncate">{it.qty}× {nm}{it.isCombo && <span className="text-orange-500"> · COMBO</span>}</span>
                  <span className="no-flip">${(unit * it.qty).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-neutral-800 my-3" />
          <div className="flex justify-between text-base">
            <span className="font-display font-bold">{t('total')}</span>
            <span className="font-display font-extrabold text-orange-500 no-flip">${Number(order.total).toFixed(2)}</span>
          </div>

          <div className="mt-4 space-y-1 text-xs text-neutral-500">
            <p><span className="text-neutral-400">👤</span> {order.name}</p>
            <p className="no-flip"><span className="text-neutral-400">📞</span> {order.phone}</p>
            <p><span className="text-neutral-400">📍</span> {order.address}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 w-full max-w-md"
      >
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl btn-shimmer text-white font-display font-bold shadow-xl shadow-orange-500/30"
        >
          <Home className="w-5 h-5" />
          {t('backToMenu')}
        </Link>
      </motion.div>
    </div>
  );
}

function App() { return <ConfirmationPage />; }
export default App;
