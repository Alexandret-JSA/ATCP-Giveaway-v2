// Meta Conversions API (server side). One Server Function, called from the form on submit.
// INACTIVE until these Secrets exist in AI Studio (More -> Secrets): META_PIXEL_ID, META_CAPI_TOKEN.
// Optional while testing: META_TEST_EVENT_CODE (events then show only in Events Manager -> Test events).
// It fires `Lead` with the SAME event_id as the browser/GTM `lead` event so Meta de-duplicates them.
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders, getRequestIP } from "@tanstack/react-start/server";

// Graph API versions expire after ~2 years: check https://developers.facebook.com/docs/graph-api/changelog
const META_API_VERSION = "v23.0";

type LeadInput = {
  event_id: string;
  event_source_url: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  fbp?: string;
  fbc?: string;
};

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.slice(0, max) : "");

function validate(input: unknown): LeadInput {
  const i = (input ?? {}) as Record<string, unknown>;
  const out: LeadInput = {
    event_id: str(i["event_id"], 100),
    event_source_url: str(i["event_source_url"], 2000),
    email: str(i["email"], 320),
    phone: str(i["phone"], 40),
    first_name: str(i["first_name"], 100),
    last_name: str(i["last_name"], 100),
  };
  const fbp = str(i["fbp"], 200);
  const fbc = str(i["fbc"], 400);
  if (fbp) out.fbp = fbp;
  if (fbc) out.fbc = fbc;
  if (!out.event_id) throw new Error("event_id required");
  return out;
}

async function sha256(value: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Meta wants lowercase/trimmed values, digits-only phone with country code. US default. */
const normEmail = (v: string) => v.trim().toLowerCase();
const normName = (v: string) => v.trim().toLowerCase();
const normPhone = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d.length === 10 ? `1${d}` : d;
};

export const sendLeadToCapi = createServerFn({ method: "POST" })
  .validator(validate)
  .handler(async ({ data }) => {
    const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
      ?.env;
    const pixelId = env?.["META_PIXEL_ID"];
    const token = env?.["META_CAPI_TOKEN"];
    if (!pixelId || !token) return { sent: false as const, reason: "not_configured" };

    const headers = getRequestHeaders();
    const userData: Record<string, unknown> = {
      client_user_agent: headers.get("user-agent") ?? undefined,
      client_ip_address: getRequestIP({ xForwardedFor: true }) ?? undefined,
      fbp: data.fbp,
      fbc: data.fbc,
    };
    if (data.email) userData["em"] = [await sha256(normEmail(data.email))];
    if (data.phone) userData["ph"] = [await sha256(normPhone(data.phone))];
    if (data.first_name) userData["fn"] = [await sha256(normName(data.first_name))];
    if (data.last_name) userData["ln"] = [await sha256(normName(data.last_name))];

    const body: Record<string, unknown> = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.event_id,
          event_source_url: data.event_source_url,
          action_source: "website",
          user_data: userData,
        },
      ],
    };
    const testCode = env?.["META_TEST_EVENT_CODE"];
    if (testCode) body["test_event_code"] = testCode;

    const res = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      // Never log the token or the URL; status only.
      console.error("Meta CAPI rejected the event", res.status);
      return { sent: false as const, reason: `meta_${res.status}` };
    }
    return { sent: true as const };
  });
