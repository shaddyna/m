"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavbarTwo from "@/components/HeaderTwo";
import LuxuryFooter from "@/components/LuxuryFooter";
import { Clock, Zap, Tag, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const offers = [
  {
    id: 1,
    title: "Summer Flash Sale",
    discount: "50% OFF",
    description: "On all swimwear & beach accessories",
    timeLeft: 24 * 60 * 60,
    code: "SUNNY50",
    image: "https://i.pinimg.com/736x/70/cf/84/70cf84d4d824e5994022b0f489ef81d9.jpg",
    category: "Swimwear",
    terms: "Valid on selected items until stock lasts"
  },
  {
    id: 2,
    title: "Designer Handbags",
    discount: "30% OFF",
    description: "Selected luxury handbags & accessories",
    timeLeft: 15 * 60 * 60 + 30 * 60,
    code: "LUXE30",
    image: "https://i.pinimg.com/564x/5a/3b/5a/5a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg",
    category: "Accessories",
    terms: "Excludes limited edition pieces"
  },
  {
    id: 3,
    title: "New Season Collection",
    discount: "20% OFF",
    description: "First purchase over $200",
    timeLeft: 3 * 24 * 60 * 60,
    code: "WELCOME20",
    image: "https://i.pinimg.com/564x/7a/3b/5a/7a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg",
    category: "All Items",
    terms: "Valid for new customers only"
  },
  {
    id: 4,
    title: "Luxury Footwear",
    discount: "40% OFF",
    description: "Selected designer shoes & boots",
    timeLeft: 6 * 60 * 60 + 45 * 60,
    code: "STEPOUT40",
    image: "https://i.pinimg.com/564x/9a/3e/6a/9a3e6a6c8a1a9b1e8e3e6a6c8a1a9b1e.jpg",
    category: "Footwear",
    terms: "Limited sizes available"
  },
  {
    id: 5,
    title: "Evening Wear",
    discount: "25% OFF",
    description: "Red carpet-ready gowns & suits",
    timeLeft: 12 * 60 * 60,
    code: "GLAM25",
    image: "https://i.pinimg.com/736x/57/6e/ef/576eefe23318e35580853471036bbc8d.jpg",
    category: "Dresses",
    terms: "Includes custom alterations"
  },
  {
    id: 6,
    title: "VIP Membership",
    discount: "15% OFF",
    description: "Exclusive benefits for members",
    timeLeft: 30 * 24 * 60 * 60,
    code: "VIP15",
    image: "https://i.pinimg.com/736x/da/e1/00/dae1000ddbd86a468c90685ac6603879.jpg",
    category: "All Items",
    terms: "Recurring discount for members"
  }
];

const OffersPage = () => {
  const [activeOffer, setActiveOffer] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortedOffers, setSortedOffers] = useState(offers);

  useEffect(() => {
    const interval = setInterval(() => {
      setSortedOffers(prev => 
        prev.map(offer => ({
          ...offer,
          timeLeft: offer.timeLeft > 0 ? offer.timeLeft - 1 : 0
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return {
      days: days.toString().padStart(2, "0"),
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      secs: secs.toString().padStart(2, "0")
    };
  };

  const toggleOffer = (id: number) => {
    setActiveOffer(activeOffer === id ? null : id);
  };

  const categories = ["All", "Swimwear", "Accessories", "Footwear", "Dresses"];

  return (
    <div className="bg-white min-h-screen">
      <NavbarTwo />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src="https://i.pinimg.com/736x/97/82/56/978256ac60bc5ed25e6dfeda175bd14d.jpg"
          alt="Extreme Collections Offers"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f4b500] to-[#d4a017]">
              Exclusive Offers
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Limited-time promotions on our most coveted collections
          </p>
        </motion.div>
      </section>

      {/* Offers Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12 flex flex-col md:flex-row gap-4 items-start md:items-center"
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Filter by:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? "bg-[#f4b500] text-black font-bold"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Offers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOffers
            .filter(offer => 
              selectedCategory === "All" || offer.category === selectedCategory
            )
            .map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                {/* Offer Image */}
                <div className="relative h-60 overflow-hidden rounded-t-xl">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-[#f4b500] text-white font-bold px-4 py-2 rounded-full">
                    {offer.discount}
                  </div>
                </div>

                {/* Offer Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">
                      {offer.title}
                    </h3>
                    <span className="text-sm bg-[#f4b500]/10 text-[#f4b500] px-2 py-1 rounded">
                      {offer.category}
                    </span>
                  </div>

                  <p className="mt-2 text-gray-600">{offer.description}</p>

                  {/* Countdown Timer */}
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-[#f4b500]" size={16} />
                      <span className="text-sm font-medium">Ends in:</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(formatTime(offer.timeLeft)).map(([unit, value]) => (
                        <div key={unit} className="text-center">
                          <div className="bg-white p-2 rounded-md shadow-sm">
                            <span className="font-bold text-lg">{value}</span>
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {unit.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms & Code */}
                  <div className="mt-6">
                    <button
                      onClick={() => toggleOffer(offer.id)}
                      className="w-full flex justify-between items-center text-left"
                    >
                      <span className="text-sm font-medium text-[#f4b500]">
                        Terms & Conditions
                      </span>
                      {activeOffer === offer.id ? (
                        <ChevronUp className="text-[#f4b500]" />
                      ) : (
                        <ChevronDown className="text-[#f4b500]" />
                      )}
                    </button>
                    
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        activeOffer === offer.id ? "max-h-96 mt-4" : "max-h-0"
                      }`}
                    >
                      <p className="text-sm text-gray-600">{offer.terms}</p>
                      <div className="mt-4 flex items-center justify-between bg-[#f4b500]/10 p-3 rounded-lg">
                        <span className="font-mono font-bold text-[#f4b500]">
                          {offer.code}
                        </span>
                        <button className="text-sm text-[#f4b500] hover:text-[#d4a017]">
                          Copy Code
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold py-3 rounded-lg transition-colors"
                  >
                    Shop This Offer
                  </motion.button>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Empty State */}
        {sortedOffers.filter(offer => 
          selectedCategory === "All" || offer.category === selectedCategory
        ).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-20"
          >
            <Zap className="mx-auto text-[#f4b500]" size={40} />
            <h3 className="mt-6 text-xl font-bold">No current offers in this category</h3>
            <p className="mt-2 text-gray-600">Check back soon for new promotions!</p>
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Zap className="mx-auto text-[#f4b500]" size={48} />
          <h2 className="mt-8 text-3xl md:text-4xl font-bold">
            Never Miss a Deal
          </h2>
          <p className="mt-4 text-gray-300 max-w-xl mx-auto">
            Sign up for exclusive offers, early access to sales, and VIP benefits
          </p>
          <div className="mt-8 max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#f4b500]"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold rounded-full"
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
};

export default OffersPage;