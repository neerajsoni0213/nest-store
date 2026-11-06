import { useEffect, useState } from "react";

/* Shows the SVG fallback until the image is confirmed to load, so a missing
   file never flashes a broken-image icon. */
const imageStatus = new Map();
export function useImageOk(src) {
  const [ok, setOk] = useState(() => imageStatus.get(src) === "ok");
  useEffect(() => {
    if (!src) return undefined;
    const known = imageStatus.get(src);
    if (known === "ok") {
      setOk(true);
      return undefined;
    }
    if (known === "fail") return undefined;
    let alive = true;
    let pending = known instanceof Promise ? known : null;
    if (!pending) {
      pending = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve("ok");
        img.onerror = () => resolve("fail");
        img.src = src;
      });
      imageStatus.set(src, pending);
    }
    pending.then((r) => {
      imageStatus.set(src, r);
      if (alive && r === "ok") setOk(true);
    });
    return () => {
      alive = false;
    };
  }, [src]);
  return ok;
}

export function Asset({ src, alt, Fallback, fit = "object-contain", position = "object-center" }) {
  const ok = useImageOk(src);
  if (!ok) return <Fallback className="block w-full h-full" />;
  return <img src={src} alt={alt} draggable={false} className={`block w-full h-full ${fit} ${position}`} />;
}
