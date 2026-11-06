import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

/* "Add to Home Screen" support.
   - Chrome / Edge / Android: uses the native install prompt.
   - iPhone / iPad Safari: shows the two-tap instructions (Apple has no prompt API). */
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

export function useInstall() {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setIos(isIOS());
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const canInstall = !installed && (!!deferred || ios);
  const install = async () => {
    if (deferred) {
      deferred.prompt();
      await deferred.userChoice.catch(() => null);
      setDeferred(null);
      return "prompted";
    }
    return ios ? "ios" : "none";
  };
  return { canInstall, install, ios };
}

export function InstallButton({ className = "", compact = false }) {
  const { canInstall, install } = useInstall();
  const [sheet, setSheet] = useState(false);
  if (!canInstall) return null;
  const onClick = async () => {
    const r = await install();
    if (r === "ios") setSheet(true);
  };
  return (
    <>
      <button type="button" onClick={onClick} className={className} aria-label="Install the NEST app">
        <Download size={16} strokeWidth={2} />
        {!compact && <span>Install app</span>}
      </button>
      {sheet && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-cobalt/30 p-4" onClick={() => setSheet(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-cobalt bg-cream p-6 text-cobalt shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Install NEST on iPhone">
            <div className="flex items-start justify-between gap-4">
              <p className="font-serif text-2xl font-bold">Add NEST to your Home Screen</p>
              <button type="button" onClick={() => setSheet(false)} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cobalt">
                <X size={16} />
              </button>
            </div>
            <ol className="mt-4 space-y-3 text-[16px]">
              <li className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cobalt text-sm font-bold text-cream">1</span>
                <span>
                  Tap <Share size={16} className="inline -mt-1" /> <strong>Share</strong> in Safari's toolbar.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cobalt text-sm font-bold text-cream">2</span>
                <span>
                  Choose <strong>Add to Home Screen</strong>, then <strong>Add</strong>.
                </span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
