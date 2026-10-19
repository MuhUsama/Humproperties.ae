import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import AboutHero from "@/components/about/AboutHero";

// Lazy load below-the-fold interactive & editorial sections for optimal initial page load performance
const AboutHeritage = dynamic(() => import("@/components/about/AboutHeritage"), {
  loading: () => (
    <div className="h-[calc(100vh-4.5rem)] sm:h-[calc(100svh-5rem)] flex items-center justify-center p-4 sm:py-10 sm:px-0">
      <div className="w-full h-full bg-white rounded-[28px] sm:rounded-[36px] animate-pulse border border-gray-200 flex items-center justify-center p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin"></div>
          <div className="text-gray-400 font-serif text-base sm:text-lg">Loading Royal Heritage Dossier...</div>
        </div>
      </div>
    </div>
  )
});

const AboutLeadership = dynamic(() => import("@/components/about/AboutLeadership"), {
  loading: () => (
    <div className="h-[calc(100vh-4.5rem)] sm:h-[calc(100svh-5rem)] flex items-center justify-center p-4 sm:py-10 sm:px-0">
      <div className="w-full h-full bg-white rounded-[28px] sm:rounded-[36px] animate-pulse border border-gray-200 flex items-center justify-center p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin"></div>
          <div className="text-gray-400 font-serif text-base sm:text-lg">Loading Executive Leadership Dossier...</div>
        </div>
      </div>
    </div>
  )
});

const AboutPhilosophy = dynamic(() => import("@/components/about/AboutPhilosophy"), {
  loading: () => (
    <div className="h-[calc(100vh-4.5rem)] sm:h-[calc(100svh-5rem)] flex items-center justify-center p-4 sm:py-10 sm:px-0">
      <div className="w-full h-full bg-[#101014] rounded-[28px] sm:rounded-[36px] animate-pulse border border-[#d4af37]/35 flex items-center justify-center p-8 shadow-sm">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin"></div>
          <div className="text-gray-400 font-serif text-base sm:text-lg">Loading Private Consultation Suite...</div>
        </div>
      </div>
    </div>
  )
});

export const metadata: Metadata = {
  title: "About Us | Mohd. Alfalasi Private Real Estate Advisory Dubai",
  description: "Learn about Mohd. Alfalasi Real Estate — Dubai's premier private advisory firm for sovereign wealth, institutional acquisitions, and luxury residences."
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] pt-20 overflow-x-hidden selection:bg-[#d4af37] selection:text-[#101014]">
      {/* 0. Luxury Cinematic Hero (Full Screen) */}
      <AboutHero />

      {/* 1. Royal Heritage & Institutional Legacy Section (Full Screen) */}
      <AboutHeritage />

      {/* 2. Executive Leadership & Advisory Index Section (Full Screen) */}
      <AboutLeadership />

      {/* 3. Private Consultation Suite Section (Full Screen) */}
      <AboutPhilosophy />
    </main>
  );
}
