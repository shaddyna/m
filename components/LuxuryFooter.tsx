"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaTwitter, FaYoutube, FaFlask, FaRegEnvelope } from 'react-icons/fa';
import { GiChemicalDrop } from 'react-icons/gi';

const Footer = () => {
  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-blue-900 to-blue-950 text-white overflow-hidden">
      {/* Floating molecules */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 20}px`
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 40],
              x: [0, (Math.random() - 0.5) * 40],
              rotate: [0, 360],
              transition: {
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }
            }}
          >
            <GiChemicalDrop className="w-full h-full" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Logo Section */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <motion.div
              className="flex items-center"
             // variants={floatingVariants}
              animate="float"
            >
              <FaFlask className="text-3xl mr-3 text-blue-400" />
              <span className="text-2xl font-bold">Malex Chem Supplies</span>
            </motion.div>
            <p className="text-blue-300">
              Pioneering chemical solutions for a sustainable future
            </p>
            <div className="flex space-x-4">
              {[FaLinkedin, FaTwitter, FaYoutube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="p-3 bg-blue-800/30 rounded-full hover:bg-blue-700/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="text-xl" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-400">Solutions</h3>
            <ul className="space-y-4">
              {['Industrial Chemicals', 'Laboratory Supplies', 'Safety Equipment', 'Custom Formulations'].map((link, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                  className="text-blue-300 hover:text-white cursor-pointer"
                >
                  {link}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-400">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <FaRegEnvelope className="mr-3 text-blue-400" />
               sales@malexsupplies.com
              </li>
              <li className="flex items-center">
                <FaFlask className="mr-3 text-blue-400" />
                +254 (7) 185-486-95
              </li>
              <li className="flex items-center">
                <GiChemicalDrop className="mr-3 text-blue-400" />
                Hotel Green Court Building
                5th Floor, Latema Road
                Nairobi, Kenya
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-400">Stay Updated</h3>
            <form className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-blue-800/30 border border-blue-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 py-3 rounded-lg font-semibold"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800/50 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-blue-400 text-sm">
            © {new Date().getFullYear()} Malex Chemical. All rights reserved.
          </div>
          <div className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service', 'Safety Docs'].map((item, i) => (
              <motion.a
                key={i}
                href="#"
                className="text-blue-300 hover:text-white text-sm"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Element */}
      <motion.div 
        className="absolute bottom-20 left-1/2 w-48 h-48 bg-blue-800/20 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          transition: {
            duration: 8,
            repeat: Infinity
          }
        }}
      />
    </footer>
  );
};

export default Footer;

