"use client";

import React, { useState } from 'react';
import { AnimatePresence, Easing, motion } from 'framer-motion';
import { FaShieldAlt, FaBoxOpen, FaTruck, FaExclamationTriangle, FaDownload } from 'react-icons/fa';

const SafetyGuidesSection = () => {
  const [activeGuide, setActiveGuide] = useState<number | null>(null);

  const safetyGuides = [
    {
      id: 1,
      title: "Safe Handling Procedures",
      icon: <FaShieldAlt className="text-4xl" />,
      summary: "Essential protocols for working with industrial chemicals",
      details: [
        "Always wear appropriate PPE (gloves, goggles, lab coat)",
        "Work in well-ventilated areas or fume hoods",
        "Never mix chemicals unless specified in procedures",
        "Wash hands thoroughly after handling",
        "Know emergency procedures for spills/exposure"
      ],
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      title: "Proper Storage Guidelines",
      icon: <FaBoxOpen className="text-4xl" />,
      summary: "Optimal conditions for chemical preservation and safety",
      details: [
        "Store in original, labeled containers",
        "Maintain proper temperature controls",
        "Separate incompatible chemicals",
        "Use secondary containment for liquids",
        "Implement strict inventory controls"
      ],
      color: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      title: "Transportation Safety",
      icon: <FaTruck className="text-4xl" />,
      summary: "Regulations for safe chemical transport",
      details: [
        "Use UN-certified packaging",
        "Proper hazard labeling required",
        "Secure loads to prevent shifting",
        "Include emergency response documents",
        "Train personnel in spill containment"
      ],
      color: "bg-amber-100 text-amber-800"
    },
    {
      id: 4,
      title: "Emergency Response",
      icon: <FaExclamationTriangle className="text-4xl" />,
      summary: "Critical steps for chemical incidents",
      details: [
        "Immediate spill containment procedures",
        "Emergency shower/eye wash locations",
        "First aid measures for exposures",
        "Fire suppression protocols",
        "Emergency contact numbers"
      ],
      color: "bg-red-100 text-red-800"
    }
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as Easing
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Floating molecular background */}
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
            Safety First
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Chemical Safety <span className="text-blue-600">Guides</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Essential protocols for handling, storing, and transporting chemical products safely.
          </p>
        </motion.div>

        {/* Safety Guides Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {safetyGuides.map((guide) => (
            <motion.div
              key={guide.id}
             // variants={itemVariants}
              whileHover="hover"
              className={`rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 ${guide.color} ${activeGuide === guide.id ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}`}
              onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)}
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className={`p-4 rounded-xl ${guide.color.replace('bg-', 'bg-opacity-50 bg-')} mr-4`}>
                    {guide.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{guide.title}</h3>
                </div>
                
                <p className="mb-6 font-medium">{guide.summary}</p>
                
                <AnimatePresence>
                  {activeGuide === guide.id && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden space-y-3 mb-6"
                    >
                      {guide.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-current mt-2 mr-2"></div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <button className="flex items-center text-current font-medium">
                  <FaDownload className="mr-2" />
                  Download Full Guide
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative floating elements */}
        <motion.div 
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-100/30 blur-xl z-0"
          animate={{
            y: [0, -20, 0],
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
        
        <motion.div 
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-green-100/20 blur-xl z-0"
          animate={{
            rotate: [0, 360],
            transition: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16 relative z-10"
        >
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl">
            Request Custom Safety Consultation
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SafetyGuidesSection;