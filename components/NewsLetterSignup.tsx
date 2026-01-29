"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Mail, ChevronRight } from "lucide-react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setShowPopup(true), 1000);
    }
  };

  return (
    <section className="relative py-20 bg-white px-4 sm:px-6 lg:px-8">
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-1/4 left-10 w-16 h-16 bg-[#f4b500]/10 rounded-full blur-xl"
        animate={{
          x: [0, 15, 0],
          y: [0, 20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-16 w-20 h-20 bg-[#f4b500]/05 rounded-full blur-lg"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#fafafa] to-white border border-gray-100 rounded-2xl shadow-sm p-8 sm:p-12 text-center"
        >
          <div className="w-16 h-16 bg-[#f4b500]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-[#f4b500]" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get <span className="text-[#f4b500]">10% Off</span> Your First Order
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter for exclusive offers, early access to new collections, and styling tips.
          </p>

          {!isSubscribed ? (
            <motion.form 
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-5 py-4 pr-12 rounded-lg border border-gray-200 focus:border-[#f4b500] focus:ring-2 focus:ring-[#f4b500]/20 transition-all"
                  required
                />
                <Mail size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <motion.button
                type="submit"
                className="relative overflow-hidden bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold py-4 px-8 rounded-lg transition-colors shadow-md"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Subscribe <ChevronRight size={18} className={`transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                </span>
                <motion.span 
                  className="absolute inset-0 bg-white opacity-0"
                  animate={{ opacity: isHovered ? 0.2 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#f4b500]/10 border border-[#f4b500]/20 rounded-xl p-6 max-w-md mx-auto"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you for subscribing!</h3>
              <p className="text-gray-600">Check your inbox for your 10% discount code.</p>
            </motion.div>
          )}

          <p className="text-sm text-gray-400 mt-6">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </motion.div>
      </div>

      {/* Discount Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-50 bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-full transition-colors"
                onClick={() => setShowPopup(false)}
              >
                <X size={20} />
              </button>

              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-[#f4b500]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail size={32} className="text-[#f4b500]" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Your Exclusive Discount!
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Use code <span className="font-mono font-bold text-[#f4b500]">WELCOME10</span> at checkout for 10% off your first order.
                </p>
                
                <motion.button
                  className="relative overflow-hidden bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold py-3 px-8 rounded-lg transition-colors shadow-md w-full max-w-xs mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Shopping
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NewsletterSignup;