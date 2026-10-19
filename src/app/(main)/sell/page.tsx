"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, TrendingUp, ShieldCheck, Users, ChevronDown, CheckCircle2 } from "lucide-react";
import ValuationForm from "@/components/sell/ValuationForm";
import Link from "next/link";
import FaqSection from "@/components/common/FaqSection";
import { getFaqsByCategory } from "@/lib/faqData";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const valueProps = [
  {
    icon: <Globe className="w-8 h-8 text-[#d4af37]" />,
    title: "Global Exposure",
    desc: "Your property is marketed to a curated database of ultra-high-net-worth individuals across the globe."
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-[#d4af37]" />,
    title: "Data-Driven Valuation",
    desc: "We utilize real-time Dubai Land Department data combined with our proprietary market analysis for pinpoint accuracy."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#d4af37]" />,
    title: "Discreet & Secure",
    desc: "For off-market listings, we ensure absolute confidentiality, dealing only with vetted and qualified buyers."
  },
  {
    icon: <Users className="w-8 h-8 text-[#d4af37]" />,
    title: "Bespoke Marketing",
    desc: "From cinematic video tours to private VIP viewing events, we tailor the marketing strategy to your asset."
  }
];

const processSteps = [
  {
    step: "01",
    title: "Expert Valuation",
    desc: "A senior consultant visits your property to provide a comprehensive market appraisal and strategy."
  },
  {
    step: "02",
    title: "Premium Media",
    desc: "Our in-house production team captures architectural photography and cinematic video tours."
  },
  {
    step: "03",
    title: "Targeted Marketing",
    desc: "The property is launched across our premium channels and pitched to our exclusive investor network."
  },
  {
    step: "04",
    title: "Seamless Closing",
    desc: "We negotiate the highest possible yield and handle all conveyancing for a frictionless transfer."
  }
];

export default function SellPage() {
  const sellFaqs = getFaqsByCategory('sell');

  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    document.getElementById("valuation-form")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Mobile carousel auto-scroll
    const scrollTimer = setInterval(() => {
      if (window.innerWidth < 768 && mobileScrollRef.current) {
        const container = mobileScrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const scrollAmount = container.firstElementChild?.clientWidth || container.clientWidth;
        
        if (maxScroll > 0) {
          if (container.scrollLeft >= maxScroll - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            const currentIndex = Math.round(container.scrollLeft / scrollAmount);
            const targetScroll = (currentIndex + 1) * scrollAmount;
            container.scrollTo({ left: targetScroll, behavior: 'smooth' });
          }
        }
      }
    }, 4000);

    return () => clearInterval(scrollTimer);
  }, []);

  return (
    <main className="min-h-screen bg-[#faf9f7] pt-20 text-[#101014] overflow-x-hidden w-full">
      
      {/* Hero Section */}
      <section className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center min-h-[calc(100svh-5rem)] lg:h-[calc(100svh-5rem)]">
        <div className="relative w-full flex-1 min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-center justify-center text-center shadow-none group px-6 py-12 md:px-24 md:py-20 animate-[fadeInUp_0.8s_ease-out_forwards]">
          
          {/* Background Image & Overlays */}
          <motion.div className="absolute inset-0 w-full h-full scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out z-0">
            <img 
              src="/page-assets/sell/sell-1.webp" 
              alt="Dubai Skyline" 
              className="w-full h-full object-cover rounded-[2rem] md:rounded-[2.5rem]"
            />
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10"></div>
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <p className="text-brand-gold font-semibold tracking-[0.2em] text-xs md:text-sm uppercase mb-3 md:mb-4">
                Sell Property
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-md">
                Maximize the Value <br/>
                <span className="text-[#d4af37] italic">of Your Property</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto font-light mb-10 drop-shadow">
                Partner with Dubai's leading luxury real estate consultancy. We deliver unparalleled global reach, bespoke marketing, and record-breaking results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={scrollToForm}
                  className="px-8 py-4 bg-[#d4af37] text-white font-medium tracking-wide hover:bg-[#b5952f] transition-all rounded-full flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(196,162,89,0.3)] hover:-translate-y-1"
                >
                  Get a Free Valuation
                </button>
                <Link href="/contact" className="px-8 py-4 bg-black/30 backdrop-blur-md border border-white/50 text-white font-medium tracking-wide hover:bg-white hover:text-black transition-all rounded-full flex items-center justify-center gap-2 hover:-translate-y-1">
                  Speak to an Expert
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={scrollToForm}
          >
            <ChevronDown className="w-8 h-8 text-white opacity-70" />
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="h-auto min-h-[calc(100svh-5rem)] lg:h-[calc(100svh-5rem)] flex flex-col items-center justify-center py-12 sm:py-8 lg:py-32 bg-white relative w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex flex-col flex-1 min-h-0 justify-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center w-full max-w-3xl mx-auto mb-8 md:mb-16 px-6 flex-shrink-0"
          >
            <h2 className="text-3xl md:text-5xl font-serif mb-4 md:mb-6">Why Sell With Us?</h2>
            <div className="w-20 h-1 bg-[#d4af37] mx-auto mb-4 md:mb-6"></div>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              We don't just list properties; we launch them. Our holistic approach ensures your asset is positioned to command the highest possible market premium.
            </p>
          </motion.div>

          <motion.div 
            ref={mobileScrollRef}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex overflow-x-auto md:overflow-x-visible snap-x snap-mandatory gap-4 px-[7.5vw] md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-10 md:px-6 lg:px-12 w-full pb-8 [&::-webkit-scrollbar]:hidden items-stretch"
          >
            {valueProps.map((prop, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="flex flex-col items-center text-center p-8 md:p-6 rounded-3xl md:rounded-2xl bg-white shadow-lg md:shadow-none hover:shadow-xl md:hover:bg-gray-50 transition-all duration-300 flex-[0_0_85vw] snap-center md:flex-auto h-full justify-center border border-gray-100 md:border-transparent">
                <div className="w-16 h-16 bg-[#faf9f7] rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  {prop.icon}
                </div>
                <h3 className="text-xl font-serif mb-3">{prop.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{prop.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-24 lg:py-32 bg-[#101014] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-5xl font-serif mb-6">The Selling Process</h2>
              <div className="w-20 h-1 bg-[#d4af37] mb-8"></div>
              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                A streamlined, transparent, and highly effective methodology designed to take you from valuation to successful closing with zero stress.
              </p>
              
              <div className="space-y-8">
                {processSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full border border-[#d4af37] text-[#d4af37] flex items-center justify-center font-serif text-lg">
                        {step.step}
                      </div>
                      {idx !== processSteps.length - 1 && (
                        <div className="w-[1px] h-full bg-gray-800 my-2"></div>
                      )}
                    </div>
                    <div className="pb-8">
                      <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src="/page-assets/sell/sell-2.webp" 
                alt="Luxury Property Interior" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-10">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">Proven Track Record</p>
                    <p className="text-gray-300 text-sm">Over AED 2B+ in successful transactions.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valuation Form Section */}
      <section id="valuation-form" className="py-24 lg:py-32 bg-[#faf9f7]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <ValuationForm />
          </motion.div>
        </div>
      </section>

      <FaqSection faqs={sellFaqs} title="Selling Your Property" subtitle="Frequently asked questions about valuations, marketing, and the selling process." />

    </main>
  );
}
