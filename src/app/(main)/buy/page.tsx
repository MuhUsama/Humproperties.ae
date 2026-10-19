"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square, ExternalLink, ArrowLeft } from "lucide-react";
import PropertyFilterBar, { FilterState } from "@/components/property/PropertyFilterBar";
import { useSettings } from "@/context/SettingsContext";
import FaqSection from "@/components/common/FaqSection";
import { getFaqsByCategory } from "@/lib/faqData";

const ALL_CATEGORIES = {
  Residential: ["Apartment", "Studio", "Villa", "Townhouse", "Penthouse", "Duplex"],
  Commercial: ["Office", "Retail", "Warehouse", "Full Floor", "Commercial Building"],
  Industrial: ["Jebel Ali", "Technology Park", "Dubai Industrial Park", "Al Quoz", "Dubai South", "DIP"],
};

export default function BuyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#faf9f7]"><div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div></div>}>
      <BuyContent />
    </Suspense>
  );
}

function BuyContent() {
  const searchParams = useSearchParams();
  const { formatPrice, formatArea } = useSettings();
  
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyType, setPropertyType] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "All Categories");
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    purpose: "Buy",
    city: searchParams.get("city") || "All Cities",
    priceRange: "Any Price",
    areaRange: "Any Area (sqft)"
  });

  // Sync state when URL params change (important for client-side navigation within the same page)
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      // Auto-select correct property type so the tab makes sense
      if (ALL_CATEGORIES.Residential.includes(categoryParam)) setPropertyType("Residential");
      else if (ALL_CATEGORIES.Commercial.includes(categoryParam)) setPropertyType("Commercial");
      else if (ALL_CATEGORIES.Industrial.includes(categoryParam)) setPropertyType("Industrial");
    } else {
      setSelectedCategory("All Categories");
      setPropertyType("All");
    }
    
    const cityParam = searchParams.get("city");
    if (cityParam) {
      setFilters(prev => ({ ...prev, city: cityParam }));
    } else {
      setFilters(prev => ({ ...prev, city: "All Cities" }));
    }
  }, [searchParams]);

  let availableCategories: string[] = [];
  if (propertyType === "All") {
    availableCategories = [
      ...ALL_CATEGORIES.Residential,
      ...ALL_CATEGORIES.Commercial,
      ...ALL_CATEGORIES.Industrial,
    ];
  } else {
    availableCategories = ALL_CATEGORIES[propertyType as keyof typeof ALL_CATEGORIES] || [];
  }

  // Calculate category counts dynamically
  const categoryCounts = properties.reduce((acc, p) => {
    const isPurposeMatch = filters.purpose === "Buy" ? p.status?.toUpperCase().includes("SALE") : p.status?.toUpperCase().includes("RENT");
    if (isPurposeMatch) {
      const cat = p.category;
      if (cat) {
        acc[cat] = (acc[cat] || 0) + 1;
      }
    }
    return acc;
  }, {} as Record<string, number>);

  const totalInType = availableCategories.reduce((sum, cat) => sum + (categoryCounts[cat] || 0), 0);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProperties(data.data);
        }
      })
      .catch((err) => console.error("Error fetching listings:", err))
      .finally(() => setLoading(false));
  }, []);

  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Compute displayed properties
  const displayedProperties = properties.filter(prop => {
    // Purpose Filter (from PropertyFilterBar)
    const isBuy = filters.purpose === "Buy";
    const propStatus = prop.status?.toUpperCase() || "";
    if (isBuy && !propStatus.includes("SALE")) return false;
    if (!isBuy && !propStatus.includes("RENT")) return false;

    // Search Filter
    if (filters.search && !prop.title?.toLowerCase().includes(filters.search.toLowerCase()) && !prop.location?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    // Property Type Filter
    if (propertyType !== "All") {
      const pType = prop.propertyType || "Residential";
      if (pType !== propertyType) return false;
    }

    // Sub-Category Filter
    if (selectedCategory !== "All Categories") {
      const cat = prop.category || "Unknown";
      if (cat !== selectedCategory) return false;
    }

    // Price Filter
    if (filters.priceRange !== "Any Price" && prop.price) {
      const numPrice = parseInt(prop.price.replace(/[^\d]/g, ''), 10);
      if (filters.priceRange === "Under 10M AED" && numPrice >= 10000000) return false;
      if (filters.priceRange === "10M - 25M AED" && (numPrice < 10000000 || numPrice > 25000000)) return false;
      if (filters.priceRange === "25M - 50M AED" && (numPrice < 25000000 || numPrice > 50000000)) return false;
      if (filters.priceRange === "50M+ AED" && numPrice <= 50000000) return false;
    }

    // Area Filter
    if (filters.areaRange !== "Any Area (sqft)" && prop.sqft) {
      const numArea = parseInt(prop.sqft.replace(/[^\d]/g, ''), 10);
      if (filters.areaRange === "Under 5,000" && numArea >= 5000) return false;
      if (filters.areaRange === "5,000 - 10,000" && (numArea < 5000 || numArea > 10000)) return false;
      if (filters.areaRange === "10,000 - 20,000" && (numArea < 10000 || numArea > 20000)) return false;
      if (filters.areaRange === "20,000+" && numArea <= 20000) return false;
    }

    // City Filter
    if (filters.city !== "All Cities") {
      const propCity = prop.city || "Dubai";
      if (propCity !== filters.city) return false;
    }

    return true;
  });

  const buyFaqs = getFaqsByCategory('buy');

  return (
    <main className="min-h-screen bg-[#faf9f7] pt-20 pb-20">

      {/* Hero Banner Area */}
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
              Properties for <span className="text-[#d4af37]">Sale</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-light max-w-xl mx-auto">
              Explore our exclusive collection of premium real estate tailored for your unique requirements in Dubai.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="w-full mx-auto px-6 lg:px-12 mt-8 md:mt-16">
        
        {/* Top Type Tabs (Only show types with at least 1 listing) */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-6 border-b border-gray-100 pb-4">
          {["All", "Residential", "Commercial", "Industrial"].filter((type) => {
            if (type === "All") return totalInType > 0;
            const count = properties.filter(p => (p.propertyType || "Residential") === type && (filters.purpose === "Buy" ? p.status?.toUpperCase().includes("SALE") : p.status?.toUpperCase().includes("RENT"))).length;
            return count > 0;
          }).map((type) => {
            const count = type === "All" 
              ? properties.filter(p => (filters.purpose === "Buy" ? p.status?.toUpperCase().includes("SALE") : p.status?.toUpperCase().includes("RENT"))).length 
              : properties.filter(p => (p.propertyType || "Residential") === type && (filters.purpose === "Buy" ? p.status?.toUpperCase().includes("SALE") : p.status?.toUpperCase().includes("RENT"))).length;
            
            return (
              <button
                key={type}
                onClick={() => {
                  setPropertyType(type);
                  setSelectedCategory("All Categories");
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  propertyType === type
                    ? "bg-brand-black text-white shadow-md"
                    : "bg-white text-gray-500 hover:bg-gray-100 hover:text-brand-black border border-gray-100"
                }`}
              >
                {type} <span className="opacity-60 ml-1 font-medium text-xs">({count})</span>
              </button>
            )
          })}
        </div>

        {/* Sub-categories Grid (Hide categories with 0 listings) */}
        {(() => {
          const activeCategories = availableCategories.filter((cat) => (categoryCounts[cat] || 0) > 0);
          if (activeCategories.length === 0) return null;

          return (
            <div className="mb-6">
              <h3 className="text-xl font-serif text-brand-black mb-4">
                {propertyType === "All" ? "All Available Properties" : `${propertyType} Properties`} for {filters.purpose}
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {activeCategories.length > 1 && (
                  <button
                    onClick={() => setSelectedCategory("All Categories")}
                    className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      selectedCategory === "All Categories"
                        ? "border-brand-gold bg-brand-gold/5 text-brand-gold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    All Categories ({totalInType})
                  </button>
                )}
                {activeCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "border-brand-gold bg-brand-gold/5 text-brand-gold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cat} <span className="opacity-60 text-xs ml-1">({categoryCounts[cat]})</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
        
        {(() => {
          const availableCities = Array.from(
            new Set(
              properties
                .filter(p => filters.purpose === "Buy" ? p.status?.toUpperCase().includes("SALE") : p.status?.toUpperCase().includes("RENT"))
                .map(p => p.city || "Dubai")
                .filter(Boolean)
            )
          );
          return <PropertyFilterBar onFilterChange={setFilters} initialFilters={filters} availableCities={availableCities} lockPurpose={true} />;
        })()}

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {displayedProperties.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-serif text-brand-black mb-2">No properties found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                <button 
                  onClick={() => {
                    setPropertyType("All");
                    setSelectedCategory("All Categories");
                    setFilters({ search: "", purpose: "Buy", city: "All Cities", priceRange: "Any Price", areaRange: "Any Area (sqft)" });
                  }}
                  className="mt-6 px-6 py-3 bg-brand-gold text-white rounded-full font-medium hover:bg-brand-black transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedProperties.map((prop, idx) => (
                  <motion.div
                    key={prop.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                  >
                    <Link href={`/properties/${prop.id}`} className="block relative aspect-[4/3] overflow-hidden">
                      <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-black text-xs font-bold rounded-full uppercase tracking-wider">
                          {prop.status}
                        </span>
                        {prop.category && (
                          <span className="px-3 py-1 bg-brand-gold/90 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider">
                            {prop.category}
                          </span>
                        )}
                      </div>
                      <img 
                        src={prop.image || "/placeholder-property.jpg"} 
                        alt={prop.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-serif text-xl text-brand-black line-clamp-1 group-hover:text-brand-gold transition-colors">
                          <Link href={`/properties/${prop.id}`}>
                            {prop.title}
                          </Link>
                        </h3>
                      </div>
                      
                      <div className="flex items-center text-gray-500 mb-4 text-sm">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{prop.location}{prop.city ? `, ${prop.city}` : ''}</span>
                      </div>
                      
                      <div className="text-2xl font-bold text-brand-gold mb-6">
                        {formatPrice(prop.price)}
                        {prop.status === "FOR RENT" && !prop.price?.toLowerCase().includes("yearly") && " / Yearly"}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1.5 opacity-70" />
                          <span>{prop.beds}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1.5 opacity-70" />
                          <span>{prop.baths}</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1.5 opacity-70" />
                          <span>{formatArea(prop.sqft)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <FaqSection faqs={buyFaqs} title="Buying a Property in Dubai" subtitle="Common questions about the buying process, fees, and regulations." />
    </main>
  );
}
