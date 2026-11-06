import { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShoppingBag } from "lucide-react";

import { STORE, COLORS as C, fmt } from "./config/store.js";
import { PRODUCTS } from "./data/products.js";
import { Hero } from "./components/Hero.jsx";
import { ProductRow } from "./components/ProductRow.jsx";
import { Tray } from "./components/Tray.jsx";
import { InstallButton } from "./components/InstallApp.jsx";
import { CloverIcon, CLOVER_MARKUP, LEAF } from "./illustrations/ornaments.jsx";
import { shakeStand, flickPendant } from "./lib/standPhysics.js";
import { bus, sendRabbit, webglAvailable } from "./lib/rabbitBus.js";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The 3D stage (three.js) is code-split so the page paints first.
const RabbitStage = lazy(() => import("./three/RabbitStage.jsx"));

function loadTray() {
  try {
    const raw = JSON.parse(localStorage.getItem("nest-tray") || "{}");
    const clean = {};
    PRODUCTS.forEach((p) => {
      const q = Number(raw[p.id]);
      if (Number.isInteger(q) && q > 0) clean[p.id] = Math.min(q, 20);
    });
    return clean;
  } catch {
    return {};
  }
}

export default function App() {
  const rootRef = useRef(null);
  const nestRef = useRef(null);
  const catalogRef = useRef(null);
  const trayBtnRef = useRef(null);
  const trayCountRef = useRef(null);
  const hitRef = useRef(null);
  const rowRefs = useRef([]);
  const standRefs = useRef([]);

  const [tray, setTray] = useState(loadTray);
  const [trayOpen, setTrayOpen] = useState(false);
  const [orderNo] = useState(() => `NEST-${Math.floor(1000 + Math.random() * 9000)}`);
  const [trail, setTrail] = useState(null);
  const [stage, setStage] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("nest-tray", JSON.stringify(tray));
    } catch {
      /* storage unavailable — the tray still works for this visit */
    }
  }, [tray]);

  const lines = PRODUCTS.filter((p) => tray[p.id]).map((p) => ({ p, q: tray[p.id], total: p.price * tray[p.id] }));
  const count = lines.reduce((n, l) => n + l.q, 0);
  const subtotal = lines.reduce((n, l) => n + l.total, 0);
  const shipping = subtotal === 0 || subtotal >= STORE.freeShippingAbove ? 0 : STORE.shippingFee;
  const total = subtotal + shipping;

  const setQty = (id, q) =>
    setTray((t) => {
      const next = { ...t };
      if (q <= 0) delete next[id];
      else next[id] = Math.min(q, 20);
      return next;
    });

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    if (trayOpen) html.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setTrayOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [trayOpen]);

  /* Mount the 3D stage once the page has painted (skipped without WebGL —
     the poster rabbit then simply stays in its bowl). */
  useEffect(() => {
    if (!webglAvailable()) return undefined;
    const start = () => setStage(true);
    const id = "requestIdleCallback" in window ? window.requestIdleCallback(start, { timeout: 900 }) : window.setTimeout(start, 300);
    return () => ("cancelIdleCallback" in window ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, []);

  /* Faint dotted clover trail weaving through every stand */
  useEffect(() => {
    const cat = catalogRef.current;
    if (!cat) return undefined;
    const compute = () => {
      const R = cat.getBoundingClientRect();
      const pts = standRefs.current
        .map((s) => {
          const p = s?.querySelector("[data-perch]");
          if (!p) return null;
          const r = p.getBoundingClientRect();
          return { x: r.left - R.left, y: r.top - R.top };
        })
        .filter(Boolean);
      if (pts.length < 2) return;
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      const mids = [];
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const dy = b.y - a.y;
        d += ` C ${a.x.toFixed(1)} ${(a.y + dy * 0.55).toFixed(1)}, ${b.x.toFixed(1)} ${(b.y - dy * 0.55).toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
        mids.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, r: i * 47 });
      }
      setTrail({ w: R.width, h: R.height, d, mids });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(cat);
    return () => ro.disconnect();
  }, []);

  /* DOM side of the rabbit: decides WHERE it should be (scroll position);
     the 3D director decides HOW it gets there. */
  const { contextSafe } = useGSAP(
    () => {
      bus.nestEl = nestRef.current;
      bus.standEls = standRefs.current;
      bus.hitEl = hitRef.current;
      const nestImg = nestRef.current;

      bus.onLeaveNest = () => gsap.to(nestImg, { autoAlpha: 0, scale: 1.04, duration: 0.14, ease: "power1.out", transformOrigin: "50% 90%" });
      bus.onReturnNest = () => gsap.fromTo(nestImg, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.34, ease: "power2.out" });
      bus.onLand = (i, dir, power) => {
        if (power > 0) shakeStand(standRefs.current[i], { dir, power: Math.min(power, 1.2) });
      };

      const activeRow = () => {
        let idx = 0;
        rowRefs.current.forEach((r, i) => {
          if (r && r.getBoundingClientRect().top < window.innerHeight * 0.6) idx = i;
        });
        return idx;
      };
      const onScroll = () => {
        if (!bus.ready) return;
        const y = window.scrollY;
        if (bus.target === "nest" && y > 80) sendRabbit(activeRow());
        else if (bus.target !== "nest" && y < 60) sendRabbit("nest");
      };
      bus.onReady = onScroll;
      window.addEventListener("scroll", onScroll, { passive: true });

      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767.98px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        bus.mobile = !ctx.conditions.desktop;
        bus.reduce = !!ctx.conditions.reduce;
        rowRefs.current.forEach((row, i) => {
          if (!row) return;
          const go = () => bus.target !== "nest" && sendRabbit(i);
          ScrollTrigger.create({ trigger: row, start: "top 60%", end: "bottom 40%", onEnter: go, onEnterBack: go });
        });
      });

      return () => {
        window.removeEventListener("scroll", onScroll);
        mm.revert();
      };
    },
    { scope: rootRef }
  );

  const onPendantFlick = contextSafe((el, dir, soft) => {
    if (soft && gsap.isTweening(el)) return;
    flickPendant(el, dir, bus.reduce ? 0.35 : soft ? 0.7 : 1);
  });

  const addToTray = contextSafe((id, fromEl) => {
    setTray((t) => ({ ...t, [id]: Math.min((t[id] || 0) + 1, 20) }));
    const bump = () => {
      if (trayCountRef.current) gsap.fromTo(trayCountRef.current, { scale: 1.6 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.4, 0.4)" });
      gsap.fromTo(trayBtnRef.current, { rotation: -6 }, { rotation: 0, duration: 0.6, ease: "elastic.out(1.4, 0.3)" });
    };
    if (!fromEl || !trayBtnRef.current || bus.reduce) {
      requestAnimationFrame(bump);
      return;
    }
    const a = fromEl.getBoundingClientRect();
    const b = trayBtnRef.current.getBoundingClientRect();
    const el = document.createElement("div");
    el.innerHTML = CLOVER_MARKUP(26, C.clover);
    Object.assign(el.style, { position: "fixed", left: `${a.left + a.width / 2 - 13}px`, top: `${a.top + a.height / 2 - 13}px`, zIndex: 70, pointerEvents: "none" });
    document.body.appendChild(el);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    gsap
      .timeline({
        onComplete: () => {
          el.remove();
          bump();
        },
      })
      .to(el, { x: dx, duration: 0.75, ease: "power1.inOut" }, 0)
      .to(el, { y: Math.min(dy, 0) - 90, duration: 0.33, ease: "power2.out" }, 0)
      .to(el, { y: dy, duration: 0.42, ease: "power2.in" }, 0.33)
      .to(el, { rotation: 360, scale: 0.6, duration: 0.75, ease: "none" }, 0);
  });

  const jumpTo = (id) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`item-${id}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div
      ref={rootRef}
      id="top"
      className="relative bg-cream text-cobalt [--stand-w:268px] [--stand-h:350px] [--s:0.8] md:[--stand-w:340px] md:[--stand-h:450px] md:[--s:1]"
      style={{ overflowX: "clip" }}
    >
      {stage && (
        <Suspense fallback={null}>
          <RabbitStage />
        </Suspense>
      )}
      {/* invisible tap target that follows the perched 3D rabbit */}
      <button
        ref={hitRef}
        type="button"
        tabIndex={-1}
        aria-label="Tap the rabbit"
        onClick={() => (bus.tapVersion += 1)}
        className="fixed left-0 top-0 z-[51] rounded-full cursor-pointer"
        style={{ width: 0, height: 0, pointerEvents: "none", background: "transparent" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-[56] bg-cream/90 backdrop-blur border-b border-cobalt">
        <div className="flex items-center justify-between gap-3 h-[60px] px-4 md:px-8">
          <a href="#top" className="font-serif text-[28px] font-bold tracking-[0.04em]">
            NEST
          </a>
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold tracking-[0.12em] uppercase" aria-label="Primary">
            <a href="#menu" className="hover:opacity-70">
              The Menu
            </a>
            <a href="#care" className="hover:opacity-70">
              Care
            </a>
            <span className="font-semibold tracking-normal normal-case text-[14px] text-cobalt/80">Free shipping from {fmt(STORE.freeShippingAbove)}</span>
          </nav>
          <div className="flex items-center gap-2">
            <InstallButton className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-cobalt text-[13px] font-bold hover:bg-cobalt/5" />
            <button
              ref={trayBtnRef}
              type="button"
              onClick={() => setTrayOpen(true)}
              className="relative inline-flex items-center gap-2 h-10 px-4 rounded-full bg-cobalt text-cream text-[13px] font-bold tracking-[0.06em] uppercase hover:bg-cobalt-deep"
              aria-label={`Open Collector's Tray, ${count} item${count === 1 ? "" : "s"}`}
            >
              <ShoppingBag size={17} strokeWidth={2} />
              <span className="hidden sm:inline">Tray</span>
              {count > 0 && (
                <span ref={trayCountRef} className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-clover text-cream font-mono text-[12px] font-medium grid place-items-center ring-2 ring-cream">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        <Hero nestRef={nestRef} onJump={jumpTo} />

        <section id="menu" ref={catalogRef} className="relative scroll-mt-16" aria-label="The collection">
          {trail && (
            <svg className="pointer-events-none absolute left-0 top-0" width={trail.w} height={trail.h} aria-hidden="true">
              <path d={trail.d} fill="none" stroke={C.cobalt} strokeOpacity=".15" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 10" />
              {trail.mids.map((m, i) => (
                <g key={i} transform={`translate(${m.x} ${m.y}) rotate(${m.r})`} opacity=".18" fill={C.cobalt}>
                  {[0, 120, 240].map((a) => (
                    <path key={a} d={LEAF} transform={`rotate(${a})`} />
                  ))}
                </g>
              ))}
            </svg>
          )}

          <div className="relative z-[1] border-b border-cobalt px-6 md:px-12 py-12 md:py-16 grid md:grid-cols-[1fr_auto] md:items-end gap-6">
            <div>
              <p className="eyebrow">The Menu · 9 pieces</p>
              <h2 className="mt-3 font-display font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(2.5rem,6vw,4.6rem)]">
                Wear something
                <br />
                delicious.
              </h2>
            </div>
            <p className="font-serif text-[1.3rem] md:text-[1.45rem] max-w-sm leading-snug">Tiny chillies, lemons and croissants, sculpted and glazed by hand. Pick a favourite — or three.</p>
          </div>

          {PRODUCTS.map((p, i) => (
            <ProductRow
              key={p.id}
              product={p}
              index={i}
              rowRef={(el) => (rowRefs.current[i] = el)}
              standRef={(el) => (standRefs.current[i] = el)}
              onAdd={addToTray}
              onPendantFlick={onPendantFlick}
              inTray={tray[p.id] || 0}
            />
          ))}
        </section>

        <section id="care" className="relative z-[1] grid md:grid-cols-3 border-b border-cobalt scroll-mt-16">
          {[
            ["Keep them dry", "Take your pieces off before showers, swims and skincare — glaze lasts longest away from water and oils."],
            ["Store them flat", "Rest each pair in its pouch, away from direct sunlight, so leaves and stems stay crisp."],
            ["Wipe, don't scrub", "A soft dry cloth brings back the shine. Skip polishes and cleaners on painted ceramic."],
          ].map(([t, d], i) => (
            <div key={t} className={`px-6 md:px-10 py-10 ${i < 2 ? "border-b md:border-b-0 md:border-r border-cobalt" : ""}`}>
              <div className="flex items-center gap-2">
                <CloverIcon className="w-5 text-clover" />
                <span className="eyebrow">Care · 0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-display font-extrabold uppercase text-2xl">{t}</h3>
              <p className="mt-2 text-[17px] leading-relaxed text-cobalt/90">{d}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="relative z-[1] bg-cobalt text-cream px-6 md:px-12 py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="font-serif text-6xl md:text-7xl font-bold tracking-[0.04em]">NEST</p>
            <p className="mt-3 font-extrabold uppercase text-[15px] leading-tight">
              Good things take time
              <br />
              We make good things
            </p>
            <InstallButton className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full border border-cream text-[14px] font-bold hover:bg-cream/10" />
          </div>
          <div className="text-[15px] space-y-2 md:text-right">
            <p>Handcrafted miniature earrings & art objects</p>
            <p>Orders & questions on WhatsApp · payments by UPI</p>
            <p className="opacity-75">© {new Date().getFullYear()} NEST</p>
          </div>
        </div>
      </footer>

      <Tray open={trayOpen} onClose={() => setTrayOpen(false)} lines={lines} setQty={setQty} subtotal={subtotal} shipping={shipping} total={total} orderNo={orderNo} />
    </div>
  );
}
