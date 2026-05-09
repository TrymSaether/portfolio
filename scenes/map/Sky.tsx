"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { SceneColors } from "@/lib/useThemeColors";

/**
 * Cinematic backdrop: gradient dome, drifting starfield, and an aurora ribbon.
 * Cheap to render — all on a single inverted sphere + a points field + a plane.
 */
export function Sky({ colors, isLight }: { colors: SceneColors; isLight: boolean }) {
  return (
    <group>
      <Dome colors={colors} />
      {!isLight && <Stars count={520} radius={42} colors={colors} />}
      <Aurora colors={colors} />
    </group>
  );
}

function Dome({ colors }: { colors: SceneColors }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTop: { value: new THREE.Color(colors["--scene-sky-top"] || "#04060c") },
      uMid: { value: new THREE.Color(colors["--scene-sky-mid"] || "#0d1730") },
      uHorizon: { value: new THREE.Color(colors["--scene-sky-horizon"] || "#243a5c") },
      uGlow: { value: new THREE.Color(colors["--scene-glow"] || "#f3c66b") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTop.value.set(colors["--scene-sky-top"]);
    u.uMid.value.set(colors["--scene-sky-mid"]);
    u.uHorizon.value.set(colors["--scene-sky-horizon"]);
    u.uGlow.value.set(colors["--scene-glow"]);
  }, [colors]);

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[55, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          uniform vec3 uTop;
          uniform vec3 uMid;
          uniform vec3 uHorizon;
          uniform vec3 uGlow;
          varying vec3 vPos;
          void main() {
            float h = clamp(vPos.y / 50.0, -0.4, 1.0);
            vec3 col = mix(uHorizon, uMid, smoothstep(-0.05, 0.4, h));
            col = mix(col, uTop, smoothstep(0.4, 1.0, h));
            // Warm horizon ember
            float ember = exp(-pow(h * 6.0, 2.0));
            col += uGlow * ember * 0.18;
            // Slight directional tint where the sun/moon sits
            float dirX = vPos.x / length(vPos.xz + 0.0001);
            col += uGlow * 0.05 * smoothstep(0.4, 1.0, dirX) * (1.0 - h);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Stars({ count, radius, colors }: { count: number; radius: number; colors: SceneColors }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(1 - v * 1.4);
      const r = radius * (0.85 + Math.random() * 0.15);
      pos[i * 3 + 0] = Math.cos(theta) * Math.sin(phi) * r;
      pos[i * 3 + 1] = Math.cos(phi) * r;
      pos[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * r;
      s[i] = 0.04 + Math.random() * 0.18;
    }
    return { positions: pos, sizes: s };
  }, [count, radius]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.005;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.6 + Math.sin(t * 0.4) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color={colors["--scene-star"] || "#f6f1e6"}
        size={0.18}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </points>
  );
}

function Aurora({ colors }: { colors: SceneColors }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(colors["--scene-aurora-a"] || "#74c0c8") },
      uColorB: { value: new THREE.Color(colors["--scene-aurora-b"] || "#a78bf3") },
      uOpacity: { value: parseFloat(colors["--scene-aurora-opacity"] || "0.55") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uColorA.value.set(colors["--scene-aurora-a"]);
    u.uColorB.value.set(colors["--scene-aurora-b"]);
    u.uOpacity.value = parseFloat(colors["--scene-aurora-opacity"] || "0.55");
  }, [colors]);

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <mesh position={[0, 5, -22]} rotation={[0, 0, -0.05]}>
      <planeGeometry args={[60, 12, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
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
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uOpacity;
          varying vec2 vUv;

          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            vec2 u = f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                       mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y);
          }
          float fbm(vec2 p) {
            float v = 0.0; float a = 0.5;
            for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.05; a *= 0.5; }
            return v;
          }

          void main() {
            float t = uTime * 0.05;
            float ribbon = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
            float wave = sin(vUv.x * 6.0 + t * 2.0) * 0.06;
            float mask = smoothstep(0.45 + wave, 0.55 + wave, vUv.y) *
                         smoothstep(0.85 + wave, 0.6 + wave, vUv.y);
            float n = fbm(vec2(vUv.x * 3.0 + t, vUv.y * 4.0 - t * 0.6));
            float density = mask * (0.55 + 0.45 * n) * ribbon;
            vec3 col = mix(uColorA, uColorB, vUv.x + n * 0.4);
            gl_FragColor = vec4(col, density * uOpacity);
          }
        `}
      />
    </mesh>
  );
}
