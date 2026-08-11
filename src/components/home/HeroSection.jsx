import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { EASE_LUXURY } from '@/lib/luxuryMotion';
import { HOME_MEDIA } from '@/lib/homepageMedia';

const HERO_SLIDES = HOME_MEDIA.heroSlides;
const AUTOPLAY_DELAY = 4500;

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const activeSlide = HERO_SLIDES[activeIndex];
  const shouldAutoplay = !reduceMotion && isVisible;

  const showNextSlide = useCallback(() => {
    setActiveIndex((index) => (index + 1) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const nextSlide = HERO_SLIDES[(activeIndex + 1) % HERO_SLIDES.length];
    const nextImage = new Image();
    nextImage.src = nextSlide.src;
  }, [activeIndex]);

  useEffect(() => {
    const element = heroRef.current;
    if (!element || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldAutoplay) return undefined;

    const timer = window.setTimeout(showNextSlide, AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [activeIndex, shouldAutoplay, showNextSlide]);

  return (
    <section
      ref={heroRef}
      className="hero-cinematic hero-cinematic-clean hero-carousel relative h-[64svh] min-h-[33rem] overflow-hidden bg-charcoal pt-24 md:h-screen md:min-h-[43rem] md:pt-32 lg:h-[780px]"
      aria-roledescription="carousel"
      aria-label="Poshkaar Kashmir craft collection"
    >
      <motion.div
        className="hero-carousel-track"
        animate={{ x: reduceMotion ? '0%' : `-${activeIndex * 100}%` }}
        transition={{ duration: reduceMotion ? 0.01 : 0.85, ease: EASE_LUXURY }}
      >
        {HERO_SLIDES.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.src}
            width="1600"
            height="1000"
            alt={index === activeIndex ? slide.alt : ''}
            aria-hidden={index !== activeIndex}
            className="hero-cinematic-bg hero-carousel-image"
            style={{
              objectPosition: slide.objectPosition,
              '--hero-mobile-position': slide.mobileObjectPosition,
            }}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            decoding="async"
          />
        ))}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/74 via-black/32 to-black/10" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/22 via-black/4 to-black/68" aria-hidden="true" />
      <div className="hero-text-frame" aria-hidden="true" />
      <p className="hero-photo-credit">Photograph: {activeSlide.credit}</p>

      <div className="relative z-10 mx-auto flex h-[calc(64svh-6rem)] min-h-[27rem] w-full max-w-[1500px] items-end px-4 pb-8 md:h-[calc(100vh-8rem)] md:min-h-[35rem] md:items-center md:px-12 md:pb-16 lg:px-16">
        <div className="hero-copy-stack">
          <p className="hero-kicker">{activeSlide.eyebrow}</p>

          <h1
            className="hero-cinematic-title hero-cinematic-title-clean font-heading text-ivory"
            aria-label={activeSlide.title.join(' ')}
          >
            {activeSlide.title.map((line) => (
              <span key={line} className="hero-title-line" aria-hidden="true">
                {line}
              </span>
            ))}
          </h1>

          <p className="hero-plain-copy">{activeSlide.description}</p>

          <div className="hero-actions">
            <Link to="/collections" className="hero-primary-link">
              Shop now
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <a href="https://wa.me/916006491824" target="_blank" rel="noopener noreferrer" className="hero-secondary-link">
              WhatsApp
              <MessageCircle size={15} aria-hidden="true" />
            </a>
          </div>

          <ul className="hero-proof-row" aria-label="Poshkaar promises">
            <li>Verified details</li>
            <li>Secure checkout</li>
            <li>Personal service</li>
          </ul>
        </div>
      </div>

      <p className="sr-only" aria-live={shouldAutoplay ? 'off' : 'polite'}>
        Image {activeIndex + 1} of {HERO_SLIDES.length}: {activeSlide.alt}
      </p>

      <div className="hero-scroll-cue" aria-hidden="true">Scroll</div>
    </section>
  );
}
