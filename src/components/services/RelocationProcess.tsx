"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import Image from "next/image";
import { Plane, Home, FileText, Users } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Pre-Arrival Planning",
    desc: "We handle all pre-move logistics — visa advisory, documentation, school enrollment, and identifying ideal neighborhoods tailored to your lifestyle preferences.",
    image: "/services-assets/relocationprocess/relocationprocess-1.webp",
    accent: "from-amber-500/20"
  },
  {
    icon: Plane,
    title: "Arrival & Settlement",
    desc: "From airport meet-and-greet to temporary accommodation, we ensure your first days in Dubai are seamless, stress-free, and comfortable.",
    image: "/services-assets/relocationprocess/relocationprocess-2.webp",
    accent: "from-blue-500/20"
  },
  {
    icon: Home,
    title: "Property Search & Lease",
    desc: "Our expert agents curate exclusive property viewings based on your requirements — from luxury penthouses to waterfront villas — negotiating the best terms on your behalf.",
    image: "/services-assets/relocationprocess/relocationprocess-3.webp",
    accent: "from-emerald-500/20"
  },
  {
    icon: Users,
    title: "Lifestyle Integration",
    desc: "We connect you with premium services — private healthcare, fitness memberships, social clubs, and domestic staffing — to help you settle into the Dubai lifestyle effortlessly.",
    image: "/services-assets/relocationprocess/relocationprocess-4.webp",
    accent: "from-purple-500/20"
  },
];

export default function RelocationProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="relative w-full p-4 md:p-6 lg:p-8 xl:p-10 min-h-[calc(100vh-4.5rem)] lg:h-[calc(100svh-5rem)] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full mx-auto flex flex-col h-full">

        <div className="text-center mb-4 lg:mb-6 shrink-0">
          <span className="text-[#d4af37] font-mono text-[10px] tracking-[0.3em] uppercase block mb-1.5">How It Works</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#101014]">
            Your Relocation <span className="text-[#d4af37] italic">Journey</span>
          </h2>
        </div>

        <div
          className="flex flex-col lg:flex-row flex-1 min-h-0 w-full gap-4 lg:gap-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left — Steps Timeline */}
          <div className="w-full lg:w-[42%] bg-white rounded-[2rem] p-5 md:p-7 lg:p-8 xl:p-10 border border-black/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex flex-col justify-center overflow-hidden relative">
            
            {/* Decorative vertical line */}
            <div className="absolute left-[2.1rem] md:left-[2.6rem] lg:left-[3rem] top-[15%] bottom-[15%] w-[2px] bg-gradient-to-b from-transparent via-black/[0.04] to-transparent hidden lg:block" />
            
            {steps.map((step, i) => {
              const isActive = activeStep === i;
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  onClick={() => setActiveStep(i)}
                  animate={{ x: isActive ? 8 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex items-start gap-4 lg:gap-5 p-3 lg:p-4 rounded-2xl cursor-pointer transition-all duration-500 mb-1.5 last:mb-0 relative ${
                    isActive
                      ? "bg-gradient-to-r from-[#faf9f7] to-white shadow-[0_6px_24px_rgba(0,0,0,0.04)]"
                      : "hover:bg-[#faf9f7]/60"
                  }`}
                >
                  {/* Step number + icon */}
                  <div className="flex flex-col items-center gap-1 shrink-0 relative z-10">
                    <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isActive 
                        ? "bg-[#d4af37] text-white shadow-[0_4px_16px_rgba(212,175,55,0.3)] scale-110" 
                        : "bg-[#faf9f7] text-gray-300 border border-black/[0.04]"
                    }`}>
                      <Icon className="w-[18px] h-[18px]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-mono tracking-[0.2em] transition-colors duration-500 ${isActive ? "text-[#d4af37]" : "text-gray-300"}`}>STEP 0{i + 1}</span>
                    </div>
                    <h3 className={`text-sm lg:text-[15px] font-sans font-bold tracking-tight transition-colors duration-500 leading-snug ${
                      isActive ? "text-[#101014]" : "text-gray-400"
                    }`}>{step.title}</h3>
                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="text-gray-400 text-[12px] lg:text-[13px] font-light leading-relaxed overflow-hidden mt-1.5"
                        >
                          {step.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="stepIndicator"
                      className="absolute right-0 top-[20%] bottom-[20%] w-[3px] rounded-full bg-[#d4af37]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right — Cinematic Image */}
          <div className="w-full lg:w-[58%] relative rounded-[2rem] overflow-hidden min-h-[280px] lg:min-h-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image src={steps[activeStep].image} alt={steps[activeStep].title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 58vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${steps[activeStep].accent} to-transparent opacity-40`} />
              </motion.div>
            </AnimatePresence>

            {/* Floating step title on image */}
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <span className="text-[#d4af37] font-mono text-[10px] tracking-[0.3em] uppercase block mb-1">Step 0{activeStep + 1}</span>
                  <h3 className="text-white font-serif text-2xl lg:text-3xl tracking-tight">{steps[activeStep].title}</h3>
                </motion.div>
              </AnimatePresence>

              {/* Progress bars */}
              <div className="flex gap-1.5 mt-4">
                {steps.map((_, i) => (
                  <div key={i} className="flex-1 h-[3px] rounded-full bg-white/15 overflow-hidden">
                    <motion.div
                      className="h-full bg-[#d4af37] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: activeStep === i ? "100%" : activeStep > i ? "100%" : "0%" }}
                      transition={{ duration: activeStep === i && !isPaused ? 5 : 0.3, ease: "linear" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
