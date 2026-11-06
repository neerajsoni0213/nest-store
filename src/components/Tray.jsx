import { useEffect, useRef, useState } from "react";
import { MessageCircle, Minus, Plus, Trash2, X } from "lucide-react";
import { Asset } from "./Asset.jsx";
import { CloverIcon } from "../illustrations/ornaments.jsx";
import { ASSETS, STORE, fmt } from "../config/store.js";

function buildOrderMessage({ lines, subtotal, shipping, total, orderNo, form }) {
  const out = [];
  out.push("*NEST — New Order* ✦", `Order: ${orderNo}`, `Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`, "");
  lines.forEach(({ p, q, total: t }, i) => {
    out.push(`${i + 1}. ${p.name}`, `    ${q} × Rs. ${p.price} = ${fmt(t)}`);
  });
  out.push("", `Subtotal: ${fmt(subtotal)}`, `Shipping: ${shipping === 0 ? "FREE" : fmt(shipping)}`, `*Total: ${fmt(total)}*`, "");
  if (form.name.trim()) out.push(`Name: ${form.name.trim()}`);
  if (form.phone.trim()) out.push(`Phone: ${form.phone.trim()}`);
  if (form.address.trim()) out.push(`Ship to: ${form.address.trim()}`);
  out.push("", STORE.upiId ? `Payment: UPI to ${STORE.upiId} — I'll share the payment screenshot here.` : "Payment: UPI — please share your UPI ID / QR code.");
  out.push("", "Good things take time. 🐇");
  return out.join("\n");
}

export function Tray({ open, onClose, lines, setQty, subtotal, shipping, total, orderNo }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const closeRef = useRef(null);
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);
  const remaining = Math.max(0, STORE.freeShippingAbove - subtotal);
  const pct = Math.min(100, (subtotal / STORE.freeShippingAbove) * 100);
  const placeOrder = () => {
    const msg = buildOrderMessage({ lines, subtotal, shipping, total, orderNo, form });
    const num = STORE.whatsappNumber.replace(/\D/g, "");
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };
  const field = (key, label, props = {}) => (
    <label className="block">
      <span className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-cobalt/80">{label}</span>
      {props.multiline ? (
        <textarea
          rows={2}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="mt-1 w-full resize-none bg-transparent border-b border-cobalt text-[16px] py-1.5 outline-none focus:border-b-2"
        />
      ) : (
        <input
          type={props.type || "text"}
          value={form[key]}
          autoComplete={props.autoComplete}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="mt-1 w-full bg-transparent border-b border-cobalt text-[16px] py-1.5 outline-none focus:border-b-2"
        />
      )}
    </label>
  );

  return (
    <div className="fixed inset-0 z-[60]" style={{ visibility: open ? "visible" : "hidden", transition: `visibility 0s linear ${open ? "0s" : ".5s"}` }} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-cobalt/30 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Collector's Tray"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-porcelain border-l border-cobalt flex flex-col transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-5 border-b border-cobalt shrink-0">
          <span className="text-sm font-extrabold uppercase tracking-[0.14em]">Collector's Tray</span>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close tray" className="grid place-items-center w-9 h-9 rounded-full border border-cobalt hover:bg-cobalt/5">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="bg-cream border border-cobalt/25 px-5 pt-6 pb-4 shadow-[0_14px_30px_-20px_rgba(10,60,140,.6)]">
            <div className="text-center">
              <p className="font-serif text-3xl font-bold">NEST</p>
              <p className="text-[12px] font-bold tracking-[0.14em] mt-1">GOOD THINGS TAKE TIME</p>
              <p className="font-mono text-[13px] mt-3 text-cobalt/80">
                {orderNo} · {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
            <div className="my-4 border-t-2 border-dotted border-cobalt" />

            {lines.length === 0 ? (
              <div className="py-8 text-center">
                <CloverIcon className="w-10 mx-auto text-clover" />
                <p className="mt-3 font-serif italic text-lg">Your tray is empty.</p>
                <p className="font-sans text-sm opacity-80 mt-1">Pick something small and lovely from the menu.</p>
              </div>
            ) : (
              <ul>
                {lines.map(({ p, q, total: t }) => (
                  <li key={p.id} className="py-4 border-b border-dotted border-cobalt/60 last:border-b-0">
                    <div className="flex gap-3">
                      <div className="w-14 h-14 shrink-0 rounded-lg bg-porcelain border border-cobalt/20 p-1.5">
                        <Asset src={ASSETS.products[p.asset]} alt={p.name} Fallback={p.Svg} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-[15px] truncate min-w-0">{p.short}</span>
                          <span className="leader" aria-hidden="true" />
                          <span className="font-mono text-sm whitespace-nowrap">{fmt(t)}</span>
                        </div>
                        <p className="text-[13px] text-cobalt/75 mt-0.5">
                          {fmt(p.price)} each · {p.category}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="inline-flex items-center rounded-full border border-cobalt">
                            <button type="button" aria-label={`Remove one ${p.short}`} onClick={() => setQty(p.id, q - 1)} className="grid place-items-center w-8 h-8">
                              <Minus size={14} />
                            </button>
                            <span className="font-mono text-sm w-6 text-center" aria-live="polite">
                              {q}
                            </span>
                            <button type="button" aria-label={`Add one ${p.short}`} onClick={() => setQty(p.id, q + 1)} className="grid place-items-center w-8 h-8">
                              <Plus size={14} />
                            </button>
                          </div>
                          <button type="button" aria-label={`Remove ${p.short} from tray`} onClick={() => setQty(p.id, 0)} className="grid place-items-center w-8 h-8 rounded-full hover:bg-cobalt/5">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {lines.length > 0 && (
              <>
                <div className="my-4 border-t-2 border-dotted border-cobalt" />
                <div>
                  <div className="flex justify-between text-[13px] font-semibold">
                    <span>{remaining > 0 ? `Add ${fmt(remaining)} for free shipping` : "Free shipping unlocked ✦"}</span>
                    <span>{fmt(STORE.freeShippingAbove)}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full border border-cobalt overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}>
                    <div className="h-full bg-clover transition-[width] duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="mt-5 space-y-1.5 font-mono text-sm">
                  {[
                    ["Subtotal", fmt(subtotal)],
                    ["Shipping", shipping === 0 ? "Free" : fmt(shipping)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline gap-2">
                      <span>{k}</span>
                      <span className="leader" aria-hidden="true" />
                      <span>{v}</span>
                    </div>
                  ))}
                  <div className="flex items-baseline gap-2 pt-2 text-base font-medium">
                    <span>TOTAL</span>
                    <span className="leader" aria-hidden="true" />
                    <span>{fmt(total)}</span>
                  </div>
                </div>
                <div className="my-4 border-t-2 border-dotted border-cobalt" />
                <div className="space-y-4">
                  {field("name", "Name", { autoComplete: "name" })}
                  {field("phone", "Phone", { type: "tel", autoComplete: "tel" })}
                  {field("address", "Shipping address & PIN", { multiline: true })}
                </div>
              </>
            )}
            <p className="mt-5 text-center text-[12px] font-bold tracking-[0.14em]">✦ THANK YOU ✦</p>
          </div>
          <div className="receipt-edge" />
        </div>

        <div className="shrink-0 border-t border-cobalt p-5">
          <button
            type="button"
            disabled={lines.length === 0}
            onClick={placeOrder}
            className="w-full h-12 rounded-full bg-cobalt text-cream text-[15px] font-bold tracking-[0.03em] inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cobalt-deep transition-colors"
          >
            <MessageCircle size={16} /> Place Order via WhatsApp / UPI
          </button>
          <p className="mt-2 text-center text-[12.5px] text-cobalt/75">Opens WhatsApp with your bill pre-filled · pay by UPI</p>
        </div>
      </aside>
    </div>
  );
}

