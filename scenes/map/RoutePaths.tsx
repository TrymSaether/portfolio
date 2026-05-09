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
import { easeInOutCubic, useSceneStore } from "./sceneStore";

/**
 * Network of every pair-wise path between stations.
 * – Inactive paths render as warm dashed contour-style lines, always visible.
 * – When the camera is flying to a destination, the path between the parked
 *   station and the destination becomes a progressive dispatch stroke.
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
      uProgress: { value: 0 },
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
      uniforms.uProgress.value = THREE.MathUtils.lerp(
        uniforms.uProgress.value,
        0,
        0.08,
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
    const elapsed = performance.now() / 1000 - store.phaseStart;
    const progress = easeInOutCubic(Math.min(1, elapsed / store.flightDuration));
    uniforms.uProgress.value = THREE.MathUtils.lerp(
      uniforms.uProgress.value,
      progress,
      0.22,
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
            uniform float uProgress;
            varying vec2 vUv;
            void main() {
              float revealed = 1.0 - smoothstep(uProgress, uProgress + 0.045, vUv.x);
              float wake = smoothstep(uProgress - 0.16, uProgress, vUv.x) *
                (1.0 - smoothstep(uProgress, uProgress + 0.035, vUv.x));
              float dash = step(0.42, fract(vUv.x * 78.0 - uTime * 1.9));
              float edge = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.82, vUv.y);
              float head = exp(-pow((vUv.x - uProgress) * 30.0, 2.0));
              float trail = (0.3 + dash * 0.45 + wake * 0.75) * revealed;
              float alpha = (trail + head * 1.2) * edge * uIntensity;
              vec3 color = mix(uColor * 0.65, uColor + vec3(0.35), head + wake * 0.45);
              gl_FragColor = vec4(color, alpha);
            }
          `}
        />
      </mesh>
    </group>
  );
}
