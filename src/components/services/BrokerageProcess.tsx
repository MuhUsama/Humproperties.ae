"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Image from "next/image";

const phases = [
  {
    num: "01",
    title: "Consultation",
    desc: "Define your precise mandate and objectives with our senior advisory team."
  },
  {
    num: "02",
    title: "Curation",
    desc: "Isolate a select portfolio of ultra-prime assets tailored to your exact requirements."
  },
  {
    num: "03",
    title: "Negotiation",
    desc: "Aggressive, data-backed negotiations to secure optimal terms on your behalf."
  },
  {
    num: "04",
    title: "Acquisition",
    desc: "Legally ironclad, entirely discreet transfer of ownership handled seamlessly."
  }
];

export default function BrokerageProcess() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative w-full h-[calc(100vh-4.5rem)] min-h-[700px] bg-white flex flex-col md:flex-row overflow-hidden border-t border-black/5">
      
      {/* Left: Full Bleed Image (Expansive, no card shape) */}
      <div className="w-full md:w-1/2 h-[40%] md:h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Different image for each step for dynamic feel */}
            <Image
              src={
                activeStep === 0 ? "/services-assets/brokerageprocess/brokerageprocess-1.webp" :
                activeStep === 1 ? "/services-assets/brokerageprocess/brokerageprocess-2.webp" :
                activeStep === 2 ? "/services-assets/brokerageprocess/brokerageprocess-3.webp" :
                "/services-assets/brokerageprocess/brokerageprocess-4.webp"
              }
              alt={phases[activeStep].title}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right: Expansive Typography (No borders, massive text) */}
      <div className="w-full md:w-1/2 h-[60%] md:h-full flex flex-col justify-center px-8 lg:px-20 xl:px-32 bg-white">
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-12 lg:mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#101014] tracking-tight leading-none mb-6">
            The Process.
          </h2>
          <p className="text-gray-500 font-light text-base lg:text-lg max-w-md leading-relaxed">
            A highly structured, data-driven methodology designed to protect your interests at the pinnacle of the market.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col gap-6 lg:gap-8 w-full max-w-xl"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
        >
          {phases.map((phase, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              onMouseEnter={() => setActiveStep(index)}
              className="flex items-start gap-8 cursor-pointer group"
            >
              {/* Elegant Serif Numbering */}
              <span className={`text-2xl md:text-3xl lg:text-4xl font-serif transition-colors duration-500 ${activeStep === index ? 'text-[#d4af37]' : 'text-gray-200 group-hover:text-gray-400'}`}>
                {phase.num}
              </span>
              
              <div className="flex flex-col pt-1">
                <h3 className={`text-2xl md:text-3xl lg:text-4xl font-serif tracking-tight mb-3 transition-colors duration-500 ${activeStep === index ? 'text-[#101014]' : 'text-gray-300 group-hover:text-gray-500'}`}>
                  {phase.title}
                </h3>
                
                {/* Smooth Expansion without jumping layout too harshly */}
                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${activeStep === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-500 font-light text-sm md:text-base leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

    </section>
  );
}
