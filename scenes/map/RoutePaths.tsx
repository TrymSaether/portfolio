"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { stations } from "@/content/stations";
import {
  buildAllPaths,
  findEdge,
  type PathEdge,
} from "./topography";
import { useSceneStore } from "./sceneStore";

/**
 * Network of every pair-wise path between stations.
 * – Inactive paths render as dim, dashed contour-style lines.
 * – The active path (between parked station and destination) renders bright,
 *   with a moving highlight chasing the rover along it.
 */
export function RoutePaths() {
  const allPaths = useMemo(() => buildAllPaths(), []);

  return (
    <group>
      <NetworkLines edges={allPaths} />
      <ActivePath edges={allPaths} />
    </group>
  );
}

interface NetworkLinesProps {
  edges: PathEdge[];
}

function NetworkLines({ edges }: NetworkLinesProps) {
  const matRefs = useRef<THREE.ShaderMaterial[]>([]);

  useFrame((state) => {
    matRefs.current.forEach((m) => {
      if (m) m.uniforms.uTime.value = state.clock.elapsedTime;
    });
  });

  // One mesh per edge — small count (15 for 6 stations) so this is fine.
  return (
    <group>
      {edges.map((edge, i) => {
        const tube = new THREE.TubeGeometry(edge.curve, 80, 0.012, 5, false);
        return (
          <mesh key={`${edge.fromIndex}-${edge.toIndex}`} geometry={tube} renderOrder={2}>
            <shaderMaterial
              ref={(el) => {
                if (el) matRefs.current[i] = el;
              }}
              transparent
              depthWrite={false}
              uniforms={{
                uTime: { value: 0 },
                uColor: { value: new THREE.Color("#a7b3cd") },
              }}
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
                varying vec2 vUv;
                void main() {
                  // Soft dashes that drift slowly
                  float dash = step(0.5, fract(vUv.x * 50.0 - uTime * 0.05));
                  // Soft tube edge
                  float edge = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
                  float alpha = (0.18 + dash * 0.18) * edge;
                  gl_FragColor = vec4(uColor, alpha);
                }
              `}
            />
          </mesh>
        );
      })}
    </group>
  );
}

interface ActivePathProps {
  edges: PathEdge[];
}

function ActivePath({ edges }: ActivePathProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tubeRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Current geometry, rebuilt when the active edge changes
  const lastKey = useRef<string | null>(null);
  const lastReversed = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#f3c66b") },
      uProgress: { value: 0 }, // 0..1, how far the rover has driven
      uReversed: { value: 0 }, // 1 if we should flip dir along uv.x
    }),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const store = useSceneStore.getState();
    const t = state.clock.elapsedTime;
    if (matRef.current) matRef.current.uniforms.uTime.value = t;

    const driving = store.mode === "driving";
    const arriving = store.mode === "arriving";

    // Determine which edge to highlight: from parked → toStation while driving,
    // or simply hide on parked.
    if (!driving && !arriving) {
      groupRef.current.visible = false;
      return;
    }

    const fromIndex = store.parkedStationIndex;
    const toIndex = store.toStationIndex;
    if (toIndex === null) {
      groupRef.current.visible = false;
      return;
    }
    const edge = findEdge(edges, fromIndex, toIndex);
    if (!edge) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;
    const reversed = edge.fromIndex !== fromIndex;
    const key = `${edge.fromIndex}-${edge.toIndex}-${reversed ? "r" : "f"}`;

    if (lastKey.current !== key && tubeRef.current) {
      // Build a fresh, fatter tube along the directional curve
      const points = reversed
        ? [...edge.curve.points].reverse()
        : edge.curve.points;
      const dirCurve = new THREE.CatmullRomCurve3(
        points,
        false,
        "catmullrom",
        0.4,
      );
      const tube = new THREE.TubeGeometry(dirCurve, 160, 0.024, 6, false);
      tubeRef.current.geometry.dispose();
      tubeRef.current.geometry = tube;
      lastKey.current = key;
      lastReversed.current = reversed;
    }

    // Update progress based on phase
    const now = performance.now() / 1000;
    if (driving) {
      const u = Math.min(1, (now - store.phaseStart) / store.driveDuration);
      // ease — match Rover's ease so highlight travels with the rover
      const eased = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      uniforms.uProgress.value = eased;
    } else if (arriving) {
      uniforms.uProgress.value = 1;
    }

    // Tint the active path with the destination station's accent
    const accent = stations[toIndex].palette.accent;
    uniforms.uColor.value.set(accent);
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh ref={tubeRef} renderOrder={3}>
        {/* Placeholder geometry; replaced when an edge becomes active */}
        <bufferGeometry />
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
            uniform float uProgress;
            varying vec2 vUv;
            void main() {
              float u = vUv.x;
              // Trail behind the rover: full intensity up to progress, then fade
              float driven = smoothstep(uProgress + 0.04, uProgress, u);
              // Pulse riding the leading edge
              float pulse = exp(-pow((u - uProgress) * 14.0, 2.0));
              // Animated dashes within the driven part
              float dash = step(0.4, fract(u * 70.0 - uTime * 1.2));
              float edge = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
              float base = driven * (0.45 + dash * 0.35);
              float alpha = (base + pulse * 0.95) * edge;
              vec3 col = uColor + vec3(pulse) * 0.3;
              gl_FragColor = vec4(col, alpha);
            }
          `}
        />
      </mesh>
    </group>
  );
}
