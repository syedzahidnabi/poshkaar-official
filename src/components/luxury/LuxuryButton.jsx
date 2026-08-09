import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EASE_LUXURY } from '@/lib/luxuryMotion';

export default function LuxuryButton({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  onClick = () => {},
  disabled = false,
  type = 'button',
  ...props
}) {
  const [ripples, setRipples] = useState([]);

  const base =
    'relative inline-flex items-center justify-center font-body tracking-[0.2em] uppercase text-xs overflow-hidden luxury-transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-burgundy text-ivory hover:bg-charcoal',
    secondary:
      'bg-transparent border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory',
    gold: 'bg-gold text-charcoal hover:bg-charcoal hover:text-ivory',
    ghost: 'bg-transparent text-charcoal hover:text-burgundy',
    ivory: 'bg-ivory text-charcoal border border-gold/30 hover:border-gold',
    darkGhost: 'bg-transparent text-ivory border border-ivory/30 hover:border-gold hover:text-champagne',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-[10px]',
    default: 'px-8 py-3.5 text-xs',
    lg: 'px-12 py-4 text-xs',
    full: 'w-full px-8 py-4 text-xs',
  };

  const handleClick = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ripple = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: Date.now(),
    };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 600);
    onClick?.(e);
  };

  return (
    <motion.button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.3, ease: EASE_LUXURY }}
      {...props}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-current opacity-25 pointer-events-none"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, opacity: 0.25 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_LUXURY }}
        />
      ))}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
