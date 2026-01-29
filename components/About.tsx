/*"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaFlask, FaAward, FaLeaf, FaGlobe, FaShieldAlt } from 'react-icons/fa';

const AboutSection = () => {
  const stats = [
    { value: '20+', label: 'Years Experience', icon: <FaAward className="text-blue-600 text-3xl" /> },
    { value: '500+', label: 'Products', icon: <FaFlask className="text-blue-600 text-3xl" /> },
    { value: '40+', label: 'Counties Served', icon: <FaGlobe className="text-blue-600 text-3xl" /> },
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-blue-600 text-2xl" />,
      title: "Safety First",
      description: "Rigorous quality control and safety protocols at every stage of production and delivery."
    },
    {
      icon: <FaLeaf className="text-blue-600 text-2xl" />,
      title: "Sustainable Solutions",
      description: "Developing eco-friendly chemical alternatives that reduce environmental impact."
    },
    {
      icon: <FaFlask className="text-blue-600 text-2xl" />,
      title: "Innovation Driven",
      description: "Dedicated R&D team constantly pushing boundaries in chemical technology."
    },
  ];

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
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <section className="relative py-20 bg-white text-gray-900 overflow-hidden">
    
      <div className="absolute inset-0 opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              rotate: Math.random() * 360,
              scale: 0.5 + Math.random() * 0.5
            }}
            animate={{
              y: [null, (Math.random() - 0.5) * 40],
              x: [null, (Math.random() - 0.5) * 40],
              rotate: [0, 360],
              transition: {
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear"
              }
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="2" />
              <path d="M16 12l3 3m-7 0l3-3m-5-5l3-3m-3 14l3-3" />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
       
          <motion.div className="relative" variants={itemVariants}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://i.pinimg.com/736x/dc/cf/47/dccf47c2bf129ee8a1c01fa649ae931b.jpg" 
                alt="Modern chemical laboratory"
                className="w-full h-auto object-cover"
                width={600}
                height={400}
              />
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
            </div>
            
      
            <motion.div 
              className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-blue-100 border border-blue-200"
              animate={{
                y: [0, -15, 0],
                transition: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
            
            <motion.div 
              className="absolute -top-8 -right-8 w-24 h-24 rounded-lg bg-blue-50 border border-blue-200"
              animate={{
                rotate: [0, 5, 0],
                transition: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.div 
              className="inline-block px-4 py-1 rounded-full bg-blue-100 border border-blue-200 mb-6"
              variants={itemVariants}
            >
              <span className="text-blue-600 font-medium">About Us</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              Pioneering <span className="text-blue-600">Chemical Innovation</span> Since 2005
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 mb-8"
              variants={itemVariants}
            >
              Malex Chemical Supplies has been at the forefront of chemical distribution, providing high-quality solutions to industries countrywide. Our commitment to excellence and sustainability drives every formulation we create.
            </motion.p>

     
            <motion.div 
              className="grid grid-cols-3 gap-4 mb-12"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100"
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <h3 className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

 
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 border border-blue-200">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-200"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [null, (Math.random() - 0.5) * 30],
              x: [null, (Math.random() - 0.5) * 30],
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
    </section>
  );
};

export default AboutSection;*/



/*"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaFlask, FaAward, FaLeaf, FaGlobe, FaShieldAlt } from 'react-icons/fa';

const AboutSection = () => {
  const stats = [
    { value: '20+', label: 'Years', icon: <FaAward className="text-blue-600 text-2xl" /> },
    { value: '500+', label: 'Products', icon: <FaFlask className="text-blue-600 text-2xl" /> },
    { value: '40+', label: 'Countries', icon: <FaGlobe className="text-blue-600 text-2xl" /> },
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-blue-600 text-xl" />,
      title: "Safety First",
      description: "Rigorous quality control and safety protocols."
    },
    {
      icon: <FaLeaf className="text-blue-600 text-xl" />,
      title: "Sustainable",
      description: "Eco-friendly chemical alternatives."
    },
    {
      icon: <FaFlask className="text-blue-600 text-xl" />,
      title: "Innovation",
      description: "Dedicated R&D team pushing boundaries."
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <section className="relative py-3 sm:py-16 bg-white text-gray-900 overflow-hidden">
    
      <div className="absolute inset-0 opacity-5">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400"
            style={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: 0.3 + Math.random() * 0.3
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="1" />
              <path d="M16 12l2 2m-7 0l2-2m-5-5l2-2m-2 14l2-2" />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-3 sm:px-6 relative z-10">
        <motion.div
          className="flex flex-col gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
     
          <motion.div className="relative" variants={itemVariants}>
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://i.pinimg.com/736x/dc/cf/47/dccf47c2bf129ee8a1c01fa649ae931b.jpg" 
                alt="Chemical laboratory"
                className="w-full h-auto object-cover"
                width={600}
                height={400}
              />
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
            </div>
          </motion.div>

    
          <motion.div variants={itemVariants}>
            <motion.div 
              className="inline-block px-3 py-1 rounded-full bg-blue-100 border border-blue-200 mb-2"
              variants={itemVariants}
            >
              <span className="text-blue-600 font-medium text-sm">About Us</span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-4 leading-snug"
              variants={itemVariants}
            >
              Pioneering <span className="text-blue-600">Chemical Innovation</span>
            </motion.h2>
            
            <motion.p 
              className="text-base sm:text-lg text-gray-600 mb-6"
              variants={itemVariants}
            >
              Providing high-quality chemical solutions with commitment to excellence and sustainability.
            </motion.p>

      
            <motion.div 
              className="grid grid-cols-3 gap-2 sm:gap-3 mb-8"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="bg-blue-50 rounded-lg p-2 sm:p-3 text-center border border-blue-100"
                  variants={itemVariants}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <div className="flex justify-center mb-1">{stat.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-600">{stat.value}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>


            <motion.div 
              className="space-y-4 sm:space-y-5"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <div className="bg-blue-100 p-2 rounded-md mr-3 border border-blue-200">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-800">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;*/

"use client";

import React from 'react';
import { Easing, motion } from 'framer-motion';
import { FaFlask, FaAward, FaLeaf, FaGlobe, FaShieldAlt } from 'react-icons/fa';

const AboutSection = () => {
  const stats = [
    { value: '20+', label: 'Years', icon: <FaAward className="text-blue-600 text-2xl" /> },
    { value: '500+', label: 'Products', icon: <FaFlask className="text-blue-600 text-2xl" /> },
    { value: '40+', label: 'Countries', icon: <FaGlobe className="text-blue-600 text-2xl" /> },
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-blue-600 text-xl" />,
      title: "Safety First",
      description: "Rigorous quality control and safety protocols."
    },
    {
      icon: <FaLeaf className="text-blue-600 text-xl" />,
      title: "Sustainable",
      description: "Eco-friendly chemical alternatives."
    },
    {
      icon: <FaFlask className="text-blue-600 text-xl" />,
      title: "Innovation",
      description: "Dedicated R&D team pushing boundaries."
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.6, -0.05, 0.01, 0.99] as Easing
      }
    }
  };

  return (
    <section className="relative py-24 sm:py-20 bg-white text-gray-900 overflow-hidden">
      {/* Floating molecules background */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              scale: 0.3 + Math.random() * 0.3
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="1" />
              <path d="M16 12l2 2m-7 0l2-2m-5-5l2-2m-2 14l2-2" />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Image section - now on left for desktop */}
          <motion.div 
            className="w-full lg:w-1/2 relative"
            variants={itemVariants}
          >
            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video lg:aspect-auto lg:h-[500px]">
              <img 
                src="https://i.pinimg.com/736x/dc/cf/47/dccf47c2bf129ee8a1c01fa649ae931b.jpg" 
                alt="Chemical laboratory"
                className="w-full h-full object-cover"
                width={800}
                height={500}
              />
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
            </div>
          </motion.div>

          {/* Content section - now on right for desktop */}
          <motion.div 
            className="w-full lg:w-1/2"
            variants={itemVariants}
          >
            <motion.div 
              className="inline-block px-3 py-1 rounded-full bg-blue-100 border border-blue-200 mb-4"
              variants={itemVariants}
            >
              <span className="text-blue-600 font-medium text-sm">About Us</span>
            </motion.div>
            
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              Pioneering <span className="text-blue-600">Chemical Innovation</span>
            </motion.h2>
            
            <motion.p 
              className="text-base sm:text-lg text-gray-600 mb-8 max-w-lg"
              variants={itemVariants}
            >
              Providing high-quality chemical solutions with commitment to excellence and sustainability.
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 mb-10"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center border border-blue-100"
                  variants={itemVariants}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1">{stat.value}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Features */}
            <motion.div 
              className="space-y-5 sm:space-y-6"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-4"
                  variants={itemVariants}
                >
                  <div className="bg-blue-100 p-2.5 rounded-lg mt-1 border border-blue-200 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-xl font-semibold mb-1.5 text-gray-800">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;