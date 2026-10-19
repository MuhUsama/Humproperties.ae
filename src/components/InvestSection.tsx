"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Globe } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useState, useEffect } from "react";

export default function InvestSection() {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const backgroundImages = [
    "/home-assets/invest/invest-1.webp", // Modern luxury home
    "/home-assets/invest/invest-2.webp", // Glass skyscrapers corporate
    "/home-assets/invest/invest-3.webp", // Sleek dark modern interior
    "/home-assets/invest/invest-4.webp"  // Modern villa at dusk
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); // Increased to 6 seconds for slower cinematic pan
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="h-[calc(100svh-5rem)] py-4 sm:py-8 lg:py-16 relative overflow-hidden bg-brand-black flex flex-col justify-center min-h-0">
      {/* Background Image Slideshow with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={currentImageIdx}
            src={backgroundImages[currentImageIdx]} 
            alt="Dubai Premium Real Estate" 
            initial={{ opacity: 0, scale: 1.1, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1, x: -30 }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 10, ease: "linear" },
              x: { duration: 10, ease: "linear" }
            }}
            className="absolute inset-0 w-full h-full object-cover origin-center"
          />
        </AnimatePresence>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 relative z-20 flex-1 min-h-0 flex flex-col justify-center">
        <motion.div 
          className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-16 max-h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {/* Text Content */}
          <div className="flex-1 w-full lg:w-auto">
            <motion.span variants={fadeInUp} className="text-brand-gold font-sans text-[10px] md:text-sm uppercase tracking-widest font-bold block mb-2 lg:mb-4">
              Unlock Your Wealth
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-3 lg:mb-6 leading-tight">
              Invest in the Future <br className="hidden sm:block" /> of <span className="text-brand-gold">Dubai Real Estate</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 text-xs sm:text-sm md:text-lg font-light leading-relaxed mb-4 lg:mb-8 line-clamp-2 sm:line-clamp-none">
              Discover high-yield investment opportunities in one of the world's most dynamic markets. From off-plan developments to premium commercial spaces, secure your financial legacy with Mohd. Alfalasi Real Estate.
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <Link 
                href="/invest"
                className="inline-flex items-center justify-center space-x-3 px-6 py-3 lg:px-8 lg:py-4 bg-brand-gold text-brand-black hover:bg-white rounded-full font-heading font-bold text-xs lg:text-base uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Feature Points - Glassmorphism */}
          <div className="flex-1 w-full lg:w-auto grid gap-3 lg:gap-6">
            {[
              {
                icon: TrendingUp,
                title: "High ROI Potential",
                desc: "Benefit from tax-free rental yields averaging 6-8%, outperforming major global cities."
              },
              {
                icon: Shield,
                title: "Secure & Regulated",
                desc: "Invest with confidence in a transparent, investor-friendly market regulated by DLD."
              },
              {
                icon: Globe,
                title: "Global Hub",
                desc: "Capitalize on Dubai's strategic location and booming tourism sector."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl flex items-center lg:items-start space-x-3 lg:space-x-6 hover:bg-white/15 transition-colors duration-300"
              >
                <div className="bg-brand-gold/20 p-2 lg:p-3 rounded-full flex-shrink-0">
                  <feature.icon className="w-4 h-4 lg:w-6 lg:h-6 text-brand-gold" />
                </div>
                <div>
                  <h3 className="text-sm lg:text-xl font-heading font-bold text-white mb-0.5 lg:mb-2 leading-tight">{feature.title}</h3>
                  <p className="text-gray-300 font-light text-[10px] lg:text-sm leading-snug lg:leading-relaxed line-clamp-1 sm:line-clamp-none">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
