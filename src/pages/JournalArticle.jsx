import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageNotFound from '@/lib/PageNotFound';

const ARTICLES = {
  'slow-handwork': {
    label: 'Craft note',
    title: 'Why slow handwork feels different',
    description: 'A simple guide to the quiet details that make handwork feel alive.',
    image: '/images/shan.jpg',
    alt: 'Kashmiri artisan stitching a handmade textile',
    sections: [
      {
        heading: 'Small marks make it human',
        body: 'A handmade piece is never flat or lifeless. You can see small choices in the stitch, the spacing and the pressure of the hand. That is where the feeling comes from.',
      },
      {
        heading: 'Time is part of the beauty',
        body: 'Slow work allows the artisan to adjust each detail. The result feels softer, richer and more personal than something rushed through a machine.',
      },
      {
        heading: 'Made to be kept',
        body: 'Good handwork does not only follow fashion. It becomes part of family photographs, wedding days, gifts and quiet everyday rituals.',
      },
    ],
    ctaText: 'Explore handmade pieces',
    ctaPath: '/collections',
  },
  'keepsake-shawl': {
    label: 'Material guide',
    title: 'How to choose a keepsake shawl',
    description: 'Look for softness, warmth, embroidery and a design that feels personal.',
    image: '/images/home/pashmina-sozni-jamawar.jpeg',
    alt: 'Close detail of a Sozni embroidered Pashmina shawl',
    sections: [
      {
        heading: 'Start with touch',
        body: 'A keepsake shawl should feel soft, light and warm. It should sit easily on the shoulders and feel comfortable for long wear.',
      },
      {
        heading: 'Study the embroidery',
        body: 'Look closely at the motifs. Fine embroidery feels balanced, careful and clear. The best pieces invite you to keep looking.',
      },
      {
        heading: 'Choose for the moment',
        body: 'For weddings, choose richer detail. For gifting, choose colours the person can use often. For daily luxury, choose softness first.',
      },
    ],
    ctaText: 'Shop Pashmina',
    ctaPath: '/collections/pashmina',
  },
  'product-provenance': {
    label: 'Product guide',
    title: 'What verified product details mean',
    description: 'A practical guide to reading material, origin, care and availability information.',
    image: '/images/main-banner.jpg',
    alt: 'Close view of textile work in progress',
    sections: [
      {
        heading: 'Details belong to the individual piece',
        body: 'Materials, origin and technique can differ from one product to another. Reliable product pages describe the exact item instead of making one claim for an entire collection.',
      },
      {
        heading: 'Unknown information should stay open',
        body: 'A blank or pending field is more useful than a confident guess. Poshkaar publishes a detail only after it can be connected to the product record.',
      },
      {
        heading: 'Care and fulfilment are part of the choice',
        body: 'Before ordering, check how the item should be stored, cleaned, packed and delivered. These practical details help you choose a piece that suits your life.',
      },
    ],
    ctaText: 'Explore the catalogue',
    ctaPath: '/collections',
  },
};

export default function JournalArticle() {
  const { slug } = useParams();
  const article = ARTICLES[slug];

  useEffect(() => {
    if (!article) return;
    document.title = `${article.title} | Poshkaar Journal`;
    let description = document.head.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', article.description);
  }, [article]);

  if (!article) return <PageNotFound />;

  return (
    <main className="min-h-screen bg-ivory pt-32">
      <article>
        <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 md:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-16 lg:pb-24">
          <div className="flex flex-col justify-center">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-walnut luxury-transition hover:text-gold"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back home
            </Link>
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">{article.label}</p>
            <h1 className="font-heading text-5xl font-light leading-[0.98] text-charcoal md:text-7xl">
              {article.title}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-charcoal/68 md:text-lg">
              {article.description}
            </p>
          </div>

          <div className="overflow-hidden border border-walnut/10 bg-sand shadow-[0_34px_110px_-78px_rgba(91,58,41,0.95)]">
            <img src={article.image} alt={article.alt} className="h-full min-h-[32rem] w-full object-cover" />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-20 md:px-12 lg:px-0">
          <div className="space-y-10 border-y border-gold/15 py-12">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-4 font-heading text-3xl font-light text-charcoal">{section.heading}</h2>
                <p className="text-base leading-8 text-charcoal/70">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to={article.ctaPath}
              className="inline-flex min-h-12 items-center justify-center gap-3 bg-walnut px-7 text-[10px] uppercase tracking-[0.22em] text-ivory luxury-transition hover:bg-charcoal"
            >
              {article.ctaText}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-walnut luxury-transition hover:text-gold"
            >
              More from Poshkaar
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
