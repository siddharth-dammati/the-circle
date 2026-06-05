"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

function ParticleHeart() {
  const ref = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const { positions, colors } = useMemo(() => {
    const positions = [];
    const colors = [];
    const colorA = new THREE.Color("#22C55E"); // Green
    const colorB = new THREE.Color("#EC4899"); // Pink

    let i = 0;
    // Massive 20,000 particles
    while (i < 20000) {
      const x = (Math.random() - 0.5) * 3;
      const y = (Math.random() - 0.5) * 3;
      const z = (Math.random() - 0.5) * 3;

      const val = Math.pow(x * x + (9 / 4) * (z * z) + y * y - 1, 3) - (x * x) * (y * y * y) - (9 / 80) * (z * z) * (y * y * y);

      if (val < 0) {
        positions.push(x * 3, y * 3, z * 3); // Scale up massively

        const mixRatio = Math.max(0, Math.min(1, (x + 1) / 2));
        const mixedColor = colorA.clone().lerp(colorB, mixRatio);
        colors.push(mixedColor.r, mixedColor.g, mixedColor.b);

        i++;
      }
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Gentle automatic rotation
      ref.current.rotation.y += delta * 0.1;
      
      // Mouse interaction: Heart tilts towards cursor
      const targetRotationX = (mouse.y * Math.PI) / 8;
      const targetRotationY = (mouse.x * Math.PI) / 8;
      
      ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * 0.05;
      ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingNetwork() {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 30; i++) {
      pts.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 - 2));
    }
    return pts;
  }, []);

  return (
    <group>
      {points.map((p, i) => (
        <group key={i}>
          <mesh position={p}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#22C55E" : "#EC4899"} transparent opacity={0.6} />
          </mesh>
          {i > 0 && Math.random() > 0.5 && (
            <Line
              points={[p, points[Math.floor(Math.random() * i)]]}
              color="white"
              opacity={0.1}
              transparent
              lineWidth={1}
            />
          )}
        </group>
      ))}
    </group>
  );
}

function FloatingTags() {
  return (
    <>
      <Html position={[-4, 3, 0]} center className="pointer-events-none">
        <motion.div animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px", borderRadius: 100, color: "#22C55E", fontWeight: 600, fontSize: 16 }}>
          Study Partner 📚
        </motion.div>
      </Html>
      <Html position={[4, 2, 1]} center className="pointer-events-none">
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px", borderRadius: 100, color: "#EC4899", fontWeight: 600, fontSize: 16 }}>
          Relationship ❤️
        </motion.div>
      </Html>
      <Html position={[-3.5, -3, 1]} center className="pointer-events-none">
        <motion.div animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px", borderRadius: 100, color: "#F8FAFC", fontWeight: 600, fontSize: 16 }}>
          Friendship 🤝
        </motion.div>
      </Html>
      <Html position={[3.5, -2.5, 0]} center className="pointer-events-none">
        <motion.div animate={{ y: [0, -18, 0], rotate: [0, 3, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px", borderRadius: 100, color: "#F8FAFC", fontWeight: 600, fontSize: 16 }}>
          Networking 🚀
        </motion.div>
      </Html>
    </>
  );
}

export default function Hero3D() {
  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0, zIndex: 0, pointerEvents: "auto" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <ParticleHeart />
          <FloatingTags />
        </Float>
        <FloatingNetwork />
      </Canvas>
    </div>
  );
}
