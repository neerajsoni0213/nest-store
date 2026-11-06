/* A tiny shared channel between the DOM (scroll, stands, hero) and the 3D
   stage. The DOM says *where* the rabbit should be; the 3D director decides
   *how* it gets there. Plain mutable object — no React re-renders per frame. */
export const bus = {
  ready: false, // 3D stage has rendered its first frame
  target: "nest", // "nest" | product row index
  version: 0, // bumps whenever target changes
  tapVersion: 0, // bumps when the perched rabbit is tapped
  nestEl: null, // hero poster rabbit box
  standEls: [], // stand elements, each contains a [data-perch] marker
  hitEl: null, // invisible button that follows the rabbit for taps
  pointer: { x: -9999, y: -9999 }, // page coords
  reduce: false,
  mobile: false,
  onReady: null,
  onLand: null, // (rowIndex, direction, power) => void
  onLeaveNest: null,
  onReturnNest: null,
};

export function sendRabbit(target) {
  if (bus.target === target) return;
  bus.target = target;
  bus.version += 1;
}

export function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
