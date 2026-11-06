import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { Stand } from "./Stand.jsx";
import { Sparkle } from "../illustrations/ornaments.jsx";
import { TYPE_LABEL } from "../data/products.js";

export function ProductRow({ product, index, rowRef, standRef, onAdd, onPendantFlick, inTray }) {
  const standLeft = index % 2 === 0; // rows 1, 3, 5, 7, 9 → stand on the left
  const [added, setAdded] = useState(false);
  const addBtn = useRef(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const num = String(index + 1).padStart(2, "0");
  const isPair = product.type === "dangle" || product.type === "stud";

  const handleAdd = () => {
    onAdd(product.id, addBtn.current);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1400);
  };

  const specs = [
    ["Weight", product.weight ? `${product.weight.toFixed(1)} g${isPair ? " / pair" : ""}` : "—"],
    [product.type === "dangle" ? "Drop" : "Size", product.size],
    product.note,
  ];

  return (
    <article ref={rowRef} id={`item-${product.id}`} className="relative z-[1] grid md:grid-cols-2 md:min-h-[78vh] border-b border-cobalt scroll-mt-16" aria-labelledby={`t-${product.id}`}>
      <div
        className={`relative flex items-center pt-24 pb-4 md:py-20 border-cobalt md:justify-center ${
          standLeft ? "justify-start md:order-1 md:border-r" : "justify-end md:order-2 md:border-l"
        }`}
      >
        <span className={`absolute top-6 font-mono text-sm tracking-[0.12em] ${standLeft ? "left-6" : "right-6"}`}>No. {num}</span>
        <div className={standLeft ? "ml-3 mr-auto md:mx-auto" : "ml-auto mr-3 md:mx-auto"}>
          <Stand product={product} standRef={standRef} onPendantFlick={onPendantFlick} />
        </div>
      </div>

      <div className={`flex items-center px-6 pb-16 md:px-14 md:py-20 ${standLeft ? "md:order-2" : "md:order-1"}`}>
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-3 eyebrow">
            <Sparkle className="w-3.5 shrink-0" />
            <span>{product.category}</span>
            <span className="h-px flex-1 bg-cobalt/40" />
            <span>{TYPE_LABEL[product.type]}</span>
          </div>

          <h3 id={`t-${product.id}`} className="mt-6 flex items-end gap-3">
            <span className="font-display font-extrabold uppercase leading-[1.02] tracking-[-0.01em] text-[clamp(1.75rem,3.1vw,2.6rem)] max-w-[74%]">{product.name}</span>
            <span className="leader" aria-hidden="true" />
            <span className="font-mono text-xl md:text-2xl font-medium whitespace-nowrap">Rs. {product.price}</span>
          </h3>

          <p className="mt-5 font-serif text-[1.35rem] md:text-[1.5rem] leading-[1.4]">
            {product.poem[0]}
            <br />
            {product.poem[1]}
          </p>
          <p className="mt-3 text-[17px] leading-relaxed text-cobalt/90">{product.detail}</p>

          <dl className="mt-7 grid grid-cols-3 border-y border-cobalt divide-x divide-cobalt">
            {specs.map(([k, v]) => (
              <div key={k} className="py-3.5 px-3 first:pl-0">
                <dt className="text-[12px] font-bold uppercase tracking-[0.12em] text-cobalt/75">{k}</dt>
                <dd className="mt-1 text-[15px] md:text-base font-semibold leading-snug">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              ref={addBtn}
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2.5 h-[52px] px-7 rounded-full bg-cobalt text-cream text-[15px] font-bold tracking-[0.04em] hover:bg-cobalt-deep active:scale-[0.98] transition"
            >
              {added ? <Check size={18} strokeWidth={2.2} /> : <ShoppingBag size={18} strokeWidth={2} />}
              {added ? "Added to Tray" : "Add to Tray"}
            </button>
            {inTray > 0 && <span className="text-[15px] font-semibold text-cobalt/80">{inTray} in your tray</span>}
          </div>
        </div>
      </div>
    </article>
  );
}
