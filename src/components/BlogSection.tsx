"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const BlogSection = memo(function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    // Fetch latest 3 blogs
    fetch("/api/blogs")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBlogs(data.slice(0, 3));
      })
      .catch(err => console.error("Error fetching blogs", err));
  }, []);

  if (blogs.length === 0) return null; // Don't show section if no blogs exist yet

  return (
    <section className="h-[calc(100svh-5rem)] flex flex-col md:h-auto md:block py-4 sm:py-8 md:py-32 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="w-full mx-auto px-0 md:px-6 lg:px-12 relative z-10 flex flex-col flex-1 min-h-0 md:block">
        
        <div className="flex flex-col mb-6 md:mb-16 px-6 md:px-0 flex-shrink-0">
          <div className="flex items-start justify-between w-full">
            <div className="max-w-2xl">
              <motion.span variants={fadeInUp} className="text-[#C4A259] font-sans text-xs md:text-sm uppercase tracking-widest font-bold block mb-2 md:mb-4">
                Our Journal
              </motion.span>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-heading font-bold text-brand-black mb-4 md:mb-6 pr-4">
                Exclusive Insights
              </motion.h2>
            </div>
            
            {/* Desktop Button */}
            <motion.div variants={fadeInUp} className="hidden md:flex flex-shrink-0 ml-4">
              <Link 
                href="/blogs" 
                className="inline-flex items-center justify-center space-x-3 px-8 py-3.5 bg-brand-black text-white hover:bg-[#C4A259] hover:text-white rounded-full font-heading font-bold uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-xs">View All Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Mobile Link */}
            <motion.div variants={fadeInUp} className="flex md:hidden flex-shrink-0 mt-1">
              <Link 
                href="/blogs"
                className="text-[#C4A259] font-bold text-[10px] uppercase tracking-widest flex items-center border-b border-[#C4A259] pb-0.5"
              >
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </motion.div>
          </div>
          
          <motion.p variants={fadeInUp} className="text-gray-600 text-sm md:text-lg font-light leading-relaxed max-w-2xl">
            Read original market analyses, buying guides, and expert advice straight from Mohd. Alfalasi.
          </motion.p>
        </div>

        <motion.div 
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 md:grid md:grid-cols-3 md:gap-8 md:px-0 flex-1 min-h-0 pb-4 [&::-webkit-scrollbar]:hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {blogs.map((blog) => (
            <motion.div 
              key={blog.id} 
              variants={fadeInUp} 
              className="group flex flex-col bg-gray-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100 flex-[0_0_85vw] snap-center md:flex-auto h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={blog.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"} 
                  alt={blog.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center space-x-4 mb-4 text-[10px] font-bold tracking-widest uppercase text-gray-400">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span className="w-1 h-1 rounded-full bg-[#C4A259]" />
                  <span>{blog.author}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-brand-black mb-4 leading-snug group-hover:text-[#C4A259] transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-500 font-light text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                  {blog.excerpt}
                </p>
                
                <Link 
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center space-x-2 text-brand-black font-semibold border-b-2 border-brand-black group-hover:border-[#C4A259] group-hover:text-[#C4A259] transition-colors pb-1 w-max"
                >
                  <span className="uppercase tracking-widest text-[10px]">Read Article</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        
      </div>
    </section>
  );
});

export default BlogSection;
