"use client";
import { motion } from "framer-motion";
import { MessageCircle, X, ArrowRight, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useInquiryStore } from "@/stores/inquiryStore";
import Image from "next/image";
import NavbarTwo from "@/components/HeaderTwo";
import LuxuryFooter from "@/components/LuxuryFooter";

const InquiryPage = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    updateNotes,
    clearInquiry,
    itemCount,
  } = useInquiryStore();

  return (
    <>
      <NavbarTwo />
      <div className="bg-white min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82cee4] to-[#62aee4]">
                Your Inquiry List
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              {itemCount()} {itemCount() === 1 ? "product" : "products"} in your inquiry
            </p>
          </motion.div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col sm:flex-row gap-6 border-b border-gray-200 pb-8"
                    >
                      <div className="relative w-full sm:w-40 h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                            <p className="text-gray-500 text-sm">{item.category}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Technical Specifications:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                            {item.specifications.slice(0, 4).map((spec, index) => (
                              <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                                <p className="text-gray-500">{spec.name}</p>
                                <p className="font-medium">{spec.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center border border-gray-200 rounded-full">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-3 py-1 text-gray-600 disabled:text-gray-300"
                            >
                              -
                            </button>
                            <span className="px-3">Qty: {item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="w-full sm:w-64">
                            <label htmlFor={`notes-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Additional Notes
                            </label>
                            <input
                              id={`notes-${item.id}`}
                              type="text"
                              value={item.notes}
                              onChange={(e) => updateNotes(item.id, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              placeholder="Any special requirements?"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={clearInquiry}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all items
                  </button>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Inquiry Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Products</span>
                      <span className="font-medium">{itemCount()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Quantity</span>
                      <span className="font-medium">
                        {items.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6"></div>

                  <Link href="/submit-inquiry" passHref legacyBehavior>
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold py-3 px-6 rounded-full text-center transition-colors flex items-center justify-center gap-2"
                    >
                      Submit Inquiry <ArrowRight size={18} />
                    </motion.a>
                  </Link>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    or <Link href="/collections" className="text-[#82cee4] hover:underline">Continue Browsing</Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-20"
            >
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ClipboardList size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your inquiry list is empty</h3>
              <p className="text-gray-600 mb-6">Browse our products to add items for inquiry</p>
              <Link href="/collections" passHref legacyBehavior>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block px-6 py-3 bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold rounded-full transition-colors"
                >
                  View Products
                </motion.a>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
      <LuxuryFooter />
    </>
  );
};

export default InquiryPage;