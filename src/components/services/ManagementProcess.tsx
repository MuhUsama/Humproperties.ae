"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const phases = [
  {
    num: "Phase 1",
    title: "Onboarding & Audit",
    desc: "Rigorous property inspection and financial auditing to establish a baseline for yield optimization.",
    image: "/services-assets/managementprocess/managementprocess-1.webp"
  },
  {
    num: "Phase 2",
    title: "Strategic Marketing",
    desc: "Targeted campaigns to attract ultra-high-net-worth tenants and corporate executives.",
    image: "/services-assets/managementprocess/managementprocess-2.webp"
  },
  {
    num: "Phase 3",
    title: "Asset Maintenance",
    desc: "Preventative upkeep and rapid response protocols ensuring your property remains in pristine condition.",
    image: "/services-assets/managementprocess/managementprocess-3.webp"
  },
  {
    num: "Phase 4",
    title: "Financial Reporting",
    desc: "Transparent, institutional-grade financial statements delivered monthly for absolute clarity.",
    image: "/services-assets/managementprocess/managementprocess-4.webp"
  }
];

export default function ManagementProcess() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic Scroll (Carousel)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phases.length);
    }, 4000); // Change card every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[calc(100vh-4.5rem)] min-h-[700px] bg-[#faf9f7] overflow-hidden flex flex-col justify-center items-center py-24">
      
      {/* Title */}
      <div className="absolute top-16 left-8 lg:left-24 z-20">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#101014] tracking-tight">
          The Process.
        </h2>
      </div>

      {/* Cards Container (Coverflow Style) */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center mt-12 perspective-[1000px]">
        <AnimatePresence mode="popLayout">
          {phases.map((phase, index) => {
            
            // Calculate distance from center to determine styles
            const offset = (index - currentIndex + phases.length) % phases.length;
            
            // Map offset to position (0: center, 1: right, phases.length-1: left)
            let xOffset = 0;
            let zOffset = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 10;

            if (offset === 0) {
              // Center Card
              xOffset = 0;
              zOffset = 0;
              scale = 1;
              opacity = 1;
              zIndex = 30;
            } else if (offset === 1) {
              // Right Card
              xOffset = 40;
              zOffset = -100;
              scale = 0.85;
              opacity = 0.5;
              zIndex = 20;
            } else if (offset === phases.length - 1) {
              // Left Card
              xOffset = -40;
              zOffset = -100;
              scale = 0.85;
              opacity = 0.5;
              zIndex = 20;
            } else {
              // Hidden Cards (Back)
              xOffset = 0;
              zOffset = -200;
              scale = 0.7;
              opacity = 0;
              zIndex = 10;
            }

            // Apply different styles for mobile vs desktop for xOffset
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const mobileMultiplier = isMobile ? 0.7 : 1;

            return (
              <motion.div
                key={index}
                className="absolute w-[85vw] md:w-[60vw] lg:w-[45vw] h-full rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer"
                initial={false}
                animate={{ 
                  x: `${xOffset * mobileMultiplier}%`, 
                  z: zOffset, 
                  scale: scale, 
                  opacity: opacity,
                  rotateY: offset === 1 ? -15 : offset === phases.length - 1 ? 15 : 0 // subtle 3d rotation
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ zIndex }}
                onClick={() => setCurrentIndex(index)}
              >
                {/* Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={phase.image}
                    alt={phase.title}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 transition-colors duration-1000 ${offset === 0 ? 'bg-gradient-to-t from-black/90 via-black/30 to-transparent' : 'bg-black/40'}`} />
                </div>

                {/* Content (Only fully visible when centered) */}
                <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end text-white">
                  <motion.span 
                    animate={{ opacity: offset === 0 ? 1 : 0.5 }} 
                    className="text-[#d4af37] font-serif text-lg md:text-xl mb-3 tracking-widest uppercase"
                  >
                    {phase.num}
                  </motion.span>
                  <motion.h3 
                    animate={{ y: offset === 0 ? 0 : 20, opacity: offset === 0 ? 1 : 0.5 }} 
                    className="text-3xl md:text-5xl lg:text-6xl font-serif mb-4 tracking-tight"
                  >
                    {phase.title}
                  </motion.h3>
                  
                  {/* Expand description ONLY on center card */}
                  <motion.div 
                    animate={{ 
                      height: offset === 0 ? 'auto' : 0, 
                      opacity: offset === 0 ? 1 : 0 
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-300 font-light text-sm md:text-base lg:text-lg max-w-lg leading-relaxed">
                      {phase.desc}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </section>
  );
}
