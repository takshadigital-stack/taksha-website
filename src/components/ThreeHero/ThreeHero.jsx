import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Lightformer, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------------------------------
// Core Taksha Shape (Yellow with Black Extrusion and Ivory internal)
// ----------------------------------------------------------------------------
function TakshaShape(props) {
  const meshRef = useRef();
  
  // Custom hexagonal shape loosely inspired by the Taksha Nexus SVG
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const size = 1.8;
    s.moveTo(size * Math.cos(0), size * Math.sin(0));
    for (let i = 1; i <= 6; i++) {
      const angle = (i * Math.PI) / 3;
      s.lineTo(size * Math.cos(angle), size * Math.sin(angle));
    }
    
    // Hole in the middle
    const hole = new THREE.Path();
    const holeSize = 0.8;
    hole.moveTo(holeSize * Math.cos(0), holeSize * Math.sin(0));
    for (let i = 1; i <= 6; i++) {
      const angle = (i * Math.PI) / 3;
      hole.lineTo(holeSize * Math.cos(angle), holeSize * Math.sin(angle));
    }
    s.holes.push(hole);
    
    return s;
  }, []);

  const extrudeSettings = {
    steps: 2,
    depth: 0.6,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 4,
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(t / 2) * 0.2;
    meshRef.current.rotation.x = Math.cos(t / 2) * 0.1;
  });

  return (
    <group {...props} ref={meshRef}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial 
          color="#FFB800" 
          roughness={0.2} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Black backing for contrast (Neo-Brutalist effect) */}
      <mesh castShadow position={[0, 0, -0.1]}>
        <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.8, bevelSize: 0.15 }]} />
        <meshStandardMaterial 
          color="#0F0F0F" 
          roughness={0.6}
          metalness={0.5}
        />
      </mesh>
      
      {/* Ivory core */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.7, 0.7, 0.8, 6]} />
        <meshStandardMaterial color="#F4F1EA" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// Floating Accents
// ----------------------------------------------------------------------------
function FloatingAccents() {
  return (
    <>
      {/* Small Box */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[2.5, 1.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#0F0F0F" />
        </mesh>
      </Float>
      
      {/* Small Yellow Sphere */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1} position={[-2, 2, 1]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#FFB800" roughness={0.1} metalness={0.1} />
        </mesh>
      </Float>
      
      {/* Ivory Torus */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5} position={[2, -1.5, 1]}>
        <mesh castShadow receiveShadow>
          <torusGeometry args={[0.4, 0.1, 16, 32]} />
          <meshStandardMaterial color="#F4F1EA" />
        </mesh>
      </Float>
      
      {/* Mint Accent Card */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1} position={[-2.5, -1, 0.5]}>
        <mesh castShadow receiveShadow rotation={[0.2, 0.4, 0]}>
          <boxGeometry args={[0.8, 0.6, 0.1]} />
          <meshStandardMaterial color="#A7E4D0" />
        </mesh>
      </Float>
    </>
  );
}

// ----------------------------------------------------------------------------
// Main Scene
// ----------------------------------------------------------------------------
export default function ThreeHero({ prefersReducedMotion }) {
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }} style={{ pointerEvents: 'auto' }}>
        <ambientLight intensity={0.5} />
        <directionalLight 
          castShadow 
          position={[5, 10, 5]} 
          intensity={1.5} 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Adds realistic reflections to give the "Claymorphic/Premium" look */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.5, 1]} />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
          </group>
        </Environment>

        {/* PresentationControls gives that slight mouse-reactive parallax */}
        <PresentationControls 
          global 
          config={{ mass: 2, tension: 500 }} 
          snap={{ mass: 4, tension: 1500 }} 
          rotation={[0, 0.3, 0]} 
          polar={[-Math.PI / 3, Math.PI / 3]} 
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <TakshaShape position={[0, 0, 0]} />
          <FloatingAccents />
        </PresentationControls>

        {/* Soft shadow under the object */}
        <ContactShadows position={[0, -3.5, 0]} opacity={0.65} scale={15} blur={2.5} far={4} />
      </Canvas>
    </div>
  );
}
