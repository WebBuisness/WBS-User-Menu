'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X, Minus, Plus, Star } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function ItemSheet({ item, open, onClose, onAdd }) {
  const { lang, t } = useLang();
  const [qty, setQty] = useState(1);
  const [isCombo, setIsCombo] = useState(false);
  const [note, setNote] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);

  useEffect(() => {
    if (open) {
      setQty(1);
      setIsCombo(false);
      setNote('');
      setUserRating(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, item]);

  if (!item) return null;

  const name = lang === 'ar' ? item.name_ar : item.name_en;
  const desc = lang === 'ar' ? item.desc_ar : item.desc_en;
  const comboDesc = lang === 'ar' ? (item.combo_desc_ar || t('comboDesc')) : (item.combo_desc_en || t('comboDesc'));
  const basePrice = Number(item.price);
  const comboExtra = item.has_combo && item.combo_price ? Number(item.combo_price) - basePrice : 2.7;
  const unitPrice = isCombo ? basePrice + comboExtra : basePrice;
  const total = unitPrice * qty;

  const handleAdd = () => {
    onAdd({
      id: item.id,
      name_en: item.name_en,
      name_ar: item.name_ar,
      image_url: item.image_url,
      price: basePrice,
      comboExtra,
      isCombo,
      note,
      qty,
      userRating,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 rounded-t-3xl max-h-[92vh] overflow-y-auto safe-bottom"
          >
            {/* Drag handle */}
            <div className="sticky top-0 z-10 bg-neutral-950/95 backdrop-blur flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-neutral-700" />
            </div>

            <button
              onClick={onClose}
              className="absolute top-3 end-3 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="relative aspect-[16/11] -mt-7">
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt={name} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent" />
            </div>

            <div className="px-5 pb-40 -mt-10 relative">
              {/* Title + price */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display font-extrabold text-2xl leading-tight">{name}</h2>
                <span className="font-display font-bold text-orange-500 text-2xl no-flip">${basePrice.toFixed(2)}</span>
              </div>

              {item.rating > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span className="font-semibold text-sm">{Number(item.rating).toFixed(1)}</span>
                  <span className="text-neutral-500 text-xs">({item.rating_count || 0})</span>
                </div>
              )}

              <p className="text-neutral-400 text-sm mt-3 leading-relaxed">{desc}</p>

              {/* Rate this item */}
              <div className="mt-5">
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">{t('rateItem')}</p>
                <div className="flex gap-1 no-flip">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      onClick={() => setUserRating(n)}
                      onMouseEnter={() => setHoverStar(n)}
                      onMouseLeave={() => setHoverStar(0)}
                      className="p-1"
                    >
                      <Star
                        className={`w-7 h-7 transition ${
                          (hoverStar || userRating) >= n
                            ? 'fill-orange-500 text-orange-500'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Combo option */}
              {item.has_combo && (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">{t('makeItCombo')}</p>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${!isCombo ? 'border-orange-500 bg-orange-500/5' : 'border-neutral-800 bg-neutral-900/50'}`}>
                      <input type="radio" className="dh-radio" checked={!isCombo} onChange={() => setIsCombo(false)} />
                      <span className="font-medium">{t('noThanks')}</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${isCombo ? 'border-orange-500 bg-orange-500/5' : 'border-neutral-800 bg-neutral-900/50'}`}>
                      <input type="radio" className="dh-radio" checked={isCombo} onChange={() => setIsCombo(true)} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold">{t('combo')} <span className="text-orange-500 no-flip">+${comboExtra.toFixed(2)}</span></span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">{comboDesc}</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Note */}
              <div className="mt-5">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t('notePlaceholder')}
                  rows={2}
                  className="w-full p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/50 focus:border-orange-500 focus:outline-none text-sm resize-none"
                />
              </div>

              {/* Quantity */}
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-neutral-500">{t('quantity')}</span>
                <div className="flex items-center gap-1 bg-neutral-900 rounded-full p-1 no-flip">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-full hover:bg-neutral-800 flex items-center justify-center">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-display font-bold text-lg">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-black" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent safe-bottom">
              <button
                onClick={handleAdd}
                className="w-full py-4 rounded-2xl btn-shimmer text-white font-display font-bold text-base flex items-center justify-between px-6 shadow-xl shadow-orange-500/20"
              >
                <span>{t('addToCart')}</span>
                <span className="no-flip">${total.toFixed(2)}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
