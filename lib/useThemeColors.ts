"use client";

import { useEffect, useState } from "react";

const sceneVars = [
  "--scene-bg",
  "--scene-fog",
  "--scene-low",
  "--scene-high",
  "--scene-contour",
  "--scene-glow",
  "--scene-particle",
  "--scene-star",
  "--scene-sky-top",
  "--scene-sky-mid",
  "--scene-sky-horizon",
  "--scene-aurora-a",
  "--scene-aurora-b",
  "--scene-aurora-opacity",
  "--scene-light-key",
  "--scene-light-fill",
  "--scene-light-hemi-a",
  "--scene-light-hemi-b",
  "--scene-vignette",
] as const;

type SceneVar = (typeof sceneVars)[number];
export type SceneColors = Record<SceneVar, string>;

function readVars(): SceneColors {
  if (typeof window === "undefined") return {} as SceneColors;
  const styles = getComputedStyle(document.documentElement);
  const out = {} as SceneColors;
  for (const v of sceneVars) {
    out[v] = styles.getPropertyValue(v).trim();
  }
  return out;
}

/**
 * Reads scene-related CSS custom properties and re-evaluates whenever the
 * `theme-cream` class is added/removed on the <html> element.
 */
export function useSceneColors(): SceneColors {
  const [colors, setColors] = useState<SceneColors>(() => readVars());

  useEffect(() => {
    setColors(readVars());
    const root = document.documentElement;
    const observer = new MutationObserver(() => setColors(readVars()));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}

export function useIsLightTheme(): boolean {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setLight(root.classList.contains("theme-cream"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return light;
}
