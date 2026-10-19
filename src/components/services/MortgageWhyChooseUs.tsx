"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Image from "next/image";
import { ArrowRight, ArrowLeft, Star, ShieldCheck } from "lucide-react";

export default function MortgageWhyChooseUs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reasons = [
    {
      title: "EXPERT GUIDANCE",
      desc: "Take advantage of our partnership with Mortgage Finder and our in-depth knowledge of the UAE real estate market.",
      image: "/services-assets/mortgagewhychooseus/mortgagewhychooseus-1.webp"
    },
    {
      title: "STREAMLINED PROCESS",
      desc: "From the initial consultation to final financing, our streamlined process guarantees clarity and efficiency every step of the way.",
      image: "/services-assets/mortgagewhychooseus/mortgagewhychooseus-2.webp"
    },
    {
      title: "PERSONALIZED SOLUTIONS",
      desc: "We offer tailored mortgage solutions that align with your financial goals and investment strategies.",
      image: "/services-assets/mortgagewhychooseus/mortgagewhychooseus-3.webp"
    },
    {
      title: "ONGOING SUPPORT",
      desc: "We provide ongoing support throughout the mortgage application process and beyond.",
      image: "/services-assets/mortgagewhychooseus/mortgagewhychooseus-4.webp"
    }
  ];
  // Auto-play logic
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % reasons.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, reasons.length]);

  const handleNext = () => setActiveIndex((current) => (current + 1) % reasons.length);
  const handlePrev = () => setActiveIndex((current) => (current - 1 + reasons.length) % reasons.length);

  return (
    <section className="relative w-full p-5 md:p-10 lg:p-12 lg:h-[calc(100svh-5rem)] flex flex-col items-center mb-16 lg:mb-32 overflow-hidden">
      <div className="w-full relative flex-1 flex flex-col min-h-0 z-10">
        <div className="text-center mb-8 lg:mb-12 flex-shrink-0">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-[#101014] tracking-tight mb-4"
          >
            Why Choose <span className="text-[#d4af37] italic">MFreuae</span>
          </motion.h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">
            Unparalleled expertise paired with a seamless luxury experience.
          </p>
        </div>

        {/* The Single Master Card */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col lg:flex-row w-full flex-1 min-h-0 rounded-[2rem] overflow-hidden shadow-2xl bg-[#101014]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Side (Color Block & Text) */}
          <div className="w-full lg:w-[40%] bg-[#101014] p-8 lg:p-16 relative flex flex-col justify-center min-h-0">
            {/* Thin vertical line */}
            <div className="absolute top-[20%] bottom-[20%] left-0 w-1 bg-[#d4af37]"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col flex-1 justify-center"
              >
                <span className="text-[#d4af37] font-mono tracking-widest uppercase text-sm mb-4 block pl-2 lg:pl-0">
                  0{activeIndex + 1} / 0{reasons.length}
                </span>
                <h3 className="text-3xl lg:text-4xl font-serif text-white mb-6 leading-tight pl-2 lg:pl-0">
                  {reasons[activeIndex].title}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed font-light mb-12 pl-2 lg:pl-0 max-w-md">
                  {reasons[activeIndex].desc}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* Bottom Controls */}
            <div className="flex items-center mt-auto pl-2 lg:pl-0 pt-8">
              {/* Navigation Arrows */}
              <div className="flex gap-3">
                <button 
                  onClick={handlePrev} 
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all"
                  aria-label="Previous reason"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNext} 
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all"
                  aria-label="Next reason"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side (Image) */}
          <div className="w-full lg:w-[60%] relative h-full bg-gray-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image 
                  src={reasons[activeIndex].image} 
                  alt={reasons[activeIndex].title} 
                  fill 
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Decorative floating badges */}
            <div className="absolute top-8 right-8 flex flex-col gap-3 z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-white ml-6">
                <Star className="w-5 h-5 text-white drop-shadow-md" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
