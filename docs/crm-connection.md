# How the AI Studio "Connect to CRM" works in this project

Written by Claude after reading the commit AI Studio made when "Connect forms to my CRM" was run
(commit `72f5d73`, 2026-11-05). Verified by a real test submission that appeared in
**Sites → Forms → Submissions → External Forms**.

## The key finding

**There is no magic script that watches the form.** The "connection" is ordinary code in the page that
makes one `fetch` POST to HighLevel's external-tracking endpoint when the form is submitted.
That means:

- The form can be any React form. It does **not** need to be a native `submit` event, and
  `e.preventDefault()` is fine (the AI Studio-generated form calls it).
- Any component can send a lead, as long as it calls `postTrackingEvent(...)`.
- Claude can build, restyle and extend the form freely, as long as it keeps this helper and its IDs.

## Files AI Studio added

| File | Purpose |
|---|---|
| `src/lib/crm-tracking.ts` | The whole connection: IDs, endpoint, payload builder, sender. **Do not rewrite it**; extend by calling it. |
| `src/routes/lead.tsx` | Minimal test form (`first_name`, `last_name`, `email`, `phone`) that calls the helper on submit. |
| `src/routeTree.gen.ts` | Auto-generated route list (never edit by hand). |

Nothing was added to `__root.tsx` or `package.json`. The published site also loads `/__vibe/analytics.js`
(AI Studio's own analytics); the helper reuses its `__vibe_sid` cookie as the `sessionId`.

## What gets sent

`POST https://backend.leadconnectorhq.com/external-tracking/events` (header `version: 2021-07-28`),
body = `FormData` with one field `event` containing JSON:

```
type: "external_form_submission"
formId, formData{...}, formLabels{...}
url, title, path, userAgent, timestamp, sessionId
trackingId, locationId, projectId      (per project; shipped to the browser, not secret)
properties { deviceType, source: "ai_studio", projectId, formName }
```

- `url` is `window.location.href`, so UTMs / `fbclid` in the landing URL travel with the event.
- The request is **fire-and-forget**: no `await`, errors are swallowed (`.catch(() => {})`), no retry.

## Field rules (from the helper's own comments)

- `formData` / `formLabels` accept **standard CRM field keys only** (`first_name`, `last_name`, `email`, `phone`, ...).
- **Any other field** (membership question, Facebook name, tracking fields like `fbp`, `fbc`, `utm_*`, `event_id`)
  must be a **registered custom field**, passed through `customFields` with the **id returned by AI Studio's
  `register_custom_field`** tool. That registration is done by AI Studio's AI in its chat, not by Claude.
- Files go through `fileFields` (max 50 MB); images through `imageDataFields` (`data:image/*` only).

## Consequences for the funnel build

1. **Per project, a human must run "Connect forms to my CRM" once** in the AI Studio chat to get the project's
   `trackingId` / `locationId` / `projectId`. After that, Claude can copy this helper into any page.
2. **Custom fields must be registered first.** Before building the real ATCP form, ask AI Studio's AI to register
   the extra fields and tell us their ids.
3. **Before a hard redirect** (`window.location = ...`), add `keepalive: true` to the fetch. Client-side navigation
   with TanStack Router (`navigate({ to: "/thank-you" })`) is fine as is.
4. **The endpoint is public.** Anyone can POST to it without visiting the page, so bots can create contacts.
   Browser-side anti-spam (honeypot, time check) only reduces noise; it is not protection. Track this as a risk.
5. **This helper does not send Pixel or CAPI events.** Tracking (Pixel + server CAPI with the same `event_id`) is
   our own layer, added next to the `postTrackingEvent` call. See the SOP, sections 4-6.
