import React from "react";
import { Home, User, Settings, Activity, Zap, Layers } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../logo/Logo";

const menuItems = [
  { icon: Home, label: "Metadata1", active: true },
  { icon: Activity, label: "Metadata2", active: false },
  { icon: User, label: "Metadata3", active: false },
  { icon: Layers, label: "Metadata4", active: false },
  { icon: Zap, label: "Random", active: false },
];

const AppSidebar: React.FC = () => {
  return (
    <div className="bg-[#1a0e2c] border-r border-purple-900/30 h-screen w-64 flex flex-col">
      <div className="p-4 border-b border-purple-900/30 flex justify-center scale-50">
        <Logo />
      </div>

      <div className="flex-1 py-6 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
          >
            <div
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out
                ${item.active ? "bg-purple-600 text-white" : "hover:bg-purple-900/20 text-purple-300 hover:text-white"}
              `}
            >
              <item.icon className={`mr-3 ${item.active ? "text-white" : "text-purple-400"}`} size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 border-t border-purple-900/30">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
              <div>
                {/* Fetch the name here from DB*/}
                <p className="text-sm font-semibold text-white">Aman Morghade</p>
                <p className="text-xs text-purple-300">Native User</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-purple-300 hover:text-white">
              <Settings size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppSidebar;
