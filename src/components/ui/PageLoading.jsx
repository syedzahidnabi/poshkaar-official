export default function PageLoading({ label = 'Opening the atelier' }) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center bg-ivory px-6 pb-20 pt-32" role="status" aria-live="polite">
      <div className="text-center">
        <span className="mx-auto block h-7 w-7 animate-spin rounded-full border border-gold/30 border-t-gold" aria-hidden="true" />
        <p className="mt-5 text-[9px] uppercase tracking-[0.28em] text-charcoal/60">{label}</p>
      </div>
    </div>
  );
}
