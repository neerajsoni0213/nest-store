import { ArrowDown } from "lucide-react";
import { Asset } from "./Asset.jsx";
import { ASSETS, COLORS as C } from "../config/store.js";
import { CATEGORIES } from "../data/products.js";
import { DotMatrix, Sparkle, TeapotArt, SpoonArt } from "../illustrations/ornaments.jsx";
import { RabbitIdleSVG } from "../illustrations/rabbit.jsx";
import { BowlSVG } from "../illustrations/scene.jsx";

export function Hero({ nestRef, onJump }) {
  return (
    <section className="grid md:grid-cols-2 border-b border-cobalt" aria-label="NEST">
      {/* Left: cobalt poster panel. No z-index on these wrappers on purpose —
          the front clover tuft must stack above the 3D canvas (z 50). */}
      <div className="relative overflow-hidden bg-cobalt text-cream min-h-[88svh] md:min-h-[calc(100svh-61px)]">
        <DotMatrix className="absolute left-4 top-[32%] w-12 opacity-70" />
        <Sparkle className="absolute w-6 text-cream" style={{ left: "10%", bottom: "38%" }} />
        <Sparkle className="absolute w-3.5 text-cream opacity-80" style={{ right: "12%", top: "18%" }} />
        <div className="relative pt-8 md:pt-10 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-[0.06em]">NEST</h1>
          <p className="mt-1 text-[12px] font-bold tracking-[0.3em] opacity-90">HANDCRAFTED MINIATURES</p>
        </div>
        <div aria-hidden="true" className="relative select-none font-display font-extrabold leading-[0.8] tracking-[-0.05em] text-[clamp(8.5rem,30vw,13rem)] md:text-[clamp(9rem,17vw,17rem)] px-6 md:px-12 mt-3">
          <div>ME</div>
          <div>NU</div>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-[62%]" aria-hidden="true">
            <path d="M0 64 C70 30 150 24 230 56 C300 84 360 120 400 170 L400 200 L0 200Z" fill={C.cobaltDeep} />
          </svg>
          <div className="relative ml-[3%] w-[clamp(280px,86%,560px)] pb-2">
            {/* The poster rabbit. On the first scroll it comes alive as the 3D rabbit. */}
            <div ref={nestRef} className="relative mx-auto" style={{ width: "54%", aspectRatio: "900 / 835", marginBottom: "-24%" }}>
              <Asset src={ASSETS.rabbitIdle} alt="The NEST rabbit resting in clover" Fallback={RabbitIdleSVG} position="object-bottom" />
            </div>
            <div className="relative">
              <BowlSVG className="relative block w-full" />
              <BowlSVG layer="front" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 55 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Right: cream menu panel */}
      <div className="relative overflow-hidden bg-cream px-6 md:px-12 pt-10 pb-28 md:pt-12 md:pb-24">
        <div className="flex flex-col gap-6 md:gap-8">
          <p className="font-extrabold uppercase text-[15px] md:text-base leading-tight md:self-end md:text-right tracking-[0.02em]">
            Good things take time
            <br />
            We make good things
          </p>
          <h2 className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-[clamp(2.8rem,5.6vw,5rem)]">
            Earrings
            <br />
            <span className="inline-block mt-4 whitespace-nowrap">Hot - Picks</span>
          </h2>
        </div>
        <ul className="relative mt-10 md:mt-12 max-w-md space-y-5">
          {CATEGORIES.map((c) => (
            <li key={c.name}>
              <button type="button" onClick={() => onJump(c.first)} className="group w-full text-left">
                <span className="flex items-baseline gap-3">
                  <span className="font-extrabold uppercase tracking-[0.02em] text-[17px] group-hover:underline underline-offset-4">{c.name}</span>
                  <span className="leader" aria-hidden="true" />
                  <span className="font-mono text-[16px] font-medium whitespace-nowrap">{c.price}</span>
                </span>
                <span className="block text-[15.5px] mt-1 text-cobalt/85">{c.note}</span>
              </button>
            </li>
          ))}
        </ul>
        <SpoonArt className="hidden sm:block absolute w-12 right-[8%] top-[34%] rotate-[28deg]" />
        <TeapotArt className="absolute right-[-6%] bottom-4 w-[42%] max-w-[250px] opacity-95" />
        <Sparkle className="absolute w-5 text-cobalt" style={{ right: "30%", top: "30%" }} />
        <Sparkle className="absolute w-4 text-cobalt" style={{ right: "4%", top: "56%" }} />
        <div className="absolute left-6 md:left-12 bottom-6 flex items-center gap-3 text-[13px] font-bold tracking-[0.12em] uppercase">
          <span className="grid place-items-center w-10 h-10 rounded-full border border-cobalt nest-bob">
            <ArrowDown size={17} />
          </span>
          Scroll the menu
        </div>
      </div>
    </section>
  );
}
