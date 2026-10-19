"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square, ExternalLink, ArrowLeft } from "lucide-react";
import PropertyFilterBar, { FilterState } from "@/components/property/PropertyFilterBar";
import { useSettings } from "@/context/SettingsContext";

export default function PropertyCategoryPage({ params }: { params: Promise<{ type: string }> }) {
  const unwrappedParams = use(params);
  const { formatPrice, formatArea } = useSettings();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    purpose: "Buy",
    priceRange: "Any Price",
    areaRange: "Any Area (sqft)",
    city: "Dubai"
  });

  // Capitalize the type for display (e.g. "industrial" -> "Industrial")
  const categoryType = unwrappedParams.type.charAt(0).toUpperCase() + unwrappedParams.type.slice(1).toLowerCase();

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Filter out the properties matching this specific category
          const filtered = data.data.filter(
            (prop: any) => prop.propertyType?.toLowerCase() === unwrappedParams.type.toLowerCase()
          );
          setProperties(filtered);
        }
      })
      .catch((err) => console.error("Error fetching listings:", err))
      .finally(() => setLoading(false));
  }, [unwrappedParams.type]);

  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] pt-20 pb-20">

      {/* Hero Banner Area (Direct child of main) */}
      <section className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center h-[calc(100svh-5rem)]">
        <div className="relative w-full flex-1 min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-center justify-center text-center shadow-none group px-6 py-12 md:px-24 md:py-20 animate-[fadeInUp_0.8s_ease-out_forwards]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent opacity-50 z-0"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="relative z-20 flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">
              <span className="text-[#d4af37]">{categoryType}</span> Properties
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-light max-w-xl mx-auto">
              Explore our exclusive collection of premium {categoryType.toLowerCase()} real estate tailored for your unique requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="w-full mx-auto px-6 lg:px-12 mt-8 md:mt-16">
        <PropertyFilterBar onFilterChange={setFilters} />

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (() => {
          const displayedProperties = properties.filter(prop => {
            // Search Filter
            if (filters.search && !prop.title?.toLowerCase().includes(filters.search.toLowerCase()) && !prop.location?.toLowerCase().includes(filters.search.toLowerCase())) return false;
            
            // Purpose Filter
            const isBuy = filters.purpose === "Buy";
            const propStatus = prop.status?.toUpperCase() || "";
            if (isBuy && !propStatus.includes("SALE")) return false;
            if (!isBuy && !propStatus.includes("RENT")) return false;

            // Price Filter
            if (filters.priceRange !== "Any Price" && prop.price) {
              const numPrice = parseInt(prop.price.replace(/[^\d]/g, ''), 10);
              if (filters.priceRange === "Under 10M AED" && numPrice >= 10000000) return false;
              if (filters.priceRange === "10M - 25M AED" && (numPrice < 10000000 || numPrice > 25000000)) return false;
              if (filters.priceRange === "Above 25M AED" && numPrice <= 25000000) return false;
            }

            // Area Filter
            if (filters.areaRange !== "Any Area (sqft)" && prop.sqft) {
              const numArea = parseInt(prop.sqft.replace(/[^\d]/g, ''), 10);
              if (filters.areaRange === "Under 5,000 sqft" && numArea >= 5000) return false;
              if (filters.areaRange === "5,000 - 15,000 sqft" && (numArea < 5000 || numArea > 15000)) return false;
              if (filters.areaRange === "Above 15,000 sqft" && numArea <= 15000) return false;
            }

            return true;
          });

          if (displayedProperties.length === 0) {
            return (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
                <h3 className="text-2xl font-serif text-brand-black mb-2">No Properties Found</h3>
                <p className="text-gray-500">There are currently no properties matching your exact search and filter criteria.</p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mt-8">
              {displayedProperties.map((property, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] border border-gray-100/50 group cursor-pointer flex flex-col w-full h-full"
              >
                <Link href={`/properties/${property.id}`} className="flex flex-col w-full h-full">
                  <div className="relative h-[260px] w-full overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-brand-black/10 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                    <motion.img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover origin-center"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.15 }}
                      transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                    />
                    <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm text-brand-black px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-lg z-20 uppercase">
                      {property.status || "For Sale"}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-5 left-6 right-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-2xl font-serif text-white">
                        {formatPrice(property.price)}
                        {property.status === "FOR RENT" && !property.price?.toLowerCase().includes("yearly") && " / Yearly"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-serif font-bold text-brand-black mb-4 group-hover:text-brand-gold transition-colors line-clamp-1">{property.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-gray-500 text-sm font-medium line-clamp-1 pr-2">
                        <MapPin className="w-4 h-4 text-red-500 relative z-10 mr-2 flex-shrink-0" />
                        <span className="truncate">{property.location}{property.city ? `, ${property.city}` : ''}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(`https://maps.google.com/?q=${encodeURIComponent(property.location + ' Dubai')}`, '_blank');
                        }}
                        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-400 hover:text-brand-black hover:bg-brand-gold/10 hover:border-brand-gold/50 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#faf9f7] px-6 py-4 border-t border-gray-100 flex items-center justify-between text-gray-600 text-sm font-medium mt-auto">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1 text-brand-gold/70" /> {property.beds}
                    </div>
                    <div className="w-[1px] h-4 bg-gray-300"></div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1 text-brand-gold/70" /> {property.baths}
                    </div>
                    <div className="w-[1px] h-4 bg-gray-300"></div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1 text-brand-gold/70" /> {formatArea(property.sqft)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          );
        })()}
      </div>
    </main>
  );
}
