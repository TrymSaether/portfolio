"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { buildRoverCurve } from "./topography";

/**
 * Tiny low-poly rover that travels along the loop curve between stations.
 * Built procedurally from primitives — no external GLB needed for v1.
 */
export function Rover({ speed = 0.025 }: { speed?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const beaconRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => buildRoverCurve(), []);
  const t = useRef(0);

  useFrame((state, dt) => {
    if (!groupRef.current) return;

    t.current = (t.current + dt * speed) % 1;
    const p = curve.getPointAt(t.current);
    const lookAhead = curve.getPointAt((t.current + 0.005) % 1);
    groupRef.current.position.copy(p);
    groupRef.current.position.y += 0.06;
    groupRef.current.lookAt(lookAhead.x, p.y + 0.06, lookAhead.z);

    wheelRefs.current.forEach((w) => {
      if (w) w.rotation.x += dt * 6;
    });

    if (beaconRef.current) {
      const t2 = state.clock.elapsedTime;
      (beaconRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.65 + Math.sin(t2 * 6) * 0.3;
    }
  });

  const chassisMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d6dceb",
        roughness: 0.4,
        metalness: 0.55,
      }),
    [],
  );
  const accent = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f3c66b",
        emissive: "#f3c66b",
        emissiveIntensity: 1.2,
        roughness: 0.3,
        metalness: 0.5,
      }),
    [],
  );
  const tire = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f1523",
        roughness: 0.85,
      }),
    [],
  );

  return (
    <group ref={groupRef}>
      {/* Chassis */}
      <mesh material={chassisMat} castShadow>
        <boxGeometry args={[0.34, 0.1, 0.22]} />
      </mesh>
      {/* Cabin */}
      <mesh material={chassisMat} position={[-0.04, 0.08, 0]} castShadow>
        <boxGeometry args={[0.18, 0.08, 0.18]} />
      </mesh>
      {/* Antenna mast */}
      <mesh material={accent} position={[0.1, 0.16, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.18, 6]} />
      </mesh>
      {/* Antenna beacon */}
      <mesh ref={beaconRef} position={[0.1, 0.27, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#f3c66b" transparent opacity={0.9} toneMapped={false} />
      </mesh>
      {/* Headlight cone */}
      <mesh material={accent} position={[0.18, 0.0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.05, 0.06, 12]} />
      </mesh>

      {/* Wheels */}
      {[
        [-0.12, -0.05, 0.12],
        [0.12, -0.05, 0.12],
        [-0.12, -0.05, -0.12],
        [0.12, -0.05, -0.12],
      ].map(([x, y, z], i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) wheelRefs.current[i] = el;
          }}
          material={tire}
          position={[x, y, z]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
        </mesh>
      ))}

      {/* Faint dust trail / pointlight */}
      <pointLight color="#f3c66b" intensity={0.6} distance={1.4} decay={2} position={[0, 0.18, 0]} />
    </group>
  );
}
