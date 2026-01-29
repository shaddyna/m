/*"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, Search, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";

const NavbarTwo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.itemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Catalogue", href: "/collections" },
    //{ name: "Offers", href: "/offers" },
    { name: "Guide", href: "/guide" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 ${
        scrolled ? "bg-[#081e4e]/90 backdrop-blur-sm" : "bg-[#081e4e]/90 backdrop-blur-sm"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <Link href="/" className="text-white font-bold text-2xl">
              <span className="group relative">
                <span className="block group-hover:opacity-0 transition-opacity">Malex</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-clip-text text-transparent bg-gradient-to-r from-[#82cee4] to-[#ffffff]">
                  Malex
                </span>
              </span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className={`relative text-white/80 hover:text-white transition-colors ${
                  pathname === link.href ? "text-[#82cee4]" : ""
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.span
                    layoutId="activeLink"
                    className="absolute left-0 bottom-0 w-full h-px bg-[#82cee4]"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/search" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Search size={20} />
              </motion.a>
            </Link>
            <Link href="/wishlist" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/80 hover:text-white transition-colors relative"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#82cee4] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </motion.a>
            </Link>
            <Link href="/cart" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/80 hover:text-white transition-colors relative"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#82cee4] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </motion.a>
            </Link>
            <Link href="/account" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <User size={20} />
              </motion.a>
            </Link>
          </div>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25 }}
            className="md:hidden bg-[#081e4e]/95 backdrop-blur-lg border-t border-[#333]"
          >
            <div className="px-4 py-6 space-y-6">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`block text-white/80 hover:text-white text-lg ${
                    pathname === link.href ? "text-[#82cee4] font-medium" : ""
                  }`}
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="flex items-center space-x-6 pt-6">
                <Link href="/search" passHref legacyBehavior>
                  <motion.a whileHover={{ scale: 1.1 }} className="text-white/80 hover:text-white">
                    <Search size={20} />
                  </motion.a>
                </Link>
                <Link href="/wishlist" passHref legacyBehavior>
                  <motion.a whileHover={{ scale: 1.1 }} className="text-white/80 hover:text-white relative">
                    <Heart size={20} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#82cee4] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </motion.a>
                </Link>
                <Link href="/cart" passHref legacyBehavior>
                  <motion.a whileHover={{ scale: 1.1 }} className="text-white/80 hover:text-white relative">
                    <ShoppingBag size={20} />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#82cee4] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </motion.a>
                </Link>
                <Link href="/account" passHref legacyBehavior>
                  <motion.a whileHover={{ scale: 1.1 }} className="text-white/80 hover:text-white">
                    <User size={20} />
                  </motion.a>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default NavbarTwo;*/

// components/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, User, Search, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useInquiryStore } from "@/stores/inquiryStore";
import { useWishlistStore } from "@/stores/wishlistStore";


const NavbarTwo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const inquiryCount = useInquiryStore((state) => state.itemCount());


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Catalogue", href: "/collections" },
    //{ name: "Offers", href: "/offers" },
    { name: "Guide", href: "/guide" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 ${
        scrolled ? "bg-[#081e4e]/90 backdrop-blur-sm" : "bg-[#081e4e]/90 backdrop-blur-sm"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <Link href="/" className="text-white font-bold text-2xl">
              <span className="group relative">
                <span className="block group-hover:opacity-0 transition-opacity">Malex</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-clip-text text-transparent bg-gradient-to-r from-[#82cee4] to-[#ffffff]">
                  Malex
                </span>
              </span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className={`relative text-white/80 hover:text-white transition-colors ${
                  pathname === link.href ? "text-[#82cee4]" : ""
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.span
                    layoutId="activeLink"
                    className="absolute left-0 bottom-0 w-full h-px bg-[#82cee4]"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Search size={20} />
              </motion.a>
            </Link>
            <Link href="/wishlist" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/80 hover:text-white transition-colors relative"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#82cee4] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </motion.a>
            </Link>
              {/* Desktop View */}
            <Link href="/inquiry" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/80 hover:text-white transition-colors relative"
              >
                <MessageCircle size={20} />
                {inquiryCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#82cee4] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {inquiryCount}
                  </span>
                )}
              </motion.a>
            </Link>
            <Link href="/account" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <User size={20} />
              </motion.a>
            </Link>
          </div>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25 }}
            className="md:hidden bg-[#081e4e]/95 backdrop-blur-lg border-t border-[#333]"
          >
            <div className="px-4 py-6 space-y-6">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`block text-white/80 hover:text-white text-lg ${
                    pathname === link.href ? "text-[#82cee4] font-medium" : ""
                  }`}
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="flex items-center space-x-6 pt-6">
                <Link href="" passHref legacyBehavior>
                  <motion.a whileHover={{ scale: 1.1 }} className="text-white/80 hover:text-white">
                    <Search size={20} />
                  </motion.a>
                </Link>
                <Link href="/wishlist" passHref legacyBehavior>
                  <motion.a whileHover={{ scale: 1.1 }} className="text-white/80 hover:text-white relative">
                    <Heart size={20} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#82cee4] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </motion.a>
                </Link>
                  {/* Mobile View */}
              <Link href="/inquiry" passHref legacyBehavior>
                <motion.a whileHover={{ scale: 1.1 }} className="text-white/80 hover:text-white relative">
                  <MessageCircle size={20} />
                  {inquiryCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#82cee4] text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {inquiryCount}
                    </span>
                  )}
                </motion.a>
              </Link>
                <Link href="/account" passHref legacyBehavior>
                  <motion.a whileHover={{ scale: 1.1 }} className="text-white/80 hover:text-white">
                    <User size={20} />
                  </motion.a>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default NavbarTwo;