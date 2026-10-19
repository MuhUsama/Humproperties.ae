"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const valuesData = [
  {
    num: "01",
    tag: "HALLMARK I",
    title: "T R U S T",
    subtitle: "Absolute Transparency",
    desc: "Trust is our cornerstone. We operate with complete transparency, discretion, and flawless follow-through to protect our principals."
  },
  {
    num: "02",
    tag: "HALLMARK II",
    title: "E X P E R T I S E",
    subtitle: "25+ Years Authority",
    desc: "With over two decades of direct developer relationships, our team simplifies complex acquisitions and guides clients with foresight."
  },
  {
    num: "03",
    tag: "HALLMARK III",
    title: "L O Y A L T Y",
    subtitle: "Enduring Relationships",
    desc: "We prioritize generational relationships over transactions. Our dedication remains invested in your portfolio's long-term success."
  },
  {
    num: "04",
    tag: "HALLMARK IV",
    title: "I N T E G R I T Y",
    subtitle: "Uncompromising Governance",
    desc: "Integrity dictates every decision. We uphold strict Dubai Land Department governance and safeguard client capital at every turn."
  }
];

const AboutPhilosophy = memo(function AboutPhilosophy() {
  return (
    <section className="w-full h-[calc(100vh-4.5rem)] sm:h-[calc(100svh-5rem)] bg-[#faf9f7] text-[#101014] flex flex-col justify-between sm:justify-center py-5 sm:py-10 border-t border-gray-300 relative overflow-hidden">
      {/* Subtle architectural grid lines background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="w-full px-4 sm:px-8 lg:px-16 flex flex-col justify-between sm:justify-center h-full relative z-10"
      >
        {/* Editorial Section Header - Compact for 1-Screen Frame */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-gray-300 pb-3 sm:pb-6 mb-3 sm:mb-10 shrink-0 gap-2 sm:gap-3"
        >
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="w-6 sm:w-8 h-[2px] bg-[#d4af37]"></span>
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                03 / INSTITUTIONAL HALLMARKS
              </span>
            </div>
            <h2 className="text-lg sm:text-4xl lg:text-5xl font-serif font-normal text-[#101014] tracking-tight">
              Our Core <span className="italic font-light text-[#d4af37]">Company Values</span>.
            </h2>
          </div>
          <span className="text-[9px] sm:text-xs font-mono uppercase tracking-widest text-gray-500 font-semibold">
            [ FOUR PILLARS OF SOVEREIGN ADVISORY ]
          </span>
        </motion.div>

        {/* Sculptural Architectural Pillars fitting inside 1 screen frame with adjustable flexible height */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 flex-1 sm:flex-none min-h-0">
          {valuesData.map((val) => (
            <motion.div
              key={val.num}
              variants={fadeInUp}
              className="group bg-white border border-gray-200 hover:border-[#d4af37] rounded-xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-7 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full min-h-0"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#d4af37] transition-colors duration-300"></div>

              <div className="flex flex-col justify-between flex-1">
                <div>
                  {/* Top Sculptural Number & Tag */}
                  <div className="flex items-start justify-between mb-2 sm:mb-5">
                    <span className="text-xl sm:text-3xl lg:text-4xl font-serif font-light text-gray-300 group-hover:text-[#d4af37] transition-colors">
                      {val.num}
                    </span>
                    <span className="hidden sm:inline text-[9px] font-mono font-semibold uppercase tracking-widest text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                      {val.tag}
                    </span>
                  </div>

                  {/* Core Value Title */}
                  <h3 className="text-sm sm:text-lg lg:text-xl font-serif font-bold text-[#101014] tracking-[0.15em] mb-1 sm:mb-2 group-hover:text-[#d4af37] transition-colors">
                    {val.title}
                  </h3>

                  <h4 className="text-[10px] sm:text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 sm:mb-3">
                    {val.subtitle}
                  </h4>

                  <div className="w-8 sm:w-8 h-[1px] bg-[#d4af37]/60 mb-2 sm:mb-3"></div>
                </div>

                <p className="text-xs sm:text-xs lg:text-sm text-gray-600 font-sans font-light leading-relaxed my-auto py-1 sm:py-0 line-clamp-none sm:line-clamp-3">
                  {val.desc}
                </p>
              </div>

              {/* Bottom Architectural Signature */}
              <div className="pt-3 sm:pt-4 mt-2 sm:mt-4 border-t border-gray-100 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-gray-400">
                <span>STANDARD</span>
                <span className="text-[#d4af37] font-semibold">VERIFIED ◆</span>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
});

export default AboutPhilosophy;
