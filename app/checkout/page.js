'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Phone, MapPin, Check, Loader2 } from 'lucide-react';
import { CountryCodeInput } from '@/components/PhoneInput/CountryCodeInput';
import { PhoneNumberInput } from '@/components/PhoneInput/PhoneNumberInput';
import { countryList } from '@/lib/countryList';
import Header from '@/components/Header';
import { useCart } from '@/lib/cart';
import { useLang } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { isRestaurantOpen } from '@/lib/utils';

function CheckoutPage() {
  const router = useRouter();
  const { lang, t, isRTL } = useLang();
  const { items, subtotal, clear, mounted } = useCart();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+961');
  const [address, setAddress] = useState('');
  const [promo, setPromo] = useState(null);
  const [whatsappTemplate, setWhatsappTemplate] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [whatsapp, setWhatsapp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const p = localStorage.getItem('dh_promo');
    if (p) {
      try { setPromo(JSON.parse(p)); } catch {}
    }
    // fetch whatsapp setting
    (async () => {
      try {
        const { data } = await supabase.from('settings').select('*');
        if (data) {
          const wa = data.find(s => s.key === 'whatsapp_number')?.value;
          if (wa) setWhatsapp(wa);
          
          const manualOpen = data.find(s => s.key === 'restaurant_open')?.value;
          const rawSchedule = data.find(s => s.key === 'opening_hours')?.value;
          const template = data.find(s => s.key === 'whatsapp_template')?.value;
          let parsedSchedule = null;
          if (rawSchedule) {
            try { parsedSchedule = typeof rawSchedule === 'string' ? JSON.parse(rawSchedule) : rawSchedule; } catch {}
          }
          setSchedule(parsedSchedule);
          setIsOpen(isRestaurantOpen(parsedSchedule, manualOpen !== 'false'));
          if (template) setWhatsappTemplate(template);
        }
      } catch {}
    })();
  }, []);

  const discount = promo
    ? promo.discount_type === 'percent'
      ? (subtotal * Number(promo.value)) / 100
      : Math.min(Number(promo.value), subtotal)
    : 0;
  const total = Math.max(0, subtotal - discount);

  useEffect(() => {
    if (mounted && items.length === 0 && !submitting) {
      router.push('/cart');
    }
  }, [mounted, items.length, submitting, router]);

  const combinedPhone = `${countryCode} ${phoneNumber}`.trim();

  const buildWhatsAppMessage = (orderNo) => {
    const lines = items.map(it => {
      const nm = it.name_en;
      const unit = it.isCombo ? it.price + (it.comboExtra || 2.7) : it.price;
      const combo = it.isCombo ? ' [COMBO]' : '';
      const note = it.note ? `\n   ✎ ${it.note}` : '';
      return `${it.qty}× ${nm}${combo} — $${(unit * it.qty).toFixed(2)}${note}`;
    }).join('\n');

    if (whatsappTemplate) {
      let msg = whatsappTemplate;
      msg = msg.split('{{orderNo}}').join(orderNo);
      msg = msg.split('{{items}}').join(lines);
      msg = msg.split('{{total}}').join(total.toFixed(2));
      msg = msg.split('{{name}}').join(name);
      msg = msg.split('{{phone}}').join(combinedPhone);
      msg = msg.split('{{address}}').join(address);
      return msg;
    }

    return [
      `🍖 *New Order — Döner House*`,
      `🕢 Order #${orderNo}`,
      ``,
      `👤 *Name:* ${name}`,
      `📞 *Phone:* ${combinedPhone}`,
      `📍 *Address:* ${address}`,
      `---`,
      lines,
      `---`,
      `🏷️ *Promo:* ${promo ? promo.code : 'None'}`,
      promo ? `💸 *Discount:* -$${discount.toFixed(2)}` : null,
      `💰 *Total:* $${total.toFixed(2)}`,
      `💳 *Payment:* Cash on Delivery`,
    ].filter(Boolean).join('\n');
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phoneNumber.trim() || !address.trim()) return;
    if (!isOpen) {
      alert(lang === 'ar' ? 'المطعم مغلق حالياً، لا يمكن استقبال طلبات.' : 'The restaurant is currently closed. We cannot take orders.');
      return;
    }
    setSubmitting(true);

    const orderPayload = {
      customer_name: name.trim(),
      phone: combinedPhone,
      address: address.trim(),
      items: items.map(it => ({
        id: it.id,
        name_en: it.name_en,
        name_ar: it.name_ar,
        qty: it.qty,
        price: it.price,
        isCombo: !!it.isCombo,
        comboExtra: it.comboExtra || null,
        note: it.note || null,
      })),
      promo_code: promo?.code || null,
      discount: Number(discount.toFixed(2)),
      total: Number(total.toFixed(2)),
      status: 'pending',
    };

    let orderId = null;
    let orderNo = Date.now().toString().slice(-6);

    try {
      const { data, error } = await supabase.from('orders').insert(orderPayload).select().single();
      if (!error && data) {
        orderId = data.id;
        orderNo = data.id.slice(0, 8).toUpperCase();
      }
    } catch (e) {
      console.warn('order save failed', e);
    }

    // Persist confirmation data
    const confirmation = {
      orderId: orderId || `local-${orderNo}`,
      orderNo,
      name, phone: combinedPhone, address,
      items: orderPayload.items,
      promo: promo?.code || null,
      discount,
      total,
      ts: Date.now(),
    };
    localStorage.setItem('dh_last_order', JSON.stringify(confirmation));

    // Build + open WhatsApp
    const msg = buildWhatsAppMessage(orderNo);
    const phoneClean = (whatsapp || '').replace(/\D/g, '');
    if (!phoneClean) {
      console.error('WhatsApp number is missing in settings');
      alert('Error: Restaurant WhatsApp number is not configured.');
      return;
    }
    const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(msg)}`;

    // Clear cart + promo
    clear();
    localStorage.removeItem('dh_promo');

    // Open WhatsApp in new tab and navigate to confirmation
    window.open(waUrl, '_blank');
    router.push('/confirmation');
  };

  const activeCountry = countryList.find(c => c.code === countryCode);
  const activeMask = activeCountry?.mask || '______________';

  return (
    <div className="min-h-screen pb-36">
      <Header showCart={false} isOpen={isOpen} schedule={schedule} />

      <main className="max-w-2xl mx-auto px-4 pt-5">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/cart" className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center">
            <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">{t('checkout')}</h1>
        </div>

        <form onSubmit={placeOrder} className="space-y-4">
          <Field icon={User} label={t('fullName')}>
            <input required value={name} onChange={e => setName(e.target.value)} className="dh-input" placeholder={lang === 'ar' ? 'محمد أحمد' : 'John Doe'} />
          </Field>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">{t('phone')}</label>
            <div className="flex gap-3">
              <CountryCodeInput
                countryList={countryList}
                value={countryCode}
                onChange={setCountryCode}
              />
              <div className="flex-1">
                <PhoneNumberInput
                  id="phone-input"
                  mask={activeMask}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder={lang === 'ar' ? '70 123 456' : '70 123 456'}
                />
              </div>
            </div>
          </div>

          <Field icon={MapPin} label={t('address')}>
            <textarea required rows={3} value={address} onChange={e => setAddress(e.target.value)} className="dh-input resize-none" placeholder={lang === 'ar' ? 'الشارع، المبنى، الطابق...' : 'Street, building, floor, landmark...'} />
          </Field>

          {/* Payment method */}
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">{t('paymentMethod')}</p>
            <label className="flex items-center gap-3 p-4 rounded-2xl border border-orange-500 bg-orange-500/5 cursor-pointer">
              <input type="radio" className="dh-radio" checked readOnly />
              <div className="flex-1">
                <p className="font-display font-bold">{t('cashOnDelivery')}</p>
                <p className="text-xs text-neutral-400 mt-0.5">Pay with cash when your order arrives</p>
              </div>
            </label>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">{t('orderSummary')}</p>
            <div className="space-y-1.5 text-sm">
              {mounted && items.map(it => {
                const nm = lang === 'ar' ? it.name_ar : it.name_en;
                const unit = it.isCombo ? it.price + (it.comboExtra || 2.7) : it.price;
                return (
                  <div key={it.lineKey} className="flex justify-between gap-2">
                    <span className="text-neutral-300 truncate">{it.qty}× {nm}{it.isCombo && <span className="text-orange-500"> · COMBO</span>}</span>
                    <span className="no-flip shrink-0">${(unit * it.qty).toFixed(2)}</span>
                  </div>
                );
              })}
              <div className="h-px bg-neutral-800 my-2" />
              <div className="flex justify-between text-neutral-400"><span>{t('subtotal')}</span><span className="no-flip">${subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-400"><span>{t('discount')}</span><span className="no-flip">-${discount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-lg pt-1">
                <span className="font-display font-bold">{t('total')}</span>
                <span className="font-display font-extrabold text-orange-500 no-flip">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent safe-bottom z-30">
            <button
              type="submit"
              disabled={submitting || !name || !phone || !address}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl btn-shimmer text-white font-display font-bold text-base shadow-xl shadow-orange-500/30 disabled:opacity-50 max-w-2xl mx-auto"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t('loading')}</>
              ) : !isOpen ? (
                <>{lang === 'ar' ? 'المطعم مغلق حالياً' : 'Restaurant Closed'}</>
              ) : (
                <><Check className="w-5 h-5" /> {t('placeOrder')} · <span className="no-flip">${total.toFixed(2)}</span></>
              )}
            </button>
          </div>
        </form>
      </main>

      <style jsx>{`
        .dh-input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          border-radius: 16px;
          border: 1px solid #262626;
          background: rgba(23, 23, 23, 0.6);
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        :global(html[dir='rtl']) .dh-input {
          padding: 14px 44px 14px 14px;
        }
        .dh-input:focus { border-color: #F97316; }
      `}</style>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">{label}</label>
      <div className="relative">
        <Icon className="absolute top-4 start-4 w-4 h-4 text-neutral-500 pointer-events-none z-10" />
        {children}
      </div>
    </div>
  );
}

function App() { return <CheckoutPage />; }
export default App;
