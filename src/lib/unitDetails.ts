// Optional per-unit fields matching the developer availability sheets
// (Unit No., Floor, Unit Type, Sub-Type / Location, View, Internal / External Area).
// Any field left empty is stored as null and hidden on the public site.

export const UNIT_DETAIL_FIELDS = [
  { key: "unitNo", label: "Unit No.", placeholder: "e.g. VM1-1203" },
  { key: "floor", label: "Floor", placeholder: "e.g. 12 or G" },
  { key: "unitType", label: "Unit Type", placeholder: "e.g. 1B, 4B TH, Retail" },
  { key: "subType", label: "Sub-Type / Location", placeholder: "e.g. BB-Middle-C" },
  { key: "view", label: "View", placeholder: "e.g. Community, Park" },
  { key: "internalArea", label: "Internal Area (sq.ft)", placeholder: "e.g. 1,303" },
  { key: "externalArea", label: "External Area (sq.ft)", placeholder: "e.g. 690" },
] as const;

export type UnitDetailKey = (typeof UNIT_DETAIL_FIELDS)[number]["key"];
export type UnitDetails = Record<UnitDetailKey, string | null>;

export function cleanUnitDetail(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === "" ? null : trimmed;
}

// Reads the unit detail inputs (named by key) from a submitted admin form.
export function readUnitDetails(form: HTMLFormElement): UnitDetails {
  const details = {} as UnitDetails;
  for (const { key } of UNIT_DETAIL_FIELDS) {
    const input = form.elements.namedItem(key) as HTMLInputElement | null;
    details[key] = cleanUnitDetail(input?.value);
  }
  return details;
}

// Picks the unit detail fields out of an API request body. With `onlyPresent`,
// keys missing from the body are left out so an update doesn't clear them.
export function unitDetailsFromBody(body: Record<string, unknown> | null | undefined, onlyPresent = false): Partial<UnitDetails> {
  const details: Partial<UnitDetails> = {};
  for (const { key } of UNIT_DETAIL_FIELDS) {
    if (onlyPresent && !(key in (body ?? {}))) continue;
    details[key] = cleanUnitDetail(body?.[key]);
  }
  return details;
}

// Formats a price typed in the admin form, keeping decimals from being glued
// onto the integer part (e.g. "1,749,837.87" -> "AED 1,749,838").
export function formatAedPrice(price: string): string {
  const numeric = Number(price.replace(/[^\d.]/g, ""));
  if (price.replace(/[^\d]/g, "") && Number.isFinite(numeric)) {
    return `AED ${Math.round(numeric).toLocaleString()}`;
  }
  return price.toUpperCase().startsWith("AED") ? price : `AED ${price}`;
}
