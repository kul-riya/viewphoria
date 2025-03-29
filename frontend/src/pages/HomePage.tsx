import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import AppSidebar from "../components/layout/AppSidebar";
import BackgroundScene from "../components/layout/BackgroundScene";
import DataInputField from "../components/layout/DataInputField";
import SnapshotEvolutionTimeline from "../components/layout/SnapshotEvolutionTimeline";

import Loader from "../components/common/Loader";

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleFetch = () => {
    setIsLoading(true);
    // Something
    // axios.post(...).then(() => {
    //   setIsLoading(false);
    // }).catch(() => {
    //   setIsLoading(false);
    // });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative h-screen w-screen bg-[#090012] flex overflow-hidden">
      <motion.button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[60] bg-purple-600/30 hover:bg-purple-600/50 p-2 rounded-full backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isSidebarOpen ? <X className="text-white" /> : <Menu className="text-white" />}
      </motion.button>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="fixed left-0 top-0 bottom-0 z-50"
          >
            <AppSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas
        className="absolute inset-0 z-0 w-full h-full"
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 5, 4]} intensity={1.5} />
        <pointLight position={[-3, -5, 4]} intensity={0.8} color="#d8b4fe" />
        <Stars radius={400} depth={90} count={5000} factor={6} fade />
        <BackgroundScene withSphere={false}/>
      </Canvas>

      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-20"
        animate={{ 
          paddingLeft: isSidebarOpen ? '16rem' : '0',
          transition: { type: 'tween' }
        }}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <div className="w-full max-w-xl px-4">
            <DataInputField onFetch={handleFetch} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;