"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Image from "next/image";

const features = [
  {
    title: "Global Reach",
    desc: "Unparalleled access to UHNWI and institutional networks across 60+ countries.",
    image: "/services-assets/brokeragefeatures/brokeragefeatures-1.webp"
  },
  {
    title: "Absolute Discretion",
    desc: "100% confidentiality protecting our elite clientele in every transaction.",
    image: "/services-assets/brokeragefeatures/brokeragefeatures-2.webp"
  },
  {
    title: "Data Valuation",
    desc: "Pricing backed by proprietary analytics and real-time market sentiment.",
    image: "/services-assets/brokeragefeatures/brokeragefeatures-3.webp"
  },
  {
    title: "Exclusive Access",
    desc: "Entry to Dubai's most coveted, unlisted ultra-prime properties.",
    image: "/services-assets/brokeragefeatures/brokeragefeatures-4.webp"
  }
];

export default function BrokerageFeatures() {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Default first one expanded
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 4000); // Change panel every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section 
      className="relative w-full h-[calc(100vh-4.5rem)] min-h-[600px] bg-[#101014] flex flex-col overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* Title Overlay (Top Left) */}
      <div className="absolute top-12 left-8 lg:left-12 z-20 pointer-events-none">
        <motion.h2 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="text-4xl md:text-5xl lg:text-7xl font-serif text-white tracking-tight drop-shadow-2xl"
        >
          Core <br className="hidden md:block"/>Competencies.
        </motion.h2>
      </div>

      {/* Full-Bleed Expanding Columns Container */}
      <div className="flex w-full h-full">
        {features.map((feature, index) => {
          const isExpanded = activeIndex === index;
          return (
            <motion.div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              className="relative h-full overflow-hidden cursor-pointer flex flex-col justify-end border-r border-white/10 last:border-r-0"
              animate={{
                width: isExpanded ? "55%" : "15%",
              }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-[#101014] to-transparent transition-opacity duration-700 ${isExpanded ? 'opacity-80' : 'opacity-40'}`} />
                <div className={`absolute inset-0 bg-[#101014] transition-opacity duration-700 ${isExpanded ? 'opacity-0' : 'opacity-60 hover:opacity-40'}`} />
              </div>

              {/* Text Content Area */}
              <div className="relative z-10 p-8 lg:p-12 mb-8">
                {/* Vertical Title when collapsed */}
                <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap origin-bottom-left -rotate-90 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <h3 className="text-xl md:text-2xl font-serif text-white/50 tracking-widest uppercase">
                    {feature.title}
                  </h3>
                </div>

                {/* Horizontal Content when expanded */}
                <div className={`transition-all duration-700 ease-in-out transform ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none absolute bottom-8 left-8'}`}>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 font-light text-sm md:text-lg max-w-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
