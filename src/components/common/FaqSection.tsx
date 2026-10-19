"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FaqItem } from "@/lib/faqData";

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FaqItem[];
  category?: string;
  theme?: 'dark' | 'light';
}

export default function FaqSection({ 
  title = "Frequently Asked Questions", 
  subtitle = "Everything you need to know about our services and the Dubai real estate market.",
  faqs,
  category,
  theme = 'light'
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [liveFaqs, setLiveFaqs] = useState<FaqItem[]>(faqs);

  React.useEffect(() => {
    setLiveFaqs(faqs);
    const cat = category || (faqs && faqs[0]?.category);
    if (cat) {
      fetch(`/api/faqs?category=${cat}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
            setLiveFaqs(resData.data);
          }
        })
        .catch(() => {});
    }
  }, [category, faqs]);

  if (!liveFaqs || liveFaqs.length === 0) return null;

  const halfLength = Math.ceil(liveFaqs.length / 2);
  const leftFaqs = liveFaqs.slice(0, halfLength);
  const rightFaqs = liveFaqs.slice(halfLength);

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#101014] text-white' : 'bg-[#faf9f7] text-[#101014]';
  const itemBorder = isDark ? 'border-white/10 hover:border-[#d4af37]/30' : 'border-[#101014]/10 hover:border-[#d4af37]/40';
  const itemBg = isDark ? 'bg-white/5 backdrop-blur-sm' : 'bg-white shadow-sm hover:shadow-md';
  const itemBgActive = isDark ? 'bg-gradient-to-br from-white/10 to-white/5 border-[#d4af37]/30' : 'bg-gradient-to-br from-white to-[#faf9f7] border-[#d4af37]/40 shadow-lg';
  const iconColor = isDark ? 'text-[#d4af37]' : 'text-[#d4af37]';
  const answerColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const subtitleColor = isDark ? 'text-gray-400' : 'text-gray-500';

  // Generate JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": liveFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section className={`py-16 md:py-24 relative overflow-hidden ${bgClass}`}>
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <span className="w-8 h-[1px] bg-[#d4af37]"></span>
            <span className="text-[#d4af37] font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">Insights & Clarity</span>
            <span className="w-8 h-[1px] bg-[#d4af37]"></span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 tracking-tight"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed ${subtitleColor}`}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <div className="space-y-4">
            {leftFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
                  className={`border rounded-2xl overflow-hidden transition-all duration-500 group ${isOpen ? itemBgActive : `${itemBg} ${itemBorder}`}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`w-full text-left px-6 py-5 md:py-6 flex items-start justify-between focus:outline-none transition-colors duration-300`}
                    aria-expanded={isOpen}
                  >
                    <span className={`font-serif font-medium text-base md:text-lg pr-8 transition-colors duration-300 ${isOpen ? 'text-[#d4af37]' : ''}`}>
                      {faq.question}
                    </span>
                    <span className={`flex-shrink-0 mt-1 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ease-out ${isOpen ? 'rotate-180 bg-[#d4af37] border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.4)]' : `${itemBorder} group-hover:bg-[#d4af37]/10`}`}>
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-white" />
                      ) : (
                        <Plus className={`w-4 h-4 ${iconColor}`} />
                      )}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className={`px-6 pb-6 pt-0 text-sm md:text-base leading-relaxed font-light ${answerColor}`}>
                          <div className="pt-2 border-t border-gray-500/10 mt-2">
                            {faq.answer}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
          })}
          </div>
          
          <div className="space-y-4">
            {rightFaqs.map((faq, idx) => {
              const index = idx + halfLength;
              const isOpen = openIndex === index;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx) * 0.05, duration: 0.5, ease: "easeOut" }}
                  className={`border rounded-2xl overflow-hidden transition-all duration-500 group h-fit ${isOpen ? itemBgActive : `${itemBg} ${itemBorder}`}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`w-full text-left px-6 py-5 md:py-6 flex items-start justify-between focus:outline-none transition-colors duration-300`}
                    aria-expanded={isOpen}
                  >
                    <span className={`font-serif font-medium text-base md:text-lg pr-8 transition-colors duration-300 ${isOpen ? 'text-[#d4af37]' : ''}`}>
                      {faq.question}
                    </span>
                    <span className={`flex-shrink-0 mt-1 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ease-out ${isOpen ? 'rotate-180 bg-[#d4af37] border-[#d4af37] text-white shadow-[0_0_15px_rgba(212,175,55,0.4)]' : `${itemBorder} group-hover:bg-[#d4af37]/10`}`}>
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-white" />
                      ) : (
                        <Plus className={`w-4 h-4 ${iconColor}`} />
                      )}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className={`px-6 pb-6 pt-0 text-sm md:text-base leading-relaxed font-light ${answerColor}`}>
                          <div className="pt-2 border-t border-gray-500/10 mt-2">
                            {faq.answer}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
