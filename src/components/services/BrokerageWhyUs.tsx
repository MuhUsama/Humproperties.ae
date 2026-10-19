"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";

const stats = [
  { value: "$2.5B+", label: "Total Sales Volume" },
  { value: "12 Days", label: "Average Time on Market" },
  { value: "450+", label: "Off-Market Transactions" },
  { value: "No. 1", label: "Luxury Brokerage 2025" }
];

export default function BrokerageWhyUs() {
  return (
    <section className="relative w-full h-[calc(100vh-4.5rem)] min-h-[700px] bg-[#faf9f7] flex flex-col justify-between overflow-hidden border-t border-black/5">
      
      {/* Top Half: Typography & Panoramic Image */}
      <div className="flex-1 flex flex-col relative w-full pt-16 lg:pt-24">
        
        <div className="w-full px-8 lg:px-12 xl:px-24 flex justify-between items-end mb-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-serif text-[#101014] tracking-tight leading-none">
              By the<br />Numbers.
            </h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="hidden md:block max-w-sm">
            <p className="text-gray-500 font-light text-base lg:text-lg leading-relaxed text-right">
              Our dominance in the ultra-prime sector is substantiated by an unparalleled transactional history.
            </p>
          </motion.div>
        </div>

        {/* Panoramic Full Bleed Image */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="relative flex-1 w-full overflow-hidden"
        >
          <Image
            src="/services-assets/brokeragewhyus/brokeragewhyus-1.webp"
            alt="Dubai Skyline Panoramic"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Bottom Half: Full-Width Stats Grid (No Cards) */}
      <motion.div 
        className="w-full grid grid-cols-2 md:grid-cols-4 border-t border-black/10 bg-[#faf9f7]"
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            variants={fadeInUp}
            className="flex flex-col items-center justify-center text-center p-8 lg:p-12 border-b md:border-b-0 md:border-r border-black/10 last:border-r-0 hover:bg-white transition-colors duration-500 cursor-default"
          >
            <span className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#101014] tracking-tight mb-3">
              {stat.value}
            </span>
            <span className="text-gray-400 font-sans font-medium text-[10px] lg:text-xs uppercase tracking-[0.2em]">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
}
