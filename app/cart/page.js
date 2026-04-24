'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, Tag, ArrowLeft, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '@/lib/cart';
import { useLang } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { isRestaurantOpen } from '@/lib/utils';

function CartPage() {
  const { lang, t, isRTL } = useLang();
  const { items, updateQty, removeItem, subtotal, mounted } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('dh_promo');
    if (saved) {
      try { setPromoApplied(JSON.parse(saved)); } catch {}
    }
    // fetch settings for schedule
    (async () => {
      try {
        const { data } = await supabase.from('settings').select('*');
        if (data) {
          const manualOpen = data.find(s => s.key === 'restaurant_open')?.value;
          const rawSchedule = data.find(s => s.key === 'opening_hours')?.value;
          let parsedSchedule = null;
          if (rawSchedule) {
            try { parsedSchedule = typeof rawSchedule === 'string' ? JSON.parse(rawSchedule) : rawSchedule; } catch {}
          }
          setSchedule(parsedSchedule);
          setIsOpen(isRestaurantOpen(parsedSchedule, manualOpen !== 'false'));
        }
      } catch {}
    })();
  }, []);

  const discount = promoApplied
    ? promoApplied.discount_type === 'percent'
      ? (subtotal * (Number(promoApplied.value) || 0)) / 100
      : Math.min(Number(promoApplied.value) || 0, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discount);

  const removePromo = () => {
    setPromoApplied(null);
    setPromoInput('');
    localStorage.removeItem('dh_promo');
  };

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setCheckingPromo(true);
    setPromoError('');
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code)
        .eq('active', true)
        .maybeSingle();
      if (error) {
        console.error('Supabase Promo Error:', error);
        setPromoError(t('invalidPromo'));
      } else if (!data) {
        setPromoError(t('invalidPromo'));
      } else {
        setPromoApplied(data);
        localStorage.setItem('dh_promo', JSON.stringify(data));
      }
    } catch {
      setPromoError(t('invalidPromo'));
    } finally {
      setCheckingPromo(false);
    }
  };

  return (
    <div className="min-h-screen pb-36">
      <Header isOpen={isOpen} schedule={schedule} />

      <main className="max-w-2xl mx-auto px-4 pt-5">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/" className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center transition">
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">{t('cart')}</h1>
        </div>

        {mounted && items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-neutral-900 flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-neutral-600" />
            </div>
            <p className="text-neutral-500 mb-6">{t('emptyCart')}</p>
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-black font-display font-bold transition"
            >
              {t('browseMenu')}
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((it, idx) => {
                  const name = lang === 'ar' ? it.name_ar : it.name_en;
                  const unit = it.isCombo ? it.price + (it.comboExtra || 2.7) : it.price;
                  return (
                    <motion.div
                      key={it.lineKey}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800"
                    >
                      {it.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image_url} alt={name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-display font-bold text-sm leading-tight truncate">{name}</h3>
                            {it.isCombo && (
                              <span className="inline-block mt-1 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-semibold">
                                + COMBO
                              </span>
                            )}
                            {it.note && (
                              <p className="text-[11px] text-neutral-500 mt-1 truncate">{it.note}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(it.lineKey)}
                            className="text-neutral-500 hover:text-red-500 transition p-1 -m-1"
                            aria-label={t('remove')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 bg-neutral-950 rounded-full p-1 no-flip">
                            <button onClick={() => updateQty(it.lineKey, it.qty - 1)} className="w-7 h-7 rounded-full hover:bg-neutral-800 flex items-center justify-center">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-display font-bold text-sm">{it.qty}</span>
                            <button onClick={() => updateQty(it.lineKey, it.qty + 1)} className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center">
                              <Plus className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                            </button>
                          </div>
                          <span className="font-display font-bold text-orange-500 no-flip">
                            ${(unit * it.qty).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Promo */}
            <div className="mt-6">
              <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">{t('promoCode')}</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-neutral-500" />
                  <input
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                    placeholder="WELCOME10"
                    className="w-full ps-10 pe-3 py-3 rounded-xl border border-neutral-800 focus:border-orange-500 focus:outline-none uppercase text-sm font-medium no-flip"
                  />
                </div>
                <button
                  onClick={applyPromo}
                  disabled={checkingPromo || !promoInput}
                  className="px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 font-display font-bold text-sm disabled:opacity-40 transition"
                >
                  {t('apply')}
                </button>
              </div>
              {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}
              {promoApplied && (
                <div className="flex items-center justify-between mt-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-green-400 text-xs truncate">✓ {t('promoApplied')} ({promoApplied.code})</p>
                  <button onClick={removePromo} className="text-green-400 hover:text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-green-500/20 transition">
                    {t('remove') || 'Remove'}
                  </button>
                </div>
              )}
            </div>

            {mounted && items.length > 0 && (
              <div className="mt-6 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">{t('subtotal')}</span>
                  <span className="font-semibold no-flip">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>{t('discount')}</span>
                    <span className="font-semibold no-flip">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="h-px bg-neutral-800 my-1" />
                <div className="flex justify-between text-lg">
                  <span className="font-display font-bold">{t('total')}</span>
                  <span className="font-display font-extrabold text-orange-500 no-flip">${total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {mounted && items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent safe-bottom z-30">
          <Link
            href="/checkout"
            className="block w-full py-4 rounded-2xl btn-shimmer text-white font-display font-bold text-base text-center shadow-xl shadow-orange-500/30 max-w-2xl mx-auto"
          >
            {t('proceedCheckout')} · <span className="no-flip">${total.toFixed(2)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}

function App() { return <CartPage />; }
export default App;
