// Custom field ids registered by AI Studio's `register_custom_field` (2026-11-05).
// Needed by crm-tracking.ts `customFields`. If a field is re-registered, update its id here.
//
// gclid and timezone clash with STANDARD CRM fields (registering them returns 400, and sending them in
// formData is silently ignored), so they are registered under different names:
// google_click_id and visitor_timezone.
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
  google_click_id: "d4jYBDLqOm41NVjJTJjX",
  visitor_timezone: "U6ieKftRmVzR0LruJYyb",
  // Form questions (non-standard), registered 2026-11-05. If an id is ever left "", that answer is
  // NOT sent to the CRM (buildCustomFields skips it).
  atcp_member: "KMMML0LOWMtsUxYNRMtQ",
  atcp_membership_email: "A88krGBioAeEerGjZ7M4",
  facebook_name: "wwvgaVCle38Xs6JbLU0i",
  fb_group_confirmed: "6CGlxIIbKI0mMRXUL6Kg",
  fb_group_member: "k3rk0WmePDpl3Z9Pfu0X",
  masterclass_topic: "dNFyzm76fg4fGpN18hJx",
} as const;

export type CrmFieldName = keyof typeof CRM_FIELD_IDS;
