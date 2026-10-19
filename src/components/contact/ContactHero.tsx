"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const ContactHero = memo(function ContactHero() {
  return (
    <section className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center h-[calc(100svh-5rem)]">
      {/* Exact Same Size, Margins, and Rounded Borders as Home Page Hero Card */}
      <div 
        className="relative w-full flex-1 min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-center justify-center text-center shadow-none group px-6 py-12 md:px-24 md:py-20 animate-[fadeInUp_0.8s_ease-out_forwards]"
      >
        {/* Static Image Background with Dark Overlay (Matching Home Page) */}
        <motion.div className="absolute inset-0 w-full h-full scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out z-0">
          <Image
            src="/hero_poster.jpg"
            alt="Dubai Luxury Architecture"
            fill
            priority
            className="object-cover object-center z-0 rounded-[2rem] md:rounded-[2.5rem]"
          />
          {/* Balanced dark gradient overlay for crystal clear centered text readability */}
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10"></div>
        </motion.div>

        {/* Centered Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            {/* Plain Gold Uppercase Tagline */}
            <motion.p
              variants={fadeInUp}
              className="text-brand-gold font-semibold tracking-[0.2em] text-xs md:text-sm uppercase mb-3 md:mb-4"
            >
              Private Client Advisory
            </motion.p>

            {/* Centered Heading "Contact" */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-4 md:mb-6 drop-shadow-md"
            >
              Contact
            </motion.h1>

            {/* One Paragraph Line Below */}
            <motion.p
              variants={fadeInUp}
              className="text-gray-200 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10 drop-shadow"
            >
              Experience discrete real estate consultation tailored for ultra-high-net-worth individuals, family offices, and institutional investors seeking Dubai&apos;s finest residences.
            </motion.p>

            {/* Below ONLY Request Appointment Button with Smooth Scroll & Tactile Animation */}
            <motion.div variants={fadeInUp} className="flex justify-center w-full">
              <motion.a
                href="#consultation-desk"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById("consultation-desk");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="inline-flex items-center justify-center bg-brand-gold hover:bg-white text-brand-black px-10 py-4 rounded-full font-bold text-base transition-colors shadow-[0_15px_30px_rgba(196,162,89,0.3)] hover:shadow-[0_20px_45px_rgba(255,255,255,0.4)] relative overflow-hidden group cursor-pointer"
              >
                <span className="relative z-10 flex items-center space-x-2.5">
                  <span>Request Appointment</span>
                  <motion.span
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="inline-flex items-center justify-center"
                  >
                    <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                  </motion.span>
                </span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default ContactHero;
