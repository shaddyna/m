"use client";

import { motion } from "framer-motion";
import Footer from "@/components/LuxuryFooter";
import NavbarTwo from "@/components/HeaderTwo";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardHover = {
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

export default function ContactPage() {
  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <NavbarTwo />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        {/* Floating molecules */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-200"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`
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
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="2" />
              <path d="M16 12l3 3m-7 0l3-3m-5-5l3-3m-3 14l3-3" />
            </svg>
          </motion.div>
        ))}

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
             <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
              Contact Us
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Contact <span className="text-blue-600">Malex Chem</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reach out to our team for expert chemical solutions and support
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Contact Cards */}
          <motion.div 
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            {/* Phone Card */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 hover:border-blue-200 transition-all"
              variants={fadeIn}
              whileHover="hover"
            >
              <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <FaPhone className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Phone</h3>
              <p className="text-gray-600 mb-2">+2547 185 486 95</p>
              <p className="text-gray-600">+2547 021 152 77</p>
            </motion.div>

            {/* Email Card */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 hover:border-blue-200 transition-all"
              variants={fadeIn}
              whileHover="hover"
            >
              <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <FaEnvelope className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Email</h3>
              <p className="text-gray-600 mb-2">sales@malexsupplies.com</p>
              <p className="text-gray-600">alex@malexsupplies.com</p>
            </motion.div>

            {/* Location Card */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 hover:border-blue-200 transition-all"
              variants={fadeIn}
              whileHover="hover"
            >
              <div className="w-16 h-16 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Location</h3>
              <p className="text-gray-600">Hotel Green Court Building</p>
              <p className="text-gray-600">5th Floor, Latema Road</p>
              <p className="text-gray-600">Nairobi, Kenya</p>
            </motion.div>
          </motion.div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Form */}
            <motion.div 
              variants={fadeIn}
              className="bg-white p-8 rounded-xl shadow-lg border border-blue-100"
            >
              <div className="mb-8">
                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
                  Get In Touch
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-600">We typically respond within 24 hours</p>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Tell us more about your needs..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  <FiSend className="mr-2" />
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Map */}
            <motion.div 
              variants={fadeIn}
              className="bg-white p-1 rounded-xl shadow-lg border border-blue-100 overflow-hidden h-full"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Our Headquarters</h3>
                <p className="text-gray-600 mb-6">Visit us at our Nairobi office for consultations and product demonstrations.</p>
                
                <div className="relative overflow-hidden rounded-lg" style={{ paddingBottom: "100%" }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8189881284225!2d36.822488075827444!3d-1.2824046356236611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11d5366d37f9%3A0xc72de9b7a73c5626!2sGreen%20Court%20Hotel!5e0!3m2!1sen!2ske!4v1741252292109!5m2!1sen!2ske"
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ border: "0" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Business Hours</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>8:00 AM - 5:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday</span>
                      <span>9:00 AM - 1:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div 
            variants={fadeIn}
            className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium mb-4">
                  Need Help?
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Frequently Asked <span className="text-blue-600">Questions</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Find answers to common questions about our products and services.
                </p>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-6">
                {[
                  {
                    question: "What chemicals do you supply?",
                    answer: "We supply a comprehensive range of industrial and laboratory chemicals, including solvents, acids, bases, reagents, and specialty compounds for various applications."
                  },
                  {
                    question: "Are your chemicals safe for use?",
                    answer: "Absolutely. All our chemicals comply with international safety regulations. We provide detailed Material Safety Data Sheets (MSDS) and handling guidelines with every product."
                  },
                  {
                    question: "Do you offer bulk purchasing options?",
                    answer: "Yes, we provide significant discounts for bulk orders. Our team can work with you to develop a customized procurement plan that meets your volume requirements."
                  },
                  {
                    question: "How do you ensure product quality?",
                    answer: "We partner with ISO-certified manufacturers and conduct rigorous quality control tests. Each batch is verified for purity and consistency before distribution."
                  },
                  {
                    question: "Can I get technical consultation before purchasing?",
                    answer: "Certainly. Our team of chemical experts offers free consultations to help you select the most appropriate products for your specific applications and requirements."
                  }
                ].map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button className="flex justify-between items-center w-full text-left p-6 group">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                        {faq.question}
                      </h3>
                      <FaChevronDown className="text-gray-500 group-hover:text-blue-600 transition-transform duration-300 group-hover:rotate-180" />
                    </button>
                    <div className="px-6 pb-6 pt-0 text-gray-600 bg-gray-50">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-blue-100">Partner</span> With Us?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join hundreds of satisfied clients who trust Malex Chem for their chemical supply needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition duration-300 shadow-lg hover:shadow-xl">
                Request a Quote
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition duration-300 shadow-lg hover:shadow-xl">
                Call Our Experts
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}