"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Image from "next/image";

export default function MortgagePopularServices() {
  const services = [
    {
      title: "First & Next Time Buyers",
      subtitle: "Tailored Solutions",
      desc: "Purchasing your first property can be an exciting yet overwhelming journey. We offer personalized mortgage solutions to suit your financial profile.",
      image: "/services-assets/mortgagepopularservices/mortgagepopularservices-1.webp",
    },
    {
      title: "Equity Release",
      subtitle: "Unlock Value",
      desc: "Whether you're financing home renovations, making new investments, or covering personal expenses, equity release offers a flexible solution.",
      image: "/services-assets/mortgagepopularservices/mortgagepopularservices-2.webp",
    },
    {
      title: "Refinancing",
      subtitle: "Optimizing Mortgages",
      desc: "Refinancing allows you to adjust your current mortgage terms to suit your evolving financial needs and secure better interest rates.",
      image: "/services-assets/mortgagepopularservices/mortgagepopularservices-3.webp",
    },
    {
      title: "Non-Resident Mortgages",
      subtitle: "Investing Made Easy",
      desc: "UAE's real estate market continues to draw interest. We provide specialized mortgage solutions for non-residents looking to invest in UAE's vibrant property market.",
      image: "/services-assets/mortgagepopularservices/mortgagepopularservices-4.webp",
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 4000); // 4 seconds per slide

    return () => clearInterval(interval);
  }, [isPaused, services.length]);

  return (
    <section className="relative w-full p-5 md:p-10 lg:p-12 lg:h-[calc(100svh-5rem)] flex flex-col items-center mb-16 lg:mb-32 overflow-hidden">
      <div className="relative w-full flex-1 flex flex-col z-10 min-h-0">
        <div className="text-center mb-8 lg:mb-12 flex-shrink-0">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif text-[#101014] tracking-tight mb-4"
        >
          Specialized Mortgage <span className="text-[#d4af37] italic">Portfolios</span>
        </motion.h2>
        <p className="text-gray-500 max-w-2xl mx-auto font-light">
          Discover our bespoke financing options curated for exclusive properties.
        </p>
      </div>

      <div 
        className="flex flex-col lg:flex-row items-center lg:items-stretch gap-16 lg:gap-24 flex-1 min-h-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Left Side: Stacked Cards */}
        <div className="w-full lg:w-[45%] relative h-[400px] lg:h-full group perspective-1000 shrink-0">
          {/* Decorative Back Card 2 (Furthest Back) */}
          <div className="absolute top-12 left-0 w-[calc(100%-3rem)] h-[calc(100%-3rem)] bg-[#8a8a8a] rounded-[2rem] shadow-sm z-0 transform transition-transform duration-700 group-hover:-translate-x-2"></div>
          
          {/* Decorative Back Card 1 (Middle) */}
          <div className="absolute top-6 left-[1.5rem] w-[calc(100%-3rem)] h-[calc(100%-1.5rem)] bg-[#4a4a4a] rounded-[2rem] shadow-md z-10 transform transition-transform duration-700 group-hover:-translate-x-1"></div>

          {/* Active Front Card */}
          <div className="absolute top-0 right-0 w-[calc(100%-3rem)] h-full rounded-[2rem] shadow-2xl z-20 overflow-hidden border border-white/5">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image 
                  src={services[activeIndex].image} 
                  alt={services[activeIndex].title} 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <span className="text-white font-mono tracking-widest uppercase text-sm md:text-base">
                    {services[activeIndex].subtitle}
                  </span>
                  
                  {/* The connector node on the card */}
                  <div className="absolute right-0 top-[40%] flex items-center">
                    <span className="text-white font-mono text-xs mr-2 opacity-50 hidden lg:block">0{activeIndex + 1}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Menu List */}
        <div className="w-full lg:w-[55%] relative py-4 lg:py-0 flex flex-col justify-center h-full overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <span className="text-[#d4af37] font-bold tracking-widest uppercase text-sm mb-6 lg:mb-10 block">Service List</span>
          
          <div className="flex flex-col space-y-1 lg:space-y-2">
            {services.map((service, index) => {
              const isActive = activeIndex === index;
              return (
                <div 
                  key={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="relative flex flex-col cursor-pointer py-2 lg:py-3"
                >
                  <div className={`flex items-start space-x-6 transition-all duration-500 relative z-10 ${isActive ? 'translate-x-4 lg:translate-x-8' : 'opacity-40 hover:opacity-80'}`}>
                    
                    <span className={`relative font-mono text-xs md:text-sm tracking-widest mt-2 lg:mt-3 ${isActive ? 'text-[#d4af37]' : 'text-gray-400'}`}>
                      {/* Connecting Line (spanning the 6rem/96px gap + 2rem/32px translate-x + 1rem padding) */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeLine"
                          className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-[100%] mr-4 h-[1px] bg-[#d4af37]"
                          style={{ width: 'calc(96px + 2rem)' }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        ></motion.div>
                      )}
                      0{index + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className={`text-2xl md:text-3xl lg:text-4xl font-serif leading-tight transition-colors duration-500 ${isActive ? 'text-[#101014]' : 'text-gray-500'}`}>
                        {service.title}
                      </h3>
                      
                      {/* Expandable Description */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-500 font-light mt-3 lg:mt-4 max-w-md leading-relaxed text-sm md:text-base">
                              {service.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
