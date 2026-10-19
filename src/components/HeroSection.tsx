"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center h-[calc(100svh-5rem)]">
      <div 
        className="relative w-full flex-1 min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-end justify-start text-left shadow-none group px-6 py-10 md:px-24 md:py-20 animate-[fadeInUp_0.8s_ease-out_forwards]"
      >
        {/* Video Background */}
        <motion.div
          className="absolute inset-0 w-full h-full scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/hero_poster.jpg"
            className="absolute inset-0 w-full h-full object-cover z-0 rounded-[2rem] md:rounded-[2.5rem]"
            src="/hero_section_video.webm"
            // @ts-ignore - fetchpriority is valid but Next.js types might complain depending on version
            fetchPriority="high"
          >
            Your browser does not support the video tag.
          </video>
        </motion.div>
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>

        {/* Hero Text */}
        <div className="relative z-20 max-w-3xl pt-6 md:pt-0">
          <p className="text-brand-gold font-semibold tracking-[0.2em] text-xs md:text-sm uppercase mb-2 md:mb-3">
            Welcome to Dubai
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-4 md:mb-5">
            Extraordinary <br />
            Luxury Properties
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 md:mb-8 max-w-xl">
            Discover the most exclusive homes, apartments, and investments in the heart of the UAE. Your vision, our expertise.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-start gap-3 md:gap-4 w-full sm:w-auto">
            <Link href="/buy" className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold-light text-white px-8 py-3 rounded-full font-medium transition-all shadow-none hover:-translate-y-1">
              Explore Properties
            </Link>
            <Link href="#contact" className="w-full sm:w-auto bg-black/30 backdrop-blur-md border border-white/50 text-white hover:bg-white hover:text-brand-black px-8 py-3 rounded-full font-medium transition-all hover:-translate-y-1">
              Contact an Agent
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
