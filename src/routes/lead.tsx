import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { buildTrackingPayload, postTrackingEvent } from "@/lib/crm-tracking";
import { buildCustomFields, getAttribution, newEventId } from "@/lib/tracking";

export const Route = createFileRoute("/lead")({
  component: LeadForm,
  head: () => ({
    meta: [
      { title: "ATCP Giveaway v2 — Lead Form" },
      {
        name: "description",
        content: "Enter the ATCP Giveaway v2 for your chance to win.",
      },
      {
        property: "og:title",
        content: "ATCP Giveaway v2 — Lead Form",
      },
      {
        property: "og:description",
        content: "Enter the ATCP Giveaway v2 for your chance to win.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const FORM_ID = "atcp-giveaway-lead";
const FORM_NAME = "ATCP Giveaway Lead Form";

function LeadForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    // Basic validation
    if (!form.first_name || !form.last_name || !form.email || !form.phone) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const attr = getAttribution();

    const formLabels: Record<string, string> = {
      first_name: "First Name",
      last_name: "Last Name",
      email: "Email",
      phone: "Phone",
    };

    const payload = buildTrackingPayload(FORM_ID, FORM_NAME, form, formLabels);

    // Attribution + device info travel as registered custom fields (ids in src/lib/crm-fields.ts).
    const customFields = buildCustomFields({
      fbp: attr.fbp,
      fbc: attr.fbc,
      event_id: newEventId(),
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
    });

    postTrackingEvent(payload, { customFields });

    toast.success("Thanks for entering! We'll be in touch.");
    setForm({ first_name: "", last_name: "", email: "", phone: "" });
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <h1 className="text-foreground text-2xl font-semibold">ATCP Giveaway v2</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Fill out the form below to enter the giveaway.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="first_name" className="text-sm font-medium text-foreground">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Jane"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="last_name" className="text-sm font-medium text-foreground">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Doe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="jane@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="(555) 123-4567"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Enter Giveaway"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
