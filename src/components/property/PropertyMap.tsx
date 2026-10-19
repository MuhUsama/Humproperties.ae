"use client";

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Plane, 
  ShoppingBag, 
  Anchor, 
  Trophy, 
  Compass, 
  Building2 
} from "lucide-react";
import { staggerContainer } from "@/lib/animations";

interface PropertyMapProps {
  property: {
    id: string;
    title: string;
    location: string;
    directionLink?: string;
  };
}

interface Landmark {
  time: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface LocationIntel {
  districtName: string;
  districtTag: string;
  lat: number;
  lng: number;
  landmarks: Landmark[];
}

function resolveLocationIntel(location: string, directionLink?: string): LocationIntel {
  const locLower = (location || "").toLowerCase();

  // 1. Try extracting exact GPS coordinates from directionLink if provided
  let parsedLat: number | null = null;
  let parsedLng: number | null = null;

  if (directionLink) {
    const atMatch = directionLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const qMatch = directionLink.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    const plainMatch = directionLink.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);

    const match = atMatch || qMatch || plainMatch;
    if (match) {
      parsedLat = parseFloat(match[1]);
      parsedLng = parseFloat(match[2]);
    }
  }

  // 2. Resolve known Dubai districts with realistic coordinates and travel times
  if (locLower.includes("palm") || locLower.includes("jumeirah island") || locLower.includes("atlantis")) {
    return {
      districtName: "Palm Jumeirah",
      districtTag: "ICONIC ARCHIPELAGO",
      lat: parsedLat ?? 25.1124,
      lng: parsedLng ?? 55.1390,
      landmarks: [
        { time: "2 Mins", name: "Atlantis & Private Coast", category: "COASTAL", icon: Compass },
        { time: "8 Mins", name: "Dubai Marina Yacht Club", category: "MARITIME", icon: Anchor },
        { time: "14 Mins", name: "Mall of the Emirates", category: "RETAIL", icon: ShoppingBag },
        { time: "24 Mins", name: "DXB Int'l Airport", category: "AVIATION", icon: Plane },
      ]
    };
  }

  if (locLower.includes("marina") || locLower.includes("jbr") || locLower.includes("bluewaters")) {
    return {
      districtName: "Dubai Marina",
      districtTag: "RIVIERA WATERFRONT",
      lat: parsedLat ?? 25.0805,
      lng: parsedLng ?? 55.1403,
      landmarks: [
        { time: "2 Mins", name: "Marina Promenade & Pier 7", category: "MARITIME", icon: Anchor },
        { time: "6 Mins", name: "Ain Dubai & Bluewaters", category: "LANDMARK", icon: Compass },
        { time: "12 Mins", name: "Emirates Golf Club", category: "LEISURE", icon: Trophy },
        { time: "22 Mins", name: "DXB Int'l Airport", category: "AVIATION", icon: Plane },
      ]
    };
  }

  if (locLower.includes("hills") || locLower.includes("mbr") || locLower.includes("mohammed bin rashid")) {
    return {
      districtName: "Dubai Hills Estate",
      districtTag: "GREEN HEART OF DUBAI",
      lat: parsedLat ?? 25.1136,
      lng: parsedLng ?? 55.2458,
      landmarks: [
        { time: "3 Mins", name: "Championship Golf Course", category: "LEISURE", icon: Trophy },
        { time: "5 Mins", name: "Dubai Hills Mall & Park", category: "RETAIL", icon: ShoppingBag },
        { time: "12 Mins", name: "Downtown & Burj Khalifa", category: "LANDMARK", icon: Building2 },
        { time: "18 Mins", name: "DXB Int'l Airport", category: "AVIATION", icon: Plane },
      ]
    };
  }

  if (locLower.includes("creek") || locLower.includes("harbour")) {
    return {
      districtName: "Dubai Creek Harbour",
      districtTag: "HISTORIC WATERFRONT SANCTUARY",
      lat: parsedLat ?? 25.2018,
      lng: parsedLng ?? 55.3582,
      landmarks: [
        { time: "3 Mins", name: "Creek Marina & Boardwalk", category: "MARITIME", icon: Anchor },
        { time: "10 Mins", name: "Downtown Burj Khalifa", category: "LANDMARK", icon: Building2 },
        { time: "12 Mins", name: "DXB Int'l Airport", category: "AVIATION", icon: Plane },
        { time: "15 Mins", name: "Ras Al Khor Sanctuary", category: "NATURE", icon: Compass },
      ]
    };
  }

  if (locLower.includes("difc")) {
    return {
      districtName: "DIFC",
      districtTag: "FINANCIAL EPICENTER",
      lat: parsedLat ?? 25.2106,
      lng: parsedLng ?? 55.2816,
      landmarks: [
        { time: "2 Mins", name: "Gate Avenue & Galleries", category: "CULTURE", icon: Building2 },
        { time: "5 Mins", name: "Burj Khalifa & Dubai Mall", category: "LANDMARK", icon: ShoppingBag },
        { time: "12 Mins", name: "DXB Int'l Airport", category: "AVIATION", icon: Plane },
        { time: "18 Mins", name: "Jumeirah Beach Coast", category: "COASTAL", icon: Anchor },
      ]
    };
  }

  if (locLower.includes("business bay")) {
    return {
      districtName: "Business Bay",
      districtTag: "CANAL METROPOLIS",
      lat: parsedLat ?? 25.1837,
      lng: parsedLng ?? 55.2666,
      landmarks: [
        { time: "3 Mins", name: "Dubai Canal Boardwalk", category: "MARITIME", icon: Anchor },
        { time: "5 Mins", name: "Downtown & Burj Khalifa", category: "LANDMARK", icon: Building2 },
        { time: "14 Mins", name: "DXB Int'l Airport", category: "AVIATION", icon: Plane },
        { time: "16 Mins", name: "Jumeirah Beach Enclave", category: "COASTAL", icon: Compass },
      ]
    };
  }

  if (locLower.includes("emirates hills") || locLower.includes("meadows") || locLower.includes("springs")) {
    return {
      districtName: "Emirates Hills",
      districtTag: "BEVERLY HILLS OF DUBAI",
      lat: parsedLat ?? 25.0683,
      lng: parsedLng ?? 55.1783,
      landmarks: [
        { time: "2 Mins", name: "Montgomerie Golf Club", category: "LEISURE", icon: Trophy },
        { time: "8 Mins", name: "Dubai Marina & Beaches", category: "MARITIME", icon: Anchor },
        { time: "12 Mins", name: "Mall of the Emirates", category: "RETAIL", icon: ShoppingBag },
        { time: "22 Mins", name: "DXB Int'l Airport", category: "AVIATION", icon: Plane },
      ]
    };
  }

  if (locLower.includes("ranches") || locLower.includes("damac") || locLower.includes("south")) {
    return {
      districtName: "Arabian Ranches & Hills",
      districtTag: "EXCLUSIVE GATED HAVEN",
      lat: parsedLat ?? 25.0483,
      lng: parsedLng ?? 55.2638,
      landmarks: [
        { time: "3 Mins", name: "Championship Equestrian Club", category: "LEISURE", icon: Trophy },
        { time: "14 Mins", name: "Dubai Hills Mall", category: "RETAIL", icon: ShoppingBag },
        { time: "20 Mins", name: "Downtown Dubai", category: "LANDMARK", icon: Building2 },
        { time: "24 Mins", name: "DXB & DWC Airports", category: "AVIATION", icon: Plane },
      ]
    };
  }

  // Default: Downtown Dubai / Core Metropolitan
  return {
    districtName: location || "Downtown Dubai",
    districtTag: "HYPER-CONNECTED SANCTUARY",
    lat: parsedLat ?? 25.1972,
    lng: parsedLng ?? 55.2744,
    landmarks: [
      { time: "3 Mins", name: "Burj Khalifa & Dubai Mall", category: "LANDMARK", icon: ShoppingBag },
      { time: "5 Mins", name: "Dubai Opera & DIFC", category: "CULTURE", icon: Building2 },
      { time: "15 Mins", name: "DXB Int'l Airport", category: "AVIATION", icon: Plane },
      { time: "18 Mins", name: "Dubai Marina & Coastline", category: "MARITIME", icon: Anchor },
    ]
  };
}

const PropertyMap = memo(function PropertyMap({ property }: PropertyMapProps) {
  const intel = useMemo(
    () => resolveLocationIntel(property.location, property.directionLink),
    [property.location, property.directionLink]
  );

  const mapQuery = encodeURIComponent(`${property.location} Dubai`);
  const googleMapsUrl = property.directionLink || `https://maps.google.com/?q=${mapQuery}`;
  const embedMapUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <section 
      id="location-tour" 
      className="w-full min-h-[calc(100vh-4.5rem)] sm:min-h-[calc(100svh-5rem)] bg-[#0a0a0d] text-white flex flex-col justify-between py-6 sm:py-10 overflow-hidden relative scroll-mt-20"
    >
      {/* Delicate ambient gold museum glows */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/8 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="w-full mx-auto px-4 sm:px-8 lg:px-16 flex flex-col justify-between h-full z-10 flex-1"
      >
        <div className="relative z-10 h-full flex flex-col justify-between">
          
          {/* Top Eyebrow Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6 shrink-0">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse"></span>
              <span className="text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                04 / Prime Position & Strategic Proximity
              </span>
            </div>
            <span className="inline-block text-[10px] sm:text-[11px] font-mono text-gray-400 uppercase tracking-widest">
              [ MFRE STRATEGIC LOCATION INTELLIGENCE ]
            </span>
          </div>

          {/* Editorial Connectivity & Interactive Map Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center my-auto">
            
            {/* Left Column: Dynamic Coordinates & Proximity Ledger */}
            <div className="lg:col-span-5 space-y-5 text-left shrink-0">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                    {intel.districtTag}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                    GPS: {intel.lat.toFixed(4)}° N, {intel.lng.toFixed(4)}° E
                  </span>
                </div>
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-normal text-white leading-tight">
                  Prime {intel.districtName} Coordinates
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 font-light mt-2 max-w-md leading-relaxed">
                  Engineered for effortless transit across Dubai&apos;s most vital arterial highways, aviation hubs, and world-class retail landmarks.
                </p>
              </div>

              {/* 4 Dynamic Proximity Tiles */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {intel.landmarks.map((landmark, idx) => {
                  const Icon = landmark.icon;
                  return (
                    <div 
                      key={idx}
                      className="bg-[#141418]/90 backdrop-blur-sm border border-white/10 hover:border-[#d4af37]/60 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-center space-x-3 sm:space-x-3.5 transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(212,175,55,0.12)] hover:-translate-y-0.5"
                    >
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-mono uppercase tracking-wider text-[#d4af37]/90 text-[10px] mb-0.5">
                          {landmark.category}
                        </div>
                        <div className="text-sm sm:text-base font-serif font-bold text-white">
                          {landmark.time}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-400 font-sans tracking-wide truncate">
                          {landmark.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Open Direct GPS Button */}
              <div className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2.5 sm:space-x-3 text-xs sm:text-sm font-sans font-bold uppercase tracking-widest text-[#101014] bg-[#d4af37] hover:bg-white hover:text-[#101014] transition-all py-3.5 px-6 sm:px-8 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#101014]" />
                  <span>Open Route in Google Maps</span>
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Map Theater Showcase */}
            <div className="lg:col-span-7">
              <div className="w-full h-[280px] sm:h-[400px] lg:h-[460px] xl:h-[490px] rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/15 bg-[#141418] p-2.5 sm:p-3 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative group">
                <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden relative">
                  <iframe
                    title={`Map of ${property.location}`}
                    src={embedMapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full object-cover"
                  />

                  {/* Floating Luxury Address Badge */}
                  <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-[#141418]/95 backdrop-blur-md border border-white/20 px-3.5 sm:px-5 py-2 rounded-full shadow-2xl pointer-events-none flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="text-xs sm:text-sm font-serif font-semibold text-white">
                      {property.location}, Dubai
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Signature Footer Inside Card */}
          <div className="pt-3 mt-6 sm:mt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-gray-400 font-sans tracking-wider uppercase gap-2 sm:gap-0">
            <span className="text-[#d4af37]/90 font-medium">◆ MOHD. ALFALASI REAL ESTATE ADVISORY</span>
            <span>VERIFIED GPS & ARTERIAL HIGHWAY CONNECTIVITY</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
});

export default PropertyMap;
