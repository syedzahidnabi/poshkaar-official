import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, User, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { EASE_LUXURY } from '@/lib/luxuryMotion';
import useFocusTrap from '@/hooks/useFocusTrap';

const navLinks = [
  { label: 'New Arrivals', path: '/collections/new-arrivals' },
  { label: 'Collections', path: '/collections' },
  { label: 'Bridal', path: '/collections/bridal' },
  { label: 'Pashmina', path: '/collections/pashmina' },
  { label: 'Our Story', path: '/our-story' },
];

const collectionMenu = [
  { title: 'Pashmina', text: 'Shawls and considered wraps', path: '/collections/pashmina' },
  { title: 'Walnut Wood', text: 'Carved objects for the home', path: '/collections/walnut-wood' },
  { title: 'Papier-Mâché', text: 'Pattern, colour and painted detail', path: '/collections/papier-mache' },
  { title: 'Copperware', text: 'Objects for serving and ceremony', path: '/collections/copperware' },
  { title: 'Willow Wicker', text: 'Useful forms woven from willow', path: '/collections/willow-wicker' },
  { title: 'Wedding Gifts', text: 'Pieces chosen for lasting memories', path: '/collections/wedding-gifts' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const lastScrollY = useRef(0);
  const mobileDialogRef = useFocusTrap(mobileOpen);
  const { totalItems, setIsOpen } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);
      setHidden(currentY > lastScrollY.current && currentY > 160);
      lastScrollY.current = Math.max(0, currentY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) setHidden(false);
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const showSolid = scrolled || !isHome;
  const homeHeroNav = isHome && !scrolled;
  const useLightNavText = showSolid;

  const linkClass = (isActive) =>
    `relative text-[11px] tracking-[0.18em] uppercase font-body luxury-transition group ${
      useLightNavText ? 'text-charcoal hover:text-burgundy' : 'text-ivory hover:text-champagne'
    } ${isActive ? (useLightNavText ? '!text-walnut' : '!text-ivory') : ''}`;

  const iconClass = `luxury-transition ${
    useLightNavText ? 'text-charcoal hover:text-burgundy' : 'text-ivory hover:text-champagne'
  }`;

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 top-0 z-50 luxury-transition ${
          showSolid
            ? 'border-b border-walnut/10 bg-ivory/95 shadow-[0_18px_60px_-52px_rgba(29,29,29,0.8)] backdrop-blur-xl'
            : homeHeroNav
              ? 'home-hero-navbar'
              : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: hidden ? -140 : 0 }}
        transition={{ duration: 0.7, ease: EASE_LUXURY }}
        onMouseLeave={() => setMegaOpen(false)}
      >
        {/* Announcement bar */}
        <div className="bg-charcoal px-4 py-2.5 text-center font-body text-[8px] uppercase tracking-[0.2em] text-ivory sm:text-[9px] sm:tracking-[0.3em]">
          <span className="sm:hidden">Free shipping over ₹15,000</span>
          <span className="hidden sm:inline">Complimentary shipping on orders above ₹15,000</span>
        </div>

        <nav className="flex min-h-[68px] items-center justify-between px-5 py-3 md:px-12 lg:px-16" aria-label="Primary navigation">
          {/* Left nav */}
          <div className="hidden flex-1 items-center gap-8 xl:flex">
            {navLinks.map((link) => {
              const isCollectionsLink = link.label === 'Collections';
              const isActive = location.pathname === link.path
                || (isCollectionsLink && location.pathname.startsWith('/collections/'));

              return (
                <div
                  key={link.path}
                  className={isCollectionsLink ? 'static' : 'relative'}
                  onMouseEnter={() => setMegaOpen(isCollectionsLink)}
                  onMouseLeave={() => isCollectionsLink && setMegaOpen(false)}
                  onBlur={(event) => {
                    if (isCollectionsLink && !event.currentTarget.contains(event.relatedTarget)) {
                      setMegaOpen(false);
                    }
                  }}
                >
                  <Link
                    to={link.path}
                    className={linkClass(isActive)}
                    onFocus={() => setMegaOpen(isCollectionsLink)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-gold luxury-transition ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>

                  {isCollectionsLink && (
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          className="absolute left-0 right-0 top-full z-[80] border-y border-walnut/10 bg-ivory shadow-[0_30px_80px_-62px_rgba(29,29,29,0.9)]"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.24, ease: EASE_LUXURY }}
                        >
                          <div className="mx-auto grid max-w-7xl gap-8 px-12 py-8 lg:grid-cols-[0.62fr_1.38fr] lg:px-16">
                            <div className="border-r border-walnut/10 pr-10">
                              <p className="text-[9px] uppercase tracking-[0.28em] text-gold">The collection</p>
                              <p className="mt-4 max-w-sm font-heading text-3xl font-light leading-tight text-charcoal">
                                Objects, textiles and gifts chosen for timeless living.
                              </p>
                              <Link
                                to="/collections"
                                className="mt-6 inline-flex min-h-11 items-center text-[9px] uppercase tracking-[0.22em] text-walnut luxury-transition hover:text-charcoal"
                              >
                                View every collection
                              </Link>
                            </div>
                            <div className="grid grid-cols-3 gap-x-7 gap-y-3">
                              {collectionMenu.map((item) => (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  className="group block border-b border-walnut/10 px-1 py-3 luxury-transition hover:border-gold"
                                >
                                  <span className="block font-heading text-xl font-light leading-none text-charcoal group-hover:text-walnut">
                                    {item.title}
                                  </span>
                                  <span className="mt-2 block text-[11px] leading-5 text-charcoal/60">
                                    {item.text}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            className="flex min-h-11 flex-1 items-center xl:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <Menu size={22} className={useLightNavText ? 'text-charcoal' : 'text-ivory'} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 text-center"
            aria-label="Poshkaar Kashmir home"
          >
            <img
              src="/images/poshkaar-p-mark.png"
              alt=""
              className="h-9 w-8 object-contain"
              aria-hidden="true"
            />
            <span className="text-left">
              <span
                className={`block font-heading text-lg font-medium uppercase tracking-[0.14em] luxury-transition md:text-2xl ${
                  useLightNavText ? 'text-charcoal' : 'text-ivory'
                }`}
              >
                Poshkaar
              </span>
              <span
                className={`block -mt-0.5 font-body text-[7px] uppercase tracking-[0.34em] luxury-transition ${
                  showSolid ? 'text-gold' : 'text-champagne'
                }`}
              >
                Kashmir
              </span>
            </span>
          </Link>

          {/* Right icons */}
          <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
            <Link to="/search" aria-label="Search" className="hidden h-11 w-11 items-center justify-center md:flex">
              <Search size={18} className={iconClass} />
            </Link>
            <Link to="/account" aria-label="Account" className="hidden h-11 w-11 items-center justify-center md:flex">
              <User size={18} className={iconClass} />
            </Link>
            {isAdmin && (
              <Link to="/admin" aria-label="Admin dashboard" className="hidden h-11 w-11 items-center justify-center md:flex">
                <ShieldCheck size={18} className={iconClass} />
              </Link>
            )}
            <Link to="/wishlist" aria-label="Wishlist" className="hidden h-11 w-11 items-center justify-center md:flex">
              <Heart size={18} className={iconClass} />
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex min-h-11 min-w-11 items-center justify-center"
              aria-label={`Shopping bag, ${totalItems} items`}
            >
              <ShoppingBag size={18} className={iconClass} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-burgundy text-ivory text-[8px] font-body rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3, ease: EASE_LUXURY }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              ref={mobileDialogRef}
              id="mobile-navigation"
              className="fixed bottom-0 left-0 top-0 z-[60] flex w-[22rem] max-w-[88vw] flex-col bg-ivory shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.5, ease: EASE_LUXURY }}
            >
              <div className="flex items-center justify-between p-6 border-b border-gold/10">
                <div className="flex items-center gap-2.5">
                  <img src="/images/poshkaar-p-mark.png" alt="" className="h-10 w-9 object-contain" aria-hidden="true" />
                  <div className="text-left">
                    <span className="block font-heading text-lg font-medium uppercase tracking-[0.15em] text-charcoal">
                      Poshkaar
                    </span>
                    <p className="-mt-0.5 font-body text-[7px] uppercase tracking-[0.4em] text-gold">
                      Kashmir
                    </p>
                  </div>
                </div>
                <button className="flex min-h-11 min-w-11 items-center justify-end" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X size={22} className="text-charcoal" />
                </button>
              </div>
              <nav className="flex-1 py-10 px-8 space-y-7 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, ease: EASE_LUXURY }}
                  >
                    <Link
                      to={link.path}
                      className="block font-heading text-2xl text-charcoal hover:text-burgundy luxury-transition font-light"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className={`p-6 border-t border-gold/10 grid gap-4 ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <Link to="/account" className="flex flex-col items-center gap-1.5 text-[9px] tracking-wider uppercase text-charcoal hover:text-burgundy luxury-transition">
                  <User size={18} /> Account
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex flex-col items-center gap-1.5 text-[9px] tracking-wider uppercase text-charcoal hover:text-burgundy luxury-transition">
                    <ShieldCheck size={18} /> Admin
                  </Link>
                )}
                <Link to="/wishlist" className="flex flex-col items-center gap-1.5 text-[9px] tracking-wider uppercase text-charcoal hover:text-burgundy luxury-transition">
                  <Heart size={18} /> Wishlist
                </Link>
                <Link to="/search" className="flex flex-col items-center gap-1.5 text-[9px] tracking-wider uppercase text-charcoal hover:text-burgundy luxury-transition">
                  <Search size={18} /> Search
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
