"use client"
import { motion } from "framer-motion";
import { ArrowRight, Clock, Bookmark } from "lucide-react";

// Blog article data
const fashionArticles = [
  {
    id: 1,
    title: "Top 10 Designer Shoes for 2025",
    excerpt: "Discover the most anticipated footwear collections from luxury houses that will define next year's trends.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
    category: "Trend Forecast",
    readTime: "8 min read",
    date: "May 15, 2024"
  },
  {
    id: 2,
    title: "How to Style Luxury Streetwear",
    excerpt: "Master the art of high-low dressing with these expert tips for elevating casual looks with designer pieces.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    category: "Styling Guide",
    readTime: "6 min read",
    date: "April 28, 2024"
  },
  {
    id: 3,
    title: "The Investment Handbag Report 2024",
    excerpt: "Which designer bags are appreciating in value? Our annual analysis of the most collectible pieces.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2076&auto=format&fit=crop",
    category: "Luxury Investing",
    readTime: "10 min read",
    date: "April 15, 2024"
  },
  {
    id: 4,
    title: "Sustainable Luxury: The Future of Fashion",
    excerpt: "How leading designers are redefining opulence through eco-conscious materials and practices.",
    image: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=2070&auto=format&fit=crop",
    category: "Sustainability",
    readTime: "7 min read",
    date: "March 30, 2024"
  }
];

const FashionBlogSection = () => {
  return (
    <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto text-center mb-16"
      >
        <span className="text-xs font-semibold tracking-widest text-[#f4b500] bg-[#f4b500]/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
          STYLE INTELLIGENCE
        </span>
        <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f4b500] to-[#d4a017]">
            Fashion Editorials
          </span>
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Expert insights, trend reports, and style guides from our luxury fashion team
        </p>
      </motion.div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {fashionArticles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Article Image */}
            <div className="relative h-60 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Category Tag */}
              <span className="absolute top-4 left-4 bg-[#f4b500] text-black text-xs font-bold px-3 py-1 rounded-full">
                {article.category}
              </span>
              
              {/* Bookmark Button */}
              <button className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-[#f4b500] hover:text-black transition-colors">
                <Bookmark size={18} />
              </button>
            </div>

            {/* Article Content */}
            <div className="p-6 bg-white">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Clock size={14} className="mr-1" />
                <span>{article.readTime}</span>
                <span className="mx-2">•</span>
                <span>{article.date}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#f4b500] transition-colors">
                {article.title}
              </h3>
              
              <p className="text-gray-600 mb-5">
                {article.excerpt}
              </p>
              
              <a 
                href="#"
                className="inline-flex items-center text-sm font-semibold text-[#f4b500] group-hover:underline"
              >
                Read Article <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.article>
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
        <a 
          href="#"
          className="relative overflow-hidden inline-flex items-center border-2 border-[#f4b500] text-gray-900 hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md group"
        >
          <span className="relative z-10">View All Articles</span>
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          <span className="absolute inset-0 bg-[#f4b500] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
        </a>
      </motion.div>
    </section>
  );
};

export default FashionBlogSection;