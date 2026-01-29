"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { Instagram, Twitter, Youtube, ArrowRight, Heart, MessageCircle } from "lucide-react";
import { FaPinterest, FaTiktok } from "react-icons/fa";

// Dummy Instagram posts
const instagramPosts = [
  {
    id: 1,
    image: "https://i.pinimg.com/236x/5e/77/3a/5e773a37d47fd40fbfb014281d8ae200.jpg",
    likes: "12.4k",
    comments: "428",
    caption: "Styled this look for Paris Fashion Week ✨ #YourBrand"
  },
  {
    id: 2,
    image: "https://i.pinimg.com/736x/61/97/07/619707d7c86a6466c3785d45d5064b92.jpg",
    likes: "8.7k",
    comments: "312",
    caption: "New collection dropping next week! #ComingSoon"
  },
  {
    id: 3,
    image: "https://i.pinimg.com/736x/9f/4c/2c/9f4c2c4a1c2c91f3e8864df96ed5a3e4.jpg",
    likes: "15.2k",
    comments: "892",
    caption: "Customer spotlight @fashionista wearing our blazer #YourBrandStyle"
  },
  {
    id: 4,
    image: "https://i.pinimg.com/474x/b5/c1/35/b5c135444094d30f174d10a17c7c0395.jpg",
    likes: "10.1k",
    comments: "567",
    caption: "Behind the scenes at our latest shoot 📸"
  },
  {
    id: 5,
    image: "https://i.pinimg.com/736x/73/a8/d1/73a8d1d1fa2db204b2b8ae7bee7126ae.jpg",
    likes: "18.9k",
    comments: "1.2k",
    caption: "Celebrity sighting! @superstar in our new collection"
  },
  {
    id: 6,
    image: "https://i.pinimg.com/564x/36/e5/52/36e55270678f71bdb222eeeb8651ee23.jpg",
    likes: "6.3k",
    comments: "245",
    caption: "Moodboard inspo for this season's color palette"
  }
];

const SocialMediaIntegration = () => {
  const [activePost, setActivePost] = useState(instagramPosts[0]);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section className="relative py-20 bg-white px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-20 left-10 w-24 h-24 bg-[#f4b500]/10 rounded-full blur-xl"
        style={{ y: y1 }}
        animate={{
          rotate: [0, 15, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-32 right-16 w-20 h-20 bg-[#f4b500]/05 rounded-full blur-lg"
        style={{ y: y2 }}
        animate={{
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest text-[#f4b500] bg-[#f4b500]/10 px-4 py-2 rounded-full inline-flex items-center gap-2">
            SOCIAL CONNECT
          </span>
          <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f4b500] to-[#d4a017]">
              Join Our Community
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Follow us for exclusive content, styling tips, and behind-the-scenes access
          </p>
        </motion.div>

        {/* Instagram Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={activePost.image}
              alt="Instagram post"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
              <p className="text-white text-lg mb-4">{activePost.caption}</p>
              <div className="flex gap-4 text-white">
                <span className="flex items-center gap-1">
                  <Heart size={18} /> {activePost.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={18} /> {activePost.comments}
                </span>
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-[#f4b500] text-white px-3 py-1 rounded-full text-xs font-bold">
              @YourBrand
            </div>
          </motion.div>

          {/* Post Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {instagramPosts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative rounded-xl overflow-hidden cursor-pointer ${activePost.id === post.id ? 'ring-4 ring-[#f4b500]' : ''}`}
                onClick={() => setActivePost(post)}
              >
                <img
                  src={post.image}
                  alt="Instagram thumbnail"
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram size={24} className="text-white" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Social Platform Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl p-8 sm:p-12"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Follow Us Everywhere
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Instagram */}
            <motion.a
              href="#"
              className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] p-6 rounded-xl text-white flex flex-col items-center justify-center shadow-lg"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram size={32} className="mb-4" />
              <span className="font-bold">Instagram</span>
              <span className="text-sm opacity-80 mt-1">@YourBrand</span>
              <span className="text-xs mt-3 flex items-center gap-1">
                <ArrowRight size={14} /> Follow
              </span>
            </motion.a>

            {/* TikTok */}
            <motion.a
              href="#"
              className="bg-black p-6 rounded-xl text-white flex flex-col items-center justify-center shadow-lg"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTiktok size={32} className="mb-4" />
              <span className="font-bold">TikTok</span>
              <span className="text-sm opacity-80 mt-1">@YourBrand</span>
              <span className="text-xs mt-3 flex items-center gap-1">
                <ArrowRight size={14} /> Follow
              </span>
            </motion.a>

            {/* Pinterest */}
            <motion.a
              href="#"
              className="bg-[#E60023] p-6 rounded-xl text-white flex flex-col items-center justify-center shadow-lg"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPinterest size={32} className="mb-4" />
              <span className="font-bold">Pinterest</span>
              <span className="text-sm opacity-80 mt-1">@YourBrand</span>
              <span className="text-xs mt-3 flex items-center gap-1">
                <ArrowRight size={14} /> Follow
              </span>
            </motion.a>

            {/* YouTube */}
            <motion.a
              href="#"
              className="bg-[#FF0000] p-6 rounded-xl text-white flex flex-col items-center justify-center shadow-lg"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Youtube size={32} className="mb-4" />
              <span className="font-bold">YouTube</span>
              <span className="text-sm opacity-80 mt-1">YourBrand</span>
              <span className="text-xs mt-3 flex items-center gap-1">
                <ArrowRight size={14} /> Subscribe
              </span>
            </motion.a>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center bg-black text-white px-6 py-3 rounded-full shadow-lg">
            <Instagram size={20} className="mr-3" />
            <span className="font-bold">Follow @YourBrand for the latest trends</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialMediaIntegration;