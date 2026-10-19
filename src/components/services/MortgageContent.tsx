"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export default function MortgageContent() {
  return (
    <section className="relative w-full p-5 md:p-10 lg:p-12">
      <div className="text-center mb-12 lg:mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif text-[#101014] tracking-tight mb-4"
        >
          Your Mortgage <span className="text-[#d4af37] italic">Guide</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 max-w-2xl mx-auto font-light"
        >
          Everything you need to know about property financing in the UAE.
        </motion.p>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="w-full relative mx-auto bg-white rounded-[3rem] p-8 md:p-16 lg:p-24 shadow-[0_10px_50px_rgba(0,0,0,0.02)] border border-[#d4af37]/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-12 h-[2px] bg-[#d4af37]"></div>
            <span className="text-[#d4af37] font-mono tracking-widest uppercase text-sm font-semibold">The Ultimate Guide</span>
          </div>

          <div className="prose prose-lg md:prose-xl max-w-none 
            prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#101014] prose-headings:tracking-tight 
            prose-p:text-gray-600 prose-p:font-light prose-p:leading-relaxed 
            prose-li:text-gray-600 prose-li:font-light prose-li:leading-relaxed"
          >
            <p className="text-xl md:text-2xl text-[#101014] font-medium leading-relaxed mb-12">
              There are many reasons why people are attracted to mortgage financing in the United Arab Emirates. First, the UAE is tax-free, with a stable economy and strong currency.
            </p>
            <p>
              Mortgage financing in the UAE can be used to purchase a primary residence, a second home, or an investment property. Various mortgage products are available, including fixed-rate mortgages, adjustable-rate mortgages, and interest-only mortgages.
            </p>

            <h2 className="text-3xl md:text-4xl mt-16 mb-8 flex items-center gap-4">
              <span className="text-[#d4af37] text-4xl">01.</span> What is a Mortgage Loan?
            </h2>
            <p>
              A mortgage loan is a loan secured by a property – typically, a residential property – that the borrower is obliged to pay back, usually for years. The interest rate on a mortgage loan is generally lower than the interest rate on other types of loans because the lender knows that if the borrower defaults, they can sell the property to recoup their money.
            </p>

            <h2 className="text-3xl md:text-4xl mt-16 mb-8 flex items-center gap-4">
              <span className="text-[#d4af37] text-4xl">02.</span> Types of Mortgages
            </h2>
            <p>Many different types of mortgage products are available in the UAE, each with its own benefits. The most popular types of mortgages in the UAE are:</p>
            <ul className="list-none pl-0 space-y-6 mt-8">
              <li className="relative pl-8">
                <span className="absolute left-0 top-3 w-3 h-3 bg-[#d4af37] rounded-full"></span>
                <strong className="text-[#101014]">Fixed-rate mortgages:</strong> Offer stability and certainty, as the interest rate is fixed for the entire loan term.
              </li>
              <li className="relative pl-8">
                <span className="absolute left-0 top-3 w-3 h-3 bg-[#d4af37] rounded-full"></span>
                <strong className="text-[#101014]">Variable rate mortgages:</strong> These products offer more flexibility, as the interest rate can fluctuate over the loan term.
              </li>
              <li className="relative pl-8">
                <span className="absolute left-0 top-3 w-3 h-3 bg-[#d4af37] rounded-full"></span>
                <strong className="text-[#101014]">Tracker mortgages:</strong> These products track the movements of the UAE Central Bank's benchmark interest rate.
              </li>
              <li className="relative pl-8">
                <span className="absolute left-0 top-3 w-3 h-3 bg-[#d4af37] rounded-full"></span>
                <strong className="text-[#101014]">Islamic mortgages:</strong> These products comply with Sharia law and are therefore popular with Muslim borrowers.
              </li>
            </ul>

            <div className="bg-[#faf9f7] rounded-[2rem] p-8 md:p-12 mt-16 border border-[#d4af37]/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-[40px] pointer-events-none"></div>
              <h2 className="text-2xl md:text-3xl mt-0 mb-6 font-serif">Key Terms of Mortgage Finance</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#d4af37] uppercase tracking-widest text-sm">Price</h3>
                  <p className="m-0 text-base">During the mortgage process, the term "price" always refers to the property's value in consideration.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#d4af37] uppercase tracking-widest text-sm">Down Payment</h3>
                  <p className="m-0 text-base">It is the amount that the loan applicant has to pay upfront to acquire the property. The required down payment generally is 15% or more for UAE nationals and 20% or above for expats.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
