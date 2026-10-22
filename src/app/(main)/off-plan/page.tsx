"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import OffPlanListingCard, { OffPlanDeveloper } from "@/components/offplan/OffPlanListingCard";
import FaqSection from "@/components/common/FaqSection";
import { getFaqsByCategory } from "@/lib/faqData";
import { isOffPlanStatus } from "@/lib/listingStatus";

type Developer = OffPlanDeveloper & { coverImage?: string | null };

type Filters = {
  locations: string[];
  categories: string[];
  minPrice: string;
  maxPrice: string;
  beds: number | null;
  baths: number | null;
  minSize: string;
  maxSize: string;
};

const EMPTY_FILTERS: Filters = {
  locations: [],
  categories: [],
  minPrice: "",
  maxPrice: "",
  beds: null,
  baths: null,
  minSize: "",
  maxSize: "",
};

const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Date Listed"] as const;

const OFF_PLAN_FAQS = getFaqsByCategory("off-plan");

const toNumber = (value?: string | number | null) => parseInt(String(value ?? "").replace(/[^\d]/g, ""), 10) || 0;
const locationLabel = (p: any) => [p.location, p.city].filter(Boolean).join(", ");

export default function OffPlanPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]>("Featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);

  useEffect(() => {
    Promise.all([
      fetch("/api/developers").then((res) => res.json()),
      fetch("/api/listings").then((res) => res.json()),
    ])
      .then(([devData, listingData]) => {
        if (devData.success) setDevelopers(devData.data);
        if (listingData.success) setListings(listingData.data.filter((l: any) => isOffPlanStatus(l.status)));
      })
      .catch((err) => console.error("Error loading off plan data:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isFilterOpen]);

  const developerById = useMemo(
    () => Object.fromEntries(developers.map((d) => [d.id, d])),
    [developers]
  );

  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    listings.forEach((l) => {
      const label = locationLabel(l);
      if (label) counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [listings]);

  const categories = useMemo(
    () => Array.from(new Set(listings.map((l) => l.category).filter(Boolean))) as string[],
    [listings]
  );

  const displayedListings = useMemo(() => {
    const result = listings.filter((p) => {
      if (filters.locations.length && !filters.locations.includes(locationLabel(p))) return false;
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      const price = toNumber(p.price);
      if (filters.minPrice && price < toNumber(filters.minPrice)) return false;
      if (filters.maxPrice && price > toNumber(filters.maxPrice)) return false;
      if (filters.beds !== null && (filters.beds === 5 ? p.beds < 5 : p.beds !== filters.beds)) return false;
      if (filters.baths !== null && (filters.baths === 5 ? p.baths < 5 : p.baths !== filters.baths)) return false;
      const size = toNumber(p.sqft);
      if (filters.minSize && size < toNumber(filters.minSize)) return false;
      if (filters.maxSize && size > toNumber(filters.maxSize)) return false;
      return true;
    });

    if (sortBy === "Price: Low to High") result.sort((a, b) => toNumber(a.price) - toNumber(b.price));
    if (sortBy === "Price: High to Low") result.sort((a, b) => toNumber(b.price) - toNumber(a.price));
    if (sortBy === "Date Listed") result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [listings, filters, sortBy]);

  const activeFilterCount =
    filters.locations.length + filters.categories.length +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.beds !== null ? 1 : 0) + (filters.baths !== null ? 1 : 0) +
    (filters.minSize || filters.maxSize ? 1 : 0);

  const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <main className="min-h-screen bg-[#faf9f7] pt-32 md:pt-36">

      {/* Toolbar */}
      <div className="w-full mx-auto px-6 lg:px-12 flex items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <h1 className="text-[11px] md:text-sm font-semibold uppercase tracking-[0.15em] md:tracking-[0.3em] text-brand-black">
          Off Plan Projects in Dubai
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="px-4 py-2.5 border border-gray-300 text-xs font-semibold uppercase tracking-wider text-brand-black hover:border-brand-black transition-colors"
            >
              <span className="hidden sm:inline">Sort by: </span>{sortBy}
            </button>
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-lg z-30">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                    className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${sortBy === opt ? "font-bold text-brand-gold" : "text-gray-700"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => { setDraft(filters); setIsFilterOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-black transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>
        </div>
      </div>

      {/* Developers carousel */}
      {!loading && developers.length > 0 && (
        <section className="w-full mx-auto px-6 lg:px-12 pt-12 md:pt-16">
          <h2 className="text-center font-serif text-2xl md:text-4xl uppercase tracking-[0.25em] text-brand-black mb-8 md:mb-10">
            Off-Plan Developers
          </h2>
          <DeveloperCarousel developers={developers} />
        </section>
      )}

      {/* Projects */}
      <section id="projects" className="w-full mx-auto px-6 lg:px-12 pt-14 md:pt-20 scroll-mt-24">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-serif text-2xl md:text-4xl uppercase tracking-[0.25em] text-brand-black">Off-Plan Projects</h2>
          {!loading && (
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-3">
              {displayedListings.length} {displayedListings.length === 1 ? "property" : "properties"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : displayedListings.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100">
            <h3 className="text-2xl font-serif text-brand-black mb-2">
              {listings.length === 0 ? "New Launches Coming Soon" : "No properties match these filters"}
            </h3>
            {listings.length > 0 ? (
              <button onClick={() => setFilters(EMPTY_FILTERS)} className="mt-4 px-6 py-3 bg-brand-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-black transition-colors">
                Clear Filters
              </button>
            ) : (
              <p className="text-gray-500">Contact us for early access to upcoming off plan projects.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayedListings.map((prop, idx) => (
              <OffPlanListingCard key={prop.id} property={prop} developer={developerById[prop.developerId]} index={idx} />
            ))}
          </div>
        )}
      </section>

      <FaqSection faqs={OFF_PLAN_FAQS} title="Frequently Asked Questions" subtitle="Everything you need to know about buying off plan in Dubai." />

      {/* SEO / editorial blocks */}
      <section className="w-full mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-6xl mx-auto">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-black mb-4">Ready to explore off-plan in Dubai?</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Off plan lets you secure a new home or investment at launch pricing, with payments spread across construction. We shortlist projects from developers with a proven delivery record and walk you through every step to handover.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-black mb-4">Top locations in Dubai</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Downtown Dubai, Dubai Hills Estate, Palm Jumeirah, Dubai Creek Harbour and Mohammed Bin Rashid City continue to lead on demand, rental yield and long-term capital growth.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-black mb-4">What actually matters</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              The developer&apos;s history, their handover record, how the surrounding area is growing, and who will want to rent or buy the home once it is complete. These matter more than launch-day brochures.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-black mb-4">Why clients trust our timing</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              We follow launches, price movements and resale activity daily, so you hear about the right project early. When you&apos;re ready, <Link href="/contact" className="text-brand-gold font-medium hover:underline">let&apos;s talk</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Filters drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[61] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-black">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-1 text-gray-500 hover:text-brand-black">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {locationCounts.length > 0 && (
                  <FilterGroup title="Location">
                    <div className="space-y-2">
                      {locationCounts.map(([label, count]) => (
                        <label key={label} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={draft.locations.includes(label)}
                            onChange={() => setDraft({ ...draft, locations: toggleIn(draft.locations, label) })}
                            className="w-4 h-4 accent-[#C4A259]"
                          />
                          {label} <span className="text-gray-400">({count})</span>
                        </label>
                      ))}
                    </div>
                  </FilterGroup>
                )}

                {categories.length > 0 && (
                  <FilterGroup title="Property Type">
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Chip key={cat} active={draft.categories.includes(cat)} onClick={() => setDraft({ ...draft, categories: toggleIn(draft.categories, cat) })}>
                          {cat}
                        </Chip>
                      ))}
                    </div>
                  </FilterGroup>
                )}

                <FilterGroup title="Price (AED)">
                  <RangeInputs
                    min={draft.minPrice}
                    max={draft.maxPrice}
                    onChange={(minPrice, maxPrice) => setDraft({ ...draft, minPrice, maxPrice })}
                  />
                </FilterGroup>

                <FilterGroup title="Beds">
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <Chip key={n} active={draft.beds === n} onClick={() => setDraft({ ...draft, beds: draft.beds === n ? null : n })}>
                        {n === 0 ? "Studio" : n === 5 ? "5+" : n}
                      </Chip>
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="Bathrooms">
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Chip key={n} active={draft.baths === n} onClick={() => setDraft({ ...draft, baths: draft.baths === n ? null : n })}>
                        {n === 5 ? "5+" : n}
                      </Chip>
                    ))}
                  </div>
                </FilterGroup>

                <FilterGroup title="Size (sq ft)">
                  <RangeInputs
                    min={draft.minSize}
                    max={draft.maxSize}
                    onChange={(minSize, maxSize) => setDraft({ ...draft, minSize, maxSize })}
                  />
                </FilterGroup>
              </div>

              <div className="grid grid-cols-2 gap-3 px-6 py-5 border-t border-gray-100">
                <button
                  onClick={() => { setDraft(EMPTY_FILTERS); setFilters(EMPTY_FILTERS); }}
                  className="py-3.5 border border-gray-300 text-xs font-semibold uppercase tracking-wider text-brand-black hover:border-brand-black transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setFilters(draft);
                    setIsFilterOpen(false);
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="py-3.5 bg-brand-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-black transition-colors"
                >
                  Apply
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

function DeveloperCarousel({ developers }: { developers: Developer[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setPageCount(Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.01)));
      setPage(Math.round(track.scrollLeft / track.clientWidth));
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [developers.length]);

  const goTo = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(pageCount - 1, target));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-1.5"
      >
        {developers.map((dev) => (
          <Link
            key={dev.id}
            href={`/off-plan/${dev.slug}`}
            className="group relative flex-shrink-0 basis-1/2 sm:basis-1/3 lg:basis-1/5 snap-start px-1.5"
            aria-label={dev.name}
          >
            <div className="relative aspect-square overflow-hidden bg-brand-black">
              {dev.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dev.coverImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dev.logo} alt={dev.name} className="max-w-full max-h-[45%] object-contain brightness-0 invert" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {pageCount > 1 && (
        <>
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Previous developers"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-gray-200 text-brand-black disabled:opacity-30 hover:bg-brand-black hover:text-white transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= pageCount - 1}
            aria-label="Next developers"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-gray-200 text-brand-black disabled:opacity-30 hover:bg-brand-black hover:text-white transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-1.5 transition-all ${i === page ? "w-8 bg-brand-black" : "w-4 bg-gray-300"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-black mb-3">{title}</h4>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[3rem] px-4 py-2 border text-sm transition-colors ${
        active ? "bg-brand-black border-brand-black text-white" : "border-gray-300 text-gray-700 hover:border-brand-black"
      }`}
    >
      {children}
    </button>
  );
}

function RangeInputs({ min, max, onChange }: { min: string; max: string; onChange: (min: string, max: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <input
        type="text"
        inputMode="numeric"
        placeholder="Min"
        value={min}
        onChange={(e) => onChange(e.target.value, max)}
        className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-black"
      />
      <input
        type="text"
        inputMode="numeric"
        placeholder="Max"
        value={max}
        onChange={(e) => onChange(min, e.target.value)}
        className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-black"
      />
    </div>
  );
}
