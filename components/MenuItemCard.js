'use client';

import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';

export default function MenuItemCard({ item, lang, onOpen, onQuickAdd, index = 0, isOpen = true }) {
  const name = lang === 'ar' ? item.name_ar : item.name_en;
  const desc = lang === 'ar' ? item.desc_ar : item.desc_en;
  const available = item.available && isOpen;

  return (
    <motion.button
      onClick={() => onOpen(item)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.6), ease: 'easeOut' }}
      whileTap={{ scale: 0.98 }}
      className="relative text-left bg-neutral-900/60 rounded-3xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition group"
    >
      <div className="relative aspect-[4/3] bg-neutral-800 overflow-hidden">
        {item.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Rating badge */}
        {item.rating > 0 && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur rounded-full px-2 py-1 text-xs">
            <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
            <span className="font-semibold">{Number(item.rating).toFixed(1)}</span>
          </div>
        )}

        {/* Sold out overlay */}
        {!available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-bold uppercase tracking-wider border border-neutral-700">
              {!isOpen ? (lang === 'ar' ? 'مغلق حالياً' : 'Closed Now') : (lang === 'ar' ? 'نفذت الكمية' : 'Sold Out')}
            </span>
          </div>
        )}
      </div>

      <div className="p-3.5 pb-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-base leading-tight line-clamp-1">{name}</h3>
          <span className="font-display font-bold text-orange-500 text-base shrink-0 no-flip">${Number(item.price).toFixed(2)}</span>
        </div>
        <p className="text-xs text-neutral-400 mt-1 line-clamp-2 min-h-[2rem]">{desc}</p>
      </div>

      {/* Quick-add button */}
      <button
        onClick={(e) => { e.stopPropagation(); if (available) onQuickAdd(item); }}
        disabled={!available}
        className={`absolute bottom-3 end-3 w-10 h-10 rounded-full flex items-center justify-center transition ${
          available
            ? 'bg-orange-500 hover:bg-orange-600 active:scale-90 shadow-lg shadow-orange-500/30'
            : 'bg-neutral-800 cursor-not-allowed opacity-50'
        }`}
        aria-label="Quick add"
      >
        <Plus className="w-5 h-5 text-black" strokeWidth={3} />
      </button>
    </motion.button>
  );
}
