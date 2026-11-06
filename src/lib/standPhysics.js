import gsap from "gsap";

/* DOM-side physics for the jewellery stands (bar flex, pendulum swing,
   3D stud jiggle, blossom sway). Plain GSAP — runs on the compositor. */
export function swing(el, { kick, dur, ease, delay = 0, drop = 5 }) {
  gsap.killTweensOf(el);
  const glint = el.querySelector("[data-glint]");
  const tl = gsap.timeline({
    delay,
    onUpdate: glint
      ? () => {
          const r = gsap.getProperty(el, "rotation");
          gsap.set(glint, { x: -r * 0.8, opacity: Math.min(0.85, Math.abs(r) / 14) });
        }
      : undefined,
  });
  tl.set(el, { transformOrigin: el.dataset.origin || "50% 6px" })
    .to(el, { rotation: kick, y: drop, duration: 0.13, ease: "power2.out" })
    .to(el, { rotation: 0, duration: dur, ease })
    .to(el, { y: 0, duration: 0.9, ease: "elastic.out(1.2, 0.3)" }, "<");
  return tl;
}

export function jiggle(nodes, dir, power) {
  nodes.forEach((el, i) => {
    gsap.killTweensOf(el);
    gsap
      .timeline({ delay: i * 0.06 })
      .set(el, { transformPerspective: 420, transformOrigin: "50% 45%" })
      .to(el, { rotationX: 32 * power, rotationY: -22 * dir * power, scale: 0.92, duration: 0.1, ease: "power2.out" })
      .to(el, { rotationX: 0, rotationY: 0, scale: 1, duration: 1.7, ease: "elastic.out(1.2, 0.22)" });
  });
}

export function sway(nodes, dir, power) {
  nodes.forEach((el) => {
    gsap.killTweensOf(el);
    gsap
      .timeline({ delay: 0.04 })
      .set(el, { transformOrigin: "50% 100%" })
      .to(el, { rotation: 14 * dir * power, duration: 0.14, ease: "power2.out" })
      .to(el, { rotation: 0, duration: 2.4, ease: "elastic.out(1, 0.18)" });
  });
}

export function shakeStand(stand, { dir = 1, power = 1, bar = true } = {}) {
  if (!stand) return;
  const b = stand.querySelector("[data-bar]");
  if (bar && b) {
    gsap.killTweensOf(b);
    gsap.fromTo(b, { y: 7 * power, rotation: 2.5 * dir * power }, { y: 0, rotation: 0, duration: 1.2, ease: "elastic.out(1.5, 0.3)" });
  }
  stand.querySelectorAll("[data-swing]").forEach((el) => {
    const left = el.dataset.swing === "left";
    const amp = parseFloat(el.dataset.amp || "1") * power;
    swing(
      el,
      left
        ? { kick: -25 * dir * amp, dur: 2.6, ease: "elastic.out(1.15, 0.20)", drop: 5 * amp }
        : { kick: -19 * dir * amp, dur: 2.85, ease: "elastic.out(1.1, 0.24)", delay: 0.065, drop: 5 * amp }
    );
  });
  jiggle(stand.querySelectorAll("[data-jiggle]"), dir, power);
  sway(stand.querySelectorAll("[data-flowers]"), dir, power);
}

export function flickPendant(el, dir, power = 1) {
  const amp = parseFloat(el.dataset.amp || "1") * power;
  swing(el, { kick: 22 * dir * amp, dur: 2.4, ease: "elastic.out(1.1, 0.22)", drop: 2 * amp });
  jiggle(el.querySelectorAll("[data-jiggle]"), dir, power);
  sway(el.querySelectorAll("[data-flowers]"), dir, power);
}
