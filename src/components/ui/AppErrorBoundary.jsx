import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('Poshkaar page error:', error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-ivory px-6 pb-20 pt-36">
        <section className="w-full max-w-xl border border-gold/20 bg-sand/50 p-8 text-center shadow-[0_30px_90px_-65px_rgba(91,58,41,0.9)] md:p-12" role="alert">
          <AlertTriangle className="mx-auto text-gold" size={28} strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-gold">A small pause</p>
          <h1 className="mt-3 font-heading text-4xl font-light text-charcoal">This page could not open.</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-charcoal/65">
            Your bag is safe. Refresh the page and try again. If the problem continues, contact our concierge.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mx-auto mt-8 inline-flex min-h-12 items-center justify-center gap-3 bg-charcoal px-7 text-[10px] uppercase tracking-[0.2em] text-ivory luxury-transition hover:bg-walnut focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <RefreshCw size={14} aria-hidden="true" />
            Refresh page
          </button>
        </section>
      </main>
    );
  }
}
