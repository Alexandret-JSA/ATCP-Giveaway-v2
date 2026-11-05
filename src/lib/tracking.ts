// CLIENT-ONLY helpers: first-touch attribution, device info, event ids.
// Never call at module top level (SSR). Use inside useEffect or event handlers.
import { CRM_FIELD_IDS, type CrmFieldName } from "./crm-fields";

const KEY = "attr_v1";
const CLICK_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
] as const;

type Saved = Partial<
  Record<(typeof CLICK_KEYS)[number] | "landing_page" | "referrer", string | undefined>
>;

const readSaved = (): Saved => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Saved;
  } catch {
    return {};
  }
};

const cookie = (name: string) => {
  try {
    return document.cookie
      .split("; ")
      .find((c) => c.startsWith(name + "="))
      ?.split("=")[1];
  } catch {
    return undefined;
  }
};

export const newEventId = () => crypto.randomUUID();

/** Call once in a root-layout useEffect. Keeps the session's FIRST touch (never overwritten). */
export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const saved = readSaved();
    const next: Saved = { ...saved };
    for (const k of CLICK_KEYS) {
      const v = params.get(k);
      if (v && !saved[k]) next[k] = v;
    }
    next.landing_page ??= window.location.href.split("#")[0];
    next.referrer ??= document.referrer || undefined;
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage blocked (private mode / sandbox): attribution is simply skipped
  }
}

export type DeviceInfo = { device_type: "mobile" | "tablet" | "desktop"; os: string };

/** Pure: easy to test. iPadOS reports itself as a Mac, so touch support separates the two. */
export function parseDevice(ua: string, maxTouchPoints = 0): DeviceInfo {
  const touchMac = /Macintosh/i.test(ua) && maxTouchPoints > 1;
  let os = "Other";
  if (/iPhone|iPad|iPod/i.test(ua) || touchMac) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/CrOS/i.test(ua)) os = "ChromeOS";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  const tablet =
    /iPad|Tablet/i.test(ua) || touchMac || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const device_type = tablet ? "tablet" : /Mobi|iPhone|Android/i.test(ua) ? "mobile" : "desktop";
  return { device_type, os };
}

export type Attribution = Saved & {
  fbp?: string | undefined;
  fbc?: string | undefined;
  device_type?: string | undefined;
  os?: string | undefined;
  timezone?: string | undefined;
  page_url: string;
};

/** Everything we want to attach to a lead at submit time. */
export function getAttribution(): Attribution {
  const a = readSaved();
  const fbp = cookie("_fbp");
  let fbc = cookie("_fbc");
  if (!fbc && a.fbclid) fbc = `fb.1.${Date.now()}.${a.fbclid}`;
  const { device_type, os } = parseDevice(navigator.userAgent, navigator.maxTouchPoints);
  let timezone: string | undefined;
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    // Intl unavailable: timezone is optional
  }
  return { ...a, fbp, fbc, device_type, os, timezone, page_url: window.location.href };
}

/**
 * Builds the `customFields` object for postTrackingEvent() from registered field ids.
 * Empty values are left out (the helper skips `undefined`).
 */
export function buildCustomFields(values: Partial<Record<CrmFieldName, string | undefined>>) {
  const out: Record<string, { value: string; label: string }> = {};
  for (const [name, id] of Object.entries(CRM_FIELD_IDS)) {
    const v = values[name as CrmFieldName];
    if (v && id) out[id] = { value: v, label: name };
  }
  return out;
}
