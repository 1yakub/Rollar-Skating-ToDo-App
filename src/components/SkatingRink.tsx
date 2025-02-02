import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, Box } from '@react-three/drei';
import * as THREE from 'three';

export const SkatingRink = () => {
  const rinkRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rinkRef.current) {
      rinkRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={rinkRef}>
      {/* Main rink floor */}
      <Plane
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2, 0]}
      >
        <meshStandardMaterial
          color="#4a90e2"
          metalness={0.2}
          roughness={0.1}
        />
      </Plane>

      {/* Rink borders */}
      {[-10, 10].map((x) => (
        <Box
          key={x}
          args={[0.5, 1, 20]}
          position={[x, -1.5, 0]}
        >
          <meshStandardMaterial
            color="#e74c3c"
            metalness={0.3}
            roughness={0.2}
          />
        </Box>
      ))}

      {[-10, 10].map((z) => (
        <Box
          key={z}
          args={[20, 1, 0.5]}
          position={[0, -1.5, z]}
        >
          <meshStandardMaterial
            color="#e74c3c"
            metalness={0.3}
            roughness={0.2}
          />
        </Box>
      ))}

      {/* Decorative elements */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Box
          key={i}
          args={[0.2, 0.2, 0.2]}
          position={[
            Math.sin(i * 1) * 8,
            Math.cos(i * 0.5) * 0.5 - 1,
            Math.cos(i * 1) * 8,
          ]}
        >
          <meshStandardMaterial
            color={`hsl(${(i * 20) % 360}, 70%, 60%)`}
            emissive={`hsl(${(i * 20) % 360}, 70%, 30%)`}
            emissiveIntensity={0.5}
          />
        </Box>
      ))}
    </group>
  );
}; 