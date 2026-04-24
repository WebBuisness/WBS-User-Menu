'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function PWAInstallPrompt() {
  const { lang } = useLang();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Delay showing the prompt a bit so it doesn't hit immediately
      const timer = setTimeout(() => {
        const seen = sessionStorage.getItem('dh_pwa_prompt_seen');
        if (!seen) {
          setShow(true);
        }
      }, 5000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShow(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShow(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('dh_pwa_prompt_seen', '1');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 left-4 right-4 z-[60] max-w-sm mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6">
            {/* Background decoration */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 end-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-neutral-500 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
                <Smartphone className="w-8 h-8 text-black" />
              </div>

              <h3 className="font-display font-black text-xl tracking-tight">
                {lang === 'ar' ? 'ثبت تطبيق Karmesh Broasted' : 'Install Karmesh Broasted'}
              </h3>
              <p className="text-sm text-neutral-400 mt-2 leading-relaxed px-2">
                {lang === 'ar' 
                  ? 'احصل على تجربة أسرع وأفضل للطلب مباشرة من شاشتك الرئيسية.'
                  : 'Get a faster, better experience by ordering directly from your home screen.'}
              </p>

              <div className="flex flex-col w-full gap-2 mt-6">
                <button
                  onClick={handleInstall}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-display font-bold text-sm transition"
                >
                  <Download className="w-4 h-4" />
                  {lang === 'ar' ? 'تثبيت الآن' : 'Install Now'}
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl hover:bg-neutral-800 text-neutral-500 text-xs font-bold uppercase tracking-widest transition"
                >
                  {lang === 'ar' ? 'لاحقاً' : 'Maybe Later'}
                </button>
              </div>
            </div>
            
            {/* Subtle progress indicator */}
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-orange-500/30"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 15, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
