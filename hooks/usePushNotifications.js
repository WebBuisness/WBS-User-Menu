'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

/**
 * Converts a base64 URL string (used in VAPID) to a Uint8Array for the browser API.
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * Registers the service worker, requests notification permission, and saves
 * the Push subscription endpoint to Supabase.
 * 
 * Called once when the app first loads (via page.js).
 */
export default function usePushNotifications() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    // Must be in a browser, SW and Push must be supported
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (!('PushManager' in window)) return;
    if (!VAPID_PUBLIC_KEY) {
      console.warn('[Push] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set. Skipping push setup.');
      return;
    }

    const setup = async () => {
      try {
        // 1. Register (or reuse) the service worker
        const reg = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        // 2. Ask for permission (only shows dialog if currently 'default')
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // 3. Subscribe to push
        let subscription = await reg.pushManager.getSubscription();
        if (!subscription) {
          subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          });
        }

        // 4. Persist subscription in Supabase (upsert by endpoint to avoid duplicates)
        const payload = subscription.toJSON();
        await supabase.from('push_subscriptions').upsert(
          {
            endpoint: payload.endpoint,
            p256dh: payload.keys?.p256dh,
            auth: payload.keys?.auth,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'endpoint' }
        );
      } catch (err) {
        console.error('[Push] Setup error:', err);
      }
    };

    // Slight delay so the page renders first before any permission dialog
    const timer = setTimeout(setup, 2000);
    return () => clearTimeout(timer);
  }, []);
}
