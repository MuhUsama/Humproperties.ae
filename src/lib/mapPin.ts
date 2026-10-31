export interface MapPin {
  lat: number;
  lng: number;
}

function toPin(lat: string, lng: string): MapPin | null {
  const la = parseFloat(lat);
  const ln = parseFloat(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
  if (Math.abs(la) > 90 || Math.abs(ln) > 180) return null;
  return { lat: la, lng: ln };
}

/**
 * Reads exact coordinates out of a Google Maps link (or plain "lat, lng" text).
 * The place marker (!3d..!4d..) wins over the viewport centre (@lat,lng),
 * because the viewport centre is only where the map was scrolled to.
 * Short links (maps.app.goo.gl) carry no coordinates; see /api/map-pin.
 */
export function parseMapPin(link?: string | null): MapPin | null {
  if (!link) return null;
  const text = decodeURIComponent(link.trim());

  const patterns = [
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|query|ll|destination|daddr)=(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/,
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const pin = toPin(match[1], match[2]);
      if (pin) return pin;
    }
  }
  return null;
}

const SHORT_LINK_HOSTS = ["maps.app.goo.gl", "goo.gl"];

export function isShortMapLink(link?: string | null): boolean {
  if (!link) return false;
  try {
    const url = new URL(link.trim());
    return SHORT_LINK_HOSTS.includes(url.hostname) && (url.hostname !== "goo.gl" || url.pathname.startsWith("/maps"));
  } catch {
    return false;
  }
}
