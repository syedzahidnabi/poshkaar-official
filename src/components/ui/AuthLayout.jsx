import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer = null, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 pb-16 pt-40 md:pt-44">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_8%,rgba(197,160,89,0.18),transparent_32%),linear-gradient(180deg,rgba(250,249,246,0.92),rgba(242,239,233,0.78))]" />
      <div className="absolute left-1/2 top-28 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-ivory shadow-3d">
            <Icon className="h-6 w-6 text-burgundy" aria-hidden="true" />
          </div>
          <p className="mb-2 text-[9px] uppercase tracking-[0.32em] text-gold">Poshkaar account</p>
          <h1 className="font-display text-3xl font-light tracking-tight text-charcoal">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-charcoal/55">{subtitle}</p>}
        </div>
        <div className="border border-gold/15 bg-ivory/92 p-7 shadow-3d backdrop-blur md:p-8">
          {children}
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        )}
      </div>
    </div>
  );
}
