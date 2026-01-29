"use client"
import { motion, useTransform, useScroll, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, ArrowRight } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Influencer",
    rating: 5,
    review: "The quality exceeded all my expectations. I've never received so many compliments on any outfit before!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    productImage: "https://i.pinimg.com/564x/8a/3b/5a/8a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Luxury Collector",
    rating: 5,
    review: "Absolutely flawless craftsmanship. The attention to detail makes these pieces worth every penny.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    productImage: "https://i.pinimg.com/564x/5a/3b/5a/5a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg"
  },
  {
    id: 3,
    name: "Olivia Martinez",
    role: "Style Editor",
    rating: 4,
    review: "The perfect blend of comfort and high fashion. I wear these pieces both to events and casual outings.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop",
    productImage: "https://i.pinimg.com/564x/7a/3b/5a/7a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg"
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Art Director",
    rating: 5,
    review: "I'm extremely particular about fabrics, and these are some of the finest materials I've ever worn.",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1998&auto=format&fit=crop",
    productImage: "https://i.pinimg.com/564x/9a/3b/5a/9a3b5a9e9b8c1f1e8b1e1e8b1e1e8b1e.jpg"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const ref = useRef(null);
  
  const { scrollXProgress } = useScroll({
    container: ref
  });

  // 3D tilt effect
  const x = useTransform(scrollXProgress, [0, 1], [0, -100]);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Star rating component
 
const StarRating = ({ rating }: StarRatingProps) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            size={16}
            className={i < rating ? "text-[#f4b500] fill-[#f4b500]" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#fafafa] to-white px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-20 left-10 w-24 h-24 bg-[#f4b500]/10 rounded-full blur-xl"
        animate={{
          x: [0, 15, 0],
          y: [0, 20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-32 right-16 w-20 h-20 bg-[#f4b500]/05 rounded-full blur-lg"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

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
            CUSTOMER LOVE
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            What Our <span className="text-[#f4b500]">Clients Say</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust our quality
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative h-[500px] md:h-[400px] w-full">
          <AnimatePresence custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="absolute inset-0 flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Customer Image */}
              <motion.div 
                className="relative w-full md:w-1/2 h-64 md:h-full rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                {/* Product they're wearing */}
                <motion.div 
                  className="absolute bottom-4 right-4 w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.3,
                    type: "spring",
                    stiffness: 500
                  }}
                >
                  <img
                    src={testimonials[currentIndex].productImage}
                    alt="Purchased product"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>

              {/* Testimonial Content */}
              <motion.div 
                className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-xl relative"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Quote className="absolute top-6 left-6 text-[#f4b500]/20 w-12 h-12" />
                <div className="relative z-10">
                  <StarRating rating={testimonials[currentIndex].rating} />
                  <p className="mt-6 text-lg md:text-xl text-gray-700 italic">
                    "{testimonials[currentIndex].review}"
                  </p>
                  <div className="mt-8">
                    <h4 className="text-xl font-bold text-gray-900">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-gray-500">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 bg-white hover:bg-[#f4b500] text-gray-800 hover:text-white rounded-full shadow-lg transition-all z-20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 bg-white hover:bg-[#f4b500] text-gray-800 hover:text-white rounded-full shadow-lg transition-all z-20"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-[#f4b500] w-6" : "bg-gray-300"
              }`}
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
          <button className="relative overflow-hidden group border-2 border-[#f4b500] text-gray-900 hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md inline-flex items-center gap-2">
            <span className="relative z-10">Read More Reviews</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="absolute inset-0 bg-[#f4b500] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;