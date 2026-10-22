export const LISTING_STATUSES = ["FOR SALE", "FOR RENT", "OFF PLAN"] as const;

export const isOffPlanStatus = (status?: string | null) =>
  (status || "").toUpperCase().replace(/[-_]/g, " ").includes("OFF PLAN");

// Off plan units are sold, so they belong under "Buy" alongside FOR SALE listings
export const isBuyStatus = (status?: string | null) =>
  (status || "").toUpperCase().includes("SALE") || isOffPlanStatus(status);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
