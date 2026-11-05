# Tracking: how a lead is tracked on this page

Written by Claude. One `event_id` is generated per submit and shared by every channel, so Meta can
de-duplicate the browser event and the server event.

```
submit (EntryForm.tsx)
  eventId = crypto.randomUUID()
  1) CRM contact      -> postTrackingEvent(...)   custom field event_id = eventId
  2) Browser (GTM)    -> dataLayer.push({ event: "lead", event_id: eventId })
  3) Server (CAPI)    -> sendLeadToCapi(...)      Meta event_id = eventId
  then navigate to /thank-you
```

## What is wired and what is waiting

| Piece | State | What unlocks it |
|---|---|---|
| CRM contact + tracking custom fields | **Working** (tested) | n/a |
| 6 form-question custom fields | **Waiting for ids** | Paste the ids into `src/lib/crm-fields.ts` (they are `""` now; empty ids are skipped, so the answers are NOT saved until then) |
| GTM loader | **Off** | Set the real container id in `GTM_ID` (`src/lib/event-config.ts`) |
| Meta Pixel (browser) | **Lives in GTM**, not in code | Build the tags below once the container exists |
| Meta CAPI (server) | **Off** (`not_configured`) | Add Secrets `META_PIXEL_ID`, `META_CAPI_TOKEN` (and `META_TEST_EVENT_CODE` while testing) in AI Studio -> More -> Secrets |

## dataLayer events this page pushes

| Event | When | Extra keys |
|---|---|---|
| `page_view` | once per page, including client-side navigation | `page_path`, `page_location`, `page_title` |
| `lead` | on a valid, non-bot submit | `event_id`, `form_id`, `event_source_url` |

## GTM tags to build (Meta Pixel inside GTM)

1. **Meta Pixel - PageView**: trigger = Custom Event `page_view`. **Do not** use "All Pages" or "Initialization":
   the page already pushes `page_view`, so those would count the first page twice.
2. **Meta Pixel - Lead**: trigger = Custom Event `lead`. Set **Event ID** to a Data Layer Variable `event_id`.
   Without this, Meta cannot match the browser event to the server event and counts the lead twice.
3. Test with Meta **Test Events** (set `META_TEST_EVENT_CODE`): you should see ONE `Lead` marked
   "Deduplicated" (browser + server with the same event id).

## Server function (`src/lib/capi.functions.ts`)

- Hashes email, phone, first and last name with SHA-256 (normalised) on the server; reads IP and user agent
  from the request headers (not from the browser); sends `fbp` / `fbc` from the browser.
- Returns `{ sent: false, reason: "not_configured" }` without the Secrets, so it can ship before they exist.
- Never logs the token. `META_API_VERSION` is a constant at the top: Graph API versions expire after about
  two years, check the changelog before launch.
- **Still to verify in a published AI Studio app** (could not be tested locally): that Secrets are readable
  through `process.env`, and that the outbound `fetch` to `graph.facebook.com` is allowed.

## Anti-spam

The CRM endpoint is public (see `docs/crm-connection.md`). The form adds a honeypot field and a minimum
fill time (2 s); a bot that trips either one is sent to `/thank-you` and nothing is sent anywhere.
This only reduces noise. It does not stop someone posting to the endpoint directly.
