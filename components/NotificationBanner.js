'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';

/**
 * Fetches the latest notification from Supabase (sent within the last 24 hours)
 * and shows it as a dismissible banner at the top of the screen.
 * Dismissed notifications are stored in localStorage so they don't reappear.
 */
export default function NotificationBanner() {
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .gte('sent_at', since)
          .order('sent_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error || !data) return;

        // Check if already dismissed
        const dismissed = JSON.parse(localStorage.getItem('dh_dismissed_notifs') || '[]');
        if (dismissed.includes(data.id)) return;

        setNotification(data);
        // Small delay so it animates in after the page loads
        setTimeout(() => setVisible(true), 800);
      } catch {}
    })();
  }, []);

  const dismiss = () => {
    setVisible(false);
    if (notification) {
      const dismissed = JSON.parse(localStorage.getItem('dh_dismissed_notifs') || '[]');
      dismissed.push(notification.id);
      // Keep only last 20 dismissed IDs to avoid bloating localStorage
      localStorage.setItem('dh_dismissed_notifs', JSON.stringify(dismissed.slice(-20)));
    }
  };

  return (
    <AnimatePresence>
      {visible && notification && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[60] px-4 pt-3 pointer-events-none"
        >
          <div className="max-w-lg mx-auto bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-4 shadow-2xl shadow-orange-500/30 pointer-events-auto">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-display font-bold text-sm">{notification.title}</p>
                <p className="text-white/80 text-xs mt-0.5 leading-relaxed">{notification.body}</p>
              </div>
              <button
                onClick={dismiss}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
