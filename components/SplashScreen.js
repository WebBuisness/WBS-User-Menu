'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('dh_splash_seen');
    if (!seen) {
      setShouldRender(true);
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('dh_splash_seen', '1');
        setTimeout(() => setShouldRender(false), 500);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/40">
          <span className="font-display font-black text-4xl text-black">KB</span>
        </div>
      </div>
      <h1 className="font-display font-bold text-3xl mt-6 tracking-tight animate-in slide-in-from-bottom-4 duration-700">
        WBS <span className="text-orange-500">Menu Demo</span>
      </h1>
    </div>
  );
}
