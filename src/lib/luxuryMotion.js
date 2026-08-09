import { useRef, useEffect, useState } from 'react';

// ─── Easing ───
export const EASE_LUXURY = [0.22, 1, 0.36, 1];
export const EASE_OUT = [0, 0, 0.2, 1];

// ─── Reusable Variants ───
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_LUXURY } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: EASE_LUXURY } },
};

export const fadeInSlow = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.5, ease: EASE_LUXURY } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: EASE_LUXURY } },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: EASE_LUXURY } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: EASE_LUXURY } },
};

export const staggerContainer = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_LUXURY } },
};

// ─── Viewport defaults ───
export const viewportOnce = { once: true, margin: '-80px' };
export const viewportSoft = { once: true, margin: '-40px' };

// Pointer depth without React state updates. CSS consumes these variables so
// high-frequency pointer movement stays smooth and isolated to the element.
export function updatePointerDepth(event, strength = 1) {
  if (event.pointerType === 'touch') return;

  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = Math.min(1, Math.max(-1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
  const y = Math.min(1, Math.max(-1, ((event.clientY - rect.top) / rect.height) * 2 - 1));

  element.style.setProperty('--depth-rx', `${(-y * 2.8 * strength).toFixed(2)}deg`);
  element.style.setProperty('--depth-ry', `${(x * 3.2 * strength).toFixed(2)}deg`);
  element.style.setProperty('--depth-nx', x.toFixed(3));
  element.style.setProperty('--depth-ny', y.toFixed(3));
  element.style.setProperty('--depth-x', `${((x + 1) * 50).toFixed(1)}%`);
  element.style.setProperty('--depth-y', `${((y + 1) * 50).toFixed(1)}%`);
}

export function resetPointerDepth(event) {
  const element = event.currentTarget;
  element.style.setProperty('--depth-rx', '0deg');
  element.style.setProperty('--depth-ry', '0deg');
  element.style.setProperty('--depth-nx', '0');
  element.style.setProperty('--depth-ny', '0');
  element.style.setProperty('--depth-x', '50%');
  element.style.setProperty('--depth-y', '50%');
}

// ─── Hooks ───

// Parallax on scroll
export function useParallax(strength = 0.3) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const elementTop = rect.top + scrolled;
      setOffset((scrolled - elementTop) * strength);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [strength]);

  return { ref, offset };
}

// Scroll progress (0 to 1)
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

// Mouse position relative to element
export function useMousePosition() {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      setPosition({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      });
    };
    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, []);

  return { ref, position };
}
