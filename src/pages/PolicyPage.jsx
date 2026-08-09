import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import PageNotFound from '@/lib/PageNotFound';

const CONTACT_EMAIL = 'poshkaarkashmirofficial@gmail.com';
const CONTACT_PHONE = '+91 60064 91824';
const SITE_URL = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://poshkaarkashmir.com').replace(/\/$/, '');

const POLICIES = {
  privacy: {
    eyebrow: 'Your information',
    title: 'Privacy Policy',
    intro: 'We collect only the information needed to serve you, complete orders and improve Poshkaar.',
    sections: [
      ['What we collect', 'We may collect your name, email, phone number, delivery address, order details and messages you send to us. Payment details are handled securely by the chosen payment provider and are not stored by Poshkaar.'],
      ['How we use it', 'We use your information to process orders, send order updates, answer questions, prevent fraud and improve the website. Marketing messages are sent only when you choose to receive them.'],
      ['Who receives it', 'We share only the information needed with trusted services that help us take payment, deliver parcels, send messages and run the website. We do not sell your personal information.'],
      ['Your choices', 'You can ask us to correct or delete information we hold about you, subject to records we must keep for orders, tax or legal reasons.'],
    ],
  },
  terms: {
    eyebrow: 'Shopping with Poshkaar',
    title: 'Terms and Conditions',
    intro: 'These simple terms explain how orders, prices, handmade details and website use work.',
    sections: [
      ['Orders', 'An order is accepted after payment is verified or, for an offline order, after our team confirms it. We may contact you if an item, measurement or delivery detail needs clarification.'],
      ['Handmade character', 'Small differences in colour, stitch, weave and finish are natural signs of handmade work. Screen colours can also look slightly different from the real piece.'],
      ['Prices and payment', 'Prices are shown in Indian rupees unless stated otherwise. Secure online payments are handled by Razorpay. Any duties charged by another country are the customer’s responsibility.'],
      ['Website use', 'Product photographs, writing and designs on this website belong to Poshkaar or their respective owners and may not be copied for commercial use without permission.'],
    ],
  },
  shipping: {
    eyebrow: 'From Kashmir to you',
    title: 'Shipping and Delivery',
    intro: 'Every order is checked and packed with care before it leaves our atelier.',
    sections: [
      ['Order preparation', 'Ready pieces usually leave within 2–4 business days. Made-to-order, customised and bridal pieces need more time; the expected making time is shown on the product page or confirmed by our team.'],
      ['India delivery', 'Standard delivery across India usually takes 5–7 business days after dispatch. Remote areas and service interruptions may take longer.'],
      ['International delivery', 'International delivery usually takes 10–15 business days after dispatch. Customs checks can add time and local duties may apply.'],
      ['Tracking and support', 'We send tracking details when the parcel ships. If a package looks damaged, contact us promptly with photographs of the parcel and product.'],
    ],
  },
  returns: {
    eyebrow: 'Care after delivery',
    title: 'Returns and Exchanges',
    intro: 'We want you to feel confident about every Poshkaar piece you keep.',
    sections: [
      ['Return window', 'Eligible ready-to-wear items can be requested for return within 15 days of delivery. Contact us before sending any item back so we can guide you.'],
      ['Item condition', 'Returned items must be unworn, unused and sent back with their original tags, packaging and proof of purchase.'],
      ['Custom pieces', 'Personalised, made-to-measure, altered and final-sale items cannot normally be returned unless they arrive damaged or different from the confirmed order.'],
      ['Refunds', 'After the item is received and checked, an approved refund is sent to the original payment method. Bank processing time can vary.'],
    ],
  },
};

function setPolicySeo(policy, slug) {
  const title = `${policy.title} | Poshkaar Kashmir`;
  const url = `${SITE_URL}/policies/${slug}`;
  document.title = title;

  let description = document.head.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement('meta');
    description.setAttribute('name', 'description');
    document.head.appendChild(description);
  }
  description.setAttribute('content', policy.intro);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

export default function PolicyPage() {
  const { slug } = useParams();
  const policy = POLICIES[slug];

  useEffect(() => {
    if (policy) setPolicySeo(policy, slug);
  }, [policy, slug]);

  if (!policy) return <PageNotFound />;

  return (
    <main className="min-h-screen bg-ivory pb-24 pt-36">
      <article className="mx-auto max-w-5xl px-6 md:px-12 lg:px-16">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-walnut luxury-transition hover:text-gold">
          <ArrowLeft size={14} aria-hidden="true" /> Back home
        </Link>

        <header className="mt-10 border-b border-gold/15 pb-12 md:pb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{policy.eyebrow}</p>
          <h1 className="mt-4 font-heading text-5xl font-light leading-none text-charcoal md:text-7xl">{policy.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-charcoal/65">{policy.intro}</p>
          <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-charcoal/70">Last updated: 12 July 2026</p>
        </header>

        <div className="divide-y divide-gold/12">
          {policy.sections.map(([heading, text], index) => (
            <section key={heading} className="grid gap-4 py-10 md:grid-cols-[6rem_1fr] md:gap-10 md:py-12">
              <p className="font-heading text-2xl font-light text-gold/70">{String(index + 1).padStart(2, '0')}</p>
              <div>
                <h2 className="font-heading text-3xl font-light text-charcoal">{heading}</h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-charcoal/68 md:text-base md:leading-8">{text}</p>
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-6 border border-gold/20 bg-sand/55 p-7 md:p-10" aria-label="Policy help">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Need help?</p>
          <h2 className="mt-3 font-heading text-3xl font-light text-charcoal">Speak with our concierge.</h2>
          <div className="mt-6 flex flex-col gap-4 text-sm text-charcoal/70 sm:flex-row sm:gap-8">
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-11 items-center gap-3 hover:text-walnut"><Mail size={15} className="text-gold" aria-hidden="true" />{CONTACT_EMAIL}</a>
            <a href="tel:+916006491824" className="inline-flex min-h-11 items-center gap-3 hover:text-walnut"><Phone size={15} className="text-gold" aria-hidden="true" />{CONTACT_PHONE}</a>
          </div>
        </aside>
      </article>
    </main>
  );
}
