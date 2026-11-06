import { useId } from "react";

export const useUid = (prefix) => prefix + useId().replace(/[^a-zA-Z0-9]/g, "");

/* Deterministic scatter (fur strokes, speckles) so SVGs render identically every time */
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
export const scatter = (seed, n, cx, cy, rx, ry) => {
  const r = seeded(seed);
  return Array.from({ length: n }, () => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    return [cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, r() * Math.PI - Math.PI / 2];
  });
};
export const FUR_IDLE = [...scatter(11, 34, 100, 124, 50, 30), ...scatter(23, 16, 150, 92, 26, 22)];
export const LIME_DOTS = scatter(53, 34, 45, 56, 21, 25);
export const ORANGE_DOTS = scatter(67, 40, 35, 80, 22, 22);