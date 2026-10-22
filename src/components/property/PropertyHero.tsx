"use client";

import React, { memo, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import PropertyHeroDetails from "@/components/property/PropertyHeroDetails";

interface PropertyHeroProps {
  property: {
    id: string;
    title: string;
    price: string;
    location: string;
    beds: number;
    baths: number;
    sqft: string;
    image: string;
    status?: string;
    galleryImages?: string[];
  };
}

const PropertyHero = memo(function PropertyHero({ property }: PropertyHeroProps) {
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const { formatPrice, formatArea } = useSettings();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Curated 5-photo luxury asset collection (Main cover + 4 verified architectural angles)
  const galleryImages = useMemo(() => {
    if (property.galleryImages && property.galleryImages.length > 0) {
      return [property.image, ...property.galleryImages];
    }
    return [
      property.image,
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", // Grand Living Salon
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // Master Suite
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", // Infinity Pool & Horizon
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", // Sunset Terrace
    ];
  }, [property.image, property.galleryImages]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Close zoom modal on ESC key or navigate with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
      if (isZoomed && e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % galleryImages.length);
      }
      if (isZoomed && e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed, galleryImages.length]);

  const openZoom = (index: number) => {
    setActiveIndex(index);
    setIsZoomed(true);
  };

  return (
    <>
    <PropertyHeroDetails {...{ property, galleryImages, activeIndex, setActiveIndex, openZoom, formatPrice, formatArea, onShare: handleShare, copied }} />

      {/* Full-Screen Zoomed Lightbox Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 lg:p-8"
            onClick={() => setIsZoomed(false)}
          >
            {/* Top Modal Header */}
            <div
              className="flex items-center justify-between w-full max-w-[96vw] xl:max-w-[1800px] mx-auto z-10 text-white border-b border-white/10 pb-2.5 sm:pb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-serif font-semibold text-white line-clamp-1">
                  {property.title} — {property.location}
                </h3>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => setIsZoomed(false)}
                  className="p-2 sm:px-4 sm:py-2 rounded-full bg-white/15 hover:bg-brand-gold hover:text-brand-black text-white transition-all duration-300 cursor-pointer shadow-lg flex items-center space-x-1.5 font-bold text-xs uppercase tracking-wider border border-white/20 group"
                  title="Close Zoomed View (ESC)"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>
            </div>

            {/* Main Zoomed Image Stage */}
            <div
              className="relative flex-1 min-h-0 w-full max-w-[96vw] xl:max-w-[1800px] mx-auto my-2 sm:my-3 flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-gray-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  // Whole photo always fits the stage (no zoom-in crop on desktop or mobile)
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={galleryImages[activeIndex]}
                    alt={`${property.title} - Zoomed View ${activeIndex + 1}`}
                    fill
                    sizes="100vw"
                    priority={true}
                    className="object-contain"
                    unoptimized={galleryImages[activeIndex]?.startsWith("/uploads/")}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Left/Right Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/80 hover:bg-brand-gold hover:text-brand-black text-white border border-white/20 transition-all duration-300 cursor-pointer shadow-2xl z-20 group"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/80 hover:bg-brand-gold hover:text-brand-black text-white border border-white/20 transition-all duration-300 cursor-pointer shadow-2xl z-20 group"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Bottom Thumbnail Selector Bar */}
            <div
              className="flex items-center justify-center space-x-2 sm:space-x-3 max-w-3xl mx-auto z-10 overflow-x-auto py-2 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-12 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer border-2 ${
                    activeIndex === idx ? "border-brand-gold scale-110 shadow-[0_0_15px_rgba(212,175,55,0.5)]" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                  title={`View Angle ${idx + 1}`}
                >
                  <Image src={img} alt={`Thumb ${idx + 1}`} fill sizes="64px" className="object-cover" unoptimized={img?.startsWith("/uploads/")} />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default PropertyHero;
