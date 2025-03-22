import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Stars, 
  Points, 
  PointMaterial
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import * as THREE from "three";
import { FaGithub, FaLinkedin } from "react-icons/fa";

// Floating particles in the sky
const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={particlesRef} positions={new Float32Array(3000).fill(0).map(() => (Math.random() - 0.5) * 50)}>
      <PointMaterial color="#d8b4fe" size={0.08} sizeAttenuation transparent opacity={0.7} />
    </Points>
  );
};

// This is the globe that rotates hehe..
const RotatingGlobe = () => {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={globeRef} position={[0, 0, -12]} scale={1}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial 
        color="#db0d78" 
        wireframe 
        opacity={0.5} 
        transparent 
        emissive="#6a0dad"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const OnBoarding: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is just to simulate loading and render the backend components properly for all devices and configurations!!
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-[#090012] flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence>
        {isLoading ? (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#090012]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-purple-600 border-purple-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="ml-3 sm:ml-4 text-base sm:text-xl text-white font-light">Loading Experience</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Canvas className="absolute inset-0 z-0">
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 5, 4]} intensity={1.5} />
        <pointLight position={[-3, -5, 4]} intensity={0.8} color="#d8b4fe" />
        <Stars radius={400} depth={90} count={5000} factor={6} fade />
        <Suspense fallback={null}>
          <RotatingGlobe />
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.8} 
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
          />
          <Sphere args={[2, 64, 64]} scale={3.5}>
            <MeshDistortMaterial 
              color="#6a0dad" 
              emissive="#8b5cf6" 
              emissiveIntensity={0.5} 
              distort={0.5} 
              speed={1} 
            />
          </Sphere>
          <FloatingParticles />
        </Suspense>
      </Canvas>

      <div className="absolute w-60 h-60 sm:w-80 sm:h-80 bg-purple-500 opacity-20 blur-[140px] rounded-full top-1/4 left-1/4 sm:left-1/3"></div>
      <div className="absolute w-60 h-60 sm:w-96 sm:h-96 bg-pink-500 opacity-20 blur-[120px] rounded-full bottom-1/4 right-1/4"></div>

      <motion.div
        className="z-10 flex flex-col items-center text-center absolute px-4 sm:px-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: isLoading ? 2 : 0 }}
      >
        <motion.div className="overflow-hidden relative mb-2">
          <motion.div
            className="h-1 w-24 sm:w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"
            animate={{ 
              x: ["-100%", "100%"],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "linear"
            }}
          />
        </motion.div>
        
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-2xl tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: isLoading ? 2.2 : 0.2 }}
        >
          Welcome to
          <Typewriter 
            words={[" Viewphoria", " The Future"]} 
            loop 
            cursor 
            cursorStyle="_" 
            typeSpeed={60} 
            deleteSpeed={50} 
            delaySpeed={4000} 
          />
        </motion.h1>
        
        <motion.p 
          className="text-base sm:text-lg md:text-2xl text-gray-300 mt-3 sm:mt-4 max-w-xs sm:max-w-md md:max-w-2xl leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: isLoading ? 2.4 : 0.4 }}
        >
          Step into a revolutionary metastore viewing experience, 
          <span className="text-purple-400"> powered by next-gen technology</span> that redefines digital exploration.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: isLoading ? 2.6 : 0.6 }}
        >
          <motion.button
            className="px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:cursor-pointer hover:to-purple-900 text-white text-base sm:text-lg font-semibold tracking-wide rounded-full shadow-xl transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(147, 51, 234, 0.5)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/home")}
          >
            <span>Get Started</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </motion.div>
        
        {/* Live users indicator */}
        <motion.div 
          className="mt-8 sm:mt-12 flex items-center space-x-3 sm:space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: isLoading ? 3 : 1 }}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-xs sm:text-sm">Multiple Users Online</span>
        </motion.div>
      </motion.div>
      
      <DeveloperLinks isLoading={isLoading} />
    </div>
  );
};

function DeveloperLinks({ isLoading }: { isLoading: boolean }) {
  return (
    <motion.div 
      className="absolute bottom-4 sm:bottom-6 flex flex-col items-center text-white text-sm px-4 sm:px-0 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.9 }}
      transition={{ duration: 1, delay: isLoading ? 3 : 1 }}
    >
      <p className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Meet the Developers
      </p>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-1 sm:mt-2">
        {[
          { name: "Aryan Mehta", github: "https://github.com/arymehta", linkedin: "https://www.linkedin.com/in/aryan-mehta-858715276/"},
          { name: "Aman Morghade", github: "https://github.com/xaman27x", linkedin: "https://www.linkedin.com/in/amanmorghade/"},
          { name: "Riya Kulkarni", github: "https://github.com/kul-riya", linkedin: "https://www.linkedin.com/in/riya-ashutosh-kulkarni/"},
          { name: "Hardik Mutha", github: "https://github.com/HardikMutha", linkedin: "https://www.linkedin.com/in/hardik-mutha08/"},
        ].map((dev) => (
          <motion.div
            key={dev.name}
            className="group bg-purple-900/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-purple-800/30 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <p className="font-medium text-xs sm:text-sm">{dev.name}</p>
            <div className="flex space-x-2 sm:space-x-3 mt-1 justify-center">
              <a
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <FaGithub className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
              <a
                href={dev.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <FaLinkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default OnBoarding;