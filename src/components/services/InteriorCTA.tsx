"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function InteriorCTA() {
  return (
    <section className="relative w-full min-h-[600px] lg:h-[calc(100svh-5rem)] flex items-center justify-center overflow-hidden border-t border-white/10">
      
      {/* Full Bleed Cinematic Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/services-assets/interiorcta/interiorcta-1.webp"
          alt="Luxury Interior Design"
          fill
          className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-[3s]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101014] via-[#101014]/80 to-transparent" />
        <div className="absolute inset-0 bg-[#101014]/40" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 py-16 lg:py-0">
        
        {/* Left Side: Typography */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="w-full md:w-[60%] flex flex-col items-start"
        >
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-10 h-[1px] bg-[#d4af37]"></div>
            <span className="text-[#d4af37] font-mono tracking-[0.3em] uppercase text-xs font-semibold">The Next Step</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-[5rem] font-serif text-white font-bold mb-6 leading-[1.05] tracking-tight">
            Curate Your <br/>
            <span className="text-white/50 italic font-light">Masterpiece</span>
          </h2>
          
          <p className="text-gray-300 text-base md:text-lg max-w-xl font-light leading-relaxed border-l border-white/20 pl-6">
            Transform your vision into an architectural reality. Schedule a private consultation with our principal designers to discuss your spatial aspirations, aesthetic preferences, and bespoke requirements.
          </p>
        </motion.div>

        {/* Right Side: Action Glass Card */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="w-full md:w-[40%] flex justify-center md:justify-end"
        >
           <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] w-full max-w-md relative overflow-hidden group">
             {/* Subtle Gold Hover Flare inside card */}
             <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#d4af37]/0 group-hover:bg-[#d4af37]/20 rounded-full blur-3xl transition-all duration-700"></div>

             <h3 className="text-2xl font-serif text-white font-bold mb-2">Ready to Design?</h3>
             <p className="text-gray-400 font-light text-sm mb-8">Connect with our design principals today.</p>
             
             <div className="flex flex-col gap-4 relative z-10">
               <Link
                 href="/contact"
                 className="w-full flex items-center justify-center gap-3 bg-[#d4af37] hover:bg-white text-[#101014] font-semibold text-lg py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
               >
                 Book a Consultation
                 <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
               </Link>

               <Link
                 href="https://wa.me/97145551234"
                 className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-mono tracking-widest text-xs uppercase py-4 rounded-xl border border-white/10 transition-colors duration-300"
               >
                 WhatsApp Us
               </Link>
             </div>
           </div>
        </motion.div>

      </div>
    </section>
  );
}
