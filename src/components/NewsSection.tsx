"use client";

import { memo, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

// Type definition for News items
type NewsItem = {
  id: number;
  title: string;
  snippet: string;
  date: string;
  image: string;
  source: string;
  link: string;
};

const NewsSection = memo(function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live news from our API route
  useEffect(() => {
    const controller = new AbortController();
    async function fetchNews() {
      try {
        const res = await fetch('/api/news', { signal: controller.signal });
        const data = await res.json();
        if (data.news) {
          setNews(data.news);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error("Failed to fetch news:", error.message || error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
    return () => controller.abort();
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic for mobile viewing
  useEffect(() => {
    const scrollTimer = setInterval(() => {
      if (window.innerWidth < 768 && scrollRef.current) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const scrollAmount = (container.firstElementChild?.clientWidth || container.clientWidth) + 24;
        
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
    }, 5000);

    return () => clearInterval(scrollTimer);
  }, []);

  return (
    <section className="h-[calc(100svh-5rem)] flex flex-col md:h-auto md:block py-4 sm:py-8 md:py-32 bg-[#faf9f7] relative overflow-hidden border-t border-gray-200/50">
      <div className="w-full mx-auto px-0 md:px-6 lg:px-12 relative z-10 flex flex-col flex-1 min-h-0 md:block">
        
        <div className="flex flex-col mb-6 md:mb-16 px-6 md:px-0 flex-shrink-0">
          <div className="flex items-start justify-between w-full">
            <div className="max-w-2xl">
              <motion.span variants={fadeInUp} className="text-[#C4A259] font-sans text-xs md:text-sm uppercase tracking-widest font-bold block mb-2 md:mb-4">
                Market Intelligence
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-heading font-bold text-brand-black mb-4 md:mb-6 pr-4">
                Latest Market News
              </motion.h2>
            </div>
            
            {/* Desktop Button */}
            <motion.div variants={fadeInUp} className="hidden md:flex flex-shrink-0 ml-4">
              <a 
                href="https://news.google.com/search?q=Dubai%20real%20estate%20luxury&hl=en-US&gl=US&ceid=US%3Aen" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-3 px-8 py-3.5 bg-brand-black text-white hover:bg-[#C4A259] hover:text-white rounded-full font-heading font-bold uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-xs">View All News</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>

            {/* Mobile Link */}
            <motion.div variants={fadeInUp} className="flex md:hidden flex-shrink-0 mt-1">
              <a 
                href="https://news.google.com/search?q=Dubai%20real%20estate%20luxury&hl=en-US&gl=US&ceid=US%3Aen"
                target="_blank"
                rel="noopener noreferrer" 
                className="text-[#C4A259] font-bold text-[10px] uppercase tracking-widest flex items-center border-b border-[#C4A259] pb-0.5"
              >
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </a>
            </motion.div>
          </div>
          
          <motion.p variants={fadeInUp} className="text-gray-600 text-sm md:text-lg font-light leading-relaxed max-w-2xl">
            Stay informed with live updates, exclusive insights, and market trends shaping the future of luxury real estate in the UAE.
          </motion.p>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="flex overflow-x-auto gap-4 px-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:px-0 flex-1 min-h-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-[0_0_85vw] md:flex-auto rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="w-20 h-3 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="w-full h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-200 rounded mb-2 animate-pulse mt-auto"></div>
                  <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <motion.div 
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:px-0 flex-1 min-h-0 pb-4 [&::-webkit-scrollbar]:hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {news.slice(0, 4).map((item) => (
              <motion.a 
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp} 
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex-[0_0_85vw] snap-center md:flex-auto h-full"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-gray-50">
                  <motion.img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle overlay for contrast */}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Floating Source Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest text-brand-black uppercase shadow-sm">
                      {item.source}
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="flex items-center text-gray-400 mb-3">
                    <Calendar className="w-3.5 h-3.5 mr-2" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{item.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-heading font-bold text-brand-black mb-3 leading-snug group-hover:text-[#C4A259] transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-500 font-light text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {item.snippet}
                  </p>

                  <div className="flex items-center text-xs font-bold uppercase tracking-widest text-brand-black group-hover:text-[#C4A259] transition-colors mt-auto pt-4 border-t border-gray-100">
                    Read Article <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        ) : null}

        
      </div>
    </section>
  );
});

export default NewsSection;
