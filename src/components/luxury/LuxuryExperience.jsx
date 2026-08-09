import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { EASE_LUXURY } from '@/lib/luxuryMotion';

export default function LuxuryExperience() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [routeVeilVisible, setRouteVeilVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return undefined;

    setRouteVeilVisible(true);
    const timer = window.setTimeout(() => setRouteVeilVisible(false), 520);
    return () => window.clearTimeout(timer);
  }, [location.pathname, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || typeof window === 'undefined') return undefined;

    const lenis = new Lenis({
      duration: 1.08,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.15,
      wheelMultiplier: 0.9,
    });

    let frame = 0;
    const raf = (time) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion || typeof window === 'undefined') return undefined;

    let context;

    const setupGsap = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.utils.toArray('[data-luxury-reveal]').forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 42, clipPath: 'inset(10% 0% 0% 0%)' },
            {
              autoAlpha: 1,
              y: 0,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: element,
                start: 'top 82%',
                once: true,
              },
            }
          );
        });
      });
    };

    setupGsap();

    return () => {
      context?.revert();
    };
  }, [location.pathname, reduceMotion]);

  return (
    <>
      <div className="luxury-scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      <div className="luxury-paper-grain" aria-hidden="true" />

      <AnimatePresence>
        {routeVeilVisible && (
          <motion.div
            className="luxury-route-veil"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: EASE_LUXURY }}
          />
        )}
      </AnimatePresence>

    </>
  );
}
