import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import OptimizedImage from '../ui/OptimizedImage';

export default function Collection() {
  return (
    <section className="py-32 bg-brand-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Editorial Image */}
            <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="aspect-[4/5] bg-brand-stone relative overflow-hidden"
          >
            <OptimizedImage
              src="/images/collections/tilla-banner.jpg"
              alt="Autumn Velvet Collection"
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-1000"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
          
          {/* Narrative Text */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-serif text-4xl text-brand-black mb-6">
              Rang-e-Poshkaar
            </h2>
            <p className="font-sans text-brand-charcoal leading-relaxed mb-8">
              Made by skilled artists in Shopian, this velvet collection brings Kashmiri Tilla work into soft, beautiful clothes you can wear and keep for years.
            </p>
            <Link to="/collections/pashmina" className="self-start uppercase tracking-widest text-xs font-semibold border-b border-brand-black pb-1 hover:text-brand-charcoal transition-colors">
              Explore the Collection
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
