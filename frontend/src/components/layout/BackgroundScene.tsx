import RotatingGlobe from "../visualizations/RotatingGlobe";
import FloatingParticles from "../visualizations/FloatingParticles";
import * as React from "react";
import { 
  OrbitControls,
  Sphere,
  MeshDistortMaterial 
} from "@react-three/drei";
import { Suspense } from "react";

interface BackgroundSceneProps {
  withSphere: boolean;
}

const BackgroundScene: React.FC<BackgroundSceneProps> = React.memo(({ withSphere }) => {
    return (
        <Suspense fallback={null}>
            {withSphere && <RotatingGlobe />}
            <OrbitControls 
                enableZoom={false} 
                autoRotate 
                autoRotateSpeed={0.8} 
                enablePan={false}
                minPolarAngle={Math.PI / 2.5}
                maxPolarAngle={Math.PI / 1.5}
            />
            {withSphere && (
                <Sphere args={[2, 64, 64]} scale={3.5}>
                    <MeshDistortMaterial 
                        color="#6a0dad" 
                        emissive="#8b5cf6" 
                        emissiveIntensity={0.5} 
                        distort={0.5} 
                        speed={1} 
                    />
                </Sphere>
            )}
            <FloatingParticles />
        </Suspense>
    );
});

export default BackgroundScene;
