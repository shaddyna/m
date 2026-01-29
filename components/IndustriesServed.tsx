"use client";

import React, { useState } from 'react';
import { Easing, motion } from 'framer-motion';
import { FaPills, FaSeedling, FaTshirt, FaCar, FaOilCan, FaWater } from 'react-icons/fa';
import { GiChemicalDrop } from 'react-icons/gi';

const IndustriesServed = () => {
  const [hoveredIndustry, setHoveredIndustry] = useState<number | null>(null);

  const industries = [
    {
      id: 1,
      name: "Pharmaceuticals",
      icon: <FaPills className="text-4xl" />,
      description: "High-purity chemicals for drug formulation and manufacturing processes.",
      chemicals: ["Excipients", "Solvents", "APIs", "Buffers"],
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: 2,
      name: "Agriculture",
      icon: <FaSeedling className="text-4xl" />,
      description: "Specialized formulations for crop protection and yield enhancement.",
      chemicals: ["Herbicides", "Fungicides", "Fertilizers", "Soil conditioners"],
      color: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      name: "Textiles",
      icon: <FaTshirt className="text-4xl" />,
      description: "Dyes, auxiliaries and finishing agents for fabric production.",
      chemicals: ["Reactive dyes", "Softening agents", "Flame retardants", "Water repellents"],
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 4,
      name: "Automotive",
      icon: <FaCar className="text-4xl" />,
      description: "High-performance chemicals for vehicle manufacturing and maintenance.",
      chemicals: ["Lubricants", "Adhesives", "Coatings", "Cleaners"],
      color: "bg-red-100 text-red-800"
    },
    {
      id: 5,
      name: "Oil & Gas",
      icon: <FaOilCan className="text-4xl" />,
      description: "Specialty chemicals for extraction, refining and pipeline maintenance.",
      chemicals: ["Corrosion inhibitors", "Demulsifiers", "Drilling fluids", "Catalysts"],
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 6,
      name: "Water Treatment",
      icon: <FaWater className="text-4xl" />,
      description: "Chemicals for purification, disinfection and wastewater management.",
      chemicals: ["Coagulants", "Flocculants", "Biocides", "pH adjusters"],
      color: "bg-cyan-100 text-cyan-800"
    },
  ];

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
      y: -10,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      {/* Floating chemical drops */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-200"
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

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
            Industries Served
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powering <span className="text-blue-600">Diverse Sectors</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tailored chemical solutions for specialized industrial applications across multiple sectors.
          </p>
        </motion.div>

        {/* Industries Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {industries.map((industry) => (
            <motion.div
              key={industry.id}
              //variants={itemVariants}
              whileHover="hover"
              className={`rounded-2xl overflow-hidden shadow-lg border border-gray-100 ${industry.color}`}
              onMouseEnter={() => setHoveredIndustry(industry.id)}
              onMouseLeave={() => setHoveredIndustry(null)}
            >
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className={`p-4 rounded-xl ${industry.color.replace('bg-', 'bg-opacity-50 bg-')} mr-4`}>
                    {industry.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{industry.name}</h3>
                </div>
                <p className="mb-6">{industry.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <GiChemicalDrop className="mr-2" />
                    Relevant Chemicals:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {industry.chemicals.map((chemical, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-70 backdrop-blur-sm"
                      >
                        {chemical}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: hoveredIndustry === industry.id ? 1 : 0.7,
                    transition: { duration: 0.3 }
                  }}
                  className="w-full h-1 bg-current opacity-70 rounded-full"
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            Don't see your industry listed? We likely have solutions tailored to your specific needs.
          </p>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl">
            Contact Our Industry Specialists
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustriesServed;