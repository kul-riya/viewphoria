import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import AppSidebar from "../components/layout/AppSidebar";
import BackgroundScene from "../components/layout/BackgroundScene";
import DataInputField from "../components/layout/DataInputField";

const HomePage: React.FC = () => {
  const [fetch, setFetch] = useState(false);

  const handleFetch = () => {
    // Things to do 
    // Show a loader
    // Pass the Data to Backend in the RequestedFormat via Axios
    // Get the Requested Schema
    // Set the Schema to All the Components
  };

  return (
    <div className="relative h-screen w-screen bg-[#090012] flex overflow-hidden">

      <div className="w-64 fixed left-0 top-0 bottom-0 z-50">
        <AppSidebar />
      </div>

      {/* idk why the sphere still shows up*/}
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

      <div className="flex flex-row relative z-20 items-center justify-center">
        <div className="w-full max-w-4xl p-8">
          <DataInputField onFetch={handleFetch} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;