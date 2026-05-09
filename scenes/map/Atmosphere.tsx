"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { SceneColors } from "@/lib/useThemeColors";

/**
 * Drifting particle field, distant fog, and a hovering "moon" disc.
 * Adds the soft cinematic atmosphere without expensive volumetrics.
 */
export function Atmosphere({ colors }: { colors: SceneColors }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const N = 320;
    const pos = new Float32Array(N * 3);
    const s = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = 4 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3 + 0] = Math.cos(theta) * r;
      pos[i * 3 + 1] = 0.4 + Math.random() * 3.2;
      pos[i * 3 + 2] = Math.sin(theta) * r;
      s[i] = Math.random() * 0.04 + 0.01;
    }
    return { positions: pos, sizes: s };
  }, []);

  useFrame((state, dt) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] += dt * 0.04 * (0.5 + sizes[i / 3]);
      if (arr[i + 1] > 4.5) arr[i + 1] = 0.2;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += dt * 0.01;
  });

  return (
    <group>
      {/* Drifting embers / pollen */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={colors["--scene-particle"] || "#fff5d4"}
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          fog={false}
        />
      </points>
    </group>
  );
}
