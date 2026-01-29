"use client";
import { motion } from "framer-motion";
import { MessageCircle, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useInquiryStore } from "@/stores/inquiryStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NavbarTwo from "@/components/HeaderTwo";
import LuxuryFooter from "@/components/LuxuryFooter";

const SubmitInquiryPage = () => {
  const { items, clearInquiry } = useInquiryStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    contactName: "",
    company: "",
    email: "",
    phone: "",
    additionalNotes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the user token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Handle case where user is not authenticated
        router.push('auth/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items,
          contactInfo: formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      // Clear the inquiry store on successful submission
      clearInquiry();
      setIsSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/collections');
      }, 2000);

    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isSuccess) {
    return (
      <>
        <NavbarTwo />
        <div className="bg-white min-h-screen pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-xl p-8 max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Inquiry Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your inquiry. Our team will review your request and get back to you shortly.
              </p>
              <Link href="/collections" passHref legacyBehavior>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block px-6 py-3 bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold rounded-full transition-colors"
                >
                  Continue Browsing
                </motion.a>
              </Link>
            </motion.div>
          </div>
        </div>
        <LuxuryFooter />
      </>
    );
  }

  return (
    <>
      <NavbarTwo />
      <div className="bg-white min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/inquiry" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center text-[#82cee4] hover:text-[#62aee4] mb-6"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Inquiry List
              </motion.a>
            </Link>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82cee4] to-[#62aee4]">
                Submit Your Inquiry
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Please review your products and provide your contact information
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#82cee4] focus:border-[#82cee4]"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#82cee4] focus:border-[#82cee4]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#82cee4] focus:border-[#82cee4]"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#82cee4] focus:border-[#82cee4]"
                  />
                </div>

                <div>
                  <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#82cee4] focus:border-[#82cee4]"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition-colors ${
                    isSubmitting ? 'bg-gray-400' : 'bg-[#82cee4] hover:bg-[#62aee4] text-black'
                  }`}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <MessageCircle size={18} />
                      Submit Inquiry
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Inquiry Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Products</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Quantity</span>
                  <span className="font-medium">
                    {items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-6"></div>

              <h3 className="font-medium text-gray-900 mb-4">Products in your inquiry:</h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 border-b border-gray-100 pb-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      {item.notes && (
                        <p className="text-sm text-gray-500 mt-1">Notes: {item.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LuxuryFooter />
    </>
  );
};

export default SubmitInquiryPage;