"use client"
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

// Designer brand data
const designerBrands = [
  {
    id: 1,
    name: "Gucci",
    logo: "https://i.pinimg.com/736x/bc/e8/ea/bce8ea4234fa2813b58711f0260b3029.jpg",
    link: "#gucci"
  },
  {
    id: 2,
    name: "Balenciaga",
    logo: "https://i.pinimg.com/736x/a0/22/ba/a022ba7b85a01a95840d41de478c36bd.jpg",
    link: "#balenciaga"
  },
  {
    id: 3,
    name: "Louis Vuitton",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Louis_Vuitton_logo_and_wordmark.svg/2560px-Louis_Vuitton_logo_and_wordmark.svg.png",
    link: "#louis-vuitton"
  },
  {
    id: 4,
    name: "Prada",
    logo: "https://i.pinimg.com/236x/99/98/bf/9998bfcd3ee5ecc6add09be6ac23ce80.jpg",
    link: "#prada"
  },
  {
    id: 5,
    name: "Valentino",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Valentino_logo.svg/1200px-Valentino_logo.svg.png",
    link: "#valentino"
  },
  {
    id: 6,
    name: "Dior",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Dior_logo.svg/2560px-Dior_logo.svg.png",
    link: "#dior"
  },
  {
    id: 7,
    name: "Chanel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Chanel_logo.svg/2560px-Chanel_logo.svg.png",
    link: "#chanel"
  },
  {
    id: 8,
    name: "Versace",
    logo: "https://i.pinimg.com/236x/49/fc/f0/49fcf0ef309a37b02d6e5d792009f211.jpg",
    link: "#versace"
  }
];

const DesignerShowcase = () => {
 // const [hoveredBrand, setHoveredBrand] = useState(null);
  const [hoveredBrand, setHoveredBrand] = useState<number | null>(null); 

  // Floating shapes data
  const floatingShapes = [
    { id: 1, style: "w-16 h-16 bg-[#f4b500]/10 rounded-full absolute top-1/4 left-10" },
    { id: 2, style: "w-24 h-24 bg-[#f4b500]/5 rounded-lg absolute bottom-1/3 right-20" },
    { id: 3, style: "w-32 h-32 bg-[#f4b500]/5 rounded-full absolute top-1/3 right-1/4" },
    { id: 4, style: "w-20 h-20 bg-[#f4b500]/10 rounded-lg absolute bottom-1/4 left-1/3" }
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Floating background shapes */}
      {floatingShapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={shape.style}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.05, 1],
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
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
            LUXURY COLLABORATIONS
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Featured <span className="text-[#f4b500]">Designers</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover collections from the world's most prestigious fashion houses
          </p>
        </motion.div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {designerBrands.map((brand) => (
            <motion.a
              key={brand.id}
              href={brand.link}
              className="group relative flex flex-col items-center justify-center p-6 rounded-xl bg-white border border-gray-100 hover:border-[#f4b500]/30 transition-all duration-300 shadow-sm hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: brand.id * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredBrand(brand.id)}
              onMouseLeave={() => setHoveredBrand(null)}
              whileHover={{ y: -5 }}
            >
              {/* Animated overlay */}
              <motion.div
                className="absolute inset-0 bg-[#f4b500]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0.9 }}
                animate={{ scale: hoveredBrand === brand.id ? 1 : 0.9 }}
              />

              {/* Brand logo */}
              <div className="relative h-20 w-full flex items-center justify-center">
                <motion.img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-12 object-contain object-center filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  whileHover={{ scale: 1.05 }}
                />
              </div>

              {/* Brand name */}
              <motion.p
                className="mt-4 text-sm font-medium text-gray-500 group-hover:text-[#f4b500] transition-colors duration-300"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: hoveredBrand === brand.id ? 1 : 0.8 }}
              >
                {brand.name}
              </motion.p>

              {/* View collection button */}
              <motion.div
                className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ y: 10 }}
                animate={{ y: hoveredBrand === brand.id ? 0 : 10 }}
              >
                <span className="text-xs font-semibold text-[#f4b500] border-b border-[#f4b500]/30">
                  View Collection
                </span>
              </motion.div>
            </motion.a>
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
          <button className="relative overflow-hidden group border-2 border-[#f4b500] text-gray-900 hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md inline-flex items-center gap-2">
            <span className="relative z-10">Explore All Designers</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 bg-[#f4b500] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default DesignerShowcase;