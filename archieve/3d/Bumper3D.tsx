"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import HelloCube from "./HelloCube";

export default function Bumper3D() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows camera={{ position: [0, 2, 6], fov: 50 }}>
        {/* LIGHT */}
        <ambientLight intensity={0.4} />

        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

        {/* FLOOR */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>

        {/* STACK */}
        <HelloCube position={[0, 1.5, 0]} text="HELLO" color="#111111" />

        <HelloCube position={[-1.2, 0.8, 0]} text="こんにちは" />
        <HelloCube position={[1.2, 0.8, 0]} text="HALO" />

        <HelloCube position={[-1.3, 0, 0]} text="안녕하세요" />
        <HelloCube position={[1.3, 0, 0]} text="你好" />

        <HelloCube position={[0, -0.9, 0]} text="Bonjour" />

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
