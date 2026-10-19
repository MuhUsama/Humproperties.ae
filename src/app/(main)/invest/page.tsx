"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, TrendingUp, Shield, Building, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useState, useEffect } from "react";
import FaqSection from "@/components/common/FaqSection";
import { getFaqsByCategory } from "@/lib/faqData";

export default function InvestPage() {
  const investFaqs = getFaqsByCategory('invest');

  const [hoveredStabilityIdx, setHoveredStabilityIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setHoveredStabilityIdx((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const stabilityFeatures = [
    {
      title: "Tax-Free ROI",
      desc: "Enjoy 0% property and income tax, maximizing your net returns immediately without deductions.",
      image: "/page-assets/invest/invest-1.webp"
    },
    {
      title: "Golden Visa",
      desc: "Secure long-term residency through real estate investment, ensuring stability for you and your family.",
      image: "/page-assets/invest/invest-2.webp"
    },
    {
      title: "Global Hub",
      desc: "Unmatched infrastructure, safety, and a strategic location bridging the East and West economies.",
      image: "/page-assets/invest/invest-3.webp"
    }
  ];

  return (
    <main className="w-full bg-[#faf9f7] pt-20">
      
      {/* SECTION 1: Hero */}
      <section className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center h-[calc(100svh-5rem)]">
        <div className="relative w-full flex-1 min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-center justify-center text-center shadow-none group px-6 py-10 md:px-24 md:py-20 animate-[fadeInUp_0.8s_ease-out_forwards]">
          <motion.div className="absolute inset-0 w-full h-full scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out z-0">
            <img 
              src="/page-assets/invest/invest-1.webp" 
              alt="Dubai Skyline Night" 
              className="w-full h-full object-cover z-0 rounded-[2rem] md:rounded-[2.5rem]"
            />
            <div className="absolute inset-0 bg-black/65 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45 z-10"></div>
          </motion.div>

          <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center h-full py-4 sm:py-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center text-center my-auto"
            >
              <motion.span variants={fadeInUp} className="text-[#d4af37] font-sans text-xs md:text-sm uppercase tracking-[0.3em] font-bold block mb-4">
                Strategic Investment
              </motion.span>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-4 md:mb-6 drop-shadow-md">
                Invest with <br /> <span className="text-[#d4af37]">Confidence</span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-gray-200 text-xs sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto drop-shadow">
                Capitalize on tax-free yields, world-class infrastructure, and a booming economy. Dubai is the premier destination for global real estate investors.
              </motion.p>
              
              <motion.a 
                variants={fadeInUp}
                href="#opportunities"
                className="mt-8 inline-flex flex-col items-center text-white/70 hover:text-[#d4af37] transition-colors duration-300"
              >
                <ArrowDown className="w-6 h-6 animate-bounce" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Opportunities */}
      <section id="opportunities" className="h-[calc(100vh-4.5rem)] sm:h-[calc(100svh-5rem)] py-6 md:py-8 lg:py-12 w-full relative flex flex-col justify-center bg-[#faf9f7] overflow-hidden">
        <div className="w-full h-full mx-auto px-6 lg:px-12 flex flex-col justify-center">
          <motion.div 
            className="mb-4 md:mb-8 text-center max-w-2xl mx-auto flex-none"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeInUp} className="text-[#d4af37] font-sans text-[10px] uppercase tracking-[0.25em] font-bold block mb-3 md:mb-4 flex items-center justify-center space-x-3">
              <span className="w-8 h-[1px] bg-[#d4af37]"></span>
              <span>High-Yield Assets</span>
              <span className="w-8 h-[1px] bg-[#d4af37]"></span>
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif font-bold text-brand-black mb-3 md:mb-4">
              Exclusive Opportunities
            </motion.h2>
            <motion.p variants={fadeInUp} className="hidden md:block text-gray-500 font-light text-sm md:text-base leading-relaxed">
              Curated off-market and premium public listings engineered for maximum capital appreciation and rental yield.
            </motion.p>
          </motion.div>

          <div className="flex flex-col md:flex-row w-full flex-1 min-h-[400px] gap-4 lg:gap-6 items-stretch group/accordion">
            {[
              {
                title: "Luxury Beachfront Villas",
                location: "Palm Jumeirah",
                roi: "7.5%",
                type: "Residential",
                image: "/page-assets/invest/invest-4.webp"
              },
              {
                title: "Premium Office Spaces",
                location: "Downtown Dubai",
                roi: "9.2%",
                type: "Commercial",
                image: "/page-assets/invest/invest-3.webp"
              },
              {
                title: "Branded Residences",
                location: "Business Bay",
                roi: "8.0%",
                type: "Off-Plan",
                image: "/page-assets/invest/invest-5.webp"
              }
            ].map((prop, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }}
                className="group/card relative flex-1 md:hover:flex-[2.5] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] h-full min-h-[150px] md:min-h-0 w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-brand-black z-0">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover opacity-70 transition-transform duration-[1.5s] ease-out group-hover/card:scale-110" />
                </div>
                
                {/* Elegant Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                
                <div className="absolute inset-0 z-20 p-4 md:p-6 lg:p-10 flex flex-col justify-between">
                  {/* Top Badge & Hover Arrow */}
                  <div className="flex justify-between items-start transform md:translate-y-[-20px] md:opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 ease-out">
                    <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-sm whitespace-nowrap">
                      {prop.type}
                    </span>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#d4af37] text-brand-black hidden md:flex items-center justify-center transform translate-x-4 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-500 delay-100 shadow-md flex-shrink-0">
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="w-full relative transform transition-transform duration-500 ease-out md:group-hover/card:-translate-y-2 flex flex-col md:flex-row md:items-end justify-between md:opacity-80 group-hover/card:opacity-100">
                    <div className="flex flex-col flex-1 min-w-0 pr-4">
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white mb-2 md:mb-3 drop-shadow-md leading-tight truncate md:whitespace-normal">{prop.title}</h3>
                      <div className="flex items-center text-gray-300 text-[10px] md:text-xs tracking-wider uppercase font-medium">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 text-[#d4af37] flex-shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:text-right flex-shrink-0 border-t md:border-t-0 md:border-l border-white/20 pt-3 md:pt-0 md:pl-6">
                      <span className="block text-white/70 text-[8px] md:text-[10px] uppercase tracking-[0.2em] mb-1 font-semibold">Expected ROI</span>
                      <span className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#d4af37] drop-shadow-md">{prop.roi}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          

        </div>
      </section>

      {/* SECTION 3: Why Invest Info */}
      <section className="min-h-[calc(100vh-4.5rem)] lg:h-[calc(100svh-5rem)] w-full relative flex flex-col lg:flex-row bg-[#101014] overflow-hidden">
        
        {/* Left Content Column */}
        <div className="w-full lg:w-1/2 h-full px-6 lg:px-20 py-16 lg:py-0 flex flex-col justify-center relative z-10 bg-[#101014] border-t border-white/5">
           <div className="mb-12 lg:mb-20">
             <span className="text-[#d4af37] font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold block mb-4 flex items-center space-x-3">
               <span className="w-8 h-[1px] bg-[#d4af37]"></span>
               <span>Market Stability</span>
             </span>
             <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white tracking-tighter leading-none mb-4">
               The Smart Choice.
             </h2>
           </div>

           <div className="flex flex-col w-full" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
             {stabilityFeatures.map((feature, idx) => (
                <div key={idx} onMouseEnter={() => setHoveredStabilityIdx(idx)} onClick={() => setHoveredStabilityIdx(idx)} className="group cursor-pointer flex flex-col border-b border-white/10 py-6 lg:py-8 relative">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-6">
                       <span className={`text-xl font-serif transition-colors duration-500 ${hoveredStabilityIdx === idx ? 'text-[#d4af37]' : 'text-gray-600'}`}>0{idx + 1}</span>
                       <h3 className={`text-2xl md:text-3xl lg:text-4xl font-serif tracking-tight transition-colors duration-500 ${hoveredStabilityIdx === idx ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                         {feature.title}
                       </h3>
                     </div>
                   </div>
                   
                   <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${hoveredStabilityIdx === idx ? 'max-h-40 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                     <p className="text-gray-400 font-light text-sm lg:text-base leading-relaxed pl-12 max-w-md border-l border-white/10 ml-[10px]">
                       {feature.desc}
                     </p>
                   </div>
                </div>
             ))}
           </div>
        </div>

        {/* Right Image Column */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            {stabilityFeatures.map((feature, idx) => (
              hoveredStabilityIdx === idx && (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[3s]" />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-transparent lg:hidden" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#101014] via-transparent to-transparent hidden lg:block" />
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Floating Badge inside Image Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute bottom-8 lg:bottom-16 right-8 lg:right-16 bg-[#101014]/80 backdrop-blur-md border border-[#d4af37]/30 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.15)] z-20 flex flex-col items-center justify-center text-center w-36 h-36 md:w-48 md:h-48 group cursor-pointer"
          >
            {/* Rotating dashed aura */}
            <div className="absolute inset-0 rounded-full border border-[#d4af37]/30 scale-[1.08] group-hover:scale-[1.15] transition-transform duration-700 border-dashed animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-0 rounded-full border border-white/10 scale-[1.16] group-hover:scale-[1.22] transition-transform duration-700 animate-[spin_30s_linear_infinite_reverse]" />
            
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-[#d4af37] mb-2 group-hover:-translate-y-1 transition-transform duration-500" />
            <span className="text-gray-400 font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Avg Yield</span>
            <p className="text-3xl md:text-4xl font-serif font-bold text-white">6-8<span className="text-[#d4af37] text-xl md:text-2xl">%</span></p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="min-h-screen py-24 w-full relative flex items-center justify-center bg-[#faf9f7] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-black/5 rounded-full blur-[120px]" />
        </div>
        
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-heading font-bold text-brand-black mb-8">
            Ready to Build Your Portfolio?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-600 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">
            Speak directly with our investment specialists to tailor a strategy that aligns with your financial goals.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-10 py-5 bg-brand-black text-white hover:bg-brand-gold hover:text-brand-black rounded-full font-heading font-bold uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3"
            >
              <span>Speak to an Advisor</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/properties/category/commercial"
              className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white rounded-full font-heading font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center"
            >
              Browse Commercial
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 5: FAQs */}
      <FaqSection faqs={investFaqs} title="Investment FAQs" subtitle="Common questions about ROI, taxes, and legalities in Dubai." />

    </main>
  );
}
