"use client";

import { motion } from "framer-motion";
import { User, ShoppingBag } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

export const ProfileTabs = ({ activeTab, setActiveTab, isAdmin }: ProfileTabsProps) => {
  const tabs: Tab[] = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "orders", label: "Orders", icon: <ShoppingBag size={18} /> },
  ];

  if (isAdmin) {
    tabs.push(
      { id: "users", label: "Users", icon: <User size={18} /> },
      { id: "products", label: "Products", icon: <ShoppingBag size={18} /> }
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-8 border-b border-[#82cee4]"
    >
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? "border-[#82cee4] text-[#82cee4]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </div>
          </button>
        ))}
      </nav>
    </motion.div>
  );
};