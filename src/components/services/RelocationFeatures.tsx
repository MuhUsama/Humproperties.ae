"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Globe, ShieldCheck, Clock, Handshake, MapPin, Briefcase, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const features = [
  {
    id: "01",
    title: "Global Expertise",
    desc: "Relocating families from 60+ countries with deep knowledge of cross-border logistics and cultural nuances.",
    image: "/services-assets/relocationfeatures/relocationfeatures-1.webp",
    className: "md:col-span-2 md:row-span-1 min-h-[300px] md:min-h-0",
    icon: Globe
  },
  {
    id: "02",
    title: "Visa & Legal",
    desc: "End-to-end guidance on residency visas, Emirates ID, corporate licensing, and government documentation.",
    image: "/services-assets/relocationfeatures/relocationfeatures-2.webp",
    className: "md:col-span-1 md:row-span-2 min-h-[350px] md:min-h-0",
    icon: ShieldCheck
  },
  {
    id: "03",
    title: "Neighborhood Matching",
    desc: "Data-driven analysis to find the perfect luxury community for your lifestyle.",
    image: "/services-assets/relocationfeatures/relocationfeatures-3.webp",
    className: "md:col-span-1 md:row-span-1 min-h-[300px] md:min-h-0",
    icon: MapPin
  },
  {
    id: "04",
    title: "24/7 Concierge",
    desc: "Dedicated manager available around the clock for any query or request.",
    image: "/services-assets/relocationfeatures/relocationfeatures-4.webp",
    className: "md:col-span-1 md:row-span-1 min-h-[300px] md:min-h-0",
    icon: Clock
  },
  {
    id: "05",
    title: "Corporate Programs",
    desc: "Tailored luxury packages for businesses moving elite teams to Dubai.",
    image: "/services-assets/relocationfeatures/relocationfeatures-5.webp",
    className: "md:col-span-1 md:row-span-1 min-h-[300px] md:min-h-0",
    icon: Briefcase
  },
  {
    id: "06",
    title: "Post-Move Support",
    desc: "Continued assistance for 90 days after your move — ensuring you're fully settled and thriving.",
    image: "/services-assets/relocationfeatures/relocationfeatures-6.webp",
    className: "md:col-span-2 md:row-span-1 min-h-[300px] md:min-h-0",
    icon: Handshake
  }
];

export default function RelocationFeatures() {
  return (
    <section className="relative w-full p-4 md:p-6 lg:p-8 xl:p-12 min-h-screen flex flex-col items-center justify-center bg-[#faf9f7] overflow-hidden">
      
      <div className="w-full mx-auto flex flex-col h-full relative z-10 max-w-[1400px]">

        <div className="flex flex-col md:flex-row justify-between items-end mb-10 lg:mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-[#d4af37] font-mono text-[10px] tracking-[0.3em] uppercase block mb-3">What We Offer</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#101014] leading-[1.1] tracking-tight">
              Bespoke Relocation <br />
              <span className="text-[#d4af37] italic">Solutions</span>
            </h2>
          </div>
          <p className="text-gray-500 font-light max-w-md text-sm md:text-base leading-relaxed">
            From seamless logistics to securing your ideal home, our end-to-end advisory ensures absolute peace of mind during your transition to Dubai.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[280px] gap-4 md:gap-5"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            // Delay index for staggered continuous animations
            const animDelay = index * 0.4;

            return (
              <motion.div 
                key={feature.id}
                variants={fadeInUp} 
                className={`${feature.className} rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.08)]`}
              >
                {/* Continuous zoom background image */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: animDelay }}
                >
                  <Image src={feature.image} alt={feature.title} fill className="object-cover transition-transform duration-[2s] group-hover:scale-110" />
                </motion.div>

                {/* Heavy gradient overlay for text legibility, transitions to gold tint on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/60 to-transparent group-hover:from-[#101014] group-hover:via-[#d4af37]/40 transition-colors duration-700" />
                


                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                  {/* Top Header */}
                  <div className="flex justify-between items-start">
                    {/* Noticeable continuous floating icon */}
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:bg-[#d4af37] group-hover:border-[#d4af37] transition-colors duration-500"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: animDelay }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    
                    <span className="text-white/50 font-mono text-xs tracking-widest uppercase group-hover:text-[#d4af37] transition-colors duration-500">
                      {feature.id}
                    </span>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-500">
                      {feature.title}
                    </h3>
                    
                    <div className="overflow-hidden relative h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-3 transition-all duration-500">
                      <p className="text-gray-300 font-light text-sm leading-relaxed pb-1">
                        {feature.desc}
                      </p>
                    </div>

                    {/* Bottom Gold Line */}
                    <div className="absolute -bottom-8 left-0 right-0 h-[3px] bg-gradient-to-r from-[#d4af37] to-[#f5d56e] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                  </div>
                </div>

                {/* Hover Arrow indicator */}
                <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 delay-100 shadow-xl">
                  <ArrowUpRight className="w-5 h-5 text-[#101014]" />
                </div>

                {/* Animated Gold border glow on hover */}
                <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-[#d4af37]/50 transition-colors duration-700 pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
