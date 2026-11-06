import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { bus } from "../lib/rabbitBus.js";
import { RabbitModel, createRabbitMaterials } from "./RabbitModel.jsx";

/* ==========================================================================
   Rabbit stage — one transparent, fixed, full-viewport canvas with an
   orthographic camera where 1 world unit = 1 CSS pixel. That lets the 3D
   rabbit land exactly on DOM elements (the stand bars) every frame.

   Motion model per hop:
     anticipation crouch → launch kick → true ballistic parabola (pitch follows
     the velocity vector, ears lag on springs, legs extend / tuck / reach) →
     touchdown: spring squash + ear flop + stand shake + clover puff.
   ========================================================================== */

class Spring {
  constructor(x, k, c) {
    this.x = x;
    this.v = 0;
    this.t = x;
    this.k = k;
    this.c = c;
  }
  step(dt) {
    // semi-implicit Euler, sub-stepped for stability at low frame rates
    const n = 2;
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      this.v += (-this.k * (this.x - this.t) - this.c * this.v) * h;
      this.x += this.v * h;
    }
    return this.x;
  }
  snap(x) {
    this.x = this.t = x;
    this.v = 0;
  }
}

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const YAW_RIGHT = -0.62; // 3/4 view, travelling right
const YAW_LEFT = -Math.PI + 0.62; // 3/4 view, travelling left
const YAW_FRONT = -Math.PI / 2; // facing the viewer
const MODEL_H = 1.45; // model height to ear tips, in model units

/* ---------- geometry helpers ---------- */
function cloverGeometry() {
  const heart = new THREE.Shape();
  heart.moveTo(0, 0);
  heart.bezierCurveTo(-0.36, 0.14, -0.52, 0.56, -0.26, 0.72);
  heart.bezierCurveTo(-0.1, 0.8, 0, 0.7, 0, 0.6);
  heart.bezierCurveTo(0, 0.7, 0.1, 0.8, 0.26, 0.72);
  heart.bezierCurveTo(0.52, 0.56, 0.36, 0.14, 0, 0);
  const parts = [0, 1, 2].map((i) => {
    const g = new THREE.ShapeGeometry(heart, 10);
    g.rotateZ((i * Math.PI * 2) / 3);
    return g;
  });
  const merged = mergeGeometries(parts);
  merged.computeVertexNormals();
  return merged;
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(10,40,95,0.9)");
  grd.addColorStop(0.55, "rgba(10,40,95,0.35)");
  grd.addColorStop(1, "rgba(10,40,95,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- page-coordinate anchors ---------- */
function perchPoint(index) {
  const el = bus.standEls[index]?.querySelector("[data-perch]");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY };
}
function nestPoint() {
  const el = bus.nestEl;
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width * 0.5 + window.scrollX, y: r.top + r.height * 0.9 + window.scrollY, scale: (r.height * 0.8) / MODEL_H, h: r.height };
}

const MAX_LEAVES = 48;

function Director() {
  const parts = useRef({});
  const leaves = useRef(null);
  const shadow = useRef(null);
  const { size } = useThree();
  const materials = useMemo(() => createRabbitMaterials(), []);
  const clover = useMemo(() => cloverGeometry(), []);
  const leafMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6E9A57", roughness: 0.6, side: THREE.DoubleSide }), []);
  const shadowTex = useMemo(() => shadowTexture(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const springs = useMemo(
    () => ({
      squash: new Spring(1, 260, 11),
      earL: new Spring(-0.25, 120, 7),
      earR: new Spring(-0.25, 140, 8.5),
      pitch: new Spring(0, 170, 20),
      hind: new Spring(0, 280, 24),
      front: new Spring(0, 280, 24),
      nod: new Spring(0, 90, 11),
      turn: new Spring(0, 70, 12),
      yaw: new Spring(YAW_FRONT, 70, 16),
    }),
    []
  );

  const st = useRef({
    mode: "hidden",
    version: -1,
    tapVersion: bus.tapVersion,
    x: 0,
    y: 0,
    scale: 70,
    facing: 1,
    station: null,
    flight: null,
    opacity: 1,
    t: 0,
    nextTwitch: 2.5,
    nextWiggle: 1.2,
    wiggle: 0,
  });

  // clover particle pool (page coordinates)
  const pool = useMemo(
    () =>
      Array.from({ length: MAX_LEAVES }, () => ({
        alive: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rx: 0,
        ry: 0,
        rz: 0,
        wx: 0,
        wy: 0,
        wz: 0,
        life: 0,
        max: 1,
        size: 10,
      })),
    []
  );

  const emit = (x, y, n, power = 1) => {
    if (bus.reduce) return;
    let made = 0;
    for (const p of pool) {
      if (p.alive) continue;
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25;
      const sp = (160 + Math.random() * 260) * power;
      Object.assign(p, {
        alive: true,
        x: x + (Math.random() - 0.5) * 30,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        rx: Math.random() * 6,
        ry: Math.random() * 6,
        rz: Math.random() * 6,
        wx: (Math.random() - 0.5) * 14,
        wy: (Math.random() - 0.5) * 14,
        wz: (Math.random() - 0.5) * 10,
        life: 0,
        max: 1.1 + Math.random() * 0.8,
        size: (7 + Math.random() * 8) * (power > 0.8 ? 1.3 : 1),
      });
      if (++made >= n) break;
    }
  };

  const setOpacity = (o) => {
    const s = st.current;
    if (Math.abs(s.opacity - o) < 0.001) return;
    const wasOpaque = s.opacity >= 1;
    s.opacity = o;
    materials.list.forEach((m) => {
      if (m.isLineBasicMaterial) {
        m.opacity = 0.55 * o;
        return;
      }
      const transparent = o < 1;
      if (m.transparent !== transparent) {
        m.transparent = transparent;
        m.needsUpdate = true;
      }
      m.opacity = o;
    });
    if (wasOpaque !== o >= 1) materials.list.forEach((m) => (m.needsUpdate = true));
  };

  const startTravel = (target) => {
    const s = st.current;
    const isNest = target === "nest";
    if (isNest && (s.mode === "hidden" || s.mode === "homeFade")) return;
    if (!isNest && !bus.standEls[target]) return;

    let breakaway = false;
    if (s.mode === "hidden" || s.mode === "homeFade") {
      const n = nestPoint();
      if (!n) return;
      breakaway = true;
      Object.assign(s, { x: n.x, y: n.y, scale: n.scale, facing: 1 });
      springs.yaw.snap(YAW_FRONT);
      springs.squash.snap(1);
      springs.pitch.snap(0);
      springs.hind.snap(0);
      springs.front.snap(0);
      setOpacity(1);
      bus.onLeaveNest?.();
      emit(n.x, n.y - n.h * 0.3, 14, 1.15);
    }
    const mobile = bus.mobile;
    s.flight = {
      t: 0,
      target,
      breakaway,
      from: { x: s.x, y: s.y, scale: s.scale },
      crouch: breakaway ? 0.22 : 0.15,
      air: (breakaway ? 1.0 : isNest ? 0.85 : 0.64) * (mobile ? 0.92 : 1),
      lift: (breakaway ? 210 : isNest ? 180 : 135) * (mobile ? 0.72 : 1),
      launched: false,
    };
    s.station = null;
    s.mode = bus.reduce ? "fadeMove" : "flight";
  };

  const landOnStand = (index, power = 1) => {
    const s = st.current;
    s.mode = "perched";
    s.station = index;
    springs.squash.t = 1;
    springs.squash.v -= 9 * power; // compress on impact
    springs.earL.v += 6 * power; // ears flop forward…
    springs.earR.v += 4.8 * power; // …slightly out of phase
    springs.pitch.t = 0;
    springs.hind.t = 0;
    springs.front.t = 0;
    springs.nod.v += 3 * power;
    bus.onLand?.(index, s.facing, power);
    const p = perchPoint(index);
    if (p) emit(p.x, p.y - 4, 4, 0.45);
  };

  // pointer tracking for the idle "notice the cursor" behaviour
  useEffect(() => {
    const onMove = (e) => {
      bus.pointer.x = e.clientX + window.scrollX;
      bus.pointer.y = e.clientY + window.scrollY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const s = st.current;
    const P = parts.current;
    if (!P.root) return;
    s.t += dt;
    const W = size.width;
    const H = size.height;
    const sx = window.scrollX;
    const sy = window.scrollY;
    const S = bus.mobile ? 58 : 80;
    const toWorld = (px, py) => [px - sx - W / 2, H / 2 - (py - sy)];

    if (bus.version !== s.version) {
      s.version = bus.version;
      startTravel(bus.target);
    }
    if (bus.tapVersion !== s.tapVersion) {
      s.tapVersion = bus.tapVersion;
      if (s.mode === "perched") {
        s.flight = { t: 0, crouch: 0.12, air: 0.7, lift: bus.mobile ? 80 : 105, launched: false };
        s.mode = bus.reduce ? "perched" : "flip";
        if (bus.reduce) bus.onLand?.(s.station, s.facing, 0.4);
      }
    }

    let flipAngle = 0;
    let shadowPoint = null;
    let shadowAlpha = 0;
    let breathe = 1;

    /* ---------------- modes ---------------- */
    if (s.mode === "flight") {
      const f = s.flight;
      f.t += dt;
      const isNest = f.target === "nest";
      const to = isNest ? nestPoint() : perchPoint(f.target);
      if (!to) {
        s.mode = "hidden";
      } else {
        const toScale = isNest ? to.scale : S;
        const dx = to.x - f.from.x;
        if (Math.abs(dx) > 4) s.facing = dx > 0 ? 1 : -1;
        springs.yaw.t = s.facing > 0 ? YAW_RIGHT : YAW_LEFT;

        if (f.t < f.crouch) {
          // anticipation: load the springs
          s.x = f.from.x;
          s.y = f.from.y;
          springs.squash.t = 0.78;
          springs.hind.t = 0.35;
          springs.front.t = 0.3;
          springs.earL.t = springs.earR.t = -0.6;
          springs.pitch.t = -0.06;
        } else {
          if (!f.launched) {
            f.launched = true;
            springs.squash.t = 1;
            springs.squash.v += 8; // stretch off the bar
            springs.hind.v -= 16; // kick back
            springs.front.v += 10;
          }
          const u = clamp((f.t - f.crouch) / f.air, 0, 1);
          const k = lerp(u, easeIO(u), 0.35);
          s.x = lerp(f.from.x, to.x, k);
          // ballistic arc in "up" coordinates: linear base + 4h·u(1−u)
          // Parabola through start and target whose apex sits `lift` px above
          // the higher of the two — so even long downward hops leap UP first.
          const a = -f.from.y;
          const b = -to.y;
          const D = b - a;
          const Pk = Math.max(0, D) + f.lift;
          const B = 2 * Pk + 2 * Math.sqrt(Math.max(0, Pk * (Pk - D)));
          const Cq = D - B;
          const up = a + B * u + Cq * u * u;
          s.y = -up;
          const vUp = B + 2 * Cq * u;
          const h = Pk;
          springs.pitch.t = clamp(Math.atan2(vUp, Math.abs(dx) + 420) * 0.85, -0.6, 0.6);
          const earT = -0.25 - 0.65 * clamp(vUp / (2.5 * h), -1, 1);
          springs.earL.t = earT;
          springs.earR.t = earT + 0.06;
          springs.hind.t = u < 0.5 ? lerp(-1.15, 0.5, smooth(0, 0.38, u)) : lerp(0.5, 0.05, smooth(0.62, 0.96, u));
          springs.front.t = u < 0.45 ? lerp(1.05, -0.55, smooth(0, 0.34, u)) : lerp(-0.55, 0.9, smooth(0.55, 0.93, u));
          s.scale = lerp(f.from.scale, toScale, smooth(0, 1, u));
          shadowPoint = isNest ? null : to;
          shadowAlpha = smooth(0.45, 1, u);

          if (u >= 1) {
            s.x = to.x;
            s.y = to.y;
            s.scale = toScale;
            if (isNest) {
              s.mode = "homeFade";
              s.fadeT = 0;
              springs.squash.v -= 6;
              springs.pitch.t = 0;
              springs.hind.t = springs.front.t = 0;
              springs.yaw.t = YAW_FRONT;
              bus.onReturnNest?.();
              emit(to.x, to.y - to.h * 0.25, 6, 0.5);
            } else {
              landOnStand(f.target, f.breakaway ? 1.2 : 1);
            }
          }
        }
      }
    } else if (s.mode === "fadeMove") {
      // reduced motion: a soft cross-fade instead of a leap
      const f = s.flight;
      f.t += dt;
      const isNest = f.target === "nest";
      if (f.t < 0.18) setOpacity(1 - f.t / 0.18);
      else {
        const to = isNest ? nestPoint() : perchPoint(f.target);
        if (to) {
          s.x = to.x;
          s.y = to.y;
          s.scale = isNest ? to.scale : S;
        }
        if (isNest) {
          s.mode = "hidden";
          bus.onReturnNest?.();
        } else {
          setOpacity(clamp((f.t - 0.18) / 0.22, 0, 1));
          if (f.t >= 0.4) {
            setOpacity(1);
            s.mode = "perched";
            s.station = f.target;
            bus.onLand?.(f.target, s.facing, 0);
          }
        }
      }
    } else if (s.mode === "flip") {
      const f = s.flight;
      f.t += dt;
      const p = perchPoint(s.station);
      if (p) {
        s.x = p.x;
        s.y = p.y;
      }
      shadowPoint = p;
      shadowAlpha = 1;
      if (f.t < f.crouch) {
        springs.squash.t = 0.76;
        springs.earL.t = springs.earR.t = -0.55;
      } else {
        if (!f.launched) {
          f.launched = true;
          springs.squash.t = 1;
          springs.squash.v += 9;
          springs.hind.v -= 14;
        }
        const u = clamp((f.t - f.crouch) / f.air, 0, 1);
        s.y -= 4 * f.lift * u * (1 - u);
        flipAngle = Math.PI * 2 * easeIO(clamp((u - 0.05) / 0.9, 0, 1));
        springs.hind.t = lerp(0.6, 0, smooth(0.7, 1, u));
        springs.front.t = lerp(-0.7, 0.6, smooth(0.6, 0.95, u));
        springs.earL.t = springs.earR.t = -0.9 + smooth(0.5, 1, u) * 1.1;
        shadowAlpha = 1 - 0.6 * Math.sin(u * Math.PI);
        if (u >= 1) landOnStand(s.station, 1.25);
      }
    } else if (s.mode === "perched") {
      const p = perchPoint(s.station);
      if (p) {
        s.x = p.x;
        s.y = p.y;
      }
      s.scale = lerp(s.scale, S, 1 - Math.exp(-8 * dt));
      shadowPoint = p;
      shadowAlpha = 1;
      springs.yaw.t = s.facing > 0 ? -1.02 : -Math.PI + 1.02; // turn a little more toward the viewer
      breathe = 1 + 0.014 * Math.sin(s.t * 3.1);

      // notice the cursor: ears perk, head tilts toward it
      const hx = s.x;
      const hy = s.y - s.scale * 0.9;
      const ddx = bus.pointer.x - hx;
      const ddy = bus.pointer.y - hy;
      const near = Math.hypot(ddx, ddy) < 220;
      const base = near ? -0.02 : -0.22;
      springs.earL.t = base;
      springs.earR.t = base + 0.05;
      springs.nod.t = near ? clamp(-ddy / 400, -0.25, 0.25) : 0;
      springs.turn.t = near ? clamp((ddx / 400) * -s.facing, -0.35, 0.35) : 0;

      if (s.t > s.nextTwitch) {
        (Math.random() < 0.5 ? springs.earL : springs.earR).v += (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 4);
        s.nextTwitch = s.t + 2.2 + Math.random() * 3.5;
      }
      if (s.t > s.nextWiggle) {
        s.wiggle = 0.6;
        s.nextWiggle = s.t + 1.5 + Math.random() * 3;
      }
    } else if (s.mode === "homeFade") {
      s.fadeT += dt;
      const n = nestPoint();
      if (n) {
        s.x = n.x;
        s.y = n.y;
        s.scale = n.scale;
      }
      setOpacity(clamp(1 - s.fadeT / 0.32, 0, 1));
      if (s.fadeT >= 0.32) s.mode = "hidden";
    }

    /* ---------------- integrate springs ---------------- */
    Object.values(springs).forEach((sp) => sp.step(dt));
    s.wiggle = Math.max(0, s.wiggle - dt);

    /* ---------------- apply to the model ---------------- */
    const visible = s.mode !== "hidden";
    P.root.visible = visible;
    if (visible) {
      const [wx, wy] = toWorld(s.x, s.y);
      P.root.position.set(wx, wy, 0);
      P.root.scale.setScalar(s.scale);
      P.yaw.rotation.y = springs.yaw.x;
      const sq = clamp(springs.squash.x, 0.55, 1.45);
      const side = 1 / Math.sqrt(sq);
      P.squash.scale.set(side, sq, side);
      P.pitch.rotation.z = springs.pitch.x + flipAngle;
      P.breath.scale.set(1, breathe, 1 + (breathe - 1) * 0.6);
      P.earL.rotation.z = springs.earL.x;
      P.earR.rotation.z = springs.earR.x;
      P.frontL.rotation.z = springs.front.x;
      P.frontR.rotation.z = springs.front.x * 0.9;
      P.hindL.rotation.z = springs.hind.x;
      P.hindR.rotation.z = springs.hind.x * 0.92;
      P.head.rotation.z = springs.nod.x;
      P.head.rotation.y = springs.turn.x;
      P.tail.rotation.y = Math.sin(s.t * 9) * 0.25 * (s.mode === "perched" ? 0.3 : 1);
      const w = s.wiggle > 0 ? Math.abs(Math.sin(s.t * 38)) * 0.35 : 0;
      P.nose.scale.set(1, 1 + w, 1 + w * 0.5);
    }

    /* contact shadow on the stand */
    if (shadow.current) {
      const a = visible && shadowPoint ? 0.2 * shadowAlpha : 0;
      shadow.current.visible = a > 0.005;
      if (shadowPoint) {
        const [wx, wy] = toWorld(shadowPoint.x, shadowPoint.y);
        shadow.current.position.set(wx, wy + 2, -400);
        const sc = S * 1.05 * (0.6 + 0.4 * shadowAlpha);
        shadow.current.scale.set(sc, sc, 1);
      }
      shadow.current.material.opacity = a;
    }

    /* tap target follows the rabbit */
    if (bus.hitEl) {
      const on = s.mode === "perched";
      const box = s.scale * 1.3;
      const vx = s.x - sx;
      const vy = s.y - sy;
      bus.hitEl.style.pointerEvents = on ? "auto" : "none";
      bus.hitEl.style.width = bus.hitEl.style.height = `${box}px`;
      bus.hitEl.style.transform = `translate3d(${vx - box / 2}px, ${vy - box}px, 0)`;
    }

    /* clover particles */
    const mesh = leaves.current;
    if (mesh) {
      let i = 0;
      for (const p of pool) {
        if (!p.alive) continue;
        p.life += dt;
        if (p.life >= p.max) {
          p.alive = false;
          continue;
        }
        p.vy += 620 * dt; // gravity (page y points down)
        p.vx *= 1 - 1.6 * dt; // air drag
        p.vy *= 1 - 1.2 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rx += p.wx * dt;
        p.ry += p.wy * dt;
        p.rz += p.wz * dt;
        const [wx, wy] = toWorld(p.x, p.y);
        const fade = 1 - smooth(0.7, 1, p.life / p.max);
        dummy.position.set(wx, wy, 120);
        dummy.rotation.set(p.rx, p.ry, p.rz);
        dummy.scale.setScalar(p.size * fade);
        dummy.updateMatrix();
        mesh.setMatrixAt(i++, dummy.matrix);
      }
      mesh.count = i;
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <mesh ref={shadow} renderOrder={-1}>
        <planeGeometry args={[1, 0.32]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0} />
      </mesh>
      <RabbitModel parts={parts} materials={materials} />
      <instancedMesh ref={leaves} args={[clover, leafMat, MAX_LEAVES]} frustumCulled={false} />
    </>
  );
}

export default function RabbitStage() {
  return (
    <Canvas
      orthographic
      flat
      dpr={[1, 2]}
      camera={{ zoom: 1, position: [0, 0, 1000], near: 1, far: 4000 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        requestAnimationFrame(() => {
          bus.ready = true;
          bus.onReady?.();
        });
      }}
    >
      <hemisphereLight args={["#FFF6E6", "#3557A6", 1.6]} />
      <directionalLight color="#FFF1DC" intensity={2.6} position={[-300, 650, 800]} />
      <directionalLight color="#A9BEFF" intensity={1.3} position={[500, 150, -700]} />
      <Director />
    </Canvas>
  );
}
