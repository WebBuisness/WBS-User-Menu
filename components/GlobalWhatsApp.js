'use client';

import { useState, useEffect } from 'react';
import WhatsAppBubble from './WhatsAppBubble';
import { supabase } from '@/lib/supabase';

export default function GlobalWhatsApp() {
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function fetchWa() {
      try {
        const { data } = await supabase.from('settings').select('*').eq('key', 'whatsapp_number').single();
        if (data && data.value) {
          setPhone(data.value);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchWa();
  }, []);

  if (!phone) return null;
  return <WhatsAppBubble phone={phone} />;
}
