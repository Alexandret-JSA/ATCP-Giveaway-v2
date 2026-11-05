// Google Tag Manager dataLayer helpers. CLIENT-ONLY: call from effects / event handlers.
// GTM fires the Meta Pixel; we only push events and the shared event_id. See docs/tracking.md.

type DataLayerEvent = { event: string } & Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function pushEvent(e: DataLayerEvent) {
  try {
    (window.dataLayer ??= []).push(e);
  } catch {
    // tracking must never break the page
  }
}
