"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const advantages = [
  {
    num: "01",
    title: "Award-Winning Studio",
    desc: "Recognized globally for architectural excellence and visionary interior design that redefines modern luxury.",
    image: "/services-assets/interiorwhyus/interiorwhyus-1.webp",
  },
  {
    num: "02",
    title: "Exclusive Procurement",
    desc: "Direct access to rare materials, bespoke furniture makers, and private art galleries across Europe and Asia.",
    image: "/services-assets/interiorwhyus/interiorwhyus-2.webp",
  },
  {
    num: "03",
    title: "VR & 3D Visualization",
    desc: "Experience your future home through photorealistic renderings and virtual reality walkthroughs before construction begins.",
    image: "/services-assets/interiorwhyus/interiorwhyus-3.webp",
  },
  {
    num: "04",
    title: "Turnkey Execution",
    desc: "A dedicated director oversees every detail from shell and core demolition to the final styling of accessories.",
    image: "/services-assets/interiorwhyus/interiorwhyus-4.webp",
  },
  {
    num: "05",
    title: "Post-Handover Care",
    desc: "Comprehensive maintenance and styling support long after the project is delivered, ensuring lasting perfection.",
    image: "/services-assets/interiorwhyus/interiorwhyus-5.webp",
  },
];

export default function InteriorWhyUs() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full h-[calc(100svh-5rem)] bg-[#faf9f7] flex items-center overflow-hidden py-4 lg:py-0">
      <div className="w-full mx-auto max-w-[1500px] px-5 lg:px-12 flex flex-col lg:flex-row gap-6 lg:gap-16 items-center h-full lg:h-auto overflow-y-auto lg:overflow-visible no-scrollbar">
        
        {/* Left Side: Interactive Accordion List */}
        <div className="w-full lg:w-1/2 mt-auto lg:mt-0 pt-4 lg:pt-0">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-6 lg:mb-12">
            <span className="text-[#d4af37] font-mono text-[10px] tracking-[0.4em] uppercase block mb-2 lg:mb-4">The Studio Advantage</span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#101014] leading-[1.1] tracking-tight">
              Why <span className="text-[#d4af37] italic">Choose Us</span>
            </h2>
          </motion.div>

          <div className="flex flex-col border-t border-black/10">
            {advantages.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <div 
                  key={item.num}
                  className="group border-b border-black/10 py-4 lg:py-6 cursor-pointer relative"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Hover background highlight */}
                  <div className={`absolute inset-0 bg-white transition-opacity duration-500 pointer-events-none -mx-4 lg:-mx-6 px-4 lg:px-6 ${isActive ? 'opacity-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)]' : 'opacity-0'}`} />
                  
                  <div className="relative z-10 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 lg:gap-8">
                        <span className={`font-mono text-xs lg:text-sm tracking-widest transition-colors duration-500 ${isActive ? 'text-[#d4af37]' : 'text-gray-400'}`}>
                          {item.num}
                        </span>
                        <h3 className={`text-lg md:text-2xl lg:text-3xl font-serif transition-colors duration-500 ${isActive ? 'text-[#101014]' : 'text-gray-500 group-hover:text-[#101014]'}`}>
                          {item.title}
                        </h3>
                      </div>
                      <ArrowRight className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-500 ${isActive ? 'text-[#d4af37] translate-x-0 opacity-100' : 'text-gray-300 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="pt-2 lg:pt-4 pl-8 lg:pl-16 text-gray-500 font-light text-[13px] lg:text-base leading-relaxed max-w-md">
                            {item.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Crossfading Image Showcase */}
        <div className="w-full lg:w-1/2 h-[250px] sm:h-[350px] lg:h-[calc(100vh-10rem)] lg:max-h-[700px] mb-auto lg:mb-0 relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-2xl flex-shrink-0 lg:flex-shrink">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <Image
                  src={advantages[activeIndex].image}
                  alt={advantages[activeIndex].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>
          
          {/* Subtle overlay decorative elements */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-10">
             <motion.div 
               animate={{ rotate: [0, 10, -10, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="w-12 h-12 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center"
             >
               <span className="text-white font-serif italic text-xl">{advantages[activeIndex].num}</span>
             </motion.div>
             <motion.span 
               animate={{ y: [0, -3, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="text-white/80 font-mono text-[10px] tracking-[0.2em] uppercase bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
             >
               Interior Architecture
             </motion.span>
          </div>
        </div>

      </div>
    </section>
  );
}
