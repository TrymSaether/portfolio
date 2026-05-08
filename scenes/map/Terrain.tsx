"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { TERRAIN_SEGMENTS, TERRAIN_SIZE, TERRAIN_HEIGHT } from "./topography";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uHeight;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vWorldPos;

  // Hash-based smooth noise (matches CPU mirror)
  float hash2(vec2 p) {
    return fract(sin(p.x * 127.1 + p.y * 311.7) * 43758.5453);
  }
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n00 = hash2(i);
    float n10 = hash2(i + vec2(1.0, 0.0));
    float n01 = hash2(i + vec2(0.0, 1.0));
    float n11 = hash2(i + vec2(1.0, 1.0));
    return mix(mix(n00, n10, u.x), mix(n01, n11, u.x), u.y) * 2.0 - 1.0;
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 1.0;
    float f = 1.0;
    float norm = 0.0;
    for (int i = 0; i < 5; i++) {
      v += a * smoothNoise(p * f);
      norm += a;
      a *= 0.5;
      f *= 2.05;
    }
    return v / norm;
  }

  float elevation(vec2 p) {
    float base = fbm(p * 0.18);
    float r2 = dot(p, p);
    float valley = exp(-r2 * 0.04) * 0.35;
    float ridge = sin(p.x * 0.35 + cos(p.y * 0.2) * 1.4) * 0.18;
    return (base * 1.1 - valley + ridge) * uHeight * 0.5;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float h = elevation(pos.xy);
    pos.z = h;
    vElevation = h;
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3  uLow;
  uniform vec3  uHigh;
  uniform vec3  uContour;
  uniform vec3  uGlow;
  uniform float uContourSpacing;
  uniform float uSize;

  varying vec2  vUv;
  varying float vElevation;
  varying vec3  vWorldPos;

  // Crisp contour band using fwidth — looks like a hand-drawn topo line
  float contour(float h, float spacing) {
    float f = fract(h / spacing);
    float d = min(f, 1.0 - f);
    float w = fwidth(h / spacing) * 1.2;
    return 1.0 - smoothstep(0.0, w, d);
  }

  // Geodesic-like grid that fades with elevation
  float grid(vec2 p, float scale) {
    vec2 g = abs(fract(p * scale) - 0.5);
    float line = min(g.x, g.y);
    float w = fwidth(p.x * scale);
    return 1.0 - smoothstep(0.0, w, line - 0.005);
  }

  // Subtle equation-text trail: dotted radial pattern
  float dots(vec2 p) {
    vec2 q = mod(p * 1.5, 1.0) - 0.5;
    return smoothstep(0.18, 0.16, length(q));
  }

  void main() {
    // Distance from center for radial fade-out (focus the eye on the map)
    vec2 center = (vUv - 0.5) * 2.0;
    float r = length(center);

    float t = clamp((vElevation + 1.2) / 2.4, 0.0, 1.0);

    vec3 base = mix(uLow, uHigh, smoothstep(0.05, 0.95, t));

    // Major + minor contour lines
    float major = contour(vElevation, uContourSpacing);
    float minor = contour(vElevation, uContourSpacing * 0.25) * 0.35;
    float lines = clamp(major + minor, 0.0, 1.0);
    base += uContour * lines * (0.7 + 0.3 * t);

    // Faint geodesic grid (math motif)
    float g = grid(vWorldPos.xz, 0.18) * 0.10;
    base += uContour * g * (1.0 - smoothstep(0.6, 1.0, r));

    // Equation-trail dots near valley
    float d = dots(vWorldPos.xz * 0.6) * 0.05;
    base += uGlow * d * (1.0 - smoothstep(0.0, 0.6, r));

    // Warm rim near peaks: simulated golden-hour highlight
    float rim = smoothstep(0.65, 0.95, t);
    base += uGlow * rim * 0.35;

    // Distance fog vignette toward edges
    float vignette = smoothstep(1.05, 0.55, r);
    base *= mix(0.45, 1.0, vignette);

    // Subtle time-driven shimmer along contour lines
    float shimmer = sin(vElevation * 8.0 - uTime * 0.6) * 0.5 + 0.5;
    base += uGlow * lines * shimmer * 0.04;

    gl_FragColor = vec4(base, 1.0);
  }
`;

interface Props {
  inkLow?: string;
  inkHigh?: string;
  contour?: string;
  glow?: string;
}

export function Terrain({
  inkLow = "#0a0e17",
  inkHigh = "#2a3651",
  contour = "#a7b3cd",
  glow = "#f3c66b",
}: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHeight: { value: TERRAIN_HEIGHT },
      uSize: { value: TERRAIN_SIZE },
      uContourSpacing: { value: 0.18 },
      uLow: { value: new THREE.Color(inkLow) },
      uHigh: { value: new THREE.Color(inkHigh) },
      uContour: { value: new THREE.Color(contour) },
      uGlow: { value: new THREE.Color(glow) },
    }),
    [inkLow, inkHigh, contour, glow],
  );

  useFrame((_, dt) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += dt;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGMENTS, TERRAIN_SEGMENTS]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
