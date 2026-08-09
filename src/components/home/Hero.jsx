import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-charcoal">
      {/* Background Video/Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: "url('/images/hero-main.jpg')" }}
      >
        {/* Gradient overlay to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/40 via-brand-black/20 to-brand-black/80" />
      </div>

      {/* Cinematic Content Overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // Custom easing for luxury feel
          className="flex flex-col items-center"
        >
          <span className="mb-6 block font-sans text-xs font-medium uppercase tracking-[0.4em] text-brand-stone">
            Mastering Tilla, Aari, Sozni & Dabka
          </span>
          
          <h1 className="mb-4 font-serif text-6xl text-brand-white sm:text-8xl lg:text-[10rem] tracking-tight">
            Poshkaar
          </h1>
          
          <p className="mt-4 font-serif text-2xl italic tracking-wide text-brand-stone sm:text-4xl">
            The threads of paradise.
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          className="absolute bottom-12 flex flex-col items-center"
        >
          <span className="mb-4 font-sans text-[10px] uppercase tracking-widest text-brand-stone">
            Discover
          </span>
          <div className="h-16 w-[1px] bg-gradient-to-b from-brand-stone to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}