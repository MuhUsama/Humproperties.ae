import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";

// Lazy load below-the-fold interactive form and map for optimal performance
const ContactForm = dynamic(() => import("@/components/contact/ContactForm"), {
  loading: () => (
    <div className="w-full h-[600px] bg-white rounded-[2.5rem] animate-pulse border border-gray-100 flex items-center justify-center p-8 shadow-sm">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin"></div>
        <div className="text-gray-400 font-serif text-base sm:text-lg">Loading Consultation Desk...</div>
      </div>
    </div>
  )
});

const ContactMap = dynamic(() => import("@/components/contact/ContactMap"), {
  loading: () => (
    <div className="w-full h-[450px] sm:h-[550px] bg-gray-100 rounded-[2.5rem] animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-brand-black border-t-transparent animate-spin"></div>
        <div className="text-gray-400 font-serif text-base sm:text-lg">Loading Executive Map View...</div>
      </div>
    </div>
  )
});

export const metadata: Metadata = {
  title: "Contact Private Advisory | Mohd. Alfalasi Real Estate Dubai",
  description: "Connect with our private real estate advisory desk in Oud Metha, Dubai. Inquire about confidential off-market acquisitions, luxury residences, or institutional investment portfolios."
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] pt-20 flex flex-col selection:bg-brand-gold selection:text-brand-black">
      {/* Luxury Cinematic Hero */}
      <ContactHero />

      {/* 1. Executive Sanctuary & Headquarters Section (Exact Screen Frame on all devices) */}
      <section className="min-h-[calc(100svh-5rem)] flex flex-col justify-center items-center py-6 sm:py-8 relative z-20 bg-[#faf9f7] border-b border-gray-200/60">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 w-full">
          <ContactInfo />
        </div>
      </section>

      {/* 2. Confidential Advisory Desk Form Section (Exact Screen Frame on all devices) */}
      <section id="consultation-desk" className="min-h-[calc(100svh-5rem)] flex flex-col justify-center items-center py-6 sm:py-8 relative z-20 bg-white border-b border-gray-200/60">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 max-w-4xl w-full">
          <ContactForm />
        </div>
      </section>

      {/* Lazy Loaded Map & Accessibility Section */}
      <ContactMap />
    </main>
  );
}
