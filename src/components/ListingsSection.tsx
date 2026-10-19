"use client";

import { useEffect, useRef, useState, memo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Bed, Bath, Square, ExternalLink } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const smoothScrollTo = (element: HTMLDivElement, target: number, duration: number) => {
  const start = element.scrollLeft;
  const change = target - start;
  const startTime = performance.now();
  
  // Temporarily disable scroll snap to prevent programmatic scroll fighting/jitter
  const originalSnap = element.style.scrollSnapType;
  element.style.scrollSnapType = "none";
  element.style.scrollBehavior = "auto";

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animate = (currentTime: number) => {
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, start, change, duration);
    element.scrollLeft = run;

    if (timeElapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      element.scrollLeft = target;
      // Re-enable scroll snap and behavior
      element.style.scrollSnapType = originalSnap;
      element.style.scrollBehavior = "";
    }
  };

  requestAnimationFrame(animate);
};

const ListingsSection = memo(function ListingsSection() {
  const { formatPrice, formatArea } = useSettings();
  const [activeTab, setActiveTab] = useState("All");
  const listingsScrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1500], [0, 400]);

  useEffect(() => {
    if (isPaused) return;

    // Auto-scroll logic strictly designed for iOS Safari Snap conflict
    const scrollTimer = setInterval(() => {
      if (listingsScrollRef.current) {
        const container = listingsScrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const scrollAmount = container.firstElementChild?.clientWidth || container.clientWidth;
        
        if (maxScroll > 0) {
          if (container.scrollLeft >= maxScroll - 10) {
            smoothScrollTo(container, 0, 800);
          } else {
            // Find the current active index precisely
            const currentIndex = Math.round(container.scrollLeft / scrollAmount);
            // Calculate EXACT pixel coordinate of the next card
            const targetScroll = (currentIndex + 1) * scrollAmount;
            
            smoothScrollTo(container, targetScroll, 800);
          }
        }
      }
    }, 3500);

    return () => clearInterval(scrollTimer);
  }, [isPaused]);

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/listings", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProperties(data.data);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error("Error fetching listings:", err.message || err);
      })
      .finally(() => setLoading(false));
      
    return () => controller.abort();
  }, []);

  // When there are no properties, automatically hide this section
  if (loading || properties.length === 0) {
    return null;
  }

  // If there is a property listed for buy then button goes to /buy, otherwise goes to /rent
  const hasBuyProperties = properties.some((p) => {
    const status = (p.status || "").toUpperCase();
    return status.includes("SALE") || status.includes("BUY") || (!status.includes("RENT") && status !== "");
  });
  const viewAllLink = hasBuyProperties ? "/buy" : "/rent";

  return (
    <section id="properties" className="py-4 sm:py-8 md:py-8 bg-[#faf9f7] relative overflow-hidden h-[calc(100svh-5rem)] flex flex-col">
      {/* Modern grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Giant outline text */}
      <motion.div 
        style={{ y: parallaxY }}
        className="absolute top-0 left-1/2 -translate-x-1/2 text-[80px] md:text-[200px] font-bold text-black/[0.03] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter"
      >
        PORTFOLIO
      </motion.div>

      <div className="w-full mx-auto px-0 md:px-6 lg:px-12 relative z-10 flex flex-col flex-1 min-h-0 h-full">
        <motion.div 
          className="flex flex-col md:flex-row items-center md:items-end justify-between mb-4 md:mb-8 px-6 md:px-0 flex-shrink-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <div className="text-center md:text-left md:max-w-2xl lg:max-w-3xl">
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-black mb-2 sm:mb-4 relative z-10">
              Exclusive Listings
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 text-sm md:text-lg relative z-10 line-clamp-2 md:line-clamp-none mx-auto md:mx-0">
              Discover our curated portfolio of the most sought-after luxury properties across Dubai's most prestigious neighborhoods.
            </motion.p>
          </div>
          
          <motion.div variants={fadeInUp} className="hidden md:flex flex-shrink-0 ml-8 pb-2">
            <Link href={viewAllLink} className="inline-flex items-center text-brand-black font-semibold hover:text-brand-gold transition-colors pb-1.5 border-b-2 border-brand-gold/30 hover:border-brand-gold whitespace-nowrap">
              View All Properties 
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </motion.div>
        </motion.div>
        <div className="relative flex flex-col flex-1 min-h-0 w-full group/carousel">
          {/* Desktop Floating Arrows */}
          <button 
            onClick={() => {
              if (listingsScrollRef.current) {
                const container = listingsScrollRef.current;
                const scrollAmount = container.firstElementChild?.clientWidth || container.clientWidth;
                const targetScroll = Math.max(container.scrollLeft - scrollAmount, 0);
                smoothScrollTo(container, targetScroll, 800);
              }
            }}
            className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 items-center justify-center text-brand-black hover:bg-brand-black hover:text-white hover:scale-110 transition-all duration-300 z-30 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Previous property"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={() => {
              if (listingsScrollRef.current) {
                const container = listingsScrollRef.current;
                const scrollAmount = container.firstElementChild?.clientWidth || container.clientWidth;
                const targetScroll = Math.min(container.scrollLeft + scrollAmount, container.scrollWidth - container.clientWidth);
                smoothScrollTo(container, targetScroll, 800);
              }
            }}
            className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 items-center justify-center text-brand-black hover:bg-brand-black hover:text-white hover:scale-110 transition-all duration-300 z-30 opacity-0 group-hover/carousel:opacity-100"
            aria-label="Next property"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
          </button>

          <motion.div 
            key={properties.length > 0 ? "loaded" : "empty"}
            ref={listingsScrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory gap-0 px-0 flex-1 items-stretch min-h-0 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {properties.map((property, idx) => (
              <div key={idx} className="w-full md:w-1/2 lg:w-1/3 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333333%] px-4 sm:px-6 snap-center flex justify-center h-full pt-2 sm:pt-4 pb-2 sm:pb-4">
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] border border-gray-100/50 group cursor-pointer flex flex-col w-full h-full"
                >
                  <Link href={`/properties/${property.id || `prop-${idx + 1}`}`} className="flex flex-col w-full h-full">
                  <div className="relative flex-1 min-h-[120px] sm:min-h-[150px] overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-brand-black/10 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                  <motion.img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover origin-center"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.15 }}
                    transition={{ 
                       duration: 20, 
                       repeat: Infinity, 
                       repeatType: "reverse", 
                       ease: "linear" 
                    }}
                  />
                  <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm text-brand-black px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-lg z-20 uppercase">
                    {property.status || "For Sale"}
                  </div>
                  
                  {/* Gradient Overlay for Price */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute bottom-5 left-6 right-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-2xl font-serif text-white">
                      {formatPrice(property.price)}
                      {property.status === "FOR RENT" && !property.price?.toLowerCase().includes("yearly") && " / Yearly"}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6 md:p-8">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-brand-black mb-2 sm:mb-4 group-hover:text-brand-gold transition-colors line-clamp-1">{property.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm font-medium">
                      <div className="relative mr-2 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                        <MapPin className="w-4 h-4 text-red-500 relative z-10" />
                      </div>
                      {property.location}{property.city ? `, ${property.city}` : ''}
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`https://maps.google.com/?q=${encodeURIComponent(property.location + ' Dubai')}`, '_blank');
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-400 hover:text-brand-black hover:bg-brand-gold/10 hover:border-brand-gold/50 hover:shadow-md transition-all cursor-pointer"
                      title="View on Map"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#faf9f7] px-4 sm:px-8 py-3 sm:py-5 border-t border-gray-100 flex items-center justify-between text-gray-600 text-xs sm:text-sm font-medium">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-2 text-brand-gold/70" /> {property.beds} Beds
                  </div>
                  <div className="w-[1px] h-4 bg-gray-300"></div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-2 text-brand-gold/70" /> {property.baths} Baths
                  </div>
                  <div className="w-[1px] h-4 bg-gray-300"></div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-2 text-brand-gold/70" /> {formatArea(property.sqft)}
                  </div>
                </div>
                  </Link>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex md:hidden justify-center gap-4 mt-2 sm:mt-4 relative z-10 flex-shrink-0">
          <button 
            onClick={() => {
              if (listingsScrollRef.current) {
                const container = listingsScrollRef.current;
                const scrollAmount = container.firstElementChild?.clientWidth || container.clientWidth;
                const targetScroll = Math.max(container.scrollLeft - scrollAmount, 0);
                smoothScrollTo(container, targetScroll, 800);
              }
            }}
            className="w-12 h-12 rounded-full border border-gray-300 bg-transparent flex items-center justify-center text-gray-500 hover:text-brand-black hover:border-brand-black transition-all duration-300"
            aria-label="Previous property"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={() => {
              if (listingsScrollRef.current) {
                const container = listingsScrollRef.current;
                const scrollAmount = container.firstElementChild?.clientWidth || container.clientWidth;
                const targetScroll = Math.min(container.scrollLeft + scrollAmount, container.scrollWidth - container.clientWidth);
                smoothScrollTo(container, targetScroll, 800);
              }
            }}
            className="w-12 h-12 rounded-full border border-gray-300 bg-transparent flex items-center justify-center text-gray-500 hover:text-brand-black hover:border-brand-black transition-all duration-300"
            aria-label="Next property"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="mt-2 sm:mt-4 text-center relative z-10 md:hidden flex-shrink-0 pb-2 sm:pb-4">
          <Link href={viewAllLink} className="inline-flex items-center text-brand-black font-semibold hover:text-brand-gold transition-colors pb-1.5 border-b-2 border-brand-gold/30 hover:border-brand-gold">
            View All Properties 
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
});

export default ListingsSection;
