import React, { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Stars, 
  Points, 
  PointMaterial,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import * as THREE from "three";
import axios from "axios";

const FloatingParticles = React.memo(() => {
    const particlesRef = useRef<THREE.Points>(null);
    const particlePositions = useMemo(() => 
        new Float32Array(3000).fill(0).map(() => (Math.random() - 0.5) * 50),
        []
    );

    useFrame(({ clock }) => {
        if(particlesRef.current) {
            particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02;
        }
    });
    return (
        <Points ref={particlesRef} positions={particlePositions}>
            <PointMaterial color="#d8b4fe" size={0.08} sizeAttenuation transparent opacity={0.7} />
        </Points>
    );
});

const RotatingGlobe = React.memo(() => {
    const globeRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if(globeRef.current) {
            globeRef.current.rotation.y += 0.001;
        }
    });

    return (
        <mesh ref={globeRef} position={[0, 0, -12]} scale={1.3}>
            <sphereGeometry args={[3, 64, 64]} />
            <meshStandardMaterial
                color="#b04fe8"
                wireframe
                opacity={1}
                transparent={true}
                emissive="6a0dad"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
});

// Memoized Background Scene
const BackgroundScene = React.memo(() => {
    return (
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
    );
});

const AuthPage: React.FC = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL = "http://127.0.0.1:8000";

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (!isLogin && (!username || password.length < 8)) {
      setError('Username is required and password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  // Login Handler
  const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token); // Store token for future requests
      return { success: true, message: "Login successful", user };
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  // Signup Handler
  const signupUser = async (email: string, password: string, username: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        password,
        username,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      return { success: true, message: "Signup successful", user };
    } catch (error) {
      return { success: false, message: "Signup failed" };
    }
  };

  const handleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const response = await loginUser(email, password);
        if (response.success) {
          navigate('/home');
        } else {
          setError(response.message);
        }
      } else {
        const response = await signupUser(email, password, username);
        if (response.success) {
          navigate('/home');
        } else {
          setError(response.message);
        }
      }
    } catch (err) {
      setError('Error Occured');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 0.5, 
        type: "spring", 
        stiffness: 100 
      } 
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#090012] flex items-center justify-center overflow-hidden">
      <Canvas 
        className="absolute inset-0 z-0 w-full h-full"
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 5, 4]} intensity={1.5} />
        <pointLight position={[-3, -5, 4]} intensity={0.8} color="#d8b4fe" />
        <Stars radius={400} depth={90} count={5000} factor={6} fade />
        <BackgroundScene />
      </Canvas>

      <motion.div 
        className="relative z-10 w-full max-w-md p-8 bg-[#1a0e2c] rounded-2xl shadow-2xl bg-opacity-80 backdrop-blur-lg border border-purple-900/30 transition-all duration-300 ease-in-out hover:shadow-purple-900/50 hover:shadow-2xl hover:scale-[1.02]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            <Typewriter 
              words={[isLogin ? 'Welcome Back' : 'Create Account']}
              cursor
              cursorStyle="_"
              typeSpeed={70}
            />
          </h1>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-500 text-red-300 p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        {/* Auth form and stuff starts here*/}
        <form onSubmit={handleAuthentication} className="space-y-6">
          {!isLogin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-purple-200">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-[#2a1642] border border-purple-800/50 rounded-md text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Choose a username"
                required
              />
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-purple-200">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-[#2a1642] border border-purple-800/50 rounded-md text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-purple-200">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 pr-10 bg-[#2a1642] border border-purple-800/50 rounded-md text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
              >
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-purple-300">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setUsername('');
              }}
              className="text-pink-500 hover:text-pink-400 font-semibold transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;