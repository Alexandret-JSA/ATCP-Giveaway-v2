import { useNavigate } from "@tanstack/react-router";
import { useRef, useState, type FormEvent, type ReactNode } from "react";

import { Countdown } from "@/components/atcp/Countdown";
import { sendLeadToCapi } from "@/lib/capi.functions";
import { buildTrackingPayload, postTrackingEvent } from "@/lib/crm-tracking";
import { pushEvent } from "@/lib/datalayer";
import { GROUP_URL } from "@/lib/event-config";
import { buildCustomFields, getAttribution, newEventId } from "@/lib/tracking";
import { useEntriesClosed } from "@/lib/use-entries-closed";

const FORM_ID = "atcp-giveaway-entry";
const FORM_NAME = "ATCP MasterClass Giveaway Entry";

type Values = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  atcp_member: string;
  fb_group_member: string;
  masterclass_topic: string;
};

const EMPTY: Values = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  atcp_member: "",
  fb_group_member: "",
  masterclass_topic: "",
};

const CHOICES = ["Yes", "No", "Not sure"];
const FB_GROUP_CHOICES = ["Yes", "I'm becoming a member ASAP", "Not sure"];

function validate(v: Values): string | null {
  if (!v.first_name.trim() || !v.last_name.trim()) return "Please enter your first and last name.";
  if (v.phone.replace(/\D/g, "").length < 10)
    return "Please enter a valid phone number: we call winners live.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    return "Please enter a valid email address.";
  if (!v.atcp_member) return "Please tell us whether you are an ATCP member.";
  if (!v.fb_group_member) return "Please tell us whether you are in the ATCP Facebook group.";
  if (!v.masterclass_topic.trim()) return "Please tell us what you would like to discuss.";
  return null;
}

/** One entry form. Rendered twice on the page, so every id is prefixed. */
export function EntryForm({ anchorId, prefix }: { anchorId: string; prefix: string }) {
  const navigate = useNavigate();
  const closed = useEntriesClosed();
  const [v, setV] = useState<Values>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot: real people never see or fill it
  const openedAt = useRef<number>(0);

  const set = <K extends keyof Values>(k: K, val: Values[K]) => setV((p) => ({ ...p, [k]: val }));
  const id = (n: string) => `${prefix}-${n}`;

  if (closed) {
    return (
      <div className="form-card" id={anchorId}>
        <h2 className="h3">Entries Are Closed</h2>
        <p className="p">
          The 4 winners are drawn live on Fri, Nov 13 at 5:00 PM ET during our Discord town hall.
        </p>
        <a className="btn" href={GROUP_URL} target="_blank" rel="noopener noreferrer">
          Join the Facebook Group Now
        </a>
      </div>
    );
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const problem = validate(v);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setSubmitting(true);

    // Bots: filled honeypot or an impossibly fast submit. Pretend success, send nothing.
    const tooFast = openedAt.current > 0 && Date.now() - openedAt.current < 2000;
    if (website || tooFast) {
      void navigate({ to: "/thank-you", search: { email: v.email.trim() } });
      return;
    }

    const attr = getAttribution();
    // ONE id shared by the CRM contact, the GTM/Pixel event and the server-side CAPI event.
    const eventId = newEventId();

    // 1) CRM contact (native AI Studio connection + our registered custom fields)
    const payload = buildTrackingPayload(
      FORM_ID,
      FORM_NAME,
      {
        first_name: v.first_name.trim(),
        last_name: v.last_name.trim(),
        email: v.email.trim(),
        phone: v.phone.trim(),
      },
      { first_name: "First Name", last_name: "Last Name", email: "Email", phone: "Phone" },
    );
    const customFields = buildCustomFields({
      fbp: attr.fbp,
      fbc: attr.fbc,
      event_id: eventId,
      utm_source: attr.utm_source,
      utm_medium: attr.utm_medium,
      utm_campaign: attr.utm_campaign,
      utm_content: attr.utm_content,
      utm_term: attr.utm_term,
      landing_page: attr.landing_page,
      referrer: attr.referrer,
      device_type: attr.device_type,
      os: attr.os,
      google_click_id: attr.gclid,
      visitor_timezone: attr.timezone,
      atcp_member: v.atcp_member,
      fb_group_member: v.fb_group_member,
      masterclass_topic: v.masterclass_topic.trim(),
    });
    postTrackingEvent(payload, { customFields });

    // 2) Browser event for GTM (the Meta Pixel tag lives in GTM and must use this event_id)
    pushEvent({
      event: "lead",
      event_id: eventId,
      form_id: FORM_ID,
      event_source_url: window.location.href,
    });

    // 3) Server-side Conversions API, same event_id. Inactive until the Secrets exist; never blocks the user.
    void sendLeadToCapi({
      data: {
        event_id: eventId,
        event_source_url: window.location.href,
        email: v.email.trim(),
        phone: v.phone.trim(),
        first_name: v.first_name.trim(),
        last_name: v.last_name.trim(),
        ...(attr.fbp ? { fbp: attr.fbp } : {}),
        ...(attr.fbc ? { fbc: attr.fbc } : {}),
      },
    }).catch(() => {});

    void navigate({ to: "/thank-you", search: { email: v.email.trim() } });
  };

  return (
    <div className="form-card" id={anchorId}>
      <h2 className="h3">Enter to Win Your 1-on-1 Session</h2>
      <span className="steps">Takes about 2 minutes</span>
      <form
        className="f"
        onSubmit={onSubmit}
        noValidate
        onFocusCapture={() => {
          if (!openedAt.current) openedAt.current = Date.now();
        }}
      >
        <div className="f-row">
          <Field id={id("first")} label="First Name" required>
            <input
              id={id("first")}
              name="first_name"
              autoComplete="given-name"
              value={v.first_name}
              onChange={(e) => set("first_name", e.target.value)}
            />
          </Field>
          <Field id={id("last")} label="Last Name" required>
            <input
              id={id("last")}
              name="last_name"
              autoComplete="family-name"
              value={v.last_name}
              onChange={(e) => set("last_name", e.target.value)}
            />
          </Field>
        </div>
        <div className="f-row">
          <Field id={id("phone")} label="Phone" required>
            <input
              id={id("phone")}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={v.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field id={id("email")} label="Email" required>
            <input
              id={id("email")}
              name="email"
              type="email"
              autoComplete="email"
              value={v.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
        </div>
        <Field id={id("member")} label="Are you an ATCP member?" required>
          <select
            id={id("member")}
            name="atcp_member"
            required
            value={v.atcp_member}
            onChange={(e) => set("atcp_member", e.target.value)}
          >
            <option value="" disabled>
              Please select one
            </option>
            {CHOICES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id("fbgroup")} label="Are you a member of the ATCP Facebook group?" required>
          <select
            id={id("fbgroup")}
            name="fb_group_member"
            required
            value={v.fb_group_member}
            onChange={(e) => set("fb_group_member", e.target.value)}
          >
            <option value="" disabled>
              Please select one
            </option>
            {FB_GROUP_CHOICES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id={id("topic")}
          label="What would you like to discuss during the personalized masterclass?"
          required
        >
          <textarea
            id={id("topic")}
            name="masterclass_topic"
            value={v.masterclass_topic}
            onChange={(e) => set("masterclass_topic", e.target.value)}
          />
        </Field>

        <div className="f-hp" aria-hidden="true">
          <label htmlFor={id("website")}>Website</label>
          <input
            id={id("website")}
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {error ? (
          <p className="f-err" role="alert">
            {error}
          </p>
        ) : null}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "ENTER TO WIN"}
        </button>
      </form>
      <p className="micro reassure">
        Free to enter · No purchase necessary · We never sell your information
      </p>
      <Countdown label="Sessions start in" />
    </div>
  );
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="f-field">
      <label htmlFor={id}>
        {label}
        {required ? <i>*</i> : null}
      </label>
      {children}
    </div>
  );
}
