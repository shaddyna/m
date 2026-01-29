"use client";

import React from 'react';
import { Easing, motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarker } from 'react-icons/fa';

const ContactForm = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="relative py-20 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
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
              y: [null, (Math.random() - 0.5) * 40],
              x: [null, (Math.random() - 0.5) * 40],
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
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Contact <span className="text-blue-600">Our Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Let's discuss how we can empower your chemical solutions.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Info */}
          <motion.div 
            className="space-y-8"
            variants={itemVariants}
          >
            <div className="p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
              <div className="flex items-start mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <FaEnvelope className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">sales@malexchemsupplies.com</p>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <FaPhone className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600">+254 (7) 185-486-95</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <FaMapMarker className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">HQ Location</h3>
                  <p className="text-gray-600">Hotel Green Court Building, 5th Floor, Latema Road, Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Social Media</h3>
              <div className="flex space-x-4">
                {['LinkedIn', 'Twitter', 'YouTube'].map((platform, i) => (
                  <motion.button
                    key={platform}
                    whileHover={{ y: -3 }}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {platform}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form 
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-blue-100"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=" "
                />
                <label 
                  htmlFor="name"
                  className="absolute left-4 top-3 text-gray-500 transition-all pointer-events-none"
                >
                  Full Name
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=" "
                />
                <label 
                  htmlFor="email"
                  className="absolute left-4 top-3 text-gray-500 transition-all pointer-events-none"
                >
                  Email Address
                </label>
              </div>

              <div className="relative md:col-span-2">
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=" "
                />
                <label 
                  htmlFor="subject"
                  className="absolute left-4 top-3 text-gray-500 transition-all pointer-events-none"
                >
                  Subject
                </label>
              </div>

              <div className="relative md:col-span-2">
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder=" "
                />
                <label 
                  htmlFor="message"
                  className="absolute left-4 top-3 text-gray-500 transition-all pointer-events-none"
                >
                  Your Message
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:col-span-2 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
                type="submit"
              >
                Send Message
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </div>

      {/* Floating decor elements */}
      <motion.div 
        className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-blue-100/50 backdrop-blur-sm border-2 border-blue-200/30"
        animate={{
          y: [0, -40, 0],
          rotate: [0, 15, 0],
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-lg bg-blue-50/50 backdrop-blur-sm border-2 border-blue-200/30"
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

export default ContactForm;