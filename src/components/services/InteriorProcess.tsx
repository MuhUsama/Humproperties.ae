"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";

const processSteps = [
  {
    num: "01",
    title: "Concept & Vision",
    desc: "We begin by understanding your lifestyle, curating mood boards and conceptual 3D renders that perfectly align with your aesthetic aspirations.",
    image: "/services-assets/interiorprocess/interiorprocess-1.webp",
  },
  {
    num: "02",
    title: "Spatial Architecture",
    desc: "Our architects meticulously plan the spatial flow, optimizing natural light, scale, and proportion to create harmonious living environments.",
    image: "/services-assets/interiorprocess/interiorprocess-2.webp",
  },
  {
    num: "03",
    title: "Material Curation",
    desc: "We source the world's finest marbles, exotic woods, and bespoke textiles, ensuring every tactile surface exudes uncompromising luxury.",
    image: "/services-assets/interiorprocess/interiorprocess-3.webp",
  },
  {
    num: "04",
    title: "Flawless Execution",
    desc: "From structural fit-out to the final placement of curated art, our project managers deliver a flawless, turnkey masterpiece.",
    image: "/services-assets/interiorprocess/interiorprocess-4.webp",
  }
];

export default function InteriorProcess() {
  return (
    <section className="relative w-full py-20 lg:py-32 bg-[#faf9f7] overflow-hidden">
      <div className="w-full mx-auto px-6 lg:px-16 xl:px-24">
        
        <div className="mb-20 md:mb-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <span className="text-[#d4af37] font-mono text-[10px] tracking-[0.4em] uppercase block mb-4">The Methodology</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#101014] tracking-tight leading-[1.1]">
              A Symphony of <br />
              <span className="italic font-light text-gray-400">Design & Form</span>
            </h2>
          </motion.div>
        </div>

        <div className="flex flex-col gap-24 md:gap-40">
          {processSteps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div 
                key={step.num}
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className={`relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 lg:gap-0`}
              >
                {/* Large Background Number */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-serif font-bold text-black/[0.02] select-none pointer-events-none z-0">
                  {step.num}
                </div>

                {/* Image Block */}
                <motion.div variants={fadeInUp} className="w-full md:w-[65%] relative z-10 group">
                  <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-sm">
                    <Image 
                      src={step.image} 
                      alt={step.title} 
                      fill 
                      className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-700 group-hover:opacity-0" />
                  </div>
                </motion.div>

                {/* Overlapping Text Block */}
                <motion.div 
                  variants={fadeInUp} 
                  className={`w-full md:w-[45%] relative z-20 ${isEven ? 'md:-ml-24' : 'md:-mr-24'}`}
                >
                  <div className="bg-white p-8 md:p-12 lg:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-l-4 border-[#d4af37]">
                    <div className="flex items-end gap-4 mb-6">
                      <span className="text-4xl md:text-5xl font-serif text-[#d4af37] leading-none">{step.num}.</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif text-[#101014] mb-4 tracking-tight">{step.title}</h3>
                    <p className="text-gray-500 font-light leading-relaxed md:text-lg">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
