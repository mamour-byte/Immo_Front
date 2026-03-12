import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LottieLoader from "./LottieLoader";

export default function GlobalQueryLoader({
  includeFetching = false,
  delayMs = 150,
  minVisibleMs = 250,
  message = "Chargement...",
}) {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const active = isMutating > 0 || (includeFetching && isFetching > 0);

  const [visible, setVisible] = useState(false);
  const [shownAt, setShownAt] = useState(0);

  useEffect(() => {
    let t;

    if (active) {
      t = setTimeout(() => {
        setVisible(true);
        setShownAt(Date.now());
      }, delayMs);
      return () => clearTimeout(t);
    }

    if (!visible) return;
    const elapsed = Date.now() - shownAt;
    const remaining = Math.max(0, minVisibleMs - elapsed);
    t = setTimeout(() => setVisible(false), remaining);
    return () => clearTimeout(t);
  }, [active, delayMs, minVisibleMs, shownAt, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white/80 px-6 py-5 shadow-sm ring-1 ring-slate-200">
        <LottieLoader size={120} title={message} />
        <div className="text-sm font-medium text-slate-700">{message}</div>
      </div>
    </div>
  );
}
