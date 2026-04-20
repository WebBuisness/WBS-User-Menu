'use client';

import { useEffect, useState, useCallback } from 'react';

const CART_KEY = 'dh_cart';

function readCart() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('dh_cart_change'));
}

export function useCart() {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setMounted(true);
    const handler = () => setItems(readCart());
    window.addEventListener('dh_cart_change', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('dh_cart_change', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const addItem = useCallback((item) => {
    const current = readCart();
    // generate unique line key based on item id + combo + note
    const lineKey = `${item.id}|${item.isCombo ? 'c' : 'n'}|${(item.note || '').trim()}`;
    const idx = current.findIndex(i => i.lineKey === lineKey);
    if (idx >= 0) {
      current[idx].qty += item.qty || 1;
    } else {
      current.push({ ...item, lineKey, qty: item.qty || 1 });
    }
    writeCart(current);
  }, []);

  const updateQty = useCallback((lineKey, qty) => {
    let current = readCart();
    if (qty <= 0) {
      current = current.filter(i => i.lineKey !== lineKey);
    } else {
      current = current.map(i => i.lineKey === lineKey ? { ...i, qty } : i);
    }
    writeCart(current);
  }, []);

  const removeItem = useCallback((lineKey) => {
    const current = readCart().filter(i => i.lineKey !== lineKey);
    writeCart(current);
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.qty * (i.isCombo ? i.price + (i.comboExtra || 0) : i.price), 0);

  return { items, addItem, updateQty, removeItem, clear, count, subtotal, mounted };
}
