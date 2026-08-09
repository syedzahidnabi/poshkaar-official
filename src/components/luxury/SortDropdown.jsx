import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { EASE_LUXURY } from '@/lib/luxuryMotion';

export default function SortDropdown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();
  const current = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const focusMenuItem = (index) => {
    const items = Array.from(menuRef.current?.querySelectorAll('[role="menuitemradio"]') || []);
    if (!items.length) return;
    items[(index + items.length) % items.length]?.focus();
  };

  const handleTriggerKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    setOpen(true);
    window.setTimeout(() => focusMenuItem(event.key === 'ArrowDown' ? 0 : -1), 0);
  };

  const handleMenuKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const items = Array.from(menuRef.current?.querySelectorAll('[role="menuitemradio"]') || []);
    const currentIndex = items.indexOf(document.activeElement);
    if (event.key === 'Home') focusMenuItem(0);
    else if (event.key === 'End') focusMenuItem(-1);
    else focusMenuItem(currentIndex + (event.key === 'ArrowDown' ? 1 : -1));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
        className="flex min-h-11 items-center gap-2 px-2 text-[11px] uppercase tracking-[0.15em] text-charcoal luxury-transition hover:text-burgundy"
        aria-label="Sort products"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <span className="text-muted-foreground hidden sm:inline">Sort:</span>
        {current.label}
        <ChevronDown size={12} className={`luxury-transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label="Sort products"
            onKeyDown={handleMenuKeyDown}
            className="absolute right-0 top-full z-30 mt-3 w-56 border border-gold/15 bg-ivory py-2 shadow-[0_24px_55px_-42px_rgba(29,29,29,0.65)]"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_LUXURY }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={value === opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex min-h-11 w-full items-center justify-between px-5 py-2.5 text-left text-[11px] uppercase tracking-wider luxury-transition ${
                  value === opt.value
                    ? 'text-burgundy'
                    : 'text-charcoal hover:text-burgundy hover:bg-beige/50'
                }`}
              >
                {opt.label}
                {value === opt.value && <Check size={12} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
