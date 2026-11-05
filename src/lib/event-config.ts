// Giveaway constants: the only place dates, links and tracking ids live. Edit here, not in components.

/** Entries close Thu Nov 12, 2026, 5:00 PM ET (22:00 UTC). */
export const ENTRIES_CLOSE = Date.UTC(2026, 10, 12, 22, 0, 0);
/** Countdowns tick to the first session, Fri Nov 20, 2026, 5:00 PM ET (22:00 UTC). */
export const SESSIONS_START = Date.UTC(2026, 10, 20, 22, 0, 0);

export const GROUP_URL = "https://www.facebook.com/groups/atcpros/";
export const NEWS_URL = "https://atcpros.org/news-releases/";

/**
 * Google Tag Manager container id. While it is the placeholder (or empty) the GTM script is NOT
 * loaded and nothing breaks. Paste the real id (GTM-XXXXXXX) here once the container exists.
 * The Meta Pixel is fired from inside GTM (see docs/tracking.md), never from this code.
 */
export const GTM_ID = "GTM-XXXXXXX";
