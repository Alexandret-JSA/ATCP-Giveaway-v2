import { useEffect } from "react";

import { GTM_ID } from "@/lib/event-config";

const valid = (id: string) => /^GTM-[A-Z0-9]{4,}$/.test(id) && id !== "GTM-XXXXXXX";

/**
 * Loads Google Tag Manager from an effect (React never runs <script> tags rendered in JSX).
 * Does nothing until GTM_ID in src/lib/event-config.ts is a real container id.
 */
export function Gtm() {
  useEffect(() => {
    if (!valid(GTM_ID) || document.getElementById("gtm-loader")) return;
    (window.dataLayer ??= []).push({ "gtm.start": Date.now(), event: "gtm.js" });
    const s = document.createElement("script");
    s.id = "gtm-loader";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(s);
  }, []);
  return null;
}
