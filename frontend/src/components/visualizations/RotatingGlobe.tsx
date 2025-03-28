import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

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

export default RotatingGlobe;