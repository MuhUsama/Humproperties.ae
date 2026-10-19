"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const phases = [
  {
    num: "01",
    title: "Concept & Feasibility",
    desc: "Comprehensive market analysis, architectural master-planning, and financial modeling to ensure absolute viability before ground is broken.",
    image: "/services-assets/developmentprocess/developmentprocess-1.webp"
  },
  {
    num: "02",
    title: "Design & Approvals",
    desc: "Collaborating with world-class architects and navigating regulatory landscapes to secure all necessary permits efficiently.",
    image: "/services-assets/developmentprocess/developmentprocess-2.webp"
  },
  {
    num: "03",
    title: "Construction Phase",
    desc: "Rigorous project management, overseeing Tier-1 contractors to ensure flawless execution and structural integrity.",
    image: "/services-assets/developmentprocess/developmentprocess-3.webp"
  },
  {
    num: "04",
    title: "Handover & Operation",
    desc: "Final snagging, sophisticated interior fit-outs, and seamless transition to our elite management and brokerage teams.",
    image: "/services-assets/developmentprocess/developmentprocess-4.webp"
  }
];

export default function DevelopmentProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative w-full bg-[#101014] py-24 lg:py-40 overflow-hidden" ref={containerRef}>
      
      {/* Blueprint Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-24 md:mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-7xl font-serif text-white tracking-tight"
          >
            The Masterplan.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-sans text-xs uppercase tracking-[0.3em] mt-4 md:mt-6"
          >
            Development Lifecycle
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full max-w-5xl mx-auto">
          
          {/* Center Line Desktop / Left Line Mobile */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2" />
          <motion.div 
            className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-[#d4af37] -translate-x-1/2 shadow-[0_0_15px_rgba(212,175,55,0.5)] origin-top"
            style={{ scaleY: lineHeight }}
          />

          <div className="flex flex-col gap-20 md:gap-32">
            {phases.map((phase, index) => {
              const isEven = index % 2 === 0;

              return (
                <div key={index} className="relative flex flex-col md:flex-row items-center justify-center w-full">
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-[20px] md:left-1/2 top-10 md:top-1/2 w-4 h-4 rounded-full bg-[#101014] border-2 border-[#d4af37] -translate-x-1/2 md:-translate-y-1/2 z-20 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />

                  {/* Desktop Alternating Content, Mobile Stacked */}
                  <div className={`w-full flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 pl-[60px] md:pl-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Text Block */}
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`flex-1 w-full ${isEven ? 'md:text-right' : 'md:text-left'}`}
                    >
                      <span className="text-[#d4af37] font-mono text-sm tracking-widest block mb-2">{phase.num}</span>
                      <h3 className="text-3xl lg:text-4xl font-serif text-white mb-4 leading-tight">{phase.title}</h3>
                      <p className="text-gray-400 font-light text-sm lg:text-base leading-relaxed">
                        {phase.desc}
                      </p>
                    </motion.div>

                    {/* Image Block */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      className="flex-1 w-full relative h-[250px] md:h-[350px] rounded-2xl overflow-hidden shadow-2xl group"
                    >
                      <Image 
                        src={phase.image} 
                        alt={phase.title} 
                        fill 
                        className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                      {/* Architectural frame overlay */}
                      <div className="absolute inset-4 border border-white/20 pointer-events-none transition-all duration-700 group-hover:inset-6" />
                    </motion.div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
