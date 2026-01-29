"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import NavbarTwo from "@/components/HeaderTwo";
import LuxuryFooter from "@/components/LuxuryFooter";
import { Star, MapPin, ShoppingBag, ChevronDown, ChevronUp, Search, X } from "lucide-react";

// Dummy boutique data
const boutiques = [
  {
    id: 1,
    name: "Velvet Underground",
    owner: "Sophia Chen",
    location: "Milan, Italy",
    rating: 4.9,
    products: 42,
    category: "Luxury Streetwear",
    image: "https://i.pinimg.com/736x/77/ea/a2/77eaa2802affc0b41489388e2d2bdc2e.jpg",
    featured: [
      "https://i.pinimg.com/736x/8e/3e/6a/8e3e6a6c8a1a9b1e8e3e6a6c8a1a9b1e.jpg",
      "https://i.pinimg.com/736x/5a/3e/6a/5a3e6a6c8a1a9b1e8e3e6a6c8a1a9b1e.jpg",
      "https://i.pinimg.com/736x/9a/3e/6a/9a3e6a6c8a1a9b1e8e3e6a6c8a1a9b1e.jpg"
    ],
    description: "Cutting-edge streetwear meets Italian craftsmanship. Limited edition drops monthly."
  },
  {
    id: 2,
    name: "Gilded Age",
    owner: "James Laurent",
    location: "Paris, France",
    rating: 4.8,
    products: 36,
    category: "Vintage Luxury",
    image: "https://i.pinimg.com/736x/da/e1/00/dae1000ddbd86a468c90685ac6603879.jpg",
    featured: [
      "https://i.pinimg.com/736x/57/6e/ef/576eefe23318e35580853471036bbc8d.jpg",
      "https://i.pinimg.com/736x/c8/0b/cb/c80bcbf585310970bc9a68e1ba7e96f1.jpg",
      "https://i.pinimg.com/736x/97/82/56/978256ac60bc5ed25e6dfeda175bd14d.jpg"
    ],
    description: "Curated vintage luxury pieces with modern relevance. Each item tells a story."
  },
  {
    id: 3,
    name: "Neon Noir",
    owner: "Alessandro Rossi",
    location: "Tokyo, Japan",
    rating: 4.7,
    products: 28,
    category: "Futuristic Fashion",
    image: "https://i.pinimg.com/736x/97/82/56/978256ac60bc5ed25e6dfeda175bd14d.jpg",
    featured: [
      "https://i.pinimg.com/736x/70/cf/84/70cf84d4d824e5994022b0f489ef81d9.jpg",
      "https://i.pinimg.com/564x/5a/3b/5a/5a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg",
      "https://i.pinimg.com/564x/7a/3b/5a/7a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg"
    ],
    description: "Where cyberpunk aesthetics meet high fashion. Limited runs of experimental designs."
  },
  {
    id: 4,
    name: "Silk Road",
    owner: "Isabella Moretti",
    location: "New York, USA",
    rating: 4.9,
    products: 51,
    category: "Sustainable Luxury",
    image: "https://i.pinimg.com/736x/57/6e/ef/576eefe23318e35580853471036bbc8d.jpg",
    featured: [
      "https://i.pinimg.com/736x/da/e1/00/dae1000ddbd86a468c90685ac6603879.jpg",
      "https://i.pinimg.com/736x/77/ea/a2/77eaa2802affc0b41489388e2d2bdc2e.jpg",
      "https://i.pinimg.com/736x/8e/3e/6a/8e3e6a6c8a1a9b1e8e3e6a6c8a1a9b1e.jpg"
    ],
    description: "Ethically sourced luxury with zero compromise on quality or design."
  },
  {
    id: 5,
    name: "Royal Rebel",
    owner: "Marcus DuPont",
    location: "London, UK",
    rating: 4.6,
    products: 33,
    category: "Punk Couture",
    image: "https://i.pinimg.com/736x/c8/0b/cb/c80bcbf585310970bc9a68e1ba7e96f1.jpg",
    featured: [
      "https://i.pinimg.com/736x/9a/3e/6a/9a3e6a6c8a1a9b1e8e3e6a6c8a1a9b1e.jpg",
      "https://i.pinimg.com/736x/97/82/56/978256ac60bc5ed25e6dfeda175bd14d.jpg",
      "https://i.pinimg.com/736x/57/6e/ef/576eefe23318e35580853471036bbc8d.jpg"
    ],
    description: "High-end punk aesthetics with royal tailoring techniques. Wearable rebellion."
  },
  {
    id: 6,
    name: "Midnight Sun",
    owner: "Freja Nielsen",
    location: "Stockholm, Sweden",
    rating: 4.8,
    products: 39,
    category: "Scandinavian Minimalism",
    image: "https://i.pinimg.com/736x/9a/3e/6a/9a3e6a6c8a1a9b1e8e3e6a6c8a1a9b1e.jpg",
    featured: [
      "https://i.pinimg.com/736x/5a/3e/6a/5a3e6a6c8a1a9b1e8e3e6a6c8a1a9b1e.jpg",
      "https://i.pinimg.com/736x/da/e1/00/dae1000ddbd86a468c90685ac6603879.jpg",
      "https://i.pinimg.com/736x/c8/0b/cb/c80bcbf585310970bc9a68e1ba7e96f1.jpg"
    ],
    description: "Nordic simplicity meets avant-garde silhouettes. Functional elegance redefined."
  }
];

const categories = [
  "All Boutiques",
  "Luxury Streetwear",
  "Vintage Luxury",
  "Futuristic Fashion",
  "Sustainable Luxury",
  "Punk Couture",
  "Scandinavian Minimalism"
];

const BoutiquesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Boutiques");
  const [activeBoutique, setActiveBoutique] = useState<number | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredBoutiques = boutiques.filter(boutique => {
    const matchesSearch = boutique.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        boutique.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        boutique.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Boutiques" || 
                          boutique.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBoutique = (id: number) => {
    setActiveBoutique(activeBoutique === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen">
      <NavbarTwo />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src="https://i.pinimg.com/736x/5a/3e/6a/5a3e6a6c8a1a9b1e8e3e6a6c8a1a9b1e.jpg"
          alt="Extreme Collections Boutiques"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f4b500] to-[#d4a017]">
              Curated Boutiques
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Discover exclusive mini-shops hosted by visionary designers and curators
          </p>
        </motion.div>
      </section>

      {/* Search and Filter Bar */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search boutiques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4b500] focus:border-[#f4b500]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-gray-600">Filter:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4b500] focus:border-[#f4b500]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-full shadow-sm hover:bg-gray-50"
            >
              <span>Filters</span>
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Filters Panel */}
        {mobileFiltersOpen && (
          <div className="md:hidden mb-8 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setMobileFiltersOpen(false);
                      }}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedCategory === category
                          ? "bg-[#f4b500] text-black font-bold"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Boutiques Grid */}
        {filteredBoutiques.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBoutiques.map((boutique) => (
              <motion.div
                key={boutique.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
              >
                {/* Boutique Cover Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={boutique.image}
                    alt={boutique.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold text-white">{boutique.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="text-[#f4b500]" size={16} />
                      <span className="text-white text-sm">{boutique.location}</span>
                    </div>
                  </div>
                </div>

                {/* Boutique Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Curated by</p>
                      <p className="font-medium">{boutique.owner}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#f4b500]/10 px-3 py-1 rounded-full">
                      <Star className="text-[#f4b500] fill-[#f4b500]" size={16} />
                      <span className="font-bold text-gray-900">{boutique.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{boutique.description}</p>

                  {/* Featured Products Preview */}
                  <div className="flex gap-2 mb-6">
                    {boutique.featured.map((product, index) => (
                      <div key={index} className="w-1/3 h-24 overflow-hidden rounded-lg">
                        <img
                          src={product}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Expandable Details */}
                  <button
                    onClick={() => toggleBoutique(boutique.id)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="text-sm font-medium text-[#f4b500]">
                      {activeBoutique === boutique.id ? 'Hide details' : 'View boutique details'}
                    </span>
                    {activeBoutique === boutique.id ? (
                      <ChevronUp className="text-[#f4b500]" />
                    ) : (
                      <ChevronDown className="text-[#f4b500]" />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeBoutique === boutique.id ? "max-h-96 mt-4" : "max-h-0"
                    }`}
                  >
                    <div className="pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{boutique.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Products</p>
                          <p className="font-medium">{boutique.products}+</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-4 bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={18} />
                        Visit Boutique
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-20"
          >
            <div className="mx-auto bg-[#f4b500]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Search className="text-[#f4b500]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No boutiques found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Boutiques");
              }}
              className="px-6 py-3 bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold rounded-full"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to host your own boutique?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our platform of elite curators and reach a global audience of luxury fashion enthusiasts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold rounded-full"
            >
              Apply Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black font-bold rounded-full transition-colors"
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
};

export default BoutiquesPage;