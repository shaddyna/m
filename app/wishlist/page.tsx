// app/wishlist/page.tsx
/*"use client";
import { motion } from "framer-motion";
import { Heart, X, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import Image from "next/image";
import NavbarTwo from "@/components/HeaderTwo";
import LuxuryFooter from "@/components/LuxuryFooter";

const WishlistPage = () => {
  const { items, removeItem, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      designer: product.designer,
      price: product.price,
      image: product.image,
      size: "M", // Default size
      stock: 10, // Default stock
    });
  };

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
              Your Wishlist
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </motion.div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-[#82cee4]/50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.designer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#82cee4] font-bold">Ksh {item.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(item)}
                    className="mt-4 w-full bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold py-2 rounded-full flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingBag size={16} /> Add to Bag
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
            <Link href="/collections" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block px-6 py-3 bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold rounded-full transition-colors"
              >
                Browse Collections
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

export default WishlistPage;*/

"use client";
import { motion } from "framer-motion";
import { Heart, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useInquiryStore } from "@/stores/inquiryStore";
import Image from "next/image";
import NavbarTwo from "@/components/HeaderTwo";
import LuxuryFooter from "@/components/LuxuryFooter";

const WishlistPage = () => {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useInquiryStore();

  const handleAddToInquiry = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.designer, 
      specifications: [], 
      image: product.image
    });
  };

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
                Your Wishlist
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </motion.div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-[#82cee4]/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToInquiry(item)}
                      className="mt-4 w-full bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold py-2 rounded-full flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle size={16} /> Add to Inquiry
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-20"
            >
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Heart size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
              <Link href="/collections" passHref legacyBehavior>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block px-6 py-3 bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold rounded-full transition-colors"
                >
                  Browse Collections
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

export default WishlistPage;