'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Only show once per session
    const seen = sessionStorage.getItem('dh_splash_seen');
    if (seen) { setShow(false); return; }
    const timer = setTimeout(() => {
      sessionStorage.setItem('dh_splash_seen', '1');
      setShow(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.1 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/40">
              <span className="font-display font-black text-5xl text-black">KB</span>
            </div>
            <motion.div
              className="absolute -inset-2 rounded-3xl border-2 border-orange-500/40"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="font-display font-bold text-4xl mt-8 tracking-tight"
          >
            Karmesh <span className="text-orange-500">Broasted</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-2 text-neutral-400 text-sm tracking-widest uppercase"
          >
            Serious taste, real flavor
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-12 flex gap-1.5"
          >
            {[0,1,2].map(i => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-orange-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
