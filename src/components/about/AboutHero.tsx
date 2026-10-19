"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const AboutHero = memo(function AboutHero() {
  return (
    <section className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center h-[calc(100svh-5rem)]">
      {/* Exact Same Size, Margins, and Rounded Borders as Contact Hero Card */}
      <div 
        className="relative w-full flex-1 min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-center justify-center text-center shadow-none group px-6 py-10 md:px-24 md:py-20 animate-[fadeInUp_0.8s_ease-out_forwards]"
      >
        {/* Static Image Background with Dark Overlay (Matching Contact Hero) */}
        <motion.div className="absolute inset-0 w-full h-full scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out z-0">
          <Image
            src="/hero_poster.jpg"
            alt="Dubai Royal Architectural Panorama"
            fill
            priority
            className="object-cover object-center z-0 rounded-[2rem] md:rounded-[2.5rem]"
          />
          {/* Balanced dark gradient overlay for crystal clear centered text readability */}
          <div className="absolute inset-0 bg-black/65 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45 z-10"></div>
        </motion.div>

        {/* Centered Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center h-full justify-between py-4 sm:py-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center my-auto"
          >
            {/* Plain Gold Uppercase Tagline */}
            <motion.p
              variants={fadeInUp}
              className="text-[#d4af37] font-semibold tracking-[0.2em] text-xs md:text-sm uppercase mb-3 md:mb-4"
            >
              ROYAL REAL ESTATE HERITAGE
            </motion.p>

            {/* Centered Heading "About Us" */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-4 md:mb-6 drop-shadow-md"
            >
              About Us
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-gray-200 text-xs sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto drop-shadow"
            >
              Pioneering private real estate advisory, confidential off-market acquisitions, and architectural curation for ultra-high-net-worth clients across Dubai&apos;s most prestigious royal addresses.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default AboutHero;
