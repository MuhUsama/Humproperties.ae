"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "Tenant Curation",
    desc: "Rigorous screening targeting UHNWI for unparalleled reliability.",
    image: "/services-assets/managementfeatures/managementfeatures-1.webp",
    gridClass: "col-span-12 md:col-span-4 row-span-2 aspect-[3/4] md:aspect-auto", // Tall image left
  },
  {
    title: "Yield Optimization",
    desc: "Dynamic pricing strategies to maximize your rental yields.",
    image: "/services-assets/managementfeatures/managementfeatures-2.webp",
    gridClass: "col-span-12 md:col-span-8 row-span-1 aspect-[16/5] md:aspect-auto", // Wide top right
  },
  {
    title: "Bespoke Maintenance",
    desc: "24/7 dedicated concierge and premium facility management.",
    image: "/services-assets/managementfeatures/managementfeatures-3.webp",
    gridClass: "col-span-12 md:col-span-4 row-span-1 aspect-square md:aspect-auto", // Square bottom middle
  },
  {
    title: "Legal & Compliance",
    desc: "In-house counsel handling all proactive dispute resolutions.",
    image: "/services-assets/managementfeatures/managementfeatures-4.webp",
    gridClass: "col-span-12 md:col-span-4 row-span-1 aspect-square md:aspect-auto", // Square bottom right
  }
];

export default function ManagementFeatures() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full h-auto md:h-[calc(100vh-4.5rem)] md:min-h-[700px] bg-white flex flex-col items-center justify-center py-12 md:py-0 border-t border-black/5 overflow-hidden">
      
      {/* Title */}
      <div className="absolute top-12 left-8 lg:left-24 z-20 pointer-events-none mix-blend-difference text-white hidden md:block">
        <h2 className="text-5xl lg:text-7xl font-serif tracking-tight drop-shadow-2xl">
          Elite<br />Management.
        </h2>
      </div>

      <div className="md:hidden w-full px-6 mb-8">
        <h2 className="text-4xl font-serif text-[#101014] tracking-tight">Elite Management.</h2>
      </div>

      {/* Asymmetric Grid exactly fitting screen */}
      <div className="w-full h-full mx-auto px-6 lg:px-12 xl:px-24 md:py-32 grid grid-cols-12 md:grid-rows-2 gap-4 lg:gap-8">
        
        {features.map((feature, index) => {
          const isHovered = hoveredIndex === index;
          const isFaded = hoveredIndex !== null && hoveredIndex !== index;

          return (
            <motion.div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative overflow-hidden group cursor-pointer rounded-2xl ${feature.gridClass}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              animate={{
                scale: isHovered ? 1.02 : 1,
                opacity: isFaded ? 0.6 : 1,
                filter: isFaded ? "grayscale(80%) blur(2px)" : "grayscale(0%) blur(0px)",
              }}
            >
              {/* Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className={`absolute inset-0 transition-colors duration-500 ${isHovered ? 'bg-black/30' : 'bg-black/10'}`} />
              </div>

              {/* Text Layer (Animates on Hover) */}
              <div className="absolute inset-0 p-6 lg:p-10 flex flex-col justify-end text-white">
                <motion.div
                  initial={false}
                  animate={{ y: isHovered ? 0 : 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <span className="text-[#d4af37] font-serif text-lg tracking-widest uppercase mb-2 block">
                    0{index + 1}
                  </span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-2 tracking-tight">
                    {feature.title}
                  </h3>
                </motion.div>
                
                <motion.div
                  initial={false}
                  animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-200 font-light text-sm md:text-base leading-relaxed mt-2 max-w-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              </div>

            </motion.div>
          );
        })}
        
      </div>
    </section>
  );
}
