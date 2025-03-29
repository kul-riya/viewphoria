import React from "react";
import { Home, User, Settings, Activity, Zap, Layers, LogIn, Lock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../logo/Logo";
import useAuthContext from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

// This is some temp data, the menuItems will have name(Object)
const menuItems = [
  { icon: Home, label: "Metadata1", active: true },
  { icon: Activity, label: "Metadata2", active: false },
  { icon: User, label: "Metadata3", active: false },
  { icon: Layers, label: "Metadata4", active: false },
  { icon: Zap, label: "Random", active: false },
];

const AppSidebar: React.FC = () => {
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/auth");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-b from-[#1a0e2c] to-[#170b24] border-r border-purple-900/30 h-screen w-64 flex flex-col shadow-2xl relative overflow-hidden"
    >
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600/5 rounded-full blur-3xl"></div>
      
      <div className="p-4 border-b border-purple-900/30 flex justify-center">
        <div className="scale-50 transform-gpu">
          <Logo />
        </div>
      </div>

      {state.isAuthenticated ? (
        <div className="flex-1 py-6 space-y-2 px-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            >
              <div
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out
                  ${item.active 
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md" 
                    : "hover:bg-purple-900/20 text-purple-300 hover:text-white"}
                `}
              >
                <item.icon 
                  className={`mr-3 ${item.active ? "text-white" : "text-purple-400"}`} 
                  size={20} 
                />
                <span className="text-sm font-medium">{item.label}</span>
                {item.active && (
                  <motion.div 
                    className="ml-auto" 
                    animate={{ x: [0, 2, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronRight size={16} className="text-purple-300" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center"
          >
            <Lock className="text-purple-400 w-12 h-12" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center px-6"
          >
            <p className="text-purple-300 text-sm mb-6">
              Metadata request history not available. Please authenticate to continue.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoginRedirect}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium flex items-center justify-center w-full shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all duration-300 hover:cursor-pointer"
            >
              <LogIn size={16} className="mr-2" />
              Login / Signup
            </motion.button>
          </motion.div>
        </div>
      )}

      <div className="p-4 border-t border-purple-900/30 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {state.isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <User size={18} className="text-white" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-white">User Name</p>
                  <p className="text-xs text-purple-300">Native User</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 30 }}
                whileTap={{ scale: 0.9 }}
                className="text-purple-300 hover:text-white"
              >
                <Settings size={20} />
              </motion.button>
            </div>
          ) : (
            <div className="border-t border-purple-900/30 pt-4 flex items-center justify-center">
              <p className="text-xs text-purple-400/60 italic text-center">
                © 2025 Viewphoria • All Rights Reserved
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AppSidebar;