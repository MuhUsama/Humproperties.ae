"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import PropertyHero from "@/components/property/PropertyHero";
import PropertySpecs from "@/components/property/PropertySpecs";
import PropertyInquiry from "@/components/property/PropertyInquiry";
import { mockListings } from "@/lib/data";
import FaqSection from "@/components/common/FaqSection";
import { getFaqsByCategory } from "@/lib/faqData";

// Lazy load the interactive Map & Virtual Tour theater with a full-screen loading skeleton
const PropertyMap = dynamic(() => import("@/components/property/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[calc(100svh-5rem)] w-full flex flex-col items-center justify-center bg-gray-50 border-t border-gray-200">
      <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-xs uppercase tracking-widest text-brand-black font-extrabold">Loading Interactive Map & 3D Tour Theater...</span>
    </div>
  )
});

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/listings/${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.data) {
          setListing(data.data);
        } else {
          // Fallback to local mockListings if offline or newly initialized
          const found = mockListings.find((l: any) => String(l.id) === String(id) || String(l.id) === `prop-${id}`);
          if (found) {
            setListing(found);
          } else {
            setError("The requested property asset could not be located in our active portfolio.");
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching property:", err);
        const found = mockListings.find((l: any) => String(l.id) === String(id) || String(l.id) === `prop-${id}`);
        if (found) {
          setListing(found);
        } else {
          setError("Network error. Could not connect to property advisory server.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Memoized formatted property object to guarantee stable props across re-renders
  const memoizedProperty = useMemo(() => {
    if (!listing) return null;
    return {
      id: String(listing.id || id),
      title: listing.title || "Exclusive Luxury Residence",
      price: listing.price || "Price Upon Request",
      location: listing.location || "Dubai, United Arab Emirates",
      beds: listing.beds !== undefined && listing.beds !== null && listing.beds !== "" ? Number(listing.beds) : 4,
      baths: listing.baths !== undefined && listing.baths !== null && listing.baths !== "" ? Number(listing.baths) : 5,
      sqft: String(listing.sqft || "5,000"),
      image: listing.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      status: listing.status || "FOR SALE",
      directionLink: listing.directionLink || "",
      unitNo: listing.unitNo,
      floor: listing.floor,
      unitType: listing.unitType,
      subType: listing.subType,
      view: listing.view,
      internalArea: listing.internalArea,
      externalArea: listing.externalArea,
      overview: listing.overview,
      specifications: listing.specifications,
      amenities: listing.amenities,
      galleryImages: listing.galleryImages
    };
  }, [listing, id]);

  if (loading) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#faf9f7] pt-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-brand-gold">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-brand-black">
            Accessing Confidential Property File...
          </span>
          <span className="text-[11px] text-gray-400 font-light">Mohd. Alfalasi Real Estate Advisory</span>
        </div>
      </main>
    );
  }

  if (error || !memoizedProperty) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#faf9f7] pt-20 px-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-brand-black mb-3">Portfolio Asset Unavailable</h1>
          <p className="text-gray-600 text-sm font-light mb-8 leading-relaxed">
            {error || "This property asset is either under private contract or has been archived by our advisory desk."}
          </p>
          <button
            onClick={() => router.push("/#properties")}
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-brand-gold text-brand-black font-extrabold text-xs uppercase tracking-widest hover:bg-brand-black hover:text-white transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Exclusive Listings</span>
          </button>
        </div>
      </main>
    );
  }

  const propertyFaqs = getFaqsByCategory('property');

  return (
    <main className="min-h-screen w-full flex flex-col bg-[#faf9f7] pt-24 md:pt-28 selection:bg-brand-gold selection:text-white">
      {/* Frame 1: Hero & Specs Overview */}
      <PropertyHero property={memoizedProperty} />

      {/* Frame 2: Specifications & Architectural Mastery */}
      <PropertySpecs property={memoizedProperty} />

      {/* Frame 3: Lazy-Loaded Interactive Location & Tour */}
      <PropertyMap property={memoizedProperty} />

      {/* Frame 4: Private VIP Consultation Suite */}
      <PropertyInquiry property={memoizedProperty} />

      {/* Frame 5: Property FAQs */}
      <FaqSection faqs={propertyFaqs} title="Property FAQs" subtitle="Common questions regarding service charges, viewings, and availability." />
    </main>
  );
}
