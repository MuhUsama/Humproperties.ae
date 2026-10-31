"use client";

import React, { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { staggerContainer } from "@/lib/animations";
import { isShortMapLink, parseMapPin, type MapPin as Pin } from "@/lib/mapPin";

interface PropertyMapProps {
  property: {
    id: string;
    title: string;
    location: string;
    city?: string;
    directionLink?: string;
  };
}

// Exact pin from the admin "Direction Link". Full Google Maps links are read directly;
// short maps.app.goo.gl links are resolved by /api/map-pin. No link → no pin.
function useMapPin(directionLink?: string): Pin | null {
  const parsed = useMemo(() => parseMapPin(directionLink), [directionLink]);
  const [resolved, setResolved] = useState<{ link: string; pin: Pin } | null>(null);

  useEffect(() => {
    if (parsed || !directionLink || !isShortMapLink(directionLink)) return;

    let active = true;
    fetch(`/api/map-pin?url=${encodeURIComponent(directionLink.trim())}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (active && json?.success) setResolved({ link: directionLink, pin: json.data });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [directionLink, parsed]);

  return parsed ?? (resolved && resolved.link === directionLink ? resolved.pin : null);
}

function formatCoord(value: number, positive: string, negative: string) {
  return `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positive : negative}`;
}

const PropertyMap = memo(function PropertyMap({ property }: PropertyMapProps) {
  const pin = useMapPin(property.directionLink);
  const city = property.city || "Dubai";
  const place = property.location.toLowerCase().includes(city.toLowerCase())
    ? property.location
    : `${property.location}, ${city}`;

  const mapQuery = pin ? `${pin.lat},${pin.lng}` : place;
  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${pin ? 16 : 14}&output=embed`;
  const directionsUrl = pin
    ? `https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;
  const viewUrl = property.directionLink?.trim() || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <section
      id="location-tour"
      className="w-full min-h-[calc(100vh-4.5rem)] sm:min-h-[calc(100svh-5rem)] bg-[#0a0a0d] text-white flex flex-col py-6 sm:py-10 overflow-hidden relative scroll-mt-20"
    >
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/8 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="w-full mx-auto px-4 sm:px-8 lg:px-16 flex flex-col justify-center lg:justify-start z-10 flex-1"
      >
        {/* Eyebrow */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6 shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse"></span>
            <span className="text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.2em] text-[#d4af37]">
              04 / Location
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-mono text-gray-400 uppercase tracking-widest">
            [ Hum Properties ]
          </span>
        </div>

        {/* Map stage with floating details panel */}
        <div className="relative flex flex-col lg:block lg:flex-1 rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/15 bg-[#141418] shadow-[0_20px_60px_rgba(0,0,0,0.7)] lg:min-h-[520px]">
          <div className="relative h-[300px] sm:h-[420px] lg:h-auto lg:absolute lg:inset-0">
            <iframe
              title={`Map of ${place}`}
              src={embedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          <div className="relative lg:absolute lg:left-6 lg:bottom-6 lg:w-[440px] xl:w-[480px] bg-[#111115] lg:bg-[#111115]/90 lg:backdrop-blur-xl lg:border lg:border-white/15 lg:rounded-3xl lg:shadow-2xl p-5 sm:p-8 flex flex-col">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              {city}
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-white leading-tight mt-2">
              {property.location}
            </h3>

            {pin && (
              <div className="mt-4 inline-flex self-start items-center gap-2 text-[10px] sm:text-[11px] font-mono text-gray-300 uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                <MapPin className="w-3 h-3 text-[#d4af37]" />
                {formatCoord(pin.lat, "N", "S")}, {formatCoord(pin.lng, "E", "W")}
              </div>
            )}

            <p className="text-xs sm:text-sm text-gray-400 font-light mt-4 leading-relaxed">
              {pin
                ? "The pin marks the exact location of this property."
                : `The map shows the ${property.location} area. Ask us for the exact address.`}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center whitespace-nowrap space-x-2.5 text-xs sm:text-sm font-sans font-bold uppercase tracking-widest text-[#101014] bg-[#d4af37] hover:bg-white transition-all py-3.5 px-5 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.25)]"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center whitespace-nowrap space-x-2 text-xs sm:text-sm font-sans font-bold uppercase tracking-widest text-white border border-white/25 hover:border-[#d4af37] hover:text-[#d4af37] transition-all py-3.5 px-5 rounded-full"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
});

export default PropertyMap;
