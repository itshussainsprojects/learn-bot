import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, Trail, useTexture } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

interface OrbProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  distort?: number;
  size?: number;
  emissive?: string;
}

function AnimatedOrb({ position, color, speed = 1, distort = 0.4, size = 1, emissive }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPosition = useMemo(() => position, [position]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = initialPosition[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.position.x = initialPosition[0] + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.3;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Trail
        width={2}
        length={4}
        color={color}
        attenuation={(t) => t * t}
      >
        <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={distort}
            speed={2}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.85}
            emissive={emissive || color}
            emissiveIntensity={0.3}
          />
        </Sphere>
      </Trail>
    </Float>
  );
}

function GlowingSphere({ position, color, size = 0.3 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

function FloatingRing({ position, color, size = 1.5 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1} rotationIntensity={2} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[size, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Random cyan or purple colors
      const isCyan = Math.random() > 0.5;
      colors[i * 3] = isCyan ? 0 : 0.66;
      colors[i * 3 + 1] = isCyan ? 0.96 : 0.33;
      colors[i * 3 + 2] = isCyan ? 1 : 0.97;
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00f5ff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
      <pointLight position={[0, 10, 0]} intensity={1.5} color="#ff6b6b" />
      <pointLight position={[5, -5, 5]} intensity={0.8} color="#00ff88" />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Main animated orbs with trails */}
      <AnimatedOrb position={[-4, 2, -3]} color="#00f5ff" emissive="#00f5ff" speed={0.8} distort={0.5} size={1.5} />
      <AnimatedOrb position={[4, -1, -4]} color="#a855f7" emissive="#a855f7" speed={0.6} distort={0.4} size={1.2} />
      <AnimatedOrb position={[0, 1, -5]} color="#ff6b6b" emissive="#ff6b6b" speed={0.7} distort={0.3} size={0.9} />
      <AnimatedOrb position={[-3, -3, -3]} color="#00ff88" emissive="#00ff88" speed={0.9} distort={0.6} size={0.7} />
      <AnimatedOrb position={[3, 3, -6]} color="#f59e0b" emissive="#f59e0b" speed={0.5} distort={0.4} size={1.1} />

      {/* Floating rings */}
      <FloatingRing position={[-2, 0, -4]} color="#00f5ff" size={2} />
      <FloatingRing position={[2, 1, -5]} color="#a855f7" size={1.5} />
      <FloatingRing position={[0, -1, -3]} color="#ff6b6b" size={1.2} />

      {/* Glowing particles */}
      <GlowingSphere position={[-5, 3, -2]} color="#00f5ff" size={0.15} />
      <GlowingSphere position={[5, -2, -3]} color="#a855f7" size={0.12} />
      <GlowingSphere position={[-3, -2, -1]} color="#ff6b6b" size={0.1} />
      <GlowingSphere position={[4, 2, -2]} color="#00ff88" size={0.18} />
      <GlowingSphere position={[0, 4, -3]} color="#f59e0b" size={0.14} />
      <GlowingSphere position={[-4, 0, -2]} color="#00f5ff" size={0.08} />
      <GlowingSphere position={[3, -3, -4]} color="#a855f7" size={0.11} />

      {/* Particle field */}
      <ParticleField />
    </>
  );
}

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
