import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../ui/OptimizedImage';

const products = [
  {
    id: 1,
    name: 'Midnight Velvet Tilla Pheran',
    price: '₹24,500',
    image: '/images/product1.jpg',
    tag: 'New Arrival'
  },
  {
    id: 2,
    name: 'Crimson Aari Shawl',
    price: '₹18,000',
    image: '/images/product2.jpg',
    tag: 'Signature'
  },
  {
    id: 3,
    name: 'Onyx Dabka Kurta',
    price: '₹32,000',
    image: '/images/product3.jpg',
    tag: null
  }
];

export default function FeaturedGrid() {
  return (
    <section className="py-24 bg-brand-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-serif text-3xl text-brand-black">Featured Pieces</h2>
          <button className="hidden sm:flex items-center group text-sm font-medium tracking-widest uppercase text-brand-charcoal hover:text-brand-black transition-colors">
            View All <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
            >
              <Link to={`/product/${product.id}`} className="group cursor-pointer flex flex-col block">
                {/* Image Container with Hover Zoom */}
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-stone mb-6">
                  {product.tag && (
                    <span className="absolute top-4 left-4 z-10 bg-brand-white/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-widest text-brand-black">
                      {product.tag}
                    </span>
                  )}
                  <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Product Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-lg text-brand-black mb-1 group-hover:text-brand-charcoal transition-colors">
                      {product.name}
                    </h3>
                    <p className="font-sans text-sm text-brand-charcoal/70">
                      Authentic Hand Embroidery
                    </p>
                  </div>
                  <span className="font-sans text-sm font-medium text-brand-black">
                    {product.price}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <button className="mt-12 w-full sm:hidden flex justify-center items-center group text-sm font-medium tracking-widest uppercase text-brand-charcoal border border-brand-stone py-4 hover:bg-brand-black hover:text-brand-white transition-colors">
          View All <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </section>
  );
}