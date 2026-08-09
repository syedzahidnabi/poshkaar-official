import React, { lazy, Suspense, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import AtelierSignature from '@/components/home/AtelierSignature';
import { HOME_MEDIA } from '@/lib/homepageMedia';

const LuxuryCategories = lazy(() => import('@/components/home/LuxuryCategories'));
const VisualEdit = lazy(() => import('@/components/home/VisualEdit'));
const FeaturedCollections = lazy(() => import('@/components/home/FeaturedCollections'));
const BestSellers = lazy(() => import('@/components/home/BestSellers'));
const HeritageStory = lazy(() => import('@/components/home/HeritageStory'));
const HeritageTimeline = lazy(() => import('@/components/home/HeritageTimeline'));
const CraftProcess = lazy(() => import('@/components/home/CraftProcess'));
const Testimonials = lazy(() => import('@/components/home/Testimonials'));
const LivingAtelier = lazy(() => import('@/components/home/LivingAtelier'));
const TodayAtPoshkaar = lazy(() => import('@/components/home/TodayAtPoshkaar'));
const InstagramFeed = lazy(() => import('@/components/home/InstagramFeed'));
const JournalPreview = lazy(() => import('@/components/home/JournalPreview'));

function SectionFallback({ height = 'min-h-[24rem]' }) {
  return (
    <div className={`flex ${height} items-center justify-center bg-ivory`} aria-hidden="true">
      <span className="h-6 w-6 animate-spin rounded-full border border-gold/20 border-t-gold/70" />
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    const title = 'Poshkaar Kashmir | poshkaarkashmir.com';
    document.title = title;

    const setMeta = (selector, attribute, value) => {
      let meta = document.head.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        const match = selector.match(/\[(name|property)="([^"]+)"\]/);
        if (match) meta.setAttribute(match[1], match[2]);
        document.head.appendChild(meta);
      }
      meta.setAttribute(attribute, value);
    }

    const description = 'Poshkaar Kashmir, also searched as poshkaarkashmir, presents Kashmiri textiles, clothing, gifts and objects with clear origin, material and care information.';
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);

    const siteUrl = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://poshkaarkashmir.com').replace(/\/$/, '');
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${siteUrl}/`);
    setMeta('meta[property="og:url"]', 'content', `${siteUrl}/`);
    setMeta('meta[property="og:image"]', 'content', `${siteUrl}${HOME_MEDIA.heroSlides[0].src}`);
    setMeta('meta[name="twitter:image"]', 'content', `${siteUrl}${HOME_MEDIA.heroSlides[0].src}`);
    document.getElementById('product-json-ld')?.remove();
  }, []);

  return (
    <main className="home-champagne">
      <HeroSection />
      <AtelierSignature />
      <Suspense fallback={<SectionFallback />}>
        <VisualEdit />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <LuxuryCategories />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <FeaturedCollections />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <BestSellers />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HeritageStory />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HeritageTimeline />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CraftProcess />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <LivingAtelier />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TodayAtPoshkaar />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <InstagramFeed />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <JournalPreview />
      </Suspense>
    </main>
  );
}
