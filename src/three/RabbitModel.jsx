import { useMemo } from "react";
import * as THREE from "three";

/* Procedural 3D rabbit, sculpted from soft ellipsoids so it needs no model
   download. Colours are sampled from the watercolour mascot. Local frame:
   feet at y = 0, nose points +X, the rabbit's right side faces +Z.
   Every moving joint is exposed through `parts` so the director can animate
   it with springs. */

function makeFurTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 256, 256);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  // soft watercolour blotches
  for (let i = 0; i < 60; i++) {
    const x = rnd() * 256;
    const y = rnd() * 256;
    const r = 10 + rnd() * 28;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    const dark = rnd() < 0.5;
    grd.addColorStop(0, dark ? "rgba(120,95,70,.16)" : "rgba(255,248,235,.22)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // fine ink hatching, like the illustration's fur strokes
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * 256;
    const y = rnd() * 256;
    const a = Math.PI / 2 + (rnd() - 0.5) * 0.9;
    const len = 3 + rnd() * 6;
    g.strokeStyle = rnd() < 0.6 ? "rgba(70,52,36,.20)" : "rgba(255,252,244,.42)";
    g.lineWidth = 0.8;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createRabbitMaterials() {
  const fur = makeFurTexture();
  const furry = (color, extra = {}) =>
    new THREE.MeshPhysicalMaterial({ color, map: fur, roughness: 0.92, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color("#FFF2DC"), ...extra });
  const m = {
    fur: furry("#A28C6C"),
    furDark: furry("#86715A"),
    furLight: furry("#C2AE90"),
    cream: furry("#EADFCB"),
    earInner: new THREE.MeshPhysicalMaterial({ color: "#E9B2AA", roughness: 0.65, sheen: 0.6, sheenColor: new THREE.Color("#FFE4DE") }),
    nose: new THREE.MeshStandardMaterial({ color: "#C9837F", roughness: 0.45 }),
    eye: new THREE.MeshPhysicalMaterial({ color: "#1C1826", roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05 }),
    spec: new THREE.MeshBasicMaterial({ color: "#FFFFFF" }),
    whisker: new THREE.LineBasicMaterial({ color: "#5E4A38", transparent: true, opacity: 0.55 }),
  };
  m.list = Object.values(m).filter((x) => x && x.isMaterial);
  return m;
}

const SPHERE = new THREE.SphereGeometry(1, 40, 28);

function Blob({ mat, p = [0, 0, 0], s = [1, 1, 1], r = [0, 0, 0] }) {
  return <mesh geometry={SPHERE} material={mat} position={p} scale={s} rotation={r} />;
}

function Whiskers({ mat, side }) {
  const geo = useMemo(() => {
    const pts = [];
    const z = 0.1 * side;
    [
      [0.02, 0.05],
      [0, 0],
      [-0.03, -0.05],
    ].forEach(([dy, curl]) => {
      pts.push(new THREE.Vector3(0.43, 0.09 + dy, z));
      pts.push(new THREE.Vector3(0.62, 0.11 + dy + curl, z + 0.16 * side));
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [side]);
  return <lineSegments geometry={geo} material={mat} />;
}

export function RabbitModel({ parts, materials: m }) {
  const set = (k) => (o) => {
    parts.current[k] = o;
  };
  return (
    <group ref={set("root")}>
      <group ref={set("tilt")} rotation={[0.24, 0, 0]}>
        <group ref={set("yaw")}>
          <group ref={set("squash")}>
            <group ref={set("pitch")} position={[0, 0.42, 0]}>
              <group position={[0, -0.42, 0]}>
                <group ref={set("breath")}>
                  {/* torso */}
                  <Blob mat={m.fur} p={[-0.06, 0.42, 0]} s={[0.56, 0.4, 0.37]} />
                  <Blob mat={m.furDark} p={[-0.18, 0.56, 0]} s={[0.4, 0.26, 0.3]} />
                  <Blob mat={m.fur} p={[-0.3, 0.36, 0.16]} s={[0.34, 0.32, 0.2]} />
                  <Blob mat={m.fur} p={[-0.3, 0.36, -0.16]} s={[0.34, 0.32, 0.2]} />
                  <Blob mat={m.fur} p={[0.24, 0.46, 0]} s={[0.3, 0.33, 0.29]} />
                  <Blob mat={m.cream} p={[0.2, 0.33, 0]} s={[0.3, 0.22, 0.26]} />
                  {/* tail */}
                  <group ref={set("tail")} position={[-0.6, 0.5, 0]}>
                    <Blob mat={m.cream} s={[0.13, 0.13, 0.13]} />
                    <Blob mat={m.cream} p={[-0.04, 0.05, 0.03]} s={[0.09, 0.09, 0.09]} />
                  </group>
                </group>

                {/* front legs */}
                {[1, -1].map((side) => (
                  <group key={side} ref={set(side > 0 ? "frontR" : "frontL")} position={[0.28, 0.34, 0.12 * side]}>
                    <Blob mat={m.fur} p={[0, -0.15, 0]} s={[0.075, 0.17, 0.075]} />
                    <Blob mat={m.cream} p={[0.04, -0.3, 0]} s={[0.085, 0.045, 0.07]} />
                  </group>
                ))}
                {/* hind feet */}
                {[1, -1].map((side) => (
                  <group key={side} ref={set(side > 0 ? "hindR" : "hindL")} position={[-0.28, 0.2, 0.21 * side]}>
                    <Blob mat={m.fur} p={[0.02, -0.08, 0]} s={[0.16, 0.1, 0.08]} />
                    <Blob mat={m.cream} p={[0.1, -0.165, 0]} s={[0.21, 0.045, 0.08]} />
                  </group>
                ))}

                {/* head */}
                <group ref={set("head")} position={[0.36, 0.64, 0]}>
                  <Blob mat={m.fur} p={[0.15, 0.15, 0]} s={[0.3, 0.27, 0.26]} />
                  <Blob mat={m.furLight} p={[0.25, 0.05, 0.12]} s={[0.17, 0.14, 0.12]} />
                  <Blob mat={m.furLight} p={[0.25, 0.05, -0.12]} s={[0.17, 0.14, 0.12]} />
                  <Blob mat={m.cream} p={[0.38, 0.07, 0]} s={[0.1, 0.08, 0.11]} />
                  <group ref={set("nose")} position={[0.46, 0.12, 0]}>
                    <Blob mat={m.nose} s={[0.028, 0.022, 0.034]} />
                  </group>
                  {[1, -1].map((side) => (
                    <group key={side}>
                      <Blob mat={m.eye} p={[0.29, 0.2, 0.185 * side]} s={[0.055, 0.06, 0.05]} />
                      <Blob mat={m.spec} p={[0.325, 0.225, 0.21 * side]} s={[0.014, 0.014, 0.014]} />
                      <Whiskers mat={m.whisker} side={side} />
                    </group>
                  ))}
                  {/* ears */}
                  {[1, -1].map((side) => (
                    <group key={side} position={[0.05, 0.36, 0.085 * side]} rotation={[0.2 * side, 0, 0]}>
                      <group ref={set(side > 0 ? "earR" : "earL")}>
                        <Blob mat={m.fur} p={[0, 0.3, 0]} s={[0.05, 0.32, 0.1]} />
                        <Blob mat={m.earInner} p={[0.026, 0.3, 0]} s={[0.032, 0.26, 0.068]} />
                      </group>
                    </group>
                  ))}
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
