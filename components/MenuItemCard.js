'use client';

import { motion } from 'framer-motion';
import { Plus, Star, Flame } from 'lucide-react';
import Image from 'next/image';

export default function MenuItemCard({ item, lang, onOpen, onQuickAdd, index = 0, isOpen = true }) {
  const name = lang === 'ar' ? item.name_ar : item.name_en;
  const desc = lang === 'ar' ? item.desc_ar : item.desc_en;
  const available = item.available && isOpen;
  const isPopular = item.rating >= 4.8 && item.rating_count >= 100;

  return (
    <motion.div
      onClick={() => available && onOpen(item)}
      role="button"
      tabIndex={available ? 0 : -1}
      onKeyDown={(e) => {
        if (available && (e.key === 'Enter' || e.key === ' ')) onOpen(item);
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5), ease: [0.23, 1, 0.32, 1] }}
      whileTap={available ? { scale: 0.96 } : {}}
      whileHover={available ? { y: -4 } : {}}
      className={`relative text-left bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800/80 transition-all duration-300 group flex flex-col ${
        available
          ? 'hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 cursor-pointer'
          : 'cursor-not-allowed opacity-80'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-neutral-800 overflow-hidden shrink-0">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={name}
            fill
            priority={index < 4}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="object-cover group-hover:scale-[1.1] transition-transform duration-1000 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🌯</div>
        )}

        {/* Rich gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />

        {/* Top badges row */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
          {/* Rating */}
          {item.rating > 0 && (
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
              <Star className="w-2.5 h-2.5 fill-orange-500 text-orange-500" />
              <span className="text-[10px] font-bold text-white">{Number(item.rating).toFixed(1)}</span>
            </div>
          )}

          {/* Popular badge */}
          {isPopular && (
            <div className="flex items-center gap-1 bg-orange-500/90 backdrop-blur-sm rounded-full px-2 py-1 ms-auto">
              <Flame className="w-2.5 h-2.5 text-black" />
              <span className="text-[10px] font-bold text-black uppercase tracking-wide">
                {lang === 'ar' ? 'الأكثر طلباً' : 'Popular'}
              </span>
            </div>
          )}
        </div>

        {/* Combo badge on image bottom */}
        {item.has_combo && available && (
          <div className="absolute bottom-2 start-2.5">
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80">
              + Combo
            </span>
          </div>
        )}

        {/* Sold out / Closed overlay */}
        {!available && (
          <div className="absolute inset-0 bg-black/65 backdrop-grayscale flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-neutral-900/90 text-neutral-300 text-[10px] font-bold uppercase tracking-widest border border-neutral-700 shadow-xl">
              {!isOpen
                ? (lang === 'ar' ? 'مغلق الآن' : 'Closed Now')
                : (lang === 'ar' ? 'نفذت الكمية' : 'Sold Out')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-4 pt-3.5 pb-12">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-display font-bold text-[15px] leading-snug line-clamp-2 flex-1">{name}</h2>
          <span className="font-display font-extrabold text-orange-500 text-sm shrink-0 no-flip mt-0.5">
            ${Number(item.price).toFixed(2)}
          </span>
        </div>

        {/* Description */}
        {desc && (
          <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed line-clamp-2 flex-1">{desc}</p>
        )}
      </div>

      {/* Quick-add button — floated over bottom-right of content */}
      <button
        onClick={(e) => { e.stopPropagation(); if (available) onQuickAdd(item); }}
        disabled={!available}
        aria-label={lang === 'ar' ? 'أضف إلى السلة' : 'Quick add'}
        className={`absolute bottom-3.5 end-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
          available
            ? 'bg-orange-500 hover:bg-orange-400 active:scale-90 shadow-orange-500/40 hover:shadow-orange-400/50'
            : 'bg-neutral-800 cursor-not-allowed opacity-40'
        }`}
      >
        <Plus className="w-4 h-4 text-black" strokeWidth={3.5} />
      </button>
    </motion.div>
  );
}
