import { COLORS as C } from "../config/store.js";
import { useUid, LIME_DOTS, ORANGE_DOTS } from "./util.js";

/* ==========================================================================
   PRODUCT FALLBACK ILLUSTRATIONS (one charm each, attach point at top-centre)
   ========================================================================== */
export function ChilliSVG({ className = "" }) {
  const u = useUid("ch");
  return (
    <svg viewBox="0 0 60 150" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${u}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7A0B0B" />
          <stop offset=".3" stopColor="#D92B20" />
          <stop offset=".58" stopColor="#C21A12" />
          <stop offset="1" stopColor="#690606" />
        </linearGradient>
        <linearGradient id={`${u}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4F7F3B" />
          <stop offset="1" stopColor="#1F4419" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="4" r="3" fill="none" stroke={C.gold} strokeWidth="1.4" />
      <path d="M30 6 C29 11 27 15 30 24" stroke={`url(#${u}s)`} strokeWidth="4.6" strokeLinecap="round" fill="none" />
      <path d="M17 31 C13 58 14 92 23 116 C28 130 36 141 45 147 C41 136 40 121 42 100 C45 72 45 50 43 31 Z" fill={`url(#${u}b)`} />
      <path d="M43 40 C45 62 44 84 41 104" stroke="#5B0505" strokeWidth="1.2" fill="none" opacity=".5" />
      <path d="M14 34 C17 22 43 21 46 34 C41 29 37 35 33 30 C29 35 24 29 20 35 C18 32 16 34 14 34Z" fill={`url(#${u}s)`} />
      <path d="M22 41 C20 62 21 88 27 108" stroke="#FFFDF7" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M37 47 C38 61 37 75 36 85" stroke="#FFFDF7" strokeOpacity=".25" strokeWidth="2" strokeLinecap="round" fill="none" />
      {[
        [26, 60],
        [33, 74],
        [29, 96],
        [36, 112],
        [24, 82],
        [38, 128],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r=".7" fill="#FFE1D6" opacity=".7" />
      ))}
    </svg>
  );
}

export function LemonSVG({ className = "" }) {
  const u = useUid("le");
  return (
    <svg viewBox="0 0 70 122" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}b`} cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="#FFF59A" />
          <stop offset=".45" stopColor="#F9D71C" />
          <stop offset="1" stopColor="#D69A06" />
        </radialGradient>
        <radialGradient id={`${u}g`} cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#FFF0B8" />
          <stop offset=".5" stopColor="#DDB346" />
          <stop offset="1" stopColor="#9A7417" />
        </radialGradient>
        <linearGradient id={`${u}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8DB255" />
          <stop offset="1" stopColor="#3E6B2A" />
        </linearGradient>
      </defs>
      <path d="M35 0 v4" stroke={C.gold} strokeWidth="1.4" />
      <circle cx="35" cy="9" r="6" fill={`url(#${u}g)`} />
      {[
        [32, 7],
        [37, 6],
        [35, 10],
        [31, 11],
        [39, 11],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r=".9" fill="#8C6A14" />
      ))}
      <path d="M35 15 v6" stroke={C.gold} strokeWidth="1.4" />
      <path d="M35 21 C52 23 62 44 62 64 C62 86 50 104 35 108 C20 104 8 86 8 64 C8 44 18 23 35 21Z" fill={`url(#${u}b)`} />
      <path d="M50 40 C56 54 57 76 50 94" stroke="#C58A05" strokeWidth="1.2" fill="none" opacity=".45" />
      <path d="M25 24 Q35 16 45 24 Q40 22 35 25.5 Q30 22 25 24Z" fill={`url(#${u}g)`} />
      <path d="M44 24 C58 26 67 40 63 59 C57 49 50 37 44 24Z" fill={`url(#${u}l)`} />
      <path d="M45 26 C52 34 57 44 61 55" stroke="#D9E8B5" strokeWidth=".7" fill="none" opacity=".7" />
      <ellipse cx="23" cy="52" rx="5" ry="15" fill="#FFFDF7" opacity=".6" transform="rotate(-12 23 52)" />
      <ellipse cx="27" cy="80" rx="2" ry="5" fill="#FFFDF7" opacity=".35" />
      <path d="M29 106 Q35 112 41 106 Q38 108 35 107 Q32 108 29 106Z" fill={`url(#${u}g)`} />
      <circle cx="35" cy="113.5" r="2.6" fill={`url(#${u}g)`} />
    </svg>
  );
}

export function CoconutSVG({ className = "" }) {
  const u = useUid("co");
  return (
    <svg viewBox="0 0 70 92" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${u}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8FC653" />
          <stop offset=".5" stopColor="#56962E" />
          <stop offset="1" stopColor="#2C6118" />
        </linearGradient>
        <radialGradient id={`${u}c`} cx="45%" cy="30%" r="75%">
          <stop offset="0" stopColor="#FFF9E6" />
          <stop offset=".6" stopColor="#EAD8AA" />
          <stop offset="1" stopColor="#C3A96F" />
        </radialGradient>
      </defs>
      <circle cx="35" cy="4" r="3" fill="none" stroke={C.gold} strokeWidth="1.4" />
      <path d="M35 7 v8" stroke={C.gold} strokeWidth="1.4" />
      <path d="M8 44 C8 66 18 86 35 88 C52 86 62 66 62 44 Z" fill={`url(#${u}g)`} />
      {[
        "M16 54 C18 66 22 76 28 82",
        "M54 54 C52 66 48 76 42 82",
        "M35 50 C35 64 35 76 35 86",
        "M24 50 C25 62 28 74 31 84",
      ].map((d, i) => (
        <path key={i} d={d} stroke="#2A5A16" strokeWidth=".8" fill="none" opacity=".45" />
      ))}
      <ellipse cx="20" cy="60" rx="3.5" ry="10" fill="#C8E59E" opacity=".35" />
      <path d="M8 44 C10 26 22 14 35 14 C48 14 60 26 62 44 C56 40 52 46 46 42 C41 47 36 41 30 45 C25 41 20 47 15 42 C12 46 10 44 8 44Z" fill={`url(#${u}c)`} stroke="#A48B52" strokeWidth=".7" />
      <path d="M20 22 L24 38 M35 15 L33 40 M50 22 L46 38" stroke="#BDA266" strokeWidth=".7" opacity=".6" />
      <ellipse cx="40" cy="26" rx="3.6" ry="1.7" fill="#7F6638" />
      <path d="M40 26 L48 6 L57 4" stroke="#F07393" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M41.5 22 L48.5 6.5" stroke="#FFC7D4" strokeWidth=".9" strokeLinecap="round" />
    </svg>
  );
}

export function CroissantSVG({ className = "" }) {
  const u = useUid("cr");
  const lobes = [
    [12, 46, 9, 6, -35],
    [78, 46, 9, 6, 35],
    [24, 38, 12, 10, -40],
    [66, 38, 12, 10, 40],
    [34, 30, 13, 14, -20],
    [56, 30, 13, 14, 20],
    [45, 28, 13, 16, 0],
  ];
  return (
    <svg viewBox="0 0 90 62" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}b`} cx="40%" cy="30%" r="75%">
          <stop offset="0" stopColor="#F9D49A" />
          <stop offset=".5" stopColor="#DE9447" />
          <stop offset="1" stopColor="#9E5420" />
        </radialGradient>
      </defs>
      <circle cx="45" cy="4" r="3" fill="none" stroke={C.gold} strokeWidth="1.4" />
      <path d="M45 7 v6" stroke={C.gold} strokeWidth="1.4" />
      {lobes.map(([cx, cy, rx, ry, r], i) => (
        <g key={i} transform={`rotate(${r} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${u}b)`} stroke="#8A4A1C" strokeWidth=".7" />
          <path d={`M${cx - rx * 0.6} ${cy - ry * 0.45} Q${cx} ${cy - ry * 0.9} ${cx + rx * 0.5} ${cy - ry * 0.5}`} stroke="#FFF1D6" strokeWidth="1.2" fill="none" opacity=".7" strokeLinecap="round" />
        </g>
      ))}
      {[
        "M38 20 C42 26 48 26 52 20",
        "M37 30 C42 36 48 36 53 30",
        "M38 40 C42 43 48 43 52 40",
      ].map((d, i) => (
        <path key={i} d={d} stroke="#8A4A1C" strokeWidth=".8" fill="none" opacity=".75" />
      ))}
    </svg>
  );
}

export function TangerineSVG({ className = "" }) {
  const u = useUid("ta");
  return (
    <svg viewBox="0 0 70 110" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}o`} cx="34%" cy="30%" r="74%">
          <stop offset="0" stopColor="#FFD983" />
          <stop offset=".45" stopColor="#F68D22" />
          <stop offset="1" stopColor="#C2500C" />
        </radialGradient>
      </defs>
      <circle cx="35" cy="4" r="3" fill="none" stroke={C.gold} strokeWidth="1.4" />
      <path d="M35 7 v9" stroke={C.gold} strokeWidth="1.4" />
      <path d="M34 16 C22 18 13 30 16 45 C27 41 33 31 34 16Z" fill="#7EA05C" />
      <path d="M34 18 C27 26 21 34 17 43" stroke="#C9DDB3" strokeWidth=".7" fill="none" />
      <path d="M36 16 C48 12 59 22 57 37 C46 37 38 29 36 16Z" fill="#2F5A2A" />
      <path d="M37 18 C44 23 50 29 56 35" stroke="#6E9561" strokeWidth=".7" fill="none" />
      <path d="M35 16 v34" stroke={C.gold} strokeWidth="1.3" />
      <circle cx="35" cy="51" r="2.8" fill="none" stroke={C.gold} strokeWidth="1.4" />
      <circle cx="35" cy="80" r="26" fill={`url(#${u}o)`} />
      {ORANGE_DOTS.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r=".8" fill="#A9470A" opacity=".35" />
      ))}
      <circle cx="35" cy="55.5" r="1.6" fill="#7A3B0A" opacity=".6" />
      <ellipse cx="25" cy="70" rx="6" ry="9" fill="#FFF3D9" opacity=".55" transform="rotate(-25 25 70)" />
    </svg>
  );
}

export function LimeSVG({ className = "" }) {
  const u = useUid("li");
  return (
    <svg viewBox="0 0 90 92" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}b`} cx="36%" cy="32%" r="72%">
          <stop offset="0" stopColor="#E8F396" />
          <stop offset=".5" stopColor="#A9CB42" />
          <stop offset="1" stopColor="#6A9725" />
        </radialGradient>
        <linearGradient id={`${u}l`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#45984A" />
          <stop offset="1" stopColor="#1C6328" />
        </linearGradient>
      </defs>
      <path d="M45 22 L46.5 10" stroke="#A7AFB8" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M44 20 C32 8 14 10 6 24 C18 32 34 30 44 20Z" fill={`url(#${u}l)`} stroke="#B9C0C7" strokeWidth=".9" />
      <path d="M47 18 C56 4 76 4 86 16 C76 26 58 28 47 18Z" fill={`url(#${u}l)`} stroke="#B9C0C7" strokeWidth=".9" />
      <g stroke={C.gold} strokeWidth=".8" fill="none" strokeLinecap="round">
        <path d="M44 20 C32 22 20 24 9 24" />
        <path d="M34 22 L28 15 M26 23 L20 17 M30 22 L26 27 M20 24 L16 28" />
        <path d="M47 18 C60 16 72 15 83 16" />
        <path d="M58 17 L64 10 M68 16 L74 10 M62 17 L66 22 M74 16 L78 21" />
      </g>
      <path d="M45 22 C62 22 70 38 70 56 C70 74 58 86 47 88 L45 92 L43 88 C32 86 20 74 20 56 C20 38 28 22 45 22Z" fill={`url(#${u}b)`} />
      {LIME_DOTS.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r=".95" fill="#2F5512" opacity=".75" />
      ))}
      <ellipse cx="34" cy="44" rx="5" ry="10" fill="#FCFFE6" opacity=".6" transform="rotate(-20 34 44)" />
    </svg>
  );
}

export function DelftVaseSVG({ className = "" }) {
  const u = useUid("dv");
  return (
    <svg viewBox="0 0 60 150" className={className} style={{ overflow: "visible" }} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}p`} cx="38%" cy="38%" r="70%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".6" stopColor="#EEF1F6" />
          <stop offset="1" stopColor="#C6D1E6" />
        </radialGradient>
      </defs>
      <path d="M27 110 L27 147 Q30 151 33 147 L33 116" stroke={C.gold} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <g data-flowers="">
        {[
          "M30 66 C29 52 26 40 24 30",
          "M31 66 C32 50 36 38 38 26",
          "M30 66 C30 46 30 26 31 8",
          "M29 66 C26 54 20 44 15 40",
        ].map((d, i) => (
          <path key={i} d={d} stroke="#5E7D45" strokeWidth=".9" fill="none" />
        ))}
        {[
          [31, 8],
          [29, 12],
          [33, 14],
          [29.5, 18],
          [33, 21],
          [15, 40],
          [13, 36],
          [18, 37],
          [27, 16],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="1.6" ry="2.2" fill="#7E9B5E" transform={`rotate(${i * 37} ${x} ${y})`} />
        ))}
        {[
          [24, 30, "#F4AEA6"],
          [38, 26, "#F28A6B"],
        ].map(([x, y, c], i) => (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx={x} cy={y - 3.4} rx="2.4" ry="3.6" fill={c} stroke="#D86F5E" strokeWidth=".3" transform={`rotate(${a} ${x} ${y})`} />
            ))}
            <circle cx={x} cy={y} r="1.3" fill="#F2C94C" />
          </g>
        ))}
      </g>
      <path d="M25 66 L25 71 C18 76 11 84 11 96 C11 109 20 117 30 117 C40 117 49 109 49 96 C49 84 42 76 35 71 L35 66Z" fill={`url(#${u}p)`} stroke={C.cobalt} strokeWidth=".8" />
      <ellipse cx="30" cy="66" rx="6" ry="2.4" fill={C.cobalt} />
      <g stroke="#1F4FA8" strokeLinecap="round" fill="none">
        <path d="M15 92 C19 85 24 83 29 86" strokeWidth="2.4" />
        <path d="M17 100 C22 96 25 92 24 88" strokeWidth="1.8" />
        <path d="M43 86 C40 80 36 78 33 80" strokeWidth="2" />
        <path d="M13 104 C22 110 38 110 47 104" strokeWidth="1.5" />
        <path d="M26 73 L34 73" strokeWidth="1.4" />
      </g>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="36" cy="94.5" rx="1.7" ry="2.6" fill="none" stroke="#1F4FA8" strokeWidth="1" transform={`rotate(${a} 36 97)`} />
      ))}
      {[
        [22, 78],
        [38, 77],
        [30, 80],
        [44, 96],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.1" fill="#1F4FA8" />
      ))}
      <ellipse cx="19" cy="92" rx="2.4" ry="8" fill="#FFFFFF" opacity=".85" />
      <path d="M22 116.5 L38 116.5" stroke={C.cobalt} strokeWidth="1.6" />
    </svg>
  );
}

export function CobaltVaseSVG({ className = "" }) {
  const u = useUid("cv");
  return (
    <svg viewBox="0 0 60 150" className={className} style={{ overflow: "visible" }} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}v`} cx="36%" cy="40%" r="72%">
          <stop offset="0" stopColor="#4A6EC2" />
          <stop offset=".5" stopColor="#1F3D8A" />
          <stop offset="1" stopColor="#0F2157" />
        </radialGradient>
      </defs>
      <path d="M30 110 L30 149" stroke="#9AA4B2" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 112 L31 148" stroke="#E3E8EE" strokeWidth=".6" />
      <g data-flowers="">
        {[
          "M30 66 C29 50 27 36 26 26",
          "M31 66 C32 48 35 34 36 22",
          "M30 66 C30 46 31 30 31 18",
          "M29 66 C26 54 23 44 21 36",
          "M31 66 C34 54 37 44 39 34",
        ].map((d, i) => (
          <path key={i} d={d} stroke="#6D7F55" strokeWidth=".8" fill="none" />
        ))}
        {[
          [26, 26],
          [36, 22],
          [31, 18],
        ].map(([x, y], i) => (
          <g key={i}>
            {Array.from({ length: 9 }, (_, k) => (
              <circle key={k} cx={x + Math.cos(k * 0.7) * (k % 3) * 1.5} cy={y + Math.sin(k * 0.7) * (k % 3) * 1.5} r="1.5" fill={k % 2 ? "#B3261E" : "#D2453A"} />
            ))}
          </g>
        ))}
        {[
          [21, 36],
          [39, 34],
          [24, 32],
          [37, 30],
          [19, 33],
          [41, 37],
          [22, 39],
          [38, 38],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.3" fill="#FFFDF7" stroke="#D9D3C2" strokeWidth=".3" />
        ))}
      </g>
      <path d="M22 64 C24 60 27 62 30 60 C33 62 36 60 38 64 C36 66 35 68 35 70 C42 74 48 84 48 96 C48 110 40 117 30 117 C20 117 12 110 12 96 C12 84 18 74 25 70 C25 68 24 66 22 64Z" fill={`url(#${u}v)`} />
      {[
        [20, 90, 5, 3],
        [36, 100, 6, 3],
        [28, 80, 4, 2],
        [40, 88, 3, 2],
        [24, 106, 5, 2],
      ].map(([x, y, rx, ry], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#8FA9E6" opacity=".22" />
      ))}
      <ellipse cx="19" cy="94" rx="2.2" ry="9" fill="#C9D6F5" opacity=".5" />
      <ellipse cx="30" cy="64" rx="6" ry="1.8" fill="#0B1A45" />
    </svg>
  );
}

export function HeartSVG({ className = "" }) {
  const u = useUid("he");
  return (
    <svg viewBox="0 0 80 72" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}h`} cx="36%" cy="30%" r="75%">
          <stop offset="0" stopColor="#FF7366" />
          <stop offset=".45" stopColor="#D81E23" />
          <stop offset="1" stopColor="#860A0F" />
        </radialGradient>
      </defs>
      <path d="M40 68 C14 52 4 36 6 22 C8 10 18 4 28 6 C34 7 38 11 40 16 C42 11 46 7 52 6 C62 4 72 10 74 22 C76 36 66 52 40 68Z" fill={`url(#${u}h)`} />
      <path d="M14 34 C18 46 28 56 40 64" stroke="#6E070B" strokeWidth="1.2" fill="none" opacity=".35" />
      <ellipse cx="24" cy="20" rx="8" ry="4.6" fill="#FFFDF7" opacity=".8" transform="rotate(-32 24 20)" />
      <ellipse cx="57" cy="15" rx="4" ry="2" fill="#FFFDF7" opacity=".55" transform="rotate(20 57 15)" />
      <ellipse cx="30" cy="30" rx="2" ry="1.2" fill="#FFFDF7" opacity=".5" />
    </svg>
  );
}
