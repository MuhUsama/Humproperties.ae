"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const stats = [
  { 
    value: "300+", 
    label: "Premium Units", 
    desc: "A meticulously curated portfolio of Dubai's most exclusive assets.",
    image: "/services-assets/managementwhyus/managementwhyus-1.webp"
  },
  { 
    value: "98.5%", 
    label: "Occupancy Rate", 
    desc: "Maintained through aggressive tenant retention and rigorous curation.",
    image: "/services-assets/managementwhyus/managementwhyus-2.webp"
  },
  { 
    value: "12%", 
    label: "Peak Net Yield", 
    desc: "Consistently outperforming the market through proactive optimization.",
    image: "/services-assets/managementwhyus/managementwhyus-3.webp"
  },
  { 
    value: "$500M", 
    label: "AUM", 
    desc: "Trusted by family offices and ultra-high-net-worth individuals globally.",
    image: "/services-assets/managementwhyus/managementwhyus-4.webp"
  }
];

export default function ManagementWhyUs() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full h-auto md:h-[calc(100vh-4.5rem)] md:min-h-[700px] bg-[#101014] overflow-hidden flex flex-col justify-center border-t border-white/10">
      
      {/* Dynamic Background Image Reveal */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          {hoveredIndex !== null && (
            <motion.div
              key={hoveredIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={stats[hoveredIndex].image}
                alt="Background"
                fill
                className="object-cover opacity-30 grayscale"
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Permanent Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/80 to-[#101014]/30" />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-12 xl:px-24 py-12 md:py-0 flex flex-col items-center">
        
        {/* Title */}
        <div className="mb-16 md:mb-24 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-7xl font-serif text-white tracking-tight"
          >
            Performance Metrics.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#d4af37] font-sans text-xs md:text-sm uppercase tracking-[0.3em] mt-4"
          >
            By The Numbers
          </motion.p>
        </div>

        {/* 4-Column Stats Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, index) => {
            const isHovered = hoveredIndex === index;
            const isFaded = hoveredIndex !== null && !isHovered;

            return (
              <motion.div 
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group flex flex-col items-center text-center p-8 lg:p-12 cursor-pointer rounded-2xl transition-colors duration-500 hover:bg-white/5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  opacity: isFaded ? 0.3 : 1,
                  filter: isFaded ? "blur(4px)" : "blur(0px)",
                }}
              >
                <h3 className={`text-6xl lg:text-7xl xl:text-8xl font-serif tracking-tighter mb-4 transition-colors duration-500 ${isHovered ? 'text-[#d4af37]' : 'text-white'}`}>
                  {stat.value}
                </h3>
                <h4 className="text-xl lg:text-2xl font-serif text-white mb-4">
                  {stat.label}
                </h4>
                
                {/* Expandable Description */}
                <motion.div
                  initial={false}
                  animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0, marginTop: isHovered ? 16 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed">
                    {stat.desc}
                  </p>
                </motion.div>
                
                {/* Glowing Bottom Border on Hover */}
                <motion.div 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#d4af37] w-0"
                  animate={{ width: isHovered ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  );
}
