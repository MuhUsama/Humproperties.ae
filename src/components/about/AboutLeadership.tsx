"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const AboutLeadership = memo(function AboutLeadership() {
  return (
    <section className="relative w-full min-h-screen lg:min-h-0 lg:h-[calc(100svh-5rem)] bg-[#0a0a0a] overflow-hidden flex flex-col lg:flex-row items-center border-t border-white/5">
      
      {/* Massive Background Typography Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden opacity-5">
        <h2 className="text-[20vw] font-serif text-white tracking-tighter leading-none whitespace-nowrap">
          ALFALASI
        </h2>
      </div>

      {/* Left: Cinematic Portrait */}
      <div className="w-full lg:w-[45%] h-[50vh] lg:h-full relative z-10 shrink-0">
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
            alt="Mohd. Alfalasi - Founder & CEO"
            fill
            className="object-cover object-[center_20%] grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-[3s]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {/* Gradients to blend into background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent lg:hidden" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a]/30 to-[#0a0a0a] hidden lg:block" />
          
          {/* Subtle gold line accent */}
          <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent hidden lg:block" />
        </motion.div>
      </div>

      {/* Right: Editorial Typography */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="w-full lg:w-[55%] relative z-20 px-8 lg:px-16 xl:px-24 py-16 lg:py-0 flex flex-col justify-center h-full"
      >
        <motion.div variants={fadeInUp} className="mb-12">
          <span className="flex items-center gap-4 text-[#d4af37] font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] mb-6">
            <span className="w-8 h-[1px] bg-[#d4af37]"></span>
            The Founder
          </span>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-serif text-white tracking-tighter leading-[1.05] mb-6">
            Mohd. <br/>
            <span className="italic text-gray-500 font-light">Alfalasi</span>
          </h2>
        </motion.div>

        <motion.div variants={fadeInUp} className="relative">
          {/* Elegant Quote Block */}
          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#d4af37] mb-10">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-gray-200 leading-snug italic">
              "Where your vision meets our expertise, and luxury finds its truest expression."
            </h3>
          </div>

          <div className="space-y-6 max-w-2xl">
            <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed">
              With deep expertise in the industry, Mohd. Alfalasi envisioned Mohd. Alfalasi Real Estate as more than just a brokerage—it is a highly exclusive gateway to a coveted global lifestyle. Catering specifically to high-net-worth individuals and sovereign principals, we combine aggressive market intelligence with absolute discretion to curate properties that profoundly elevate the standard of living.
            </p>

            <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed">
              We go beyond standard transactions to craft tailored architectural experiences. From securing prime unlisted waterfront investments to advising on private island sanctuaries, our commitment to excellence and confidentiality remains entirely uncompromising.
            </p>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
});

export default AboutLeadership;
