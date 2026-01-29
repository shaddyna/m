"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import NavbarTwo from "@/components/HeaderTwo";
import LuxuryFooter from "@/components/LuxuryFooter";
import { Mail, Check, ArrowLeft, ChevronRight } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        setEmail("");
      }, 1500);
    }
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Section */}
      <section className="relative h-64 md:h-96 flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src="https://i.pinimg.com/736x/8e/3e/6a/8e3e6a6c8a1a9b1e8e3e6a6c8a1a9b1e.jpg"
          alt="Extreme Collections"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f4b500] to-[#d4a017]">
              Reset Password
            </span>
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Secure your account with our streamlined password recovery process
          </p>
        </motion.div>
      </section>

      {/* Password Reset Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white p-8 rounded-xl shadow-lg border border-[#f4b500]/20"
            >
              <div className="mx-auto bg-[#f4b500]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <div className="bg-[#f4b500] text-white p-2 rounded-full">
                  <Check className="h-6 w-6" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reset Email Sent
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent instructions to your email for resetting your password
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold py-3 rounded-full"
              >
                Back to Login
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Password Recovery
                </h2>
                <p className="text-gray-600">
                  Enter your email to receive reset instructions
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        error ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4b500] focus:border-transparent`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-[#f4b500] hover:bg-[#d4a017] text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Instructions...
                    </>
                  ) : (
                    <>
                      Reset Password <ChevronRight size={18} />
                    </>
                  )}
                </motion.button>

                {/* Back to Login */}
                <div className="text-center text-sm text-gray-600">
                  <a
                    href="#"
                    className="font-medium text-[#f4b500] hover:text-[#d4a017] inline-flex items-center"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Login
                  </a>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </section>

      {/* Security Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#f4b500]">Security Promise</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your security is our top priority. We use enterprise-grade protection measures
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "End-to-End Encryption",
                description: "All communications are securely encrypted",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              },
              {
                title: "Two-Factor Authentication",
                description: "Optional extra layer of security",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: "24/7 Monitoring",
                description: "Continuous security surveillance",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
              >
                <div className="bg-[#f4b500]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPasswordPage;