import { COLORS as C } from "../config/store.js";
import { Clover, CloverBlossom } from "./ornaments.jsx";

/* Porcelain bowl from the poster. Drawn in two layers so the rabbit can sit
   *inside* it: "back" (bowl + rim + brush swirls) sits behind the rabbit,
   "front" (a tuft of clovers on the rim) sits in front of it — including in
   front of the 3D rabbit when it takes off and lands. */
const FRONT_PILE = [
  [96, 92, 1.5, -20, "#7FA563"],
  [134, 100, 1.6, 10, "#6F9A57"],
  [266, 100, 1.6, 25, "#6F9A57"],
  [304, 92, 1.5, 40, "#8BB26C"],
  [116, 108, 1.3, 30, "#8BB26C"],
  [286, 110, 1.3, 15, "#7FA563"],
  [80, 104, 1.2, -45, "#6F9A57"],
  [322, 106, 1.2, 50, "#7FA563"],
];

export function BowlSVG({ className = "", style, layer = "back" }) {
  if (layer === "front") {
    return (
      <svg viewBox="0 0 400 180" className={className} style={style} aria-hidden="true">
        {[
          [110, 104, 100, 62],
          [130, 106, 140, 58],
          [270, 106, 262, 60],
          [292, 104, 304, 64],
        ].map(([x1, y1, x2, y2], i) => (
          <path key={i} d={`M${x1} ${y1} C${x1} ${y1 - 18} ${x2 + 5} ${y2 + 16} ${x2} ${y2}`} stroke="#8DB46E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        ))}
        {FRONT_PILE.map(([x, y, s, r, f], i) => (
          <Clover key={i} x={x} y={y} s={s} r={r} fill={f} />
        ))}
        <CloverBlossom x={100} y={86} s={1.15} />
        <CloverBlossom x={300} y={84} s={1.05} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 180" className={className} style={style} aria-hidden="true">
      <path d="M6 92 C40 172 360 172 394 92 C350 126 50 126 6 92Z" fill={C.cream} stroke={C.cobalt} strokeWidth="2" />
      <ellipse cx="200" cy="168" rx="64" ry="7" fill={C.cream} stroke={C.cobalt} strokeWidth="1.6" />
      <ellipse cx="200" cy="90" rx="194" ry="36" fill={C.cream} stroke={C.cobalt} strokeWidth="2" />
      <g fill="none" stroke={C.cobalt} strokeLinecap="round">
        <path d="M40 92 C80 116 320 116 360 92" strokeWidth="3" strokeDasharray="60 10 30 14" />
        <path d="M70 90 C110 106 290 106 330 90" strokeWidth="2.4" strokeDasharray="40 12 70 8" />
        <path d="M24 80 C60 62 120 58 170 58" strokeWidth="2.6" strokeDasharray="30 8 50 10" />
        <path d="M236 58 C300 60 352 68 378 82" strokeWidth="2.6" strokeDasharray="50 10 24 8" />
        <path d="M30 104 C80 138 320 138 370 104" strokeWidth="2" strokeDasharray="20 10 80 12" />
      </g>
    </svg>
  );
}

export function PolaroidPhoto({ variant }) {
  return (
    <svg viewBox="0 0 60 54" className="w-full h-full" fill="none" stroke={C.cobalt} strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
      {variant === "cup" ? (
        <>
          <path d="M16 24 h26 v3 C42 37 35 43 29 43 C23 43 16 37 16 27Z" />
          <path d="M42 28 c6 -1 7 7 0 8" />
          <ellipse cx="29" cy="45" rx="17" ry="3" />
          <path d="M24 18 c-2 -3 2 -5 0 -8 M30 18 c-2 -3 2 -5 0 -8 M36 18 c-2 -3 2 -5 0 -8" opacity=".7" />
        </>
      ) : (
        <>
          <rect x="14" y="8" width="32" height="38" />
          <path d="M30 8 v38 M14 27 h32" />
          <circle cx="38" cy="18" r="4" />
          <path d="M8 46 h44" />
          <path d="M18 40 c3 -5 6 -5 9 0" opacity=".7" />
        </>
      )}
    </svg>
  );
}
