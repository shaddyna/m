
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ProductCard from "./product/ProductCard";
import ProductDetailModal from "./product/ProductDetailModal";
import useProducts from "@/utils/useProducts";

const FeaturedCollectionsLight = () => {
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded-full mx-auto"></div>
          <div className="animate-pulse h-12 w-64 bg-gray-200 rounded-full mx-auto mt-6"></div>
          <div className="animate-pulse h-4 w-96 bg-gray-200 rounded-full mx-auto mt-4"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl h-[500px] animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-3 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <span className="text-xs font-semibold tracking-widest text-[#82cee4] bg-[#82cee4]/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
            FOR YOU
          </span>
          <h2 className="mt-3 text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82cee4] to-[#62aee4]">
              Featured Chemical Products
            </span>
          </h2>
          <p className="mt-0 text-md text-gray-600 max-w-2xl mx-auto">
            High-quality chemicals for your laboratory needs
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={{
                ...product,
                id: product._id
              }}
              onQuickView={() => setSelectedProduct({ ...product, id: product._id })}
              animationDelay={index * 0.1}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="relative overflow-hidden group border-2 border-[#82cee4] text-gray-900 hover:text-black font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md">
            <span className="relative z-10 flex items-center gap-2">
              View All Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-[#82cee4] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          </button>
        </motion.div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal 
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedCollectionsLight;



/*"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ProductCard from "./product/ProductCard";
import ProductDetailModal from "./product/ProductDetailModal";
import useProducts from "@/utils/useProducts";

const FeaturedCollectionsLight = () => {
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse h-8 w-32 bg-gray-200 rounded-full mx-auto"></div>
          <div className="animate-pulse h-12 w-64 bg-gray-200 rounded-full mx-auto mt-6"></div>
          <div className="animate-pulse h-4 w-96 bg-gray-200 rounded-full mx-auto mt-4"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-xl h-[500px] animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-3 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
    
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <span className="text-xs font-semibold tracking-widest text-[#82cee4] bg-[#82cee4]/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
            FOR YOU
          </span>
          <h2 className="mt-3 text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82cee4] to-[#62aee4]">
              Featured Chemical Products
            </span>
          </h2>
          <p className="mt-0 text-md text-gray-600 max-w-2xl mx-auto">
            High-quality chemicals for your laboratory needs
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={{
                ...product,
                id: product._id
              }}
              onQuickView={() => setSelectedProduct({ ...product, id: product._id })}
              onAddToCart={handleAddToCart}
              animationDelay={index * 0.1}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="relative overflow-hidden group border-2 border-[#82cee4] text-gray-900 hover:text-black font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md">
            <span className="relative z-10 flex items-center gap-2">
              View All Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-[#82cee4] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal 
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedCollectionsLight;*/

