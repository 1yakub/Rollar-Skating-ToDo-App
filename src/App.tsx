import { ChakraProvider, Box } from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SkatingRink } from './components/SkatingRink';
import { TodoList } from './components/TodoList';

function App() {
  return (
    <ChakraProvider>
      <Box height="100vh" width="100vw" position="relative">
        <Box position="absolute" top={0} left={0} width="100%" height="100%">
          <Canvas
            camera={{ position: [0, 5, 15], fov: 75 }}
            style={{ background: 'linear-gradient(to bottom, #2c3e50, #3498db)' }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <SkatingRink />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2.5}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        </Box>
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          pointerEvents="none"
        >
          <Box
            bg="rgba(255, 255, 255, 0.9)"
            borderRadius="xl"
            p={6}
            boxShadow="xl"
            maxWidth="800px"
            width="90%"
            pointerEvents="auto"
          >
            <TodoList />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
