"use client"
import React, { useEffect, useState } from 'react';
import { Easing, motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';

const Hero: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  // Delay render until client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const router = useRouter();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  // Prevent rendering on server or small screens
  if (!isClient || !isLargeScreen) {
    return null;
  }
  // Animation variants

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as Easing
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 md:py-32"
    >
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white bg-opacity-10"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 10 + 2,
              height: Math.random() * 10 + 2,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              y: [null, (Math.random() - 0.5) * 50],
              x: [null, (Math.random() - 0.5) * 50],
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
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 mix-blend-screen"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 mix-blend-screen"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="hidden-on-medium text-center md:text-left max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-300 uppercase rounded-full bg-white bg-opacity-10">
              Innovative Solutions
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100">
              Malex Chem
            </span> <br />
            <span className="text-white">Supplies Ltd</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto md:mx-0 text-blue-100"
          >
            Pioneering chemical solutions that drive innovation and sustainability for tomorrow's challenges.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-6"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => router.push('/guide')}
              className="relative overflow-hidden px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => router.push('/contact')}
              className="relative overflow-hidden px-8 py-4 rounded-full font-semibold bg-transparent border-2 border-white border-opacity-20 hover:border-opacity-40 transition-all duration-300"
            >
              <span className="relative z-10">Learn More</span>
              <span className="absolute inset-0 bg-white bg-opacity-5 hover:bg-opacity-10 transition-all duration-300"></span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating 3D shapes */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-lg bg-blue-500 bg-opacity-10 border border-blue-400 border-opacity-30"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-blue-400 bg-opacity-10 border border-blue-300 border-opacity-30"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
          transition: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }
        }}
      />

      {/* Animated grid lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
          opacity: [0.6, 1, 0.6],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 text-blue-300">Scroll Down</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>

      {/* Floating molecules animation */}
      <div className="absolute inset-0 overflow-hidden">
        {['M5,5 L10,10 L5,15', 'M15,5 L20,10 L15,15', 'M10,10 L15,15 L10,20'].map((d, i) => (
          <motion.svg
            key={i}
            className="absolute"
            width="30"
            height="30"
            viewBox="0 0 25 25"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.3"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: 0.8 + Math.random() * 0.4
            }}
            animate={{
              x: [null, (Math.random() - 0.5) * 50],
              y: [null, (Math.random() - 0.5) * 50],
              rotate: [0, 360],
              transition: {
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }
            }}
          >
            <path d={d} />
            <circle cx="12.5" cy="12.5" r="2" fill="white" fillOpacity="0.5" />
          </motion.svg>
        ))}
      </div>
    </section>
  );
};

export default Hero;