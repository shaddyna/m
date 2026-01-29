"use client"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight, X, Star } from "lucide-react";

interface Celebrity {
    id: number;
    name: string;
    role: string;
    image: string;
    items: {
      id: number;
      name: string;
      price: number;
      image: string;
    }[];
    quote: string;
  }
// Celebrity spotlight data
const spotlights: Celebrity[] = [
  {
    id: 1,
    name: "Zendaya",
    role: "Actress & Style Icon",
    image: "https://images.unsplash.com/photo-1616797089288-4a0c5c4b0e6f?q=80&w=1974&auto=format&fit=crop",
    items: [
      { id: 101, name: "Silk Evening Gown", price: 1299, image: "https://i.pinimg.com/564x/8a/3b/5a/8a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg" },
      { id: 102, name: "Pearl Drop Earrings", price: 499, image: "https://i.pinimg.com/564x/3a/5b/3c/3a5b3c9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg" }
    ],
    quote: "This gown made me feel like royalty at the Met Gala."
  },
  {
    id: 2,
    name: "Timothée Chalamet",
    role: "Actor & Fashion Muse",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    items: [
      { id: 201, name: "Velvet Blazer", price: 899, image: "https://i.pinimg.com/564x/7a/3b/5a/7a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg" },
      { id: 202, name: "Wide-Leg Trousers", price: 459, image: "https://i.pinimg.com/564x/9a/3b/5a/9a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg" }
    ],
    quote: "The perfect blend of comfort and avant-garde style."
  },
  {
    id: 3,
    name: "Rihanna",
    role: "Music Icon & Entrepreneur",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1964&auto=format&fit=crop",
    items: [
      { id: 301, name: "Leather Trench Coat", price: 2499, image: "https://i.pinimg.com/564x/5a/3b/5a/5a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg" },
      { id: 302, name: "Oversized Sunglasses", price: 399, image: "https://i.pinimg.com/564x/1a/3b/5a/1a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg" }
    ],
    quote: "This coat stopped traffic - literally."
  },
  {
    id: 4,
    name: "Harry Styles",
    role: "Musician & Trendsetter",
    image: "https://images.unsplash.com/photo-1528892952291-009c663ce843?q=80&w=1974&auto=format&fit=crop",
    items: [
      { id: 401, name: "Flowy Silk Shirt", price: 699, image: "https://i.pinimg.com/564x/36/e5/52/36e55270678f71bdb222eeeb8651ee23.jpg" },
      { id: 402, name: "Statement Necklace", price: 599, image: "https://i.pinimg.com/564x/64/35/c2/6435c222aaa4c8286b99cee765bbcbbd.jpg" }
    ],
    quote: "I wear this shirt at least twice a week - it's that good."
  }
]; 
const CelebritySpotlight = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
 //const [selectedCelebrity, setSelectedCelebrity] = useState(null);
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);
  const [direction, setDirection] = useState(0);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const nextSpotlight = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === spotlights.length - 1 ? 0 : prev + 1));
  };

  const prevSpotlight = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? spotlights.length - 1 : prev - 1));
  };

  return (
    <section className="relative py-20 bg-black overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Floating gold particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#f4b500] rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            y: y2,
            opacity: 0.3
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest text-[#f4b500] bg-[#f4b500]/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
            RED CARPET APPROVED
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f4b500] to-[#ffffff]">
              Celebrity Spotlights
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            See how icons style our pieces and shop their looks
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {spotlights.map((celebrity, index) => (
            <motion.div
              key={celebrity.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative group overflow-hidden rounded-xl cursor-pointer"
              onClick={() => setSelectedCelebrity(celebrity)}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"
                initial={{ opacity: 0.5 }}
                whileHover={{ opacity: 0.8 }}
              />
              <img
                src={celebrity.image}
                alt={celebrity.name}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-2xl font-bold text-white">{celebrity.name}</h3>
                <p className="text-[#f4b500]">{celebrity.role}</p>
                <button className="mt-4 opacity-0 group-hover:opacity-100 bg-[#f4b500] text-black font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-opacity duration-300">
                  <ShoppingBag size={16} /> Shop the Look
                </button>
              </div>
              <motion.div
                className="absolute top-4 right-4 bg-black/50 rounded-full p-2 backdrop-blur-sm"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-[#f4b500] fill-[#f4b500]" />
                  ))}
                </div>
              </motion.div>
            </motion.div>
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
          <button className="relative overflow-hidden group border-2 border-[#f4b500] text-white hover:text-black font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md inline-flex items-center gap-2">
            <span className="relative z-10">View All Spotlights</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 bg-[#f4b500] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          </button>
        </motion.div>
      </div>

      {/* Spotlight Modal */}
      <AnimatePresence>
        {selectedCelebrity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCelebrity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative bg-[#1a1a1a] rounded-3xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-[#f4b500] hover:text-black transition-colors"
                onClick={() => setSelectedCelebrity(null)}
              >
                <X size={24} />
              </button>

              {/* Celebrity Image */}
              <motion.div
                className="w-full lg:w-1/2 h-64 lg:h-auto relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <img
                  src={selectedCelebrity.image}
                  alt={selectedCelebrity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>

              {/* Spotlight Content */}
              <motion.div
                className="w-full lg:w-1/2 p-8 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-3xl font-bold text-white">{selectedCelebrity.name}</h3>
                <p className="text-[#f4b500] text-lg mt-2">{selectedCelebrity.role}</p>
                
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-[#f4b500] fill-[#f4b500]" />
                  ))}
                </div>

                <p className="text-white text-xl italic mt-6">"{selectedCelebrity.quote}"</p>

                <h4 className="text-xl font-bold text-white mt-8 mb-4">Shop the Look:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedCelebrity.items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="bg-[#0a0a0a] rounded-lg overflow-hidden group"
                      whileHover={{ y: -5 }}
                    >
                      <div className="relative h-40">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <button className="w-full bg-[#f4b500] text-black font-bold py-2 rounded-full">
                            Add to Bag
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h5 className="text-white font-medium">{item.name}</h5>
                        <p className="text-[#f4b500] font-bold">${item.price.toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button className="mt-8 w-full bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag size={20} /> Shop Full Look
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CelebritySpotlight;