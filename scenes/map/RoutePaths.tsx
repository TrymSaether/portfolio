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
 * – Inactive paths render as warm dashed contour-style lines, always visible.
 * – When the camera is flying to a destination, the path between the parked
 *   station and the destination glows with the destination's accent color.
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

function NetworkLines({ edges }: { edges: PathEdge[] }) {
  const matRefs = useRef<THREE.ShaderMaterial[]>([]);

  useFrame((state) => {
    matRefs.current.forEach((m) => {
      if (m) m.uniforms.uTime.value = state.clock.elapsedTime;
    });
  });

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
                uColor: { value: new THREE.Color("#d4a560") },
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
                  float dash = step(0.5, fract(vUv.x * 50.0 - uTime * 0.05));
                  float edge = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
                  float alpha = (0.22 + dash * 0.22) * edge;
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

function ActivePath({ edges }: { edges: PathEdge[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const tubeRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const lastKey = useRef<string | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#fff5d4") },
      uIntensity: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const store = useSceneStore.getState();
    const t = state.clock.elapsedTime;
    if (matRef.current) matRef.current.uniforms.uTime.value = t;

    if (store.mode !== "flying" || store.toStationIndex === null) {
      // Fade out
      uniforms.uIntensity.value = THREE.MathUtils.lerp(
        uniforms.uIntensity.value,
        0,
        0.1,
      );
      groupRef.current.visible = uniforms.uIntensity.value > 0.01;
      return;
    }

    const fromIndex = store.parkedStationIndex;
    const toIndex = store.toStationIndex;
    const edge = findEdge(edges, fromIndex, toIndex);
    if (!edge) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;
    const reversed = edge.fromIndex !== fromIndex;
    const key = `${edge.fromIndex}-${edge.toIndex}-${reversed ? "r" : "f"}`;

    if (lastKey.current !== key && tubeRef.current) {
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
    }

    // Smooth fade-in
    uniforms.uIntensity.value = THREE.MathUtils.lerp(
      uniforms.uIntensity.value,
      1,
      0.12,
    );
    uniforms.uColor.value.set(stations[toIndex].palette.accent);
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh ref={tubeRef} renderOrder={3}>
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
            uniform float uIntensity;
            varying vec2 vUv;
            void main() {
              // Fast-moving dashes signal "active route"
              float dash = step(0.4, fract(vUv.x * 80.0 - uTime * 1.4));
              float edge = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
              // Soft pulse riding from start toward end
              float head = fract(uTime * 0.6);
              float pulse = exp(-pow((vUv.x - head) * 8.0, 2.0));
              float alpha = ((0.55 + dash * 0.35) + pulse * 0.7) * edge * uIntensity;
              gl_FragColor = vec4(uColor + vec3(pulse) * 0.35, alpha);
            }
          `}
        />
      </mesh>
    </group>
  );
}
