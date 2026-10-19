"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const stats = [
  { number: "500+", label: "Families Relocated", icon: "🏡" },
  { number: "60+", label: "Countries Served", icon: "🌍" },
  { number: "98%", label: "Client Satisfaction", icon: "⭐" },
  { number: "72h", label: "Avg. Settlement", icon: "⚡" },
];

const checklist = [
  "Personalized neighborhood analysis & property shortlisting",
  "Dedicated bilingual relocation manager",
  "School enrollment advisory & campus tours",
  "Visa processing & Emirates ID assistance",
  "Bank account opening & utility setup",
  "Pet relocation & quarantine coordination",
  "Furniture rental & interior styling",
  "Cultural orientation & city familiarization tours",
];

export default function RelocationWhyUs() {
  return (
    <section className="relative w-full p-4 md:p-6 lg:p-8 xl:p-10 min-h-[calc(100vh-4.5rem)] lg:h-[calc(100svh-5rem)] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full mx-auto flex flex-col h-full">

        <div className="text-center mb-4 lg:mb-6 shrink-0">
          <span className="text-[#d4af37] font-mono text-[10px] tracking-[0.3em] uppercase block mb-1.5">Why MFreuae</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#101014]">
            Trusted by <span className="text-[#d4af37] italic">Hundreds</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-4 lg:gap-5">

          {/* Left — Image + Stats */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="w-full lg:w-[45%] relative rounded-[2rem] overflow-hidden min-h-[300px] lg:min-h-0 group"
          >
            <Image
              src="/services-assets/relocationwhyus/relocationwhyus-1.webp"
              alt="Dubai skyline" fill className="object-cover transition-transform duration-[8s] group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

            {/* Stats grid */}
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
              <div className="grid grid-cols-2 gap-2.5 lg:gap-3">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="bg-white/[0.08] backdrop-blur-xl rounded-xl p-3 lg:p-4 border border-white/[0.08] hover:bg-white/[0.12] hover:border-white/[0.15] transition-all duration-500 group/stat"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">{stat.icon}</span>
                      <ArrowUpRight className="w-3 h-3 text-[#d4af37] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="font-serif text-xl lg:text-2xl text-white block tracking-tight">{stat.number}</span>
                    <span className="text-[8px] lg:text-[9px] font-mono text-gray-400 tracking-[0.15em] uppercase">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Checklist */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="w-full lg:w-[55%] bg-white rounded-[2rem] p-5 md:p-7 lg:p-8 xl:p-10 border border-black/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex flex-col justify-center overflow-hidden relative"
          >
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#d4af37]/[0.02] rounded-full blur-[60px] pointer-events-none translate-x-1/3 -translate-y-1/3" />

            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="w-8 h-[2px] bg-[#d4af37]" />
              <span className="text-[10px] font-mono text-[#d4af37] tracking-[0.2em] uppercase font-semibold">What&apos;s Included</span>
            </div>
            <h3 className="text-lg lg:text-xl font-serif text-[#101014] mb-1.5 tracking-tight relative z-10">Every Package Includes</h3>
            <p className="text-gray-400 text-xs font-light mb-5 lg:mb-6 relative z-10">Comprehensive end-to-end relocation support, tailored to you.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 lg:gap-y-3 relative z-10">
              {checklist.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#faf9f7] transition-colors duration-300 group/item"
                >
                  <div className="w-5 h-5 rounded-lg bg-[#d4af37]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-[#d4af37]/20 transition-colors duration-300">
                    <CheckCircle2 className="w-3 h-3 text-[#d4af37]" />
                  </div>
                  <span className="text-gray-600 text-[12px] lg:text-[13px] font-light leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
