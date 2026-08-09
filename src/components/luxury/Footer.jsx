import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, MapPin, Instagram } from 'lucide-react';
import { base44, hasConfiguredBackend } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { EASE_LUXURY } from '@/lib/luxuryMotion';

const CONTACT_EMAIL = 'poshkaarkashmirofficial@gmail.com';
const NEWSLETTER_STORAGE_KEY = 'poshkaar_newsletter_pending_v1';

const storeLocalNewsletterSignup = (email) => {
  if (typeof window === 'undefined') return;

  try {
    const existing = JSON.parse(window.localStorage.getItem(NEWSLETTER_STORAGE_KEY) || '[]');
    const signups = Array.isArray(existing) ? existing : [];
    const normalizedEmail = email.trim().toLowerCase();
    if (!signups.some((item) => item.email === normalizedEmail)) {
      window.localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify([
        { email: normalizedEmail, created_at: new Date().toISOString() },
        ...signups,
      ]));
    }
  } catch {
    // Non-critical local preview fallback only.
  }
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      if (hasConfiguredBackend) {
        await base44.entities.Newsletter.create({ email: email.trim().toLowerCase() });
      } else {
        storeLocalNewsletterSignup(email);
      }
      setSubscribed(true);
      toast({
        title: 'Welcome to Poshkaar',
        description: 'You have been added to our private list.',
      });
      setEmail('');
    } catch {
      storeLocalNewsletterSignup(email);
      setSubscribed(true);
      toast({
        title: 'Saved for follow-up',
        description: 'Your email is saved locally. Connect Base44 or Supabase to sync newsletter signups.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const linkClass =
    'block py-1 text-sm text-ivory/70 luxury-transition hover:text-ivory';

  return (
    <footer className="relative overflow-hidden bg-charcoal text-ivory grain-overlay">
      <div className="luxury-ambient left-[-8rem] top-10 h-72 w-72 bg-gold/20" />
      <div className="luxury-ambient bottom-[-8rem] right-[-6rem] h-72 w-72 bg-[#7d4c20]/20" />
      {/* Newsletter */}
      <div className="relative border-b border-white/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <motion.div
            className="max-w-xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE_LUXURY }}
          >
            <div className="flex items-center justify-center gap-4 mb-5">
              <span className="h-px w-10 bg-gold/30" />
              <span className="text-champagne text-[10px] tracking-[0.3em] uppercase">
                The Private List
              </span>
              <span className="h-px w-10 bg-gold/30" />
            </div>
            <h3 className="font-heading text-3xl md:text-5xl font-light mb-4 text-balance">
              Join Our Private List
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-ivory/75 md:mb-10 md:text-base">
              Get early access to new pieces, craft stories and private offers.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 text-champagne"
              >
                <span className="text-2xl">✓</span>
                <span className="text-sm tracking-[0.15em] uppercase">
                  You're on the list
                </span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleNewsletter}
                className="mx-auto flex max-w-md rounded-[0.25rem] border border-white/15 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl focus-within:border-gold focus-within:shadow-[0_0_0_1px_rgba(197,160,89,0.2),0_12px_35px_-15px_rgba(197,160,89,0.55)] luxury-transition"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-transparent px-5 py-4 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none"
                  required
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  aria-label={submitting ? 'Subscribing to newsletter' : 'Subscribe to newsletter'}
                  className="bg-gold text-charcoal px-6 py-4 text-[10px] tracking-[0.2em] uppercase hover:bg-ivory luxury-transition disabled:opacity-50 flex items-center gap-2 font-body"
                >
                  {submitting ? (
                    <span className="w-3 h-3 border border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">Subscribe</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20 lg:px-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-heading text-2xl tracking-[0.15em] uppercase font-medium">
              Poshkaar
            </h4>
            <p className="text-champagne text-[9px] tracking-[0.4em] uppercase mb-6 font-body">
              Kashmir
            </p>
            <p className="mb-8 max-w-xs text-sm leading-relaxed text-ivory/70">
              Textiles, clothing, gifts and objects with clear material, origin and care information.
            </p>
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com/posh__kaar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 border border-white/15 rounded-full flex items-center justify-center text-ivory/60 hover:text-champagne hover:border-gold luxury-transition"
                aria-label="Instagram"
              >
                <Instagram size={15} />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 className="text-[10px] tracking-[0.25em] uppercase text-champagne mb-6 font-body">
              Collections
            </h5>
            <ul>
              <li><Link to="/collections/new-arrivals" className={linkClass}>New Arrivals</Link></li>
              <li><Link to="/collections/best-sellers" className={linkClass}>Best Sellers</Link></li>
              <li><Link to="/collections/bridal" className={linkClass}>Bridal</Link></li>
              <li><Link to="/collections/pashmina" className={linkClass}>Pashmina</Link></li>
              <li><Link to="/collections" className={linkClass}>All Collections</Link></li>
            </ul>
          </div>

          {/* The Craft */}
          <div>
            <h5 className="text-[10px] tracking-[0.25em] uppercase text-champagne mb-6 font-body">
              The Craft
            </h5>
            <ul>
              <li><Link to="/our-story" className={linkClass}>Our Story</Link></li>
              <li><Link to="/journal/product-provenance" className={linkClass}>Product Details</Link></li>
              <li><Link to="/journal/slow-handwork" className={linkClass}>Sozni Embroidery</Link></li>
              <li><Link to="/journal/slow-handwork" className={linkClass}>Tilla Work</Link></li>
              <li><Link to="/journal/keepsake-shawl" className={linkClass}>Pashmina Heritage</Link></li>
            </ul>
          </div>

          {/* Concierge */}
          <div>
            <h5 className="text-[10px] tracking-[0.25em] uppercase text-champagne mb-6 font-body">
              Concierge
            </h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-champagne mt-0.5 shrink-0" />
                <span className="text-sm text-ivory/70">Srinagar, Kashmir</span>
              </li>
              <li>
                <a href="tel:+916006491824" className="flex items-center gap-3 text-sm text-ivory/70 hover:text-ivory luxury-transition">
                  <Phone size={14} className="text-champagne shrink-0" />
                  +91 60064 91824
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-start gap-3 break-all text-sm text-ivory/70 hover:text-ivory luxury-transition">
                  <Mail size={14} className="text-champagne shrink-0" />
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] tracking-wider text-ivory/70">
            © {new Date().getFullYear()} Poshkaar Kashmir. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/policies/privacy" className="text-[10px] tracking-wider text-ivory/70 luxury-transition hover:text-ivory">
              Privacy
            </Link>
            <Link to="/policies/terms" className="text-[10px] tracking-wider text-ivory/70 luxury-transition hover:text-ivory">
              Terms
            </Link>
            <Link to="/policies/shipping" className="text-[10px] tracking-wider text-ivory/70 luxury-transition hover:text-ivory">
              Shipping
            </Link>
            <Link to="/policies/returns" className="text-[10px] tracking-wider text-ivory/70 luxury-transition hover:text-ivory">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
