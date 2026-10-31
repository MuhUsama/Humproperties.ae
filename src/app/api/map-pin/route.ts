import { NextResponse } from "next/server";
import { isShortMapLink, parseMapPin } from "@/lib/mapPin";

// Resolves a Google Maps short link (maps.app.goo.gl) to the exact pin it points at.
// Only Google short-link hosts are followed, so this can't be used to fetch other sites.
export async function GET(request: Request) {
  const link = new URL(request.url).searchParams.get("url");
  if (!link || !isShortMapLink(link)) {
    return NextResponse.json({ success: false, error: "Not a Google Maps short link" }, { status: 400 });
  }

  try {
    let current = link;
    for (let hop = 0; hop < 5; hop++) {
      const res = await fetch(current, { redirect: "manual", cache: "force-cache" });
      const next = res.headers.get("location");
      if (!next) break;
      current = new URL(next, current).toString();
      const pin = parseMapPin(current);
      if (pin) {
        return NextResponse.json(
          { success: true, data: pin },
          { headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" } }
        );
      }
    }
    return NextResponse.json({ success: false, error: "No coordinates in link" }, { status: 404 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to resolve link" }, { status: 502 });
  }
}
