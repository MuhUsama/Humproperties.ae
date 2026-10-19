"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const aboutImages = [
  "/home-assets/about/about-1.webp",
  "/home-assets/about/about-2.webp",
  "/home-assets/about/about-3.webp",
  "/home-assets/about/about-4.webp"
];

const AboutSection = memo(function AboutSection() {
  const [currentAboutImage, setCurrentAboutImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAboutImage((prev) => (prev + 1) % aboutImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="relative w-full py-4 sm:py-8 md:p-10 lg:p-12 flex flex-col items-center justify-center h-[calc(100svh-5rem)] scroll-mt-20">
      <div className="relative w-full flex-1 rounded-none md:rounded-[2.5rem] bg-brand-black text-white overflow-hidden shadow-none p-6 md:p-10 lg:p-12 xl:p-20 flex flex-col justify-center">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/5 blur-[150px] pointer-events-none"></div>
        
        <div className="relative z-10 w-full h-full flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-1 gap-6 lg:gap-16 lg:items-stretch my-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="flex flex-col justify-center lg:h-full"
          >
            <motion.span variants={fadeInUp} className="flex items-center text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-3 lg:mb-4 xl:mb-6">
              <span className="w-12 h-[2px] bg-brand-gold mr-4"></span>
              About Us
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-2xl md:text-5xl lg:text-5xl xl:text-6xl font-serif mb-3 lg:mb-4 xl:mb-6 leading-[1.1] text-white">
              Elevating Real Estate <br className="hidden md:block" />
              Standards in Dubai
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 text-xs md:text-base lg:text-lg mb-4 lg:mb-6 xl:mb-8 font-light leading-relaxed max-w-xl">
              At Mohd. Alfalasi Real Estate, we don't just sell properties; we curate lifestyles. With years of unparalleled expertise in the Dubai market, our dedicated team ensures every transaction is seamless, transparent, and exceptionally rewarding.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 lg:gap-12 mb-4 lg:mb-6 xl:mb-8">
              <div className="relative">
                <p className="text-3xl md:text-5xl font-serif text-brand-gold mb-1 md:mb-2">500<span className="text-xl md:text-3xl">+</span></p>
                <p className="text-gray-400 text-[9px] md:text-xs font-bold uppercase tracking-widest">Properties Sold</p>
              </div>
              <div className="relative pl-6 md:pl-12 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-brand-gold/30">
                <p className="text-3xl md:text-5xl font-serif text-brand-gold mb-1 md:mb-2">98<span className="text-xl md:text-3xl">%</span></p>
                <p className="text-gray-400 text-[9px] md:text-xs font-bold uppercase tracking-widest">Client Satisfaction</p>
              </div>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Link
                href="/about"
                className="group inline-flex items-center text-brand-gold font-bold uppercase tracking-widest text-sm hover:text-white transition-colors"
              >
                Read Full Story
                <span className="ml-4 w-12 h-[2px] bg-brand-gold group-hover:bg-white group-hover:w-16 transition-all duration-300 relative">
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-brand-gold group-hover:border-white transform rotate-45 transition-colors"></span>
                </span>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative flex-1 lg:flex-none lg:h-full min-h-[160px] w-full rounded-2xl md:rounded-3xl overflow-hidden group shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-brand-black/20 md:group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
            
            <AnimatePresence>
              <motion.img 
                key={currentAboutImage}
                src={aboutImages[currentAboutImage]} 
                alt="Dubai Luxury Real Estate" 
                className="absolute inset-0 z-10 w-full h-full object-cover object-center origin-center"
                initial={{ opacity: 0, filter: "blur(12px)", scale: 1.05 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1.15 }}
                exit={{ opacity: 0, filter: "blur(12px)" }}
                transition={{ 
                  opacity: { duration: 1.5, ease: "easeInOut" },
                  filter: { duration: 1.5, ease: "easeInOut" },
                  scale: { duration: 15, ease: "linear" }
                }}
              />
            </AnimatePresence>
            
            {/* Cinematic Gradient Overlay (Mobile) & Floating Card (Desktop) */}
            <div className="absolute bottom-0 left-0 right-0 md:bottom-8 md:left-8 md:right-auto md:w-80 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:bg-black/40 pt-16 pb-4 px-4 md:backdrop-blur-xl border-t-0 md:border border-white/10 md:p-8 rounded-b-2xl md:rounded-b-none md:rounded-2xl z-20 shadow-none md:shadow-2xl transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-700 flex justify-between items-end md:block">
              <div>
                <span className="text-brand-gold font-bold tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-xs uppercase mb-1 md:mb-3 block drop-shadow-md">
                  Legacy of Trust
                </span>
                <p className="text-base md:text-2xl font-serif text-white leading-snug drop-shadow-lg">
                  MOHD. ALFALASI
                </p>
              </div>
              <p className="text-gray-300 text-[10px] md:text-sm text-right md:text-left drop-shadow-md">
                Excellence<br className="md:hidden" /> in Real Estate
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;
