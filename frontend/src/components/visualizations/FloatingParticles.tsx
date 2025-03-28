import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { 
  Points, 
  PointMaterial
} from "@react-three/drei";
;
import * as THREE from "three";


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


export default FloatingParticles;