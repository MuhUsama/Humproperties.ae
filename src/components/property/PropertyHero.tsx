"use client";

import React, { memo, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Bath, Square, MapPin, ArrowDown, Sparkles, Share2, Check, ShieldCheck, ChevronLeft, ChevronRight, ArrowLeft, ZoomIn, Maximize2, X } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useSettings } from "@/context/SettingsContext";

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

  // Calculate exact next two preview indices for the right stack
  const rightTopIndex = (activeIndex + 1) % galleryImages.length;
  const rightBottomIndex = (activeIndex + 2) % galleryImages.length;

  return (
    <section className="min-h-[calc(100svh-5rem)] min-h-[calc(100dvh-5rem)] w-full flex flex-col justify-start items-center relative overflow-hidden pt-10 sm:pt-14 pb-2 sm:pb-3 lg:pb-4 px-4 sm:px-6 lg:px-12 bg-[#faf9f7]">
      {/* Subtle luxury grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="w-full mx-auto relative z-10 flex flex-col justify-start mt-0">
        {/* Mobile Executive Action Buttons Bar (At top above Name & For Sale badge on mobile!) */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex md:hidden items-center justify-between gap-2 w-full mb-1.5 sm:mb-2.5 border-b border-gray-200/60 pb-1.5 sm:pb-2.5">
          <a
            href="/#properties"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/#properties";
            }}
            className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-brand-black text-brand-gold border border-brand-gold/40 hover:bg-brand-gold hover:text-brand-black transition-all duration-300 text-[10px] font-extrabold uppercase tracking-widest shadow-md whitespace-nowrap cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-gold group-hover:text-brand-black flex-shrink-0" />
            <span>Back to Portfolio</span>
          </a>

          <button
            onClick={handleShare}
            type="button"
            className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 sm:py-2 rounded-full bg-white text-brand-black border border-gray-200/80 hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-300 text-[10px] font-extrabold uppercase tracking-widest shadow-md whitespace-nowrap cursor-pointer group"
            title="Copy Listing URL"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-gold transition-colors flex-shrink-0" />
                <span>Share</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Top Header Bar */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-4 mb-1.5 sm:mb-3"
        >
          <div>
            <motion.div variants={fadeInUp} className="flex items-center space-x-3 mb-1 sm:mb-2">
              <span className="bg-brand-black text-brand-gold px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-md flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-brand-gold" />
                <span>{property.status || "EXCLUSIVE PORTFOLIO"}</span>
              </span>
              <div className="flex items-center text-gray-500 text-xs sm:text-sm font-medium">
                <div className="relative mr-1.5 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                  <MapPin className="w-3.5 h-3.5 text-red-500 relative z-10" />
                </div>
                <span>{property.location}</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-brand-black tracking-tight line-clamp-1">
              {property.title}
            </motion.h1>
          </div>

          <motion.div variants={fadeInUp} className="flex flex-col items-start sm:items-end justify-between md:justify-end gap-2 sm:gap-3 border-t md:border-t-0 pt-2 md:pt-0 border-gray-200/60 w-full sm:w-auto">
            {/* Executive Action Buttons Bar (Desktop only on top right) */}
            <div className="hidden md:flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end">
              <a
                href="/#properties"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/#properties";
                }}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 sm:py-2.5 rounded-full bg-brand-black text-brand-gold border border-brand-gold/40 hover:bg-brand-gold hover:text-brand-black transition-all duration-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-brand-gold group-hover:text-brand-black flex-shrink-0" />
                <span>Back to Portfolio</span>
              </a>

              <button
                onClick={handleShare}
                type="button"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 sm:py-2.5 rounded-full bg-white text-brand-black border border-gray-200/80 hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-300 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest shadow-md hover:shadow-lg whitespace-nowrap cursor-pointer group"
                title="Copy Listing URL"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-gold transition-colors flex-shrink-0" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

            {/* Offering Price Mandate Showcase */}
            <div className="text-left sm:text-right w-full sm:w-auto bg-white/60 sm:bg-transparent p-2 sm:p-0 rounded-2xl border sm:border-0 border-gray-100 shadow-2xs sm:shadow-none">
              <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-[0.2em] text-gray-400 block mb-0.5">
                Offering Price Mandate
              </span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-brand-gold tracking-tight block">
                {formatPrice(property.price)}
                {property.status === "FOR RENT" && !property.price?.toLowerCase().includes("yearly") && " / Yearly"}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* 3-Panel Interactive Gallery Grid (1 Big Left, 2 Stacked Right with Zero Scrollbars & Constrained Height!) */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full h-[280px] sm:h-[320px] md:h-[250px] lg:h-[270px] my-1.5 sm:my-3"
        >
          {/* Main Showcase Stage (Left 2 Columns) */}
          <div
            onClick={() => openZoom(activeIndex)}
            className="md:col-span-2 relative w-full h-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 group bg-gray-900 cursor-zoom-in"
            title="Click to open Full-Screen Zoomed View"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={galleryImages[activeIndex]}
                  alt={`${property.title} - Angle ${activeIndex + 1}`}
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  unoptimized={galleryImages[activeIndex]?.startsWith("/uploads/")}
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none"></div>

            {/* Verified Badge */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-black/60 backdrop-blur-md text-white/90 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-light flex items-center space-x-1.5 border border-white/15 shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
              <span>Verified Luxury Asset • Direct Advisory Mandate</span>
            </div>

            {/* Photo Counter Badge */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-white/15 shadow-md">
              <span>{activeIndex + 1} / {galleryImages.length}</span>
            </div>

            {/* Click to Zoom Overlay Button */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase border border-white/20 shadow-lg flex items-center space-x-1.5 group-hover:bg-brand-gold group-hover:text-brand-black group-hover:border-brand-gold transition-all duration-300">
              <ZoomIn className="w-3.5 h-3.5 text-brand-gold group-hover:text-brand-black transition-colors flex-shrink-0" />
              <span className="hidden sm:inline">Click to Zoom</span>
              <span className="sm:hidden">Zoom</span>
            </div>
          </div>

          {/* Two Stacked Preview Thumbnails (Right Column — No Scrollbars!) */}
          <div className="hidden md:flex flex-col gap-3 sm:gap-4 h-full">
            {/* Top Preview Card */}
            <div
              onClick={() => openZoom(rightTopIndex)}
              className="relative w-full flex-1 rounded-[1.5rem] overflow-hidden shadow-md border border-gray-200/80 cursor-pointer group bg-gray-900 hover:border-brand-gold transition-all"
              title="Click to open Zoomed View"
            >
              <Image
                src={galleryImages[rightTopIndex]}
                alt="Next preview top"
                fill
                sizes="33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                unoptimized={galleryImages[rightTopIndex]?.startsWith("/uploads/")}
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute bottom-2.5 left-3 bg-white/90 backdrop-blur-sm text-brand-black px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase shadow flex items-center space-x-1">
                <ZoomIn className="w-2.5 h-2.5 text-brand-gold" />
                <span>Zoom Angle</span>
              </div>
            </div>

            {/* Bottom Preview Card */}
            <div
              onClick={() => openZoom(rightBottomIndex)}
              className="relative w-full flex-1 rounded-[1.5rem] overflow-hidden shadow-md border border-gray-200/80 cursor-pointer group bg-gray-900 hover:border-brand-gold transition-all"
              title="Click to open Zoomed View"
            >
              <Image
                src={galleryImages[rightBottomIndex]}
                alt="Next preview bottom"
                fill
                sizes="33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                unoptimized={galleryImages[rightBottomIndex]?.startsWith("/uploads/")}
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute bottom-2.5 left-3 bg-white/90 backdrop-blur-sm text-brand-black px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase shadow flex items-center space-x-1">
                <ZoomIn className="w-2.5 h-2.5 text-brand-gold" />
                <span>Zoom Angle</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gallery Arrow Controls & Photo Selector */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex items-center justify-between max-w-2xl mx-auto w-full mb-1 sm:mb-2.5 px-2 sm:px-0">
          <button
            onClick={handlePrev}
            type="button"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-brand-black hover:border-brand-gold hover:bg-brand-gold hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Previous</span>
          </button>

          {/* Dot indicators */}
          <div className="flex items-center space-x-2">
            {galleryImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx ? "w-6 bg-brand-gold" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                title={`View angle ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            type="button"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-brand-black hover:border-brand-gold hover:bg-brand-gold hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-2xs cursor-pointer group"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>

        {/* Quick Specs Glassmorphic Bar (Full Width on Desktop matching Image Gallery) */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-2 sm:gap-6 max-w-3xl sm:max-w-none mx-auto w-full bg-white p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-gray-100 mb-1 sm:mb-2.5"
        >
          <div className="flex flex-col items-center justify-center text-center p-1.5 sm:py-3.5 sm:px-6 bg-gray-50/70 rounded-xl sm:rounded-2xl border border-gray-100">
            <Bed className="w-4 h-4 sm:w-6 sm:h-6 text-brand-gold mb-1" />
            <span className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Bedrooms</span>
            <span className="text-sm sm:text-xl md:text-2xl font-serif font-bold text-brand-black">{property.beds} Suites</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-1.5 sm:py-3.5 sm:px-6 bg-gray-50/70 rounded-xl sm:rounded-2xl border border-gray-100">
            <Bath className="w-4 h-4 sm:w-6 sm:h-6 text-brand-gold mb-1" />
            <span className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Bathrooms</span>
            <span className="text-sm sm:text-xl md:text-2xl font-serif font-bold text-brand-black">{property.baths} Baths</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center p-1.5 sm:py-3.5 sm:px-6 bg-gray-50/70 rounded-xl sm:rounded-2xl border border-gray-100">
            <Square className="w-4 h-4 sm:w-6 sm:h-6 text-brand-gold mb-1" />
            <span className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Area Size</span>
            <span className="text-sm sm:text-xl md:text-2xl font-serif font-bold text-brand-black">{formatArea(property.sqft)}</span>
          </div>
        </motion.div>

        {/* Smooth Scroll Down Indicator */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex justify-center">
          <motion.a
            href="#specifications"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("specifications")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 text-[11px] font-bold text-gray-500 hover:text-brand-black transition-colors py-1 px-3.5 rounded-full bg-white/90 border border-gray-200/80 shadow-2xs cursor-pointer group"
          >
            <span>Explore Specifications & Amenities</span>
            <motion.div animate={{ y: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
              <ArrowDown className="w-3.5 h-3.5 text-brand-gold" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>

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
    </section>
  );
});

export default PropertyHero;
