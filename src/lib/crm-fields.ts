// Custom field ids registered by AI Studio's `register_custom_field` (2026-11-05).
// Needed by crm-tracking.ts `customFields`. If a field is re-registered, update its id here.
//
// NOT here on purpose:
//  - gclid and timezone are STANDARD CRM fields (registration failed), so they go in `formData`
//    under their standard keys, not through `customFields`. Confirm the exact key names first.
export const CRM_FIELD_IDS = {
  fbp: "98KSs0yFbb4arbvxDItE",
  fbc: "uipsq14WOPHhtydUiIRv",
  event_id: "ufO20h0k08MF5SPL3knu",
  utm_source: "GSiAsEhN4Ikt7S4HqTrG",
  utm_medium: "Rv0MvdpgT0orez9DynVt",
  utm_campaign: "n2or9wto91hGAkzJkDl9",
  utm_content: "v300Gr0O0DhAW58wx0Ls",
  utm_term: "DDvRQKk80H9I359PfibG",
  landing_page: "4quTukQZjztFmEyFi5jl",
  referrer: "vZ6w6N8Zt9bac7s20hM8",
  device_type: "rVXRR2yvHMTEKgzEVR2C",
  os: "jTKLDPz9iM7Kv3Iu5p6f",
} as const;

export type CrmFieldName = keyof typeof CRM_FIELD_IDS;
