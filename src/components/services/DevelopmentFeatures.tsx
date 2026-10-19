"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const features = [
  {
    num: "01",
    title: "Land Acquisition",
    desc: "Identifying and securing prime real estate across Dubai's most coveted and rapidly appreciating districts, leveraging off-market networks and institutional relationships.",
    image: "/services-assets/developmentfeatures/developmentfeatures-1.webp",
  },
  {
    num: "02",
    title: "Architectural Vision",
    desc: "Partnering with globally renowned starchitects to design iconic structures that redefine skylines and maximize spatial utility for end users.",
    image: "/services-assets/developmentfeatures/developmentfeatures-2.webp",
  },
  {
    num: "03",
    title: "Financial Structuring",
    desc: "Sophisticated capital modeling, joint venture structuring, and risk-adjusted return analysis tailored for UHNW investors and family offices.",
    image: "/services-assets/developmentfeatures/developmentfeatures-3.webp",
  },
  {
    num: "04",
    title: "Project Management",
    desc: "End-to-end oversight ensuring absolute adherence to timelines, budgets, and uncompromised structural quality standards across every phase.",
    image: "/services-assets/developmentfeatures/developmentfeatures-4.webp",
  }
];

export default function DevelopmentFeatures() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Creates a horizontal scroll effect mapped to vertical scrolling
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]); // Moves by 75% for 4 items

  return (
    <section ref={targetRef} className="relative h-auto lg:h-[400vh] bg-[#faf9f7]">
      {/* Sticky Container (Desktop) */}
      <div className="hidden lg:flex sticky top-0 h-screen w-full items-center overflow-hidden">
        
        {/* Background Accent */}
        <div className="absolute top-12 left-12 z-20">
          <h2 className="text-5xl lg:text-7xl font-serif text-[#101014] tracking-tight leading-none">
            Structural <br/>
            <span className="italic text-gray-400 font-light">Integrity.</span>
          </h2>
          <p className="text-[#d4af37] font-mono text-xs uppercase tracking-[0.3em] mt-6">
            Our Development Pillars
          </p>
        </div>

        {/* Scrolling Track */}
        <motion.div style={{ x }} className="flex h-[60vh] gap-16 px-12 ml-[30vw] pt-20">
          {features.map((feature, index) => (
            <div key={index} className="w-[60vw] h-full shrink-0 flex items-center gap-12 group">
              {/* Image Panel */}
              <div className="relative w-[60%] h-full rounded-[2rem] overflow-hidden shadow-2xl">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-1000" />
              </div>

              {/* Text Panel */}
              <div className="w-[40%] flex flex-col justify-center">
                <span className="text-6xl font-serif text-gray-200 mb-6">{feature.num}</span>
                <h3 className="text-4xl font-serif text-[#101014] mb-6 tracking-tight leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-500 font-light text-lg leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mobile Fallback View (Vertical Stacking) */}
      <div className="lg:hidden relative w-full h-auto bg-[#faf9f7] px-6 py-24 flex flex-col items-center border-t border-black/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[#101014] tracking-tight mb-4">
            Structural <span className="italic text-gray-400 font-light">Integrity.</span>
          </h2>
          <p className="text-[#d4af37] font-mono text-xs uppercase tracking-[0.3em]">
            Our Development Pillars
          </p>
        </div>
        
        <div className="flex flex-col gap-16 w-full">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col gap-6">
              <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl">
                <Image src={feature.image} alt={feature.title} fill className="object-cover" />
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <span className="text-[#d4af37] font-mono text-sm tracking-widest mb-2">{feature.num}</span>
                <h3 className="text-3xl font-serif text-[#101014] mb-4">{feature.title}</h3>
                <p className="text-gray-500 font-light text-sm md:text-base leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
