// app/cart/page.tsx
"use client";
import { motion } from "framer-motion";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import Image from "next/image";
import NavbarTwo from "@/components/HeaderTwo";
import LuxuryFooter from "@/components/LuxuryFooter";

const CartPage = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
  } = useCartStore();

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
              Your Shopping Bag
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            {itemCount()} {itemCount() === 1 ? "item" : "items"} in your cart
          </p>
        </motion.div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
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
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                          <p className="text-gray-500 text-sm">{item.designer}</p>
                          <p className="text-gray-500 text-sm mt-2">Size: {item.size}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-full">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 text-gray-600 disabled:text-gray-300"
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="px-3 py-1 text-gray-600 disabled:text-gray-300"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-lg font-bold text-[#82cee4]">
                          Ksh {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all items
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Ksh {totalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="flex justify-between mb-8">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-[#82cee4]">
                    Ksh {totalPrice().toLocaleString()}
                  </span>
                </div>

                <Link href="/checkout" passHref legacyBehavior>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full bg-[#82cee4] hover:bg-[#62aee4] text-black font-bold py-3 px-6 rounded-full text-center transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight size={18} />
                  </motion.a>
                </Link>

                <p className="text-center text-sm text-gray-500 mt-4">
                  or <Link href="/collections" className="text-[#82cee4] hover:underline">Continue Shopping</Link>
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
              <ShoppingBag size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
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

export default CartPage;