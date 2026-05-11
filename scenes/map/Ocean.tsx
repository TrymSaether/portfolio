"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const OCEAN_LEVEL = -0.55;
const OCEAN_SIZE = 80;

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3  uDeep;
  uniform vec3  uShallow;
  uniform vec3  uHighlight;
  uniform float uIslandRadius;
  uniform float uVignette;

  varying vec3 vWorldPos;
  varying vec2 vUv;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vWorldPos.xz;
    float r = length(p);

    // Wave fields — two layered drifts at different speeds
    float w1 = fbm(p * 0.55 + vec2(uTime * 0.05, 0.0));
    float w2 = fbm(p * 1.2  + vec2(0.0, -uTime * 0.08));
    float waves = w1 * 0.65 + w2 * 0.35;

    // Depth tint — deeper as we move from the shore outward
    float shore = smoothstep(uIslandRadius * 0.9, uIslandRadius * 1.6, r);
    vec3 base = mix(uShallow, uDeep, shore);

    // Specular-ish shimmer where waves peak, biased toward the camera
    float crest = smoothstep(0.55, 0.85, waves);
    base += uHighlight * crest * (0.18 + 0.12 * (1.0 - shore));

    // Subtle gold streaks pointing along an arbitrary "current" direction
    float streak = sin(p.x * 0.35 + uTime * 0.08) * 0.5 + 0.5;
    streak *= smoothstep(0.4, 0.7, waves);
    base += uHighlight * streak * 0.06;

    // Soft contour rings at the underwater shelf — depth bands
    float band = fract(r * 0.7 - uTime * 0.04);
    float ring = smoothstep(0.96, 0.98, band) - smoothstep(0.98, 1.0, band);
    base += uHighlight * ring * 0.18 * (1.0 - shore);

    // Horizon vignette — fade water to scene fog at the edges
    float v = smoothstep(uIslandRadius * 4.5, uIslandRadius * 2.0, r);
    base *= mix(uVignette, 1.0, v);

    gl_FragColor = vec4(base, 1.0);
  }
`;

interface OceanProps {
  deep?: string;
  shallow?: string;
  highlight?: string;
  islandRadius?: number;
}

export function Ocean({
  deep = "#04080f",
  shallow = "#0c1a2a",
  highlight = "#f3c66b",
  islandRadius = 8.5,
}: OceanProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDeep: { value: new THREE.Color(deep) },
      uShallow: { value: new THREE.Color(shallow) },
      uHighlight: { value: new THREE.Color(highlight) },
      uIslandRadius: { value: islandRadius },
      uVignette: { value: 0.35 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((_, dt) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += dt;
    }
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, OCEAN_LEVEL, 0]}
      renderOrder={-1}
    >
      <planeGeometry args={[OCEAN_SIZE, OCEAN_SIZE, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
