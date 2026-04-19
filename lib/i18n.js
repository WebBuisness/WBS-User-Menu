'use client';

import { useEffect, useState } from 'react';

export const translations = {
  en: {
    tagline: 'Serious taste, real flavor',
    menu: 'Menu',
    cart: 'Cart',
    checkout: 'Checkout',
    all: 'All',
    soldOut: 'Sold Out',
    addToCart: 'Add to cart',
    makeItCombo: 'Make it a combo?',
    noThanks: 'No thanks',
    combo: 'COMBO',
    comboDesc: 'fries & soft drink',
    rateItem: 'Rate this item',
    notePlaceholder: 'Any special notes? (optional)',
    quantity: 'Quantity',
    emptyCart: 'Your cart is empty',
    browseMenu: 'Browse Menu',
    promoCode: 'Promo code',
    apply: 'Apply',
    subtotal: 'Subtotal',
    discount: 'Discount',
    total: 'Total',
    proceedCheckout: 'Proceed to Checkout',
    fullName: 'Full Name',
    phone: 'Phone Number',
    address: 'Delivery Address',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    placeOrder: 'Place Order',
    orderSummary: 'Order Summary',
    orderPlaced: 'Order Placed!',
    orderConfirmed: 'Your order has been confirmed',
    orderNumber: 'Order #',
    backToMenu: 'Back to Menu',
    search: 'Search menu...',
    remove: 'Remove',
    items: 'items',
    item: 'item',
    invalidPromo: 'Invalid promo code',
    promoApplied: 'Promo applied!',
    loading: 'Loading delicious food...',
    from: 'from',
  },
  ar: {
    tagline: 'طعم حقيقي، نكهة أصيلة',
    menu: 'القائمة',
    cart: 'السلة',
    checkout: 'الدفع',
    all: 'الكل',
    soldOut: 'نفذت الكمية',
    addToCart: 'أضف إلى السلة',
    makeItCombo: 'هل تريد وجبة؟',
    noThanks: 'لا شكراً',
    combo: 'وجبة',
    comboDesc: 'بطاطا ومشروب',
    rateItem: 'قيّم هذا الطبق',
    notePlaceholder: 'ملاحظات خاصة؟ (اختياري)',
    quantity: 'الكمية',
    emptyCart: 'سلتك فارغة',
    browseMenu: 'تصفح القائمة',
    promoCode: 'رمز الخصم',
    apply: 'تطبيق',
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    total: 'الإجمالي',
    proceedCheckout: 'متابعة الدفع',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    address: 'عنوان التوصيل',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: 'الدفع عند الاستلام',
    placeOrder: 'تأكيد الطلب',
    orderSummary: 'ملخص الطلب',
    orderPlaced: 'تم تأكيد الطلب!',
    orderConfirmed: 'تم تأكيد طلبك بنجاح',
    orderNumber: 'رقم الطلب #',
    backToMenu: 'العودة إلى القائمة',
    search: 'ابحث في القائمة...',
    remove: 'إزالة',
    items: 'قطع',
    item: 'قطعة',
    invalidPromo: 'رمز غير صالح',
    promoApplied: 'تم تطبيق الخصم!',
    loading: 'جاري التحميل...',
    from: 'من',
  }
};

export function useLang() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('dh_lang') : null;
    if (stored) setLang(stored);
    const handler = () => {
      const l = localStorage.getItem('dh_lang') || 'en';
      setLang(l);
    };
    window.addEventListener('dh_lang_change', handler);
    return () => window.removeEventListener('dh_lang_change', handler);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const toggle = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    localStorage.setItem('dh_lang', newLang);
    setLang(newLang);
    window.dispatchEvent(new Event('dh_lang_change'));
  };

  const t = (key) => translations[lang][key] || key;
  return { lang, t, toggle, isRTL: lang === 'ar' };
}
