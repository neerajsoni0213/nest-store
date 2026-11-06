import { COLORS as C } from "../config/store.js";
import { useUid, FUR_IDLE } from "./util.js";
import { Clover, CloverBlossom } from "./ornaments.jsx";

/* ==========================================================================
   RABBIT — inline watercolour-style fallbacks
   ========================================================================== */
export function RabbitIdleSVG({ className = "" }) {
  const u = useUid("ri");
  return (
    <svg viewBox="0 0 200 175" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <radialGradient id={`${u}f`} cx="58%" cy="38%" r="72%">
          <stop offset="0" stopColor="#D6BB94" />
          <stop offset=".55" stopColor="#AA8961" />
          <stop offset="1" stopColor="#7A5C3E" />
        </radialGradient>
        <radialGradient id={`${u}h`} cx="62%" cy="42%" r="66%">
          <stop offset="0" stopColor="#E0C8A3" />
          <stop offset=".6" stopColor="#B19068" />
          <stop offset="1" stopColor="#866846" />
        </radialGradient>
        <linearGradient id={`${u}e`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6CDC6" />
          <stop offset="1" stopColor="#E59E9B" />
        </linearGradient>
        <filter id={`${u}w`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
      </defs>
      <g opacity=".95">
        {[
          [14, 150, 26, 92],
          [26, 152, 40, 104],
          [186, 150, 176, 96],
          [176, 152, 166, 108],
          [8, 156, 4, 118],
        ].map(([x1, y1, x2, y2], i) => (
          <path key={i} d={`M${x1} ${y1} C${x1 + 2} ${y1 - 24} ${x2 - 4} ${y2 + 14} ${x2} ${y2}`} stroke="#8DB46E" strokeWidth="2" fill="none" strokeLinecap="round" />
        ))}
        <Clover x={22} y={128} s={1.05} r={-20} fill="#8BB26C" />
        <Clover x={180} y={124} s={1} r={25} fill="#8BB26C" />
        <CloverBlossom x={12} y={114} s={0.9} />
      </g>
      <g filter={`url(#${u}w)`}>
        <circle cx="40" cy="120" r="15" fill="#EFE4D2" />
        <path d="M44 150 C30 118 52 86 92 82 C128 78 158 100 160 132 C162 156 136 166 100 166 C70 166 52 162 44 150Z" fill={`url(#${u}f)`} />
        <ellipse cx="76" cy="130" rx="36" ry="28" fill="#7A5C3E" opacity=".28" />
        <path d="M152 66 C160 32 172 10 182 14 C190 20 180 50 164 74Z" fill="#94734F" />
        <path d="M157 62 C164 36 172 22 178 22 C181 28 174 48 163 66Z" fill={`url(#${u}e)`} opacity=".85" />
        <path d="M114 96 C112 72 130 58 150 60 C172 62 186 80 184 100 C182 118 164 126 148 124 C130 122 116 112 114 96Z" fill={`url(#${u}h)`} />
        <path d="M126 70 C112 36 114 8 127 6 C141 6 147 38 143 68Z" fill="#A4825C" />
        <path d="M129 63 C120 38 121 18 127 15 C135 17 139 40 138 62Z" fill={`url(#${u}e)`} />
        <ellipse cx="170" cy="104" rx="13" ry="10" fill="#EEE1CB" opacity=".95" />
        <ellipse cx="128" cy="104" rx="10" ry="12" fill="#8C6C4A" opacity=".25" />
      </g>
      <ellipse cx="150" cy="108" rx="8" ry="4.5" fill="#E6A9A2" opacity=".35" />
      <ellipse cx="158" cy="88" rx="5.6" ry="6.6" fill="#1E1B2E" />
      <circle cx="160" cy="85.6" r="1.9" fill="#FFFDF7" />
      <path d="M151.5 84 C154.5 80.6 161 80.6 164.5 84" stroke="#4A3726" strokeWidth=".9" fill="none" />
      <path d="M180 98 C182 96.6 184.4 97.8 183.4 100 C182.4 102 180 101.4 180 98Z" fill="#C98582" />
      <path d="M182 101 C181 105 178 106 175 105 M182 101 C183 105 185 106 187.5 105" stroke="#6E5038" strokeWidth=".8" fill="none" />
      <g stroke="#5E4A38" strokeWidth=".55" opacity=".7" fill="none">
        <path d="M176 104 C160 104 146 106 136 110" />
        <path d="M176 106 C162 110 150 116 142 122" />
        <path d="M184 103 C191 100 196 99 199 99" />
        <path d="M184 105 C191 106 196 109 199 111" />
      </g>
      <g stroke="#5B4330" strokeWidth=".7" opacity=".38" strokeLinecap="round">
        {FUR_IDLE.map(([x, y, a], i) => (
          <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(a) * 5).toFixed(1)} ${(Math.sin(a) * 5).toFixed(1)}`} />
        ))}
      </g>
      <ellipse cx="150" cy="161" rx="13" ry="6" fill="#E9DCC5" />
      <ellipse cx="128" cy="164" rx="11" ry="5" fill="#DCCBB0" />
      <Clover x={58} y={160} s={1.2} r={-10} />
      <Clover x={98} y={166} s={1} r={15} fill="#7FA563" />
      <Clover x={172} y={162} s={1.15} r={30} />
      <Clover x={28} y={164} s={0.9} r={-35} fill="#7FA563" />
      <CloverBlossom x={122} y={154} s={0.85} />
    </svg>
  );
}
