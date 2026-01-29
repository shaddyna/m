"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, Easing } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaStar, FaUser } from 'react-icons/fa';

const ClientReviews = () => {
  const [activeReview, setActiveReview] = useState(0);
  const [direction, setDirection] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Memon Academy",
      company: "Memon Academy",
      review: "An exceptional learning environment that blends academic excellence with character building. Our students are thriving!",
      rating: 5,
    },
    {
      id: 2,
      name: "Rose of Sharon Academy",
      company: "Rose of Sharon Academy",
      review: "We appreciate their holistic approach to education. Our collaboration brought a fresh perspective to student engagement.",
      rating: 4,
    },
    {
      id: 3,
      name: "Kipepeo International School",
      company: "Kipepeo International School",
      review: "A transformative partnership that enhanced both curriculum design and student performance outcomes.",
      rating: 5,
    },
    {
      id: 4,
      name: "Rophine Field International School",
      company: "Rophine Field International School",
      review: "Their tailored educational solutions helped us create a more dynamic and inclusive school culture.",
      rating: 4,
    },
    {
      id: 5,
      name: "Millfield Academy Runda",
      company: "Millfield Academy Runda",
      review: "Professional and impactful support that made a measurable difference in our academic delivery.",
      rating: 5,
    },
    {
      id: 6,
      name: "The Nairobi Waldof School Trust",
      company: "The Nairobi Waldof School Trust",
      review: "A creative and child-centered approach that resonated perfectly with our teaching philosophy.",
      rating: 5,
    },
    {
      id: 7,
      name: "Naisula International School",
      company: "Naisula International School",
      review: "Their innovative methods boosted both staff morale and student participation across the board.",
      rating: 4,
    },
    {
      id: 8,
      name: "St.Austin Academy",
      company: "St.Austin Academy",
      review: "Reliable, responsive, and committed to educational success. We look forward to future collaborations.",
      rating: 5,
    },
    {
      id: 9,
      name: "Sabis International School",
      company: "Sabis International School",
      review: "Excellent service with attention to detail. Their expertise has enriched our academic programs.",
      rating: 5,
    },
  ];
  

  const handleNext = () => {
    setDirection(1);
    setActiveReview((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1] as Easing
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    })
  };

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-100"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [null, (Math.random() - 0.5) * 40],
              x: [null, (Math.random() - 0.5) * 40],
              rotate: [0, 360],
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }
            }}
          />
        ))}
      </div>

      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 2 }}
            className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium mb-4"
          >
            Client Voices
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Trusted <span className="text-blue-600">Partnerships</span>
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover why industry leaders choose us for their chemical solutions.
          </motion.p>
        </motion.div>

        {/* Reviews Container */}
        <div className="relative flex items-center justify-center">
          <motion.button 
            onClick={handlePrev}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="hidden md:block absolute left-0 z-20 p-4 rounded-full bg-white shadow-xl hover:shadow-2xl border border-blue-200 hover:border-blue-400 -translate-x-1/2"
          >
            <FaChevronLeft className="text-2xl text-blue-600" />
          </motion.button>

          <div className="relative w-full max-w-4xl overflow-hidden">
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={activeReview}
                custom={direction}
                //variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-8 md:p-12 mx-4 backdrop-blur-sm"
              >
                <motion.div 
                  className="flex items-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FaUser className="text-2xl text-blue-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{reviews[activeReview].name}</h3>
                    <p className="text-gray-600">{reviews[activeReview].company}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex mb-4"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className="text-yellow-400 text-xl"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3))" }}
                    />
                  ))}
                </motion.div>

                <motion.p 
                  className="text-lg text-gray-700 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  "{reviews[activeReview].review}"
                </motion.p>

                <div className="flex justify-center space-x-4 md:hidden">
                  <motion.button 
                    onClick={handlePrev}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-white shadow-md border border-blue-200"
                  >
                    <FaChevronLeft className="text-xl text-blue-600" />
                  </motion.button>
                  <motion.button 
                    onClick={handleNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-full bg-white shadow-md border border-blue-200"
                  >
                    <FaChevronRight className="text-xl text-blue-600" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button 
            onClick={handleNext}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className="hidden md:block absolute right-0 z-20 p-4 rounded-full bg-white shadow-xl hover:shadow-2xl border border-blue-200 hover:border-blue-400 translate-x-1/2"
          >
            <FaChevronRight className="text-2xl text-blue-600" />
          </motion.button>
        </div>

        {/* Animated Progress Indicators */}
        <motion.div 
          className="flex justify-center mt-8 space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {reviews.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveReview(i)}
              className={`relative h-3 rounded-full overflow-hidden ${i === activeReview ? 'w-12 bg-blue-600' : 'w-6 bg-blue-100'}`}
              whileHover={{ scale: 1.1 }}
            >
              {i === activeReview && (
                <motion.div 
                  className="absolute inset-0 bg-blue-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 4, ease: "linear" }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Floating decor elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-lg bg-blue-100 border-2 border-blue-200/30 backdrop-blur-sm"
        animate={{
          y: [0, -40, 0],
          rotate: [0, 10, 0],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-blue-50/50 border-2 border-blue-200/30 backdrop-blur-sm"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
          transition: {
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      />
    </section>
  );
};

export default ClientReviews;