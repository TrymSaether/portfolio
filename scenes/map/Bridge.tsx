"use client";

import { useMemo } from "react";
import * as THREE from "three";
import {
  BRIDGE_EDGE,
  OCEAN_LEVEL,
  parkedWorldPos,
  elevation,
} from "./topography";

/**
 * Renders a small wooden-plank bridge spanning the central water along the
 * designated BRIDGE_EDGE. Sits exactly where the route's middle knots are,
 * so the path appears to be carried by the bridge.
 */
export function Bridge() {
  const { transform, span, deckY } = useMemo(() => {
    const a = parkedWorldPos(BRIDGE_EDGE[0]);
    const b = parkedWorldPos(BRIDGE_EDGE[1]);
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const fullLen = Math.hypot(dx, dz);
    // Only span the portion that's actually over water. Sample along the line
    // and find the first/last point below sea + small margin.
    const N = 60;
    let firstWater = -1;
    let lastWater = -1;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const x = a.x + dx * u;
      const z = a.z + dz * u;
      if (elevation(x, z) < OCEAN_LEVEL + 0.02) {
        if (firstWater === -1) firstWater = u;
        lastWater = u;
      }
    }
    if (firstWater === -1) {
      // No water on this edge after all — fall back to mid-edge span.
      firstWater = 0.4;
      lastWater = 0.6;
    }
    // Pad slightly so the bridge meets dry ground.
    firstWater = Math.max(0, firstWater - 0.05);
    lastWater = Math.min(1, lastWater + 0.05);
    const u0 = firstWater;
    const u1 = lastWater;
    const cx = a.x + dx * (u0 + u1) * 0.5;
    const cz = a.z + dz * (u0 + u1) * 0.5;
    const len = fullLen * (u1 - u0);
    const angle = Math.atan2(dz, dx);
    const t = new THREE.Matrix4();
    t.makeRotationY(-angle);
    t.setPosition(new THREE.Vector3(cx, 0, cz));
    return { transform: t, span: len, deckY: OCEAN_LEVEL + 0.28 };
  }, []);

  const deckColor = "#a8814a";
  const pillarColor = "#3a2c1a";
  const railColor = "#f3c66b";

  // Pillar positions along the deck (in local x, deck runs along x axis).
  const pillarCount = Math.max(3, Math.round(span * 1.2));
  const pillarStep = span / (pillarCount - 1);

  return (
    <group matrixAutoUpdate={false} matrix={transform}>
      {/* Deck */}
      <mesh position={[0, deckY, 0]} castShadow receiveShadow>
        <boxGeometry args={[span, 0.04, 0.6]} />
        <meshStandardMaterial
          color={deckColor}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Plank seams — thin dark stripes across the deck */}
      {Array.from({ length: Math.round(span * 4) }).map((_, i, arr) => {
        const x = -span / 2 + (i + 0.5) * (span / arr.length);
        return (
          <mesh key={`plank-${i}`} position={[x, deckY + 0.021, 0]}>
            <boxGeometry args={[0.02, 0.002, 0.6]} />
            <meshStandardMaterial color="#241808" roughness={1} />
          </mesh>
        );
      })}

      {/* Pillars going into the water */}
      {Array.from({ length: pillarCount }).map((_, i) => {
        const x = -span / 2 + i * pillarStep;
        return (
          <group key={`pillar-${i}`} position={[x, 0, 0]}>
            <mesh position={[0, (OCEAN_LEVEL - 0.4 + deckY) / 2, 0.22]}>
              <cylinderGeometry
                args={[0.05, 0.06, deckY - (OCEAN_LEVEL - 0.4), 6]}
              />
              <meshStandardMaterial
                color={pillarColor}
                roughness={1}
                metalness={0}
              />
            </mesh>
            <mesh position={[0, (OCEAN_LEVEL - 0.4 + deckY) / 2, -0.22]}>
              <cylinderGeometry
                args={[0.05, 0.06, deckY - (OCEAN_LEVEL - 0.4), 6]}
              />
              <meshStandardMaterial
                color={pillarColor}
                roughness={1}
                metalness={0}
              />
            </mesh>
          </group>
        );
      })}

      {/* Railings — thin glowing rails on both sides */}
      <mesh position={[0, deckY + 0.09, 0.28]}>
        <boxGeometry args={[span, 0.012, 0.012]} />
        <meshStandardMaterial
          color={railColor}
          emissive={railColor}
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, deckY + 0.09, -0.28]}>
        <boxGeometry args={[span, 0.012, 0.012]} />
        <meshStandardMaterial
          color={railColor}
          emissive={railColor}
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Railing posts */}
      {Array.from({ length: pillarCount }).map((_, i) => {
        const x = -span / 2 + i * pillarStep;
        return (
          <group key={`post-${i}`} position={[x, deckY + 0.05, 0]}>
            <mesh position={[0, 0, 0.28]}>
              <boxGeometry args={[0.018, 0.1, 0.018]} />
              <meshStandardMaterial color={pillarColor} roughness={1} />
            </mesh>
            <mesh position={[0, 0, -0.28]}>
              <boxGeometry args={[0.018, 0.1, 0.018]} />
              <meshStandardMaterial color={pillarColor} roughness={1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
