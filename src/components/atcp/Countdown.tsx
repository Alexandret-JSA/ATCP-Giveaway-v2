import { useEffect, useState } from "react";

import { ENTRIES_CLOSE } from "@/lib/event-config";

const pad = (n: number) => String(n).padStart(2, "0");

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

/**
 * Real React countdown (useEffect + setInterval). Inline <script> tags do NOT run inside an
 * AI Studio page, which is why the original HTML countdown froze at 00.
 * The first render is always zeros so server and browser markup match (no hydration warning).
 */
export function Countdown({ label }: { label?: string }) {
  const [t, setT] = useState(() => split(0));

  useEffect(() => {
    const tick = () => setT(split(ENTRIES_CLOSE - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="cd" role="timer" aria-label="Time until entries close">
      {label ? <small>{label}</small> : null}
      <b>{pad(t.d)}</b>
      <i>d</i>
      <b>{pad(t.h)}</b>
      <i>h</i>
      <b>{pad(t.m)}</b>
      <i>m</i>
      <b>{pad(t.s)}</b>
      <i>s</i>
    </div>
  );
}
