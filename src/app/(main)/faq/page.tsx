"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search } from "lucide-react";
import { getAllFaqsGrouped, FaqItem } from "@/lib/faqData";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function FAQPage() {
  const [dbFaqs, setDbFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    fetch("/api/faqs?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setDbFaqs(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const groupedFaqs = useMemo(() => {
    const base = getAllFaqsGrouped();
    if (dbFaqs.length === 0) return base;
    const grouped: Record<string, FaqItem[]> = {};
    dbFaqs.forEach((faq) => {
      if (!grouped[faq.category]) {
        grouped[faq.category] = [];
      }
      grouped[faq.category].push(faq);
    });
    return grouped;
  }, [dbFaqs]);

  const categories = Object.keys(groupedFaqs);
  
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || "general");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const formatCategoryName = (cat: string) => {
    return cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Filter FAQs based on active category OR search query
  let displayFaqs: FaqItem[] = [];
  
  if (searchQuery.trim() !== "") {
    // If searching, show matching FAQs from all categories
    categories.forEach(cat => {
      const matches = groupedFaqs[cat].filter(
        faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      displayFaqs = [...displayFaqs, ...matches];
    });
  } else {
    // If not searching, show active category
    displayFaqs = groupedFaqs[activeCategory] || [];
  }

  // Generate JSON-LD for SEO for all FAQs
  const allFaqsFlat = Object.values(groupedFaqs).flat();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqsFlat.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <main className="w-full bg-[#faf9f7] pt-20 min-h-screen flex flex-col">
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 px-6 lg:px-12 bg-brand-black text-white text-center">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.span variants={fadeInUp} className="text-[#d4af37] font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold block mb-4">
            Knowledge Base
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-bold mb-6">
            How can we help you?
          </motion.h1>
          
          {/* Search Bar */}
          <motion.div variants={fadeInUp} className="relative max-w-xl mx-auto mt-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all backdrop-blur-md"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(null); // Reset open accordion on search
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Sidebar Categories (Hide when searching) */}
        {!searchQuery && (
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <div className="sticky top-32">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Categories</h3>
              <nav className="flex flex-col space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setOpenIndex(0);
                    }}
                    className={`text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                      activeCategory === cat 
                        ? 'bg-brand-black text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {formatCategoryName(cat)}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* FAQs List */}
        <div className={`w-full ${searchQuery ? 'max-w-4xl mx-auto' : 'lg:w-3/4'}`}>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-black">
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : formatCategoryName(activeCategory)}
            </h2>
            {searchQuery && displayFaqs.length === 0 && (
              <p className="text-gray-500 mt-4">No questions found matching your search. Please try different keywords.</p>
            )}
          </div>

          <div className="space-y-4">
            {displayFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              
              return (
                <motion.div 
                  key={`${faq.category}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full text-left px-6 py-5 md:py-6 flex items-center justify-between focus:outline-none"
                  >
                    <span className="font-heading font-bold text-base md:text-lg pr-8 text-brand-black">
                      {faq.question}
                    </span>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-brand-gold/10 border-brand-gold/50' : ''}`}>
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-brand-gold" />
                      ) : (
                        <Plus className="w-4 h-4 text-brand-black" />
                      )}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-0 text-sm md:text-base leading-relaxed text-gray-600 border-t border-gray-50 pt-4 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
