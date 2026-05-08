"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { buildRoverCurve } from "./topography";

/**
 * Glowing route between stations. Two layers:
 *  – a base dashed shader-tube that gives a hand-drawn look,
 *  – a few "data packets" sliding along to suggest live movement.
 */
export function RoutePaths() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const PACKET_COUNT = 4;
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);

  const { tubeGeometry, curve } = useMemo(() => {
    const c = buildRoverCurve();
    const tube = new THREE.TubeGeometry(c, 800, 0.018, 6, true);
    return { tubeGeometry: tube, curve: c };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#f3c66b") },
      uDashScale: { value: 80.0 },
    }),
    [],
  );

  useFrame((state, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
    const t = state.clock.elapsedTime;
    packetRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const u = ((t * 0.05) + i / PACKET_COUNT) % 1;
      const p = curve.getPointAt(u);
      const tg = curve.getTangentAt(u);
      mesh.position.copy(p).add(new THREE.Vector3(0, 0.04, 0));
      const lookAt = p.clone().add(tg);
      mesh.lookAt(lookAt.x, p.y + 0.04, lookAt.z);
    });
  });

  return (
    <group>
      <mesh geometry={tubeGeometry} renderOrder={2}>
        <shaderMaterial
          ref={matRef}
          transparent
          depthWrite={false}
          uniforms={uniforms}
          vertexShader={/* glsl */ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            uniform float uTime;
            uniform vec3 uColor;
            uniform float uDashScale;
            varying vec2 vUv;
            void main() {
              float u = vUv.x;
              // Moving dashed pattern
              float dash = step(0.5, fract(u * uDashScale - uTime * 0.4));
              // Soft edge
              float edge = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
              // Base intensity baseline
              float base = 0.45;
              float alpha = (base + dash * 0.45) * edge;
              gl_FragColor = vec4(uColor, alpha);
            }
          `}
        />
      </mesh>

      {/* Data packets */}
      {Array.from({ length: PACKET_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            packetRefs.current[i] = el;
          }}
          renderOrder={3}
        >
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial
            color="#fff5d4"
            transparent
            opacity={0.95}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
