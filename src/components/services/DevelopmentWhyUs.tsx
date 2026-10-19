"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const stats = [
  { 
    value: "12B+", 
    unit: "AED",
    label: "Gross Development Value", 
    desc: "Total development portfolio value delivered across luxury residential, commercial, and mixed-use projects.",
  },
  { 
    value: "4.5M", 
    unit: "SQFT",
    label: "Built-Up Area", 
    desc: "Premium built-up area delivered to the highest construction and finishing standards.",
  },
  { 
    value: "100%", 
    unit: "",
    label: "Completion Rate", 
    desc: "Every project delivered on schedule. No exceptions. No delays.",
  },
  { 
    value: "Tier 1", 
    unit: "",
    label: "Contractor Network", 
    desc: "Exclusive partnerships with the region's most trusted and accredited Tier-1 construction firms.",
  }
];

export default function DevelopmentWhyUs() {
  return (
    <section className="relative w-full py-24 lg:py-32 bg-[#101014] overflow-hidden flex flex-col items-center">
      
      {/* Imposing Monolithic Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/services-assets/developmentwhyus/developmentwhyus-1.webp"
          alt="Monolithic Construction"
          fill
          className="object-cover opacity-20 grayscale brightness-50 contrast-125"
        />
        {/* Deep shadows overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101014] via-transparent to-[#101014]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101014] via-transparent to-[#101014]" />
      </div>

      <div className="relative z-10 w-full max-w-[1500px] px-6 lg:px-12 flex flex-col items-center">
        
        {/* Title */}
        <div className="mb-20 md:mb-32 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-[7rem] font-serif text-white tracking-tighter leading-none"
          >
            Scale &amp; Execution.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#d4af37] font-mono text-sm md:text-base uppercase tracking-[0.4em] mt-6"
          >
            By The Numbers
          </motion.p>
        </div>

        {/* Monolithic Stats Display */}
        <div className="w-full flex flex-col gap-12 md:gap-24">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-center md:items-baseline justify-between border-b border-white/10 pb-8 md:pb-12 group"
            >
              {/* Massive Value */}
              <div className="flex items-baseline gap-2 mb-6 md:mb-0">
                {stat.unit && <span className="text-[#d4af37] font-mono text-xl md:text-3xl tracking-widest">{stat.unit}</span>}
                <span className="text-7xl md:text-[8rem] lg:text-[10rem] font-serif text-white tracking-tighter leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-gray-600 transition-all duration-700">
                  {stat.value}
                </span>
              </div>
              
              {/* Structural Label & Desc */}
              <div className="flex flex-col md:w-[40%] text-center md:text-right">
                <h4 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-200 mb-4 tracking-tight">
                  {stat.label}
                </h4>
                <p className="text-gray-500 font-light text-sm md:text-base lg:text-lg leading-relaxed max-w-sm ml-auto">
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
