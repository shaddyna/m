"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaFlask, FaShippingFast, FaFileAlt, FaHandshake, FaClipboardCheck, FaHeadset } from 'react-icons/fa';
import Navbar from '@/components/Header';
import Footer from '@/components/LuxuryFooter';
import NavbarTwo from '@/components/HeaderTwo';

const PurchaseGuidePage = () => {
  const steps = [
    {
      icon: <FaHeadset className="text-blue-600 text-3xl" />,
      title: "Step 1: Inquiry",
      description: "Ask questions about our products, specifications, and services",
      details: [
        "Product availability and chemical types",
        "Packaging options and quantities",
        "Safety data sheets and compliance",
        "Pricing estimates and bulk discounts",
        "Delivery timelines and shipping methods"
      ],
      binding: "No commitment - purely informational"
    },
    {
      icon: <FaFileAlt className="text-blue-600 text-3xl" />,
      title: "Step 2: Requesting a Quote",
      description: "Get a detailed price offer for your specific needs",
      details: [
        "Itemized prices for each product",
        "Minimum order quantities",
        "Payment terms (cash, bank transfer)",
        "Delivery timeline and shipping costs",
        "Special handling fees if applicable"
      ],
      binding: "Not binding until accepted"
    },
    {
      icon: <FaHandshake className="text-blue-600 text-3xl" />,
      title: "Step 3: Placing an Order",
      description: "Confirm and commit to your purchase",
      details: [
        "Final product types and quantities",
        "Confirmed prices as per quote",
        "Shipping address and delivery date",
        "Payment details and instructions",
        "Special handling requirements"
      ],
      binding: "Legally binding agreement"
    },
    {
      icon: <FaClipboardCheck className="text-blue-600 text-3xl" />,
      title: "After Order Confirmation",
      description: "What happens next in the process",
      details: [
        "Order confirmation with estimated delivery",
        "Payment processing (cash on delivery available)",
        "Careful packaging and safe shipping",
        "Tracking information provided",
        "Customer support throughout"
      ],
      binding: "We ensure smooth fulfillment"
    }
  ];

  const exampleQuote = [
    { product: "Acetone (99.5%)", quantity: "100 L", unitPrice: "Ksh 1,500 / L", total: "Ksh 150,000", delivery: "5 business days" },
    { product: "Sodium Hydroxide", quantity: "50 kg", unitPrice: "Ksh 800 / kg", total: "Ksh 40,000", delivery: "5 business days" },
    { product: "Delivery Fee", quantity: "", unitPrice: "", total: "Ksh 5,000", delivery: "" }
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
                Purchase Guide
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                How to Acquire Chemicals from <span className="text-blue-600">Malex Chem</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A transparent, step-by-step guide to purchasing chemicals from our marketplace
              </p>
            </motion.div>
          </div>
        </section>

        {/* Process Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Our <span className="text-blue-600">Simple Process</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From initial inquiry to final delivery, we make chemical procurement straightforward and transparent
              </p>
            </motion.div>

            {/* Steps */}
            <div className="space-y-16">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="lg:sticky lg:top-32">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-4 rounded-xl">
                        {step.icon}
                      </div>
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-1">
                          Step {index + 1}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600">{step.description}</p>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="font-medium text-blue-600 mb-1">Binding Status:</p>
                      <p>{step.binding}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-gray-50 rounded-xl p-8 border border-gray-200">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Details:</h4>
                    <ul className="space-y-3">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Example Quote for Step 2 */}
                    {index === 1 && (
                      <div className="mt-8">
                        <h4 className="text-xl font-bold text-gray-800 mb-4">Example Quote:</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white rounded-lg overflow-hidden">
                            <thead className="bg-blue-600 text-white">
                              <tr>
                                <th className="py-3 px-4 text-left">Product</th>
                                <th className="py-3 px-4 text-left">Quantity</th>
                                <th className="py-3 px-4 text-left">Unit Price</th>
                                <th className="py-3 px-4 text-left">Total Price</th>
                                <th className="py-3 px-4 text-left">Delivery</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {exampleQuote.map((item, i) => (
                                <tr key={i}>
                                  <td className="py-3 px-4">{item.product}</td>
                                  <td className="py-3 px-4">{item.quantity}</td>
                                  <td className="py-3 px-4">{item.unitPrice}</td>
                                  <td className="py-3 px-4 font-medium">{item.total}</td>
                                  <td className="py-3 px-4">{item.delivery}</td>
                                </tr>
                              ))}
                              <tr className="bg-blue-50">
                                <td className="py-3 px-4 font-bold" colSpan={3}>Total</td>
                                <td className="py-3 px-4 font-bold">Ksh 195,000</td>
                                <td className="py-3 px-4"></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Sample Inquiry for Step 1 */}
                    {index === 0 && (
                      <div className="mt-8">
                        <h4 className="text-xl font-bold text-gray-800 mb-4">Sample Inquiry:</h4>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <p className="text-gray-600 mb-2">"Do you supply industrial-grade sulfuric acid in 25 kg drums? What are the available concentrations and prices?"</p>
                          <p className="text-gray-600">"Can you provide safety documentation for the chemicals? Also, do you offer delivery services for large orders?"</p>
                        </div>
                      </div>
                    )}

                    {/* Sample Order for Step 3 */}
                    {index === 2 && (
                      <div className="mt-8">
                        <h4 className="text-xl font-bold text-gray-800 mb-4">Sample Order:</h4>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <p className="text-gray-600">"I accept the quote provided and would like to place an order for 100 liters of acetone and 50 kilograms of sodium hydroxide to be delivered to my warehouse by the 10th of next month. Please send payment instructions."</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-blue-600 p-8 md:p-12 text-white">
                  <h2 className="text-3xl font-bold mb-6">Purchase Process Summary</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <FaHeadset className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">1. Inquiry</h3>
                        <p className="text-blue-100">You ask questions about our products and services</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <FaFileAlt className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">2. Quote</h3>
                        <p className="text-blue-100">We provide detailed pricing and terms</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <FaHandshake className="text-xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">3. Order</h3>
                        <p className="text-blue-100">You confirm and commit to purchase</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Need Help?</h3>
                  <p className="text-gray-600 mb-6">
                    If you're unsure at any step or need expert advice on chemical selection or safety, our specialists are ready to assist you.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="font-medium">+254 700 123 456</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">sales@malexchemsupplies.co.ke</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                      <span className="font-medium">Live Chat on our website</span>
                    </div>
                  </div>
                  <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Contact Our Sales Team
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ready to <span className="text-blue-100">Get Started</span>?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Begin your chemical procurement journey with Malex Chem Supplies today
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition duration-300 shadow-lg hover:shadow-xl">
                Request a Quote
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition duration-300">
                Contact Sales
              </button>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default PurchaseGuidePage;