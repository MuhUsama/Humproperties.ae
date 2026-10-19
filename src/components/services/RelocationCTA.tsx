"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RelocationCTA() {
  return (
    <section className="relative w-full p-4 md:p-6 lg:p-8 xl:p-12 min-h-[calc(100vh-4.5rem)] lg:h-[calc(100svh-5rem)] flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="w-full flex-1 min-h-0 rounded-[2rem] overflow-hidden relative bg-[#0a0a0c] flex flex-col lg:flex-row items-center justify-between p-8 md:p-12 lg:p-16 xl:p-24 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] border border-white/[0.03]"
      >
        {/* Background Image with dramatic cinematic overlay */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="/services-assets/relocationcta/relocationcta-1.webp" // Stunning Dubai night/dusk skyline
            alt="Dubai Skyline"
            fill
            className="object-cover opacity-40 scale-105 transform-gpu"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-[#0a0a0c]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-[#d4af37]/[0.02]" />
        </div>

        <div className="relative z-10 lg:w-[50%] flex flex-col items-start text-left mb-10 lg:mb-0">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-12 h-[1px] bg-[#d4af37]" />
            <span className="text-[#d4af37] font-mono tracking-[0.2em] uppercase text-xs font-semibold">Begin Your Journey</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-white mb-6 leading-[1.05] tracking-tight">
            Ready to Make<br />
            <span className="text-[#d4af37] italic font-light">Dubai Home?</span>
          </h2>

          <p className="text-gray-300 text-base md:text-lg max-w-xl font-light leading-relaxed mb-10">
            Whether you&apos;re an individual, a family, or a corporation — our bespoke relocation advisory ensures a flawless transition to one of the world&apos;s most exciting cities.
          </p>

          {/* Trust badges - Redesigned to be highly elegant */}
          <div className="flex items-center gap-4 flex-wrap">
            {[
              { text: "DLD Certified", icon: "✓" },
              { text: "5-Star Rated", icon: "★" },
              { text: "60+ Countries", icon: "🌍" }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#d4af37] text-sm">{badge.icon}</span>
                <span className="text-[11px] font-mono text-white/70 tracking-[0.1em] uppercase">
                  {badge.text}
                </span>
                {i < 2 && <span className="w-1 h-1 rounded-full bg-white/20 ml-4 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 lg:w-[45%] flex justify-end w-full">
          {/* Glassmorphic Consultation Card */}
          <div className="bg-black/40 backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 border border-white/[0.08] w-full max-w-md flex flex-col relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] group hover:border-white/[0.15] transition-colors duration-500">
            
            {/* Elegant top gold line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />
            
            {/* Ambient inner glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#d4af37]/10 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl border border-white/[0.05] flex items-center justify-center mx-auto mb-5 shadow-xl group-hover:-translate-y-1 transition-transform duration-500">
                <Phone className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">Private Consultation</h3>
              <p className="text-gray-400 font-light text-sm">Speak directly with our senior relocation directors.</p>
            </div>

            <div className="relative z-10 flex flex-col gap-3">
              <Link
                href="/contact"
                className="w-full bg-[#d4af37] hover:bg-[#c5a030] text-[#101014] font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 flex items-center justify-center gap-2 text-sm hover:-translate-y-0.5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex gap-3 mt-1">
                <Link
                  href="tel:+97145551234"
                  className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] hover:border-white/[0.15] text-white font-medium py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Us</span>
                </Link>
                <Link
                  href="https://wa.me/97145551234"
                  className="flex-1 bg-white/[0.05] hover:bg-emerald-500/20 border border-white/[0.05] hover:border-emerald-500/30 text-white hover:text-emerald-400 font-medium py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </motion.div>
    </section>
  );
}
