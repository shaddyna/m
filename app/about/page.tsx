
"use client";

import React from 'react';
import { Easing, motion } from 'framer-motion';
import { FaFlask, FaAward, FaLeaf, FaGlobe, FaShieldAlt, FaHandsHelping, FaUserTie, FaHeart } from 'react-icons/fa';
import Footer from '@/components/LuxuryFooter';
import NavbarTwo from '@/components/HeaderTwo';

const AboutPage = () => {
  const stats = [
    { value: '20+', label: 'Years Experience', icon: <FaAward className="text-blue-600 text-3xl" /> },
    { value: '500+', label: 'Products', icon: <FaFlask className="text-blue-600 text-3xl" /> },
    { value: '40+', label: 'Counties Served', icon: <FaGlobe className="text-blue-600 text-3xl" /> },
    { value: '1000+', label: 'Satisfied Clients', icon: <FaHeart className="text-blue-600 text-3xl" /> },
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

  const coreValues = [
    {
      icon: <FaHeart className="text-blue-600 text-2xl" />,
      title: "Cruelty Free",
      description: "We don't sell products tested on animals."
    },
    {
      icon: <FaAward className="text-blue-600 text-2xl" />,
      title: "Quality",
      description: "Committed to providing products that meet the highest standards of quality ensuring durability, accuracy and reliability."
    },
    {
      icon: <FaUserTie className="text-blue-600 text-2xl" />,
      title: "Expertise",
      description: "Our team consists of knowledgeable professionals with deep understanding of laboratory equipment and chemicals."
    },
    {
      icon: <FaLeaf className="text-blue-600 text-2xl" />,
      title: "Mild Formula",
      description: "Less irritation, suitable for sensitive skin."
    },
    {
      icon: <FaShieldAlt className="text-blue-600 text-2xl" />,
      title: "Safety",
      description: "Safety is our top priority. We understand the importance of creating a safe and secure laboratory environment."
    },
    {
      icon: <FaHandsHelping className="text-blue-600 text-2xl" />,
      title: "Customer Focus",
      description: "Dedicated to building strong long-term relationships. Your satisfaction is our priority."
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
        ease: [0.6, -0.05, 0.01, 0.99] as Easing
      }
    }
  };

  return (
    <>
    <NavbarTwo />
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
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

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
             <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
              About Us
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              About Malex Chem <span className="text-blue-600">Supplies</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pioneering chemical innovation and reliable laboratory solutions since 2005
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="relative py-20 bg-white overflow-hidden">
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
                  src="https://i.pinimg.com/736x/bb/74/ee/bb74eeb1fdeab54ae029d19ca30bfc0d.jpg" 
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
                <span className="text-blue-600 font-medium">Our Story</span>
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                variants={itemVariants}
              >
                Building a Legacy of <span className="text-blue-600">Excellence</span>
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600 mb-6"
                variants={itemVariants}
              >
                Malex Chemical Supplies Limited was founded in 2005 with a commitment to supply high-quality laboratory chemicals, equipment, and medical supplies. Our journey began with a small team of dedicated professionals and a vision to improve access to essential laboratory and medical supplies.
              </motion.p>
              
              <motion.p 
                className="text-lg text-gray-600 mb-8"
                variants={itemVariants}
              >
                Over the years, we have grown to become a trusted name in the industry, serving a diverse clientele across East Africa. Today, we have expanded our operations and established a strong distribution network, ensuring that our products reach customers efficiently and reliably.
              </motion.p>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div 
              className="inline-block px-4 py-1 rounded-full bg-blue-100 border border-blue-200 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-blue-600 font-medium">Our Purpose</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Driving <span className="text-blue-600">Innovation</span> Forward
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FaAward className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
              </div>
              <p className="text-gray-600 text-lg">
                To be the most reliable company of choice in all our core services, recognized as a symbol of excellence that leaves a lasting impression on every customer we serve.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <FaFlask className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
              </div>
              <p className="text-gray-600 text-lg">
                To provide high-quality laboratory chemicals, equipment, and medical supplies through innovative solutions, exceptional service, and sustainable practices that meet the evolving needs of our customers across East Africa.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div 
              className="inline-block px-4 py-1 rounded-full bg-blue-100 border border-blue-200 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-blue-600 font-medium">Our Foundation</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our <span className="text-blue-600">Core Values</span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              The principles that guide every decision we make and every interaction we have.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div 
                key={index}
                className="bg-blue-50 rounded-xl p-6 border border-blue-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div 
              className="inline-block px-4 py-1 rounded-full bg-blue-100 border border-blue-200 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-blue-600 font-medium">Why Choose Us</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our <span className="text-blue-600">Commitment</span> to You
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md border border-blue-50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)" }}
              >
                <div className="bg-blue-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Meet Our <span className="text-blue-100">Expert Team</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our success is driven by a team of passionate professionals dedicated to excellence in chemical solutions.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition duration-300 shadow-lg hover:shadow-xl">
              Learn About Our Team
            </button>
          </motion.div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default AboutPage;