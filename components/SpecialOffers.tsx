"use client"
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, Tag, ArrowRight } from "lucide-react";

// Enhanced dummy data with product images (light version)
const specialOffers = [
  {
    id: 1,
    title: "Summer Flash Sale",
    discount: "50% OFF",
    description: "On all swimwear & beach accessories",
    timeLeft: 24 * 60 * 60, // 24 hours in seconds
    code: "SUNNY50",
    bgColor: "bg-white",
    textColor: "text-gray-900",
    productImage: "https://i.pinimg.com/736x/70/cf/84/70cf84d4d824e5994022b0f489ef81d9.jpg",
    overlayColor: "from-white/80 to-white/20"
  },
  {
    id: 2,
    title: "Designer Handbags",
    discount: "30% OFF",
    description: "Selected luxury handbags & accessories",
    timeLeft: 15 * 60 * 60 + 30 * 60, // 15 hours 30 minutes
    code: "LUXE30",
    bgColor: "bg-white",
    textColor: "text-gray-900",
    productImage: "https://i.pinimg.com/564x/5a/3b/5a/5a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg",
    overlayColor: "from-white/70 to-white/10"
  },
  {
    id: 3,
    title: "New Season Collection",
    discount: "20% OFF",
    description: "First purchase over $200",
    timeLeft: 3 * 24 * 60 * 60, // 3 days
    code: "WELCOME20",
    bgColor: "bg-white",
    textColor: "text-gray-900",
    productImage: "https://i.pinimg.com/564x/7a/3b/5a/7a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg",
    overlayColor: "from-white/90 to-transparent"
  },
];


const SpecialOffers = () => {
  const [offers, setOffers] = useState(specialOffers);
  const [activeOffer, setActiveOffer] = useState(0);
  //const intervalRef = useRef();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);


  // Countdown timer effect
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setOffers(prevOffers =>
        prevOffers.map(offer => ({
          ...offer,
          timeLeft: offer.timeLeft > 0 ? offer.timeLeft - 1 : 0
        }))
      );
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-rotate offers every 5 seconds
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setActiveOffer(prev => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(rotationInterval);
  }, [offers.length]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
  
    return {
      days: days.toString().padStart(2, "0"),
      hours: hours.toString().padStart(2, "0"), 
      mins: mins.toString().padStart(2, "0"),
      secs: secs.toString().padStart(2, "0"),
    };
  };

  return (
    <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold tracking-widest text-[#f4b500] bg-[#f4b500]/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
            <Zap size={14} className="fill-[#f4b500]" /> FLASH SALES
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Limited-Time <span className="text-[#f4b500]">Offers</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Exclusive deals on our most coveted pieces - act fast before they're gone!
          </p>
        </motion.div>

        {/* Offers Carousel (Desktop) */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`${offer.bgColor} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100`}
            >
              {/* Product Image Background */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offer.productImage}
                  alt={offer.title}
                  className="w-full h-full object-cover absolute inset-0"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${offer.overlayColor}`} />
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-[#f4b500] text-white font-bold text-xl px-4 py-2 rounded-full shadow-lg">
                  {offer.discount}
                </div>
              </div>

              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-[#f4b500]">
                      LIMITED TIME
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-gray-900">
                      {offer.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-gray-600">
                  {offer.description}
                </p>

                <div className="mt-6 bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-[#f4b500]" />
                    <span className="text-sm font-medium text-gray-700">
                      Ends in:
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {Object.entries(formatTime(offer.timeLeft)).map(([unit, value]) => (
                      <div key={unit} className="flex flex-col items-center">
                        <div className="bg-white rounded-md px-2 py-1 min-w-[2.5rem] shadow-sm">
                          <span className="text-lg font-bold text-gray-900">
                            {value}
                          </span>
                        </div>
                        <span className="text-xs mt-1 text-gray-500">
                          {unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="bg-[#f4b500]/10 border border-[#f4b500]/20 rounded-md px-3 py-2">
                    <span className="text-sm font-mono font-bold text-[#f4b500]">
                      CODE: {offer.code}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#f4b500] hover:bg-[#d4a017] text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-md"
                  >
                    Shop Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative h-[420px] overflow-hidden rounded-2xl bg-white shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOffer}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Product Image Background */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offers[activeOffer].productImage}
                  alt={offers[activeOffer].title}
                  className="w-full h-full object-cover absolute inset-0"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${offers[activeOffer].overlayColor}`} />
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-[#f4b500] text-white font-bold text-xl px-4 py-2 rounded-full shadow-lg">
                  {offers[activeOffer].discount}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-[#f4b500]">
                      LIMITED TIME
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-gray-900">
                      {offers[activeOffer].title}
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-gray-600">
                  {offers[activeOffer].description}
                </p>

                <div className="mt-6 bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-[#f4b500]" />
                    <span className="text-sm font-medium text-gray-700">
                      Ends in:
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {Object.entries(formatTime(offers[activeOffer].timeLeft)).map(([unit, value]) => (
                      <div key={unit} className="flex flex-col items-center">
                        <div className="bg-white rounded-md px-2 py-1 min-w-[2.5rem] shadow-sm">
                          <span className="text-lg font-bold text-gray-900">
                            {value}
                          </span>
                        </div>
                        <span className="text-xs mt-1 text-gray-500">
                          {unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <div className="bg-[#f4b500]/10 border border-[#f4b500]/20 rounded-md px-3 py-2">
                    <span className="text-sm font-mono font-bold text-[#f4b500]">
                      CODE: {offers[activeOffer].code}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#f4b500] hover:bg-[#d4a017] text-white font-bold px-4 py-2 rounded-lg transition-colors shadow-md"
                  >
                    Shop Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveOffer(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeOffer ? "bg-[#f4b500] w-4" : "bg-gray-300"
                }`}
                aria-label={`Go to offer ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button className="relative overflow-hidden group border-2 border-[#f4b500] text-gray-900 hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md inline-flex items-center gap-2">
            <span className="relative z-10">View All Offers</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 bg-[#f4b500] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecialOffers;