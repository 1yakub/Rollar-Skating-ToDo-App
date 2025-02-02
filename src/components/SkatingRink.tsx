import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, Box, Stars } from '@react-three/drei';
import * as THREE from 'three';

export const SkatingRink = () => {
  const rinkRef = useRef<THREE.Group>(null);
  const decorRef = useRef<THREE.Group>(null);

  // Create a repeating pattern for the rink floor
  const floorPattern = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    // Create gradient background
    const gradient = context.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#4a90e2');
    gradient.addColorStop(1, '#357abd');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    // Add grid pattern
    context.strokeStyle = '#ffffff';
    context.lineWidth = 1;
    context.globalAlpha = 0.2;

    for (let i = 0; i < 256; i += 32) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, 256);
      context.stroke();
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(256, i);
      context.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (rinkRef.current) {
      rinkRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
    if (decorRef.current) {
      decorRef.current.rotation.y += 0.005;
      decorRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        mesh.position.y = Math.sin(state.clock.getElapsedTime() * 2 + i) * 0.2 - 1;
      });
    }
  });

  return (
    <>
      <Stars radius={50} depth={50} count={1000} factor={4} fade speed={1} />
      
      <group ref={rinkRef}>
        {/* Main rink floor */}
        <Plane
          args={[20, 20]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2, 0]}
        >
          <meshStandardMaterial
            map={floorPattern}
            metalness={0.2}
            roughness={0.1}
          />
        </Plane>

        {/* Rink borders with glow effect */}
        {[-10, 10].map((x) => (
          <Box
            key={`border-x-${x}`}
            args={[0.5, 1, 20]}
            position={[x, -1.5, 0]}
          >
            <meshStandardMaterial
              color="#e74c3c"
              metalness={0.3}
              roughness={0.2}
              emissive="#ff0000"
              emissiveIntensity={0.2}
            />
          </Box>
        ))}

        {[-10, 10].map((z) => (
          <Box
            key={`border-z-${z}`}
            args={[20, 1, 0.5]}
            position={[0, -1.5, z]}
          >
            <meshStandardMaterial
              color="#e74c3c"
              metalness={0.3}
              roughness={0.2}
              emissive="#ff0000"
              emissiveIntensity={0.2}
            />
          </Box>
        ))}

        {/* Decorative floating elements */}
        <group ref={decorRef}>
          {Array.from({ length: 20 }).map((_, i) => (
            <Box
              key={`decor-${i}`}
              args={[0.3, 0.3, 0.3]}
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
                metalness={0.8}
                roughness={0.2}
              />
            </Box>
          ))}
        </group>
      </group>

      {/* Dynamic lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4a90e2" />
      <pointLight position={[0, -10, 0]} intensity={0.2} color="#e74c3c" />
    </>
  );
}; 