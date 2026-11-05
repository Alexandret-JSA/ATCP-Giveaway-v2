// CRM form-tracking helper.
//
// trackingPayload.formData/formLabels are only for standard CRM field keys.
// Non-standard/custom fields must go through customFields/fileFields/imageDataFields
// using the id returned by register_custom_field. Labels stay human-readable.
type StandardTrackingFieldKey = string;
type RegisteredCustomFieldId = string;
type TrackingCustomField = { value?: unknown; label: string };
type TrackingFileField = { file?: File; label: string };
type TrackingImageDataField = { dataUrl?: string; label: string };

export const CRM_TRACKING = {
  trackingId: "tk_6af830c50c194cffaf784a58bb149606",
  locationId: "7TVosenUYNxLh4e16uiv",
  projectId: "1793888448858773605",
  endpoint: "https://backend.leadconnectorhq.com/external-tracking/events",
};

type TrackingPayload = Record<string, unknown> & {
  formData: Record<StandardTrackingFieldKey, unknown>;
  formLabels: Record<StandardTrackingFieldKey, string>;
};

type TrackingOptions = {
  customFields?: Record<RegisteredCustomFieldId, TrackingCustomField>;
  fileFields?: Record<RegisteredCustomFieldId, TrackingFileField>;
  imageDataFields?: Record<RegisteredCustomFieldId, TrackingImageDataField>;
};

export const postTrackingEvent = (
  trackingPayload: TrackingPayload,
  options: TrackingOptions = {},
) => {
  const { customFields = {}, fileFields = {}, imageDataFields = {} } = options;
  const eventPayload = {
    ...trackingPayload,
    formData: { ...trackingPayload.formData },
    formLabels: { ...trackingPayload.formLabels },
  };
  const body = new FormData();

  for (const [key, field] of Object.entries(customFields)) {
    if (field.value === undefined) continue;
    eventPayload.formData[key] = field.value;
    eventPayload.formLabels[key] = field.label;
  }

  for (const [key, field] of Object.entries(imageDataFields)) {
    const dataUrl = field.dataUrl;
    if (!dataUrl) continue;
    if (!dataUrl.startsWith("data:image/")) {
      throw new Error("Image data field must be a data:image/* base64 string");
    }
    eventPayload.formData[key] = dataUrl;
    eventPayload.formLabels[key] = field.label;
  }

  for (const [key, field] of Object.entries(fileFields)) {
    const file = field.file;
    if (!file) continue;
    if (file.size > 50 * 1024 * 1024) {
      throw new Error("File must be 50 MB or smaller");
    }
    eventPayload.formData[key] = {
      filename: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    };
    eventPayload.formLabels[key] = field.label;
    body.append(key, file, file.name);
  }

  for (const key of Object.keys(eventPayload.formData)) {
    eventPayload.formLabels[key] ||= key;
  }

  body.append("event", JSON.stringify(eventPayload));

  fetch(CRM_TRACKING.endpoint, {
    method: "POST",
    headers: {
      version: "2021-07-28",
    },
    body,
  }).catch(() => {}); // Fire-and-forget — don't block form ux
};

// Reuse the published site's analytics session (set by /__vibe/analytics.js) so the
// submission joins the visit's page views; fall back to a fresh id when it is absent
// or unreadable (document.cookie throws in a sandboxed iframe).
export const getTrackingSessionId = () => {
  try {
    const sid = document.cookie.match(/(?:^|;\s*)__vibe_sid=([0-9a-f-]{36})(?:;|$)/)?.[1];
    if (sid) return sid;
  } catch {}
  return crypto.randomUUID();
};

export const buildTrackingPayload = (
  formId: string,
  formName: string,
  formData: Record<string, unknown>,
  formLabels: Record<string, string>,
): TrackingPayload => ({
  type: "external_form_submission",
  timestamp: Date.now(),
  formId,
  formData,
  formLabels,
  url: window.location.href,
  title: document.title,
  path: window.location.pathname,
  userAgent: navigator.userAgent,
  trackingId: CRM_TRACKING.trackingId,
  locationId: CRM_TRACKING.locationId,
  projectId: CRM_TRACKING.projectId,
  sessionId: getTrackingSessionId(),
  properties: {
    deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
    source: "ai_studio",
    projectId: CRM_TRACKING.projectId,
    formName,
  },
});
