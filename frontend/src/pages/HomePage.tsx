import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import AppSidebar from "../components/layout/AppSidebar";
import BackgroundScene from "../components/layout/BackgroundScene";
import DataInputField from "../components/layout/DataInputField";
import SnapshotEvolutionTimeline from "../components/layout/SnapshotEvolutionTimeline";
import SchemaComparison from "../components/layout/MetadataComparison";
import MetadataOverviewTable from "../components/layout/MetadataOverviewTable"; // Add this import
import Loader from "../components/common/Loader";

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showDetails, setShowDetails] = useState(false); // New state to control visibility

  const handleFetch = () => {
    setIsLoading(true);
    // Simulate an async fetch (replace with your actual API call)
    setTimeout(() => {
      setIsLoading(false);
      setShowDetails(true); // Show details after fetch
    }, 1000); // Simulated delay
    // Example with axios:
    // axios.post(...).then(() => {
    //   setIsLoading(false);
    //   setShowDetails(true);
    // }).catch(() => {
    //   setIsLoading(false);
    // });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen w-screen bg-[#090012] flex overflow-x-hidden">
      {/* Sidebar Toggle Button */}
      <motion.button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[60] bg-purple-600/30 hover:bg-purple-600/50 p-2 rounded-full backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isSidebarOpen ? <X className="text-white" /> : <Menu className="text-white" />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
            className="fixed left-0 top-0 bottom-0 z-50"
          >
            <AppSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Canvas */}
      <Canvas
        className="absolute inset-0 z-0 w-full h-full"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 5, 4]} intensity={1.5} />
        <pointLight position={[-3, -5, 4]} intensity={0.8} color="#d8b4fe" />
        <Stars radius={400} depth={90} count={5000} factor={6} fade />
        <BackgroundScene withSphere={false} />
      </Canvas>

      {/* Main Content */}
      <motion.div
        className="relative z-20 w-full flex flex-col"
        animate={{
          paddingLeft: isSidebarOpen ? "16rem" : "0",
          transition: { type: "tween" },
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <div className="w-full px-4 py-8 space-y-12 max-w-4xl mx-auto">
            {/* Data Input Section */}
            <section className="pt-16">
              <h2 className="text-2xl font-bold text-white mb-4">Data Input</h2>
              <DataInputField onFetch={handleFetch} />
            </section>

            {/* Show details only after fetch */}
            {showDetails && (
              <>
                {/* Metadata Overview Section */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Metadata Overview
                  </h2>
                  <div className = "p-2"><MetadataOverviewTable /></div>
                </section>

                {/* Snapshot Evolution Timeline Section */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Timeline</h2>
                  <SnapshotEvolutionTimeline />
                </section>

                {/* Schema Comparison Section */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Schema Comparison
                  </h2>
                  <SchemaComparison />
                </section>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;