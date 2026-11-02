// Shared helpers for off plan projects (admin form <-> API)

const OPTIONAL_TEXT_FIELDS = [
  "coverImage",
  "location",
  "propertyTypes",
  "bedrooms",
  "startingPrice",
  "handover",
  "discount",
  "description",
] as const;

// Reads the optional text fields from a request body. Empty values are stored as null
// so they never show on the public site. With `partial`, fields not sent are left out.
export function projectFieldsFromBody(body: any, partial = false) {
  const data: Record<string, any> = {};
  for (const key of OPTIONAL_TEXT_FIELDS) {
    if (partial && body[key] === undefined) continue;
    const value = typeof body[key] === "string" ? body[key].trim() : body[key];
    data[key] = value ? String(value) : null;
  }
  if (!partial || body.galleryImages !== undefined) {
    data.galleryImages = Array.isArray(body.galleryImages) ? body.galleryImages.filter(Boolean) : [];
  }
  return data;
}

export const isObjectId = (value: string) => /^[a-f0-9]{24}$/i.test(value);
