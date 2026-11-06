import { COLORS as C } from "../config/store.js";

/* ==========================================================================
   ORNAMENTS
   ========================================================================== */
export const LEAF =
  "M0 0 C-7 -3 -9 -11 -4.5 -13.5 C-1.8 -14.8 0 -12.6 0 -10.8 C0 -12.6 1.8 -14.8 4.5 -13.5 C9 -11 7 -3 0 0Z";

export function Clover({ x = 0, y = 0, s = 1, r = 0, fill = "#6F9A57", vein = "#3E6B34", stem = true }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {stem && <path d="M0 0 C1 8 3 14 6 21" stroke={vein} strokeWidth="1.3" fill="none" strokeLinecap="round" />}
      {[0, 120, 240].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={LEAF} fill={fill} stroke={vein} strokeWidth=".55" />
          <path d="M0 -1.5 L0 -9.5" stroke={vein} strokeWidth=".5" opacity=".55" />
          <path d="M-3 -9 C-1.5 -8 1.5 -8 3 -9" stroke="#F3EFE2" strokeWidth=".7" fill="none" opacity=".55" />
        </g>
      ))}
    </g>
  );
}

export function CloverBlossom({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 4 C0 10 1 16 3 22" stroke="#4F7A3E" strokeWidth="1.1" fill="none" />
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-3.2" rx="1.3" ry="3.2" fill="#FBF7EE" stroke="#B9B08E" strokeWidth=".4" transform={`rotate(${i * 40})`} />
      ))}
      <circle r="2" fill="#EDE6CC" />
    </g>
  );
}

export const CLOVER_MARKUP = (size, color) =>
  `<svg width="${size}" height="${size}" viewBox="-16 -16 32 32" aria-hidden="true"><g fill="${color}" stroke="#3E6B34" stroke-width=".6">${[0, 120, 240]
    .map((a) => `<path transform="rotate(${a})" d="${LEAF}"/>`)
    .join("")}</g></svg>`;

export function Sparkle({ className = "", style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d="M12 0 C12.6 7.4 16.6 11.4 24 12 C16.6 12.6 12.6 16.6 12 24 C11.4 16.6 7.4 12.6 0 12 C7.4 11.4 11.4 7.4 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function CloverIcon({ className = "" }) {
  return (
    <svg viewBox="-16 -16 32 32" className={className} aria-hidden="true">
      <g fill="currentColor">
        {[0, 120, 240].map((a) => (
          <path key={a} d={LEAF} transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  );
}

export function DotMatrix({ className = "" }) {
  return (
    <svg viewBox="0 0 60 84" className={className} aria-hidden="true">
      {Array.from({ length: 7 }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => <circle key={`${r}-${c}`} cx={6 + c * 12} cy={6 + r * 12} r="1.6" fill={C.cream} />)
      )}
    </svg>
  );
}

export function TeapotArt({ className = "" }) {
  return (
    <svg viewBox="0 0 240 190" className={className} fill="none" stroke={C.cobalt} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* spout */}
      <path d="M56 104 C36 98 26 78 14 62 C11 57 17 53 21 58 C31 72 40 86 60 92" />
      <path d="M22 60 C30 70 36 80 50 88" opacity=".6" />
      {/* body */}
      <path d="M58 150 C34 128 36 84 66 70 C90 58 146 58 170 70 C200 84 202 128 178 150 Z" />
      <path d="M72 76 C100 68 136 68 164 76" opacity=".7" />
      {/* lid + knob */}
      <path d="M78 68 C86 50 152 50 160 68" />
      <path d="M90 56 C104 50 134 50 148 56" opacity=".7" />
      <ellipse cx="119" cy="42" rx="8" ry="9" />
      <path d="M111 50 h16" />
      <path d="M115 36 c2 -3 6 -3 8 0" opacity=".7" />
      {/* handle */}
      <path d="M176 84 C212 74 222 120 184 138" />
      <path d="M180 94 C204 92 206 118 186 126" />
      {/* foot */}
      <path d="M66 150 C76 160 162 160 172 150" />
      <ellipse cx="119" cy="160" rx="44" ry="6" />
      {/* roses */}
      {[
        [96, 106, 13],
        [140, 98, 11],
        [124, 132, 9],
        [74, 128, 8],
        [164, 124, 8],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} />
          <path d={`M${x - r * 0.5} ${y} a${r * 0.5} ${r * 0.5} 0 1 0 ${r} 0 a${r * 0.3} ${r * 0.3} 0 1 0 -${r * 0.6} 0`} />
          <path d={`M${x + r} ${y - 2} c${r * 0.6} -${r * 0.8} ${r * 1.4} -${r * 0.4} ${r * 1.6} ${r * 0.2}`} />
          <path d={`M${x - r} ${y + 2} c-${r * 0.6} ${r * 0.6} -${r * 1.2} ${r * 0.4} -${r * 1.5} -${r * 0.2}`} />
        </g>
      ))}
      {/* hatching */}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${48 + i * 3} ${100 + i * 4} c4 6 8 10 14 14`} opacity=".45" />
      ))}
      {/* tea cup */}
      <path d="M176 172 C176 152 236 152 236 172 C236 186 222 190 206 190 C190 190 176 186 176 172 Z" opacity=".9" />
      <ellipse cx="206" cy="170" rx="30" ry="6" />
      <circle cx="196" cy="180" r="4" opacity=".7" />
      <circle cx="216" cy="180" r="4" opacity=".7" />
    </svg>
  );
}

export function SpoonArt({ className = "" }) {
  return (
    <svg viewBox="0 0 60 230" className={className} fill="none" stroke={C.cobalt} strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <ellipse cx="30" cy="34" rx="16" ry="28" />
      <ellipse cx="30" cy="32" rx="10" ry="20" opacity=".5" />
      <path d="M26 30 c0 -10 2 -16 6 -18" opacity=".5" />
      <path d="M28 62 C27 90 26 140 24 178" />
      <path d="M32 62 C33 90 34 140 36 178" />
      <path d="M30 70 L30 170" opacity=".35" />
      <path d="M24 178 C14 184 14 200 22 206 C26 210 34 210 38 206 C46 200 46 184 36 178" />
      <path d="M22 190 c4 -4 12 -4 16 0 M22 198 c4 4 12 4 16 0" opacity=".7" />
      <circle cx="30" cy="218" r="6" />
      <path d="M30 212 v12 M24 218 h12" opacity=".5" />
    </svg>
  );
}

export function HookWire({ className = "", style }) {
  // Fish-hook ear wire; bar contact sits at y≈6 (matches transformOrigin "50% 6px").
  return (
    <svg viewBox="0 0 30 42" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M15 40 L15 22 C15 12 15 5 20 3 C25 1.5 28 6 27 12 C26 17 22 19 23 27" stroke={C.gold} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16.2 9 C16.6 6 18 4 20 3.6" stroke="#F6E2A6" strokeWidth=".7" strokeLinecap="round" />
      <rect x="12.6" y="24" width="4.8" height="9" rx="1.6" fill={C.gold} />
      {[26, 28.5, 31].map((y) => (
        <path key={y} d={`M12.6 ${y} h4.8`} stroke="#8F6E1F" strokeWidth=".6" />
      ))}
      <circle cx="15" cy="22" r="2.7" fill={C.gold} />
      <circle cx="14.2" cy="21.2" r=".8" fill="#FFF6D8" />
      <circle cx="15" cy="38.5" r="2.5" stroke={C.gold} strokeWidth="1.4" />
    </svg>
  );
}

export function CordLoop({ className = "", style, color = C.cobalt }) {
  return (
    <svg viewBox="0 0 20 30" className={className} style={style} fill="none" aria-hidden="true">
      <circle cx="10" cy="6" r="4.2" stroke={color} strokeWidth="1.3" />
      <path d="M10 10 L10 30" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}
