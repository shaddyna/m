"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCertificate, FaShieldAlt, FaGlobeAmericas, FaLeaf, FaIndustry } from 'react-icons/fa';

const CertificationsSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const [filteredCerts, setFilteredCerts] = useState<any[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const certifications = [
    {
      id: 1,
      title: "ISO 9001:2015 Certified",
      category: "quality",
      description: "Quality Management System certification demonstrating our commitment to consistent quality and continuous improvement.",
      image: "/cert-iso9001.jpg",
      year: "2023"
    },
    {
      id: 2,
      title: "ISO 14001:2015 Certified",
      category: "environmental",
      description: "Environmental Management System certification for sustainable operations and reduced environmental impact.",
      image: "/cert-iso14001.jpg",
      year: "2023"
    },
    {
      id: 3,
      title: "REACH Compliance",
      category: "safety",
      description: "Full compliance with EU REACH regulations for chemical safety and transparency.",
      image: "/cert-reach.jpg",
      year: "2024"
    },
    {
      id: 4,
      title: "FDA Registered Facility",
      category: "safety",
      description: "Approved facility meeting strict FDA standards for chemical manufacturing and handling.",
      image: "/cert-fda.jpg",
      year: "2024"
    },
    {
      id: 5,
      title: "Responsible Care® Initiative",
      category: "environmental",
      description: "Global initiative commitment to improve environmental, health, safety and security performance.",
      image: "/cert-rc.jpg",
      year: "2022"
    },
    {
      id: 6,
      title: "OECD GLP Compliance",
      category: "quality",
      description: "Good Laboratory Practice compliance for non-clinical safety studies.",
      image: "/cert-glp.jpg",
      year: "2023"
    },
  ];

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setFilteredCerts(
        activeTab === 'all' 
          ? certifications 
          : certifications.filter(cert => cert.category === activeTab)
      );
      setIsFiltering(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  const categories = [
    { id: 'all', name: 'All Certifications', icon: <FaCertificate /> },
    { id: 'quality', name: 'Quality', icon: <FaShieldAlt /> },
    { id: 'safety', name: 'Safety', icon: <FaIndustry /> },
    { id: 'environmental', name: 'Environmental', icon: <FaLeaf /> },
    { id: 'international', name: 'International', icon: <FaGlobeAmericas /> },
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
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(15)].map((_, i) => (
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
            <FaCertificate className="w-full h-full" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          {/*<span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
            Compliance & Standards
          </span>*/}
          <h2 className="text-4xl md:text-5xl font-bold mb-0">
            Our <span className="text-blue-600">Certifications</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Globally recognized accreditations demonstrating our commitment to quality, safety, and environmental responsibility.
          </p>
        </motion.div>

        {/* Category Tabs *
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              variants={itemVariants}
              onClick={() => setActiveTab(category.id)}
              className={`flex items-center px-5 py-3 rounded-full border transition-all ${activeTab === category.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isFiltering}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

         Certificates Grid *
        {isFiltering ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {filteredCerts.length > 0 ? (
                filteredCerts.map((cert) => (
                  <motion.div
                    key={cert.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div 
                      className="relative h-48 bg-gray-100 cursor-pointer" 
                      onClick={() => setSelectedCert(cert.id)}
                    >
                      <img 
                        src={cert.image} 
                        alt={cert.title}
                        className="w-full h-full object-contain p-6"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
                        <span className="text-white font-medium text-sm">{cert.year}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{cert.title}</h3>
                      <p className="text-gray-600 mb-4">{cert.description}</p>
                      <button 
                        className="text-blue-600 font-medium flex items-center hover:underline"
                        onClick={() => setSelectedCert(cert.id)}
                      >
                        View Certificate
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="col-span-full text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-gray-500">No certifications found in this category</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Certificate Modal *
        <AnimatePresence>
          {selectedCert !== null && (
            <motion.div 
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <button 
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => setSelectedCert(null)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {certifications.find(c => c.id === selectedCert)?.title}
                    </h3>
                    <p className="text-blue-600">
                      {certifications.find(c => c.id === selectedCert)?.year}
                    </p>
                  </div>
                  <img 
                    src={certifications.find(c => c.id === selectedCert)?.image} 
                    alt="Certificate" 
                    className="w-full h-auto border border-gray-200"
                  />
                  <div className="mt-6">
                    <p className="text-gray-700">
                      {certifications.find(c => c.id === selectedCert)?.description}
                    </p>
                    <div className="mt-6 flex justify-end">
                      <button 
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => setSelectedCert(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>*

        {/* Compliance Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 bg-blue-50 rounded-2xl p-8 md:p-12 border border-blue-100"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaShieldAlt className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Commitment to Compliance
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              At Malex Chemical Supplies, we maintain rigorous compliance with all local and international regulations. 
              Our dedicated compliance team ensures we not only meet but exceed industry standards, 
              providing you with the confidence that our products are safe, reliable, and responsibly manufactured.
            </p>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Request Compliance Documentation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationsSection;