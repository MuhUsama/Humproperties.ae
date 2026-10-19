"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Image from "next/image";

const disciplines = [
  {
    title: "Bespoke Furniture",
    subtitle: "Custom Craftsmanship",
    desc: "Meticulously crafted pieces designed to perfectly complement your spatial architecture.",
    image: "/services-assets/interiorfeatures/interiorfeatures-1.webp",
  },
  {
    title: "Space Planning",
    subtitle: "Architectural Flow",
    desc: "Intelligent layouts that optimize flow, functionality, and aesthetic harmony.",
    image: "/services-assets/interiorfeatures/interiorfeatures-2.webp",
  },
  {
    title: "Lighting Design",
    subtitle: "Atmospheric Brilliance",
    desc: "Layered lighting solutions to enhance mood and highlight architectural features.",
    image: "/services-assets/interiorfeatures/interiorfeatures-3.webp",
  },
  {
    title: "Art Curation",
    subtitle: "Gallery Selection",
    desc: "Sourcing and placement of fine art and statement pieces from global galleries.",
    image: "/services-assets/interiorfeatures/interiorfeatures-4.webp",
  },
  {
    title: "Material Sourcing",
    subtitle: "Rare Elements",
    desc: "Procurement of rare marbles, exotic woods, and premium textiles worldwide.",
    image: "/services-assets/interiorfeatures/interiorfeatures-5.webp",
  },
];

export default function InteriorFeatures() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0); // Default first item open

  return (
    <section className="relative w-full p-4 md:p-6 lg:p-8 xl:p-12 min-h-[calc(100vh-4.5rem)] lg:h-[calc(100svh-5rem)] flex flex-col items-center justify-center bg-[#101014] overflow-hidden">
      <div className="w-full mx-auto max-w-[1600px] h-full flex flex-col">
        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 lg:mb-10 shrink-0 gap-4 md:gap-4 relative z-10 text-center md:text-left">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl flex flex-col items-center md:items-start">
            <span className="text-[#d4af37] font-mono text-[10px] tracking-[0.4em] uppercase block mb-3 md:mb-4">Our Expertise</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] tracking-tight">
              Design <span className="text-[#d4af37] italic">Disciplines</span>
            </h2>
          </motion.div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-gray-400 font-light max-w-sm text-sm md:text-base leading-relaxed">
            Merging visionary aesthetics with uncompromising craftsmanship to deliver interiors that are deeply personal and profoundly breathtaking.
          </motion.p>
        </div>

        {/* Horizontal Expanding Accordion (Desktop) / Carousel (Mobile) */}
        <div className="flex flex-row w-full flex-1 min-h-[350px] md:min-h-0 gap-4 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar pb-6 md:pb-0">
          {disciplines.map((item, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => setHoveredIndex(index)}
                className={`relative overflow-hidden rounded-2xl transition-all duration-[0.8s] ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer group flex-shrink-0 snap-center
                  w-[85vw] md:w-auto min-w-[85vw] md:min-w-0 min-h-[350px] md:min-h-0 md:h-full
                  ${isHovered ? "md:flex-[4]" : "md:flex-[1]"}
                `}
              >
                {/* Continuous Zoom Background Image */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: index * 2 }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                </motion.div>
                
                {/* Gradients */}
                <div className={`absolute inset-0 bg-black transition-opacity duration-700 md:opacity-60 ${isHovered ? 'md:!opacity-20' : ''} opacity-30`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Content Container */}
                <div className={`absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end h-full transition-all duration-700 md:translate-y-4 ${isHovered ? 'md:!translate-y-0' : ''} translate-y-0`}>
                  
                  {/* Centered Title (Visible when inactive on desktop, hidden on mobile) */}
                  <div className={`hidden md:flex absolute inset-0 items-center justify-center p-4 transition-opacity duration-300 ${isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-300 pointer-events-none'}`}>
                    <motion.span 
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                      className="text-white font-serif text-sm md:text-base lg:text-lg text-center leading-tight tracking-wider uppercase drop-shadow-lg"
                    >
                      {item.title}
                    </motion.span>
                  </div>

                  {/* Expanded Content (Visible when hovered on desktop, always visible on mobile) */}
                  <div className={`flex flex-col transition-opacity duration-500 md:opacity-0 ${isHovered ? 'md:!opacity-100 delay-300' : ''} opacity-100`}>
                    <span className="text-[#d4af37] font-mono text-[10px] tracking-[0.2em] uppercase mb-2 block">
                      {item.subtitle}
                    </span>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-2 md:mb-3">
                      {item.title}
                    </h3>
                    <div className={`overflow-hidden transition-all duration-500 md:h-0 md:opacity-0 ${isHovered ? 'md:!h-auto md:!opacity-100' : ''} h-auto opacity-100`}>
                      <p className="text-gray-300 font-light text-sm md:text-base max-w-md leading-relaxed mt-2">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
