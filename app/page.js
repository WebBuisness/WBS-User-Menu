'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, WifiOff } from 'lucide-react';
import Header from '@/components/Header';
import SplashScreen from '@/components/SplashScreen';
import MenuItemCard from '@/components/MenuItemCard';
import ItemSheet from '@/components/ItemSheet';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';
import { useCart } from '@/lib/cart';
import { FALLBACK_CATEGORIES, FALLBACK_ITEMS } from '@/lib/menu-data';
import { isRestaurantOpen } from '@/lib/utils';

function Home() {
  const { lang, t } = useLang();
  const { addItem } = useCart();

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [sheetItem, setSheetItem] = useState(null);
  const [whatsapp, setWhatsapp] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [schedule, setSchedule] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Initial load from cache
  useEffect(() => {
    const cachedCats = localStorage.getItem('dh_categories');
    const cachedItems = localStorage.getItem('dh_items');
    const cachedSettings = localStorage.getItem('dh_settings');

    if (cachedCats) setCategories(JSON.parse(cachedCats));
    if (cachedItems) setItems(JSON.parse(cachedItems));
    if (cachedSettings) {
      const settings = JSON.parse(cachedSettings);
      const wa = settings.find(s => s.key === 'whatsapp_number')?.value;
      setWhatsapp(wa || '');
      const manualOpen = settings.find(s => s.key === 'restaurant_open')?.value;
      const rawSchedule = settings.find(s => s.key === 'opening_hours')?.value;
      let parsedSchedule = null;
      if (rawSchedule) {
        try { parsedSchedule = typeof rawSchedule === 'string' ? JSON.parse(rawSchedule) : rawSchedule; } catch {}
      }
      setSchedule(parsedSchedule);
      setIsOpen(isRestaurantOpen(parsedSchedule, manualOpen !== 'false'));
    }

    if (cachedCats && cachedItems) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [catsRes, itemsRes, settingsRes] = await Promise.all([
          supabase.from('categories').select('*').eq('active', true).order('sort_order'),
          supabase.from('items').select('*'),
          supabase.from('settings').select('*'),
        ]);

        const cats = (catsRes.data && catsRes.data.length) ? catsRes.data : FALLBACK_CATEGORIES;
        const its = (itemsRes.data && itemsRes.data.length) ? itemsRes.data : FALLBACK_ITEMS;
        const settings = settingsRes.data || [];

        setCategories(cats);
        setItems(its);

        // Cache for offline/immediate use
        localStorage.setItem('dh_categories', JSON.stringify(cats));
        localStorage.setItem('dh_items', JSON.stringify(its));
        localStorage.setItem('dh_settings', JSON.stringify(settings));

        const wa = settings.find(s => s.key === 'whatsapp_number')?.value;
        setWhatsapp(wa || '');

        const manualOpen = settings.find(s => s.key === 'restaurant_open')?.value;
        const rawSchedule = settings.find(s => s.key === 'opening_hours')?.value;
        let parsedSchedule = null;
        if (rawSchedule) {
          try { parsedSchedule = typeof rawSchedule === 'string' ? JSON.parse(rawSchedule) : rawSchedule; } catch {}
        }
        setSchedule(parsedSchedule);
        setIsOpen(isRestaurantOpen(parsedSchedule, manualOpen !== 'false'));
      } catch (e) {
        console.warn('Supabase fetch failed, using fallback/cache', e);
        if (categories.length === 0) setCategories(FALLBACK_CATEGORIES);
        if (items.length === 0) setItems(FALLBACK_ITEMS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredItems = useMemo(() => {
    let list = items;
    if (activeCat !== 'all') list = list.filter(i => i.category_id === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        (i.name_en || '').toLowerCase().includes(q) ||
        (i.name_ar || '').toLowerCase().includes(q) ||
        (i.desc_en || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, activeCat, search]);

  const handleQuickAdd = (item) => {
    addItem({
      id: item.id,
      name_en: item.name_en,
      name_ar: item.name_ar,
      image_url: item.image_url,
      price: Number(item.price),
      comboExtra: item.has_combo && item.combo_price ? Number(item.combo_price) - Number(item.price) : 2.7,
      isCombo: false,
      note: '',
      qty: 1,
    });
  };

  const handleCatClick = (id) => {
    setActiveCat(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-24">
      <SplashScreen />
      <Header isOpen={isOpen} schedule={schedule} />

      {/* Hero */}
      <section className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className={`text-orange-500 text-xs uppercase font-semibold ${lang === 'ar' ? 'tracking-normal text-sm' : 'tracking-[0.25em]'}`}>
            {t('tagline')}
          </p>
          <h1 className={`font-display font-black leading-[0.95] mt-2 tracking-tight ${
            lang === 'ar'
              ? 'text-4xl sm:text-5xl leading-snug mb-6'
              : 'text-4xl sm:text-5xl'
          }`}>
            {lang === 'ar' ? (
              <>طعم <span className="text-orange-500">حقيقي</span>,<br />نكهة <span className="text-orange-500">أصيلة</span>.</>
            ) : (
              <>Crafted with fire.<br /><span className="text-orange-500">Served with soul.</span></>
            )}
          </h1>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-5 relative"
        >
          <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-neutral-500 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full ps-11 pe-4 py-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 focus:border-orange-500 focus:outline-none text-sm"
          />
        </motion.div>
      </section>

      {/* Category tabs */}
      <div id="category-tabs" className="sticky top-[66px] z-30 bg-black/85 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max">
            <CatPill active={activeCat === 'all'} onClick={() => handleCatClick('all')}>
              {t('all')}
            </CatPill>
            {categories.map(c => (
              <CatPill key={c.id} active={activeCat === c.id} onClick={() => handleCatClick(c.id)}>
                {lang === 'ar' ? c.name_ar : c.name_en}
              </CatPill>
            ))}
          </div>
        </div>
      </div>

      {/* Items grid */}
      <main className="max-w-2xl mx-auto px-4 pt-5 pb-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800/80 aspect-[4/5] flex flex-col">
                <div className="aspect-[4/3] bg-neutral-800 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-neutral-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCat + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-4 sm:gap-5"
            >
              {filteredItems.map((item, idx) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  lang={lang}
                  onOpen={setSheetItem}
                  onQuickAdd={handleQuickAdd}
                  index={idx}
                  isOpen={isOpen}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            <p className="text-sm">No items found</p>
          </div>
        )}
      </main>

      <Footer lang={lang} />

      <ItemSheet
        item={sheetItem}
        open={!!sheetItem}
        onClose={() => setSheetItem(null)}
        onAdd={addItem}
        isOpen={isOpen}
      />

      <PWAInstallPrompt />

      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-28 left-4 right-4 z-40"
          >
            <div className="bg-orange-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
              <WifiOff className="w-4 h-4" />
              {lang === 'ar' ? 'أنت تعمل في وضع عدم الاتصال' : 'You are browsing offline'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function CatPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-5 py-2.5 rounded-full text-sm font-display font-bold uppercase tracking-wider whitespace-nowrap transition ${
        active ? 'text-black' : 'text-neutral-400 hover:text-white'
      }`}
    >
      {active && (
        <motion.span
          layoutId="cat-pill"
          className="absolute inset-0 bg-orange-500 rounded-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function App() {
  return <Home />;
}

export default App;
