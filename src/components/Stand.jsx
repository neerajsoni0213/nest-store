import { Asset } from "./Asset.jsx";
import { ASSETS, COLORS as C } from "../config/store.js";
import { HookWire, CordLoop, Sparkle } from "../illustrations/ornaments.jsx";
import { PolaroidPhoto } from "../illustrations/scene.jsx";

/* Jewellery display stand: a T-bar with a [data-perch] marker at the top
   centre (where the 3D rabbit lands) and two swinging pendants. Pendants
   expose data-swing / data-jiggle / data-flowers hooks for standPhysics. */
const sv = (n) => `calc(var(--s) * ${n}px)`;

export function Piece({ product, mirror = false, glint = false }) {
  return (
    <div className="relative w-full h-full" style={mirror ? { transform: "scaleX(-1)" } : undefined}>
      <Asset src={ASSETS.products[product.asset]} alt={product.name} Fallback={product.Svg} />
      {glint && (
        <div
          data-glint=""
          className="pointer-events-none absolute rounded-full"
          style={{
            left: "30%",
            top: "26%",
            width: "24%",
            height: "46%",
            opacity: 0,
            mixBlendMode: "screen",
            background: "radial-gradient(closest-side, rgba(255,253,247,.95), rgba(255,253,247,0))",
          }}
        />
      )}
    </div>
  );
}

export function Pendant({ side, product, onFlick }) {
  const left = side === "left";
  const [pw, ph] = product.piece;
  const dir = left ? -1 : 1;
  const flick = (e) => onFlick(e.currentTarget, dir, false);
  const hover = (e) => {
    if (e.pointerType === "mouse") onFlick(e.currentTarget, dir, true);
  };
  const keyFlick = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFlick(e.currentTarget, dir, false);
    }
  };
  const common = {
    "data-swing": side,
    role: "button",
    tabIndex: 0,
    "aria-label": `Flick the ${side} ${product.short}`,
    onClick: flick,
    onPointerEnter: hover,
    onKeyDown: keyFlick,
    className: "absolute cursor-pointer",
  };
  const anchor = left ? "16%" : "84%";

  if (product.type === "bookmark" && left) {
    // Vase rides on top of the bar, clip hangs below; pivots where the clip grips the bar.
    return (
      <div
        {...common}
        data-origin="50% 77%"
        data-amp="0.4"
        style={{ left: anchor, top: `calc(var(--s) * ${-0.773 * ph}px + 3px)`, width: sv(pw), height: sv(ph), marginLeft: sv(-pw / 2) }}
      >
        <Piece product={product} />
      </div>
    );
  }

  if (product.type === "bookmark") {
    return (
      <div {...common} aria-label={`Swing the ${product.short} price tag`} data-origin="50% 4px" style={{ left: anchor, top: -4, width: sv(46), marginLeft: sv(-23) }}>
        <CordLoop className="mx-auto block" style={{ width: sv(14), height: sv(24) }} />
        <svg viewBox="0 0 50 80" className="block mx-auto" style={{ width: sv(46), marginTop: -2 }} aria-hidden="true">
          <path d="M14 4 L36 4 L46 14 L46 76 L4 76 L4 14 Z" fill={C.cream} stroke={C.cobalt} strokeWidth="1.2" />
          <circle cx="25" cy="13" r="3" fill="none" stroke={C.cobalt} strokeWidth="1.2" />
          <text x="25" y="36" textAnchor="middle" className="font-mono" fontSize="9" fill={C.cobalt}>
            Rs.
          </text>
          <text x="25" y="52" textAnchor="middle" className="font-mono" fontSize="13" fontWeight="500" fill={C.cobalt}>
            {product.price}
          </text>
          <path d="M25 60 C25.3 64 27.4 66 31 66.3 C27.4 66.6 25.3 68.6 25 72 C24.7 68.6 22.6 66.6 19 66.3 C22.6 66 24.7 64 25 60Z" fill={C.cobalt} />
        </svg>
      </div>
    );
  }

  if (product.type === "dangle") {
    const w = Math.max(pw, 30);
    return (
      <div {...common} data-origin="50% 6px" style={{ left: anchor, top: -4, width: sv(w), marginLeft: sv(-w / 2) }}>
        <HookWire className="block mx-auto" style={{ width: sv(30), height: sv(42) }} />
        <div className="mx-auto" style={{ width: sv(pw), height: sv(ph), marginTop: sv(-4) }}>
          <Piece product={product} mirror={!left} glint />
        </div>
      </div>
    );
  }

  if (product.type === "stud") {
    return (
      <div {...common} data-origin="50% 4px" style={{ left: anchor, top: -4, width: sv(72), marginLeft: sv(-36) }}>
        <CordLoop className="mx-auto block" style={{ width: sv(14), height: sv(22) }} />
        <div
          className="relative mx-auto rounded-md border bg-[#FBF7EE] grid place-items-center"
          style={{ width: sv(72), height: sv(86), borderColor: C.cobalt, marginTop: -2, boxShadow: "0 6px 14px -8px rgba(10,60,140,.45)" }}
        >
          <span className="absolute top-1 left-1/2 -translate-x-1/2 rounded-full border" style={{ width: 6, height: 6, borderColor: C.cobalt }} />
          <div data-jiggle="" style={{ width: sv(pw), height: sv(ph) }}>
            <Piece product={product} mirror={!left} />
          </div>
          <span className="absolute bottom-1 font-mono text-[8px] tracking-[.2em] text-[#0A3C8C]">NEST</span>
        </div>
      </div>
    );
  }

  // magnet: polaroid hung on a cord with a heart pinned on top
  return (
    <div {...common} data-origin="50% 4px" style={{ left: anchor, top: -4, width: sv(70), marginLeft: sv(-35) }}>
      <CordLoop className="mx-auto block" style={{ width: sv(14), height: sv(26) }} />
      <div
        className="relative mx-auto bg-[#FBF7EE] border"
        style={{ width: sv(70), height: sv(84), padding: sv(5), paddingBottom: sv(18), borderColor: "rgba(10,60,140,.35)", marginTop: -2, boxShadow: "0 8px 16px -10px rgba(10,60,140,.5)" }}
      >
        <div className="w-full h-full bg-[#F3EFE2]">
          <PolaroidPhoto variant={left ? "cup" : "window"} />
        </div>
        <div data-jiggle="" className="absolute left-1/2" style={{ top: sv(-14), width: sv(pw), height: sv(ph), marginLeft: sv(-pw / 2) }}>
          <Piece product={product} />
        </div>
      </div>
    </div>
  );
}

export function Stand({ product, standRef, onPendantFlick }) {
  return (
    <div ref={standRef} className="relative select-none" style={{ width: "var(--stand-w)", height: "var(--stand-h)" }}>
      <div className="absolute rounded-full bg-[#F3EFE2] border" style={{ left: "6%", right: "6%", top: "8%", aspectRatio: "1 / 1", borderColor: "rgba(10,60,140,.22)" }}>
        <div className="absolute inset-[6%] rounded-full border border-dashed" style={{ borderColor: "rgba(10,60,140,.18)" }} />
      </div>
      <Sparkle className="absolute w-4 text-[#0A3C8C]" style={{ left: "9%", top: "12%" }} />
      <Sparkle className="absolute w-3 text-[#0A3C8C]" style={{ right: "11%", top: "60%" }} />
      {/* post */}
      <div className="absolute left-1/2 rounded-full bg-[#0A3C8C]" style={{ width: 5, marginLeft: -2.5, top: "22%", bottom: "11%" }} />
      {/* foot */}
      <svg viewBox="0 0 180 44" className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "4%", width: "54%" }} aria-hidden="true">
        <path d="M14 22 C14 36 166 36 166 22 L166 28 C166 42 14 42 14 28Z" fill={C.porcelain} stroke={C.cobalt} strokeWidth="1.2" />
        <ellipse cx="90" cy="22" rx="76" ry="12" fill={C.cream} stroke={C.cobalt} strokeWidth="1.2" />
        <ellipse cx="90" cy="22" rx="56" ry="7" fill="none" stroke={C.cobalt} strokeWidth=".8" strokeDasharray="2 4" />
        <ellipse cx="90" cy="20" rx="10" ry="4" fill={C.cobalt} />
      </svg>
      {/* bar */}
      <div data-bar="" className="absolute rounded-full bg-[#0A3C8C]" style={{ left: "8%", right: "8%", top: "22%", height: 6 }}>
        <span className="absolute rounded-full" style={{ left: -6, top: -3, width: 12, height: 12, background: C.gold, boxShadow: `0 0 0 1px ${C.cobalt}` }} />
        <span className="absolute rounded-full" style={{ right: -6, top: -3, width: 12, height: 12, background: C.gold, boxShadow: `0 0 0 1px ${C.cobalt}` }} />
        <div data-perch="" className="absolute left-1/2 top-0 h-0 w-0" />
        <Pendant side="left" product={product} onFlick={onPendantFlick} />
        <Pendant side="right" product={product} onFlick={onPendantFlick} />
      </div>
    </div>
  );
}

