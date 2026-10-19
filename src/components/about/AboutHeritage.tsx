"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const AboutHeritage = memo(function AboutHeritage() {
  return (
    <section className="w-full h-[calc(100vh-4.5rem)] sm:min-h-[calc(100svh-5rem)] bg-[#faf9f7] flex flex-col justify-between sm:justify-center py-4 sm:py-20 overflow-hidden relative">
      {/* Subtle Golden Ambient Backlight */}
      <div className="absolute top-1/2 right-10 w-[420px] h-[420px] bg-[#d4af37]/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="w-full px-4 sm:px-6 lg:px-12 flex flex-col justify-between sm:block h-full relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-10 lg:gap-14 items-center h-full sm:h-auto">
          
          {/* Left Column: Architectural Story Composition */}
          <motion.div variants={fadeInUp} className="lg:col-span-6 space-y-3 sm:space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-white border border-[#d4af37]/35 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#d4af37]" />
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#101014] font-semibold">
                ESTABLISHED 1999 • SOVEREIGN AUTHORITY
              </span>
            </div>

            <h2 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#101014] leading-[1.15]">
              Architects of Dubai&apos;s Ultra-Prime <span className="italic font-light text-[#d4af37]">Private Legacy</span>.
            </h2>

            <p className="text-xs sm:text-base text-gray-600 font-sans font-light leading-relaxed">
              For over twenty-five years, Mohd. Alfalasi Real Estate has operated as Dubai&apos;s premier confidential advisory desk for sovereign wealth funds, single-family offices, and ultra-high-net-worth principals worldwide.
            </p>

            <div className="pt-1 sm:pt-2 flex items-center space-x-4 sm:space-x-6 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-500">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
                <span>RERA LICENSED #1042</span>
              </span>
              <span>◆</span>
              <span>DUBAI HEADQUARTERS</span>
            </div>
          </motion.div>

          {/* Right Column: Asymmetric Floating & Overlapping Cards Composition */}
          <motion.div variants={fadeInUp} className="lg:col-span-6 relative pt-2 sm:pt-4 lg:pt-0 flex-1 flex flex-col justify-center">
            <div className="relative w-full max-w-lg mx-auto lg:ml-auto flex flex-col justify-center">
              
              {/* Card 1: Obsidian Floating Glass Card (Taller & Adjustable on Mobile) */}
              <div className="w-full sm:w-[88%] bg-[#101014] text-white border border-[#d4af37]/50 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 hover:shadow-[0_30px_70px_-10px_rgba(212,175,55,0.25)] transition-all duration-500 group relative z-20 flex flex-col justify-between min-h-[190px] sm:min-h-0">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#d4af37] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    PORTFOLIO LEDGER
                  </span>
                </div>

                <div className="space-y-1 my-2 sm:mb-4">
                  <span className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight group-hover:text-[#d4af37] transition-colors">
                    $4.2B+ AED
                  </span>
                  <span className="text-xs sm:text-sm text-gray-300 font-sans block">
                    Confidential Private Acquisitions
                  </span>
                </div>

                <div className="pt-3.5 sm:pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                  <span>Downtown Dubai • Palm Jumeirah • Creek</span>
                  <span className="text-[#d4af37] font-semibold">100% Discrete →</span>
                </div>
              </div>

              {/* Card 2: Crisp Ivory Card (Cleanly Stacked on Mobile, Asymmetric Overlap on Desktop) */}
              <div className="w-full sm:w-[85%] sm:ml-auto mt-3 sm:-mt-10 bg-white border border-gray-200/90 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group relative z-30 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#faf9f7] border border-gray-200 flex items-center justify-center text-[#101014] group-hover:border-[#d4af37] group-hover:text-[#d4af37] transition-all duration-500">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
                    SOVEREIGN AUTHORITY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 divide-x divide-gray-200 my-2">
                  <div>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#101014] block group-hover:text-[#d4af37] transition-colors">
                      25+ YRS
                    </span>
                    <span className="text-[11px] text-gray-500 font-sans">
                      Unbroken UAE Advisory Experience
                    </span>
                  </div>
                  <div className="pl-4">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#101014] block group-hover:text-[#d4af37] transition-colors">
                      TIER-1
                    </span>
                    <span className="text-[11px] text-gray-500 font-sans">
                      Emaar Platinum Master Brokerage
                    </span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-gray-100 flex items-center space-x-2 text-xs font-semibold text-[#101014]">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>Verified Regulatory Compliance &amp; Escrow Protection</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
});

export default AboutHeritage;
