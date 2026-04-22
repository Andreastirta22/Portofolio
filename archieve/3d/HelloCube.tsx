"use client";

import { Text } from "@react-three/drei";

export default function HelloCube({
  position = [0, 0, 0],
  text = "HELLO",
  color = "#ffffff",
}) {
  return (
    <group position={position as any} rotation={[0.5, -0.6, 0] as any}>
      {/* BOX */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* FRONT TEXT */}
      <Text
        position={[0, 0, 0.51]}
        fontSize={0.3}
        color={color === "#ffffff" ? "black" : "white"}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>

      {/* RIGHT TEXT */}
      <Text
        position={[1.01, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.25}
        color={color === "#ffffff" ? "black" : "white"}
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}
