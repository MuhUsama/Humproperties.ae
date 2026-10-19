"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { ArrowRight, Calculator } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";

export default function MortgageCTA() {
  const { siteInfo } = useSettings();
  const email = siteInfo?.contact_email || "info@mfreuae.com";
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    propertyValue: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: formData.name,
        email: formData.contact.includes('@') ? formData.contact : '',
        phone: !formData.contact.includes('@') ? formData.contact : '',
        inquiryType: "Mortgage Services",
        message: `Property Value: ${formData.propertyValue || 'N/A'}`
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        try {
          await fetch(`https://formsubmit.co/ajax/${email}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              Name: payload.name,
              Email: payload.email || "N/A",
              Phone: payload.phone || "N/A",
              "Consultation Subject": payload.inquiryType,
              Message: payload.message,
              _subject: `New Lead (${payload.inquiryType}): Mohd. Alfalasi Real Estate`
            })
          });
        } catch (emailErr) {
          console.error("Notice: FormSubmit email delivery error:", emailErr);
        }
        
        toast.success("Consultation request submitted. Our mortgage advisory team will contact you shortly.");
        setFormData({ name: "", contact: "", propertyValue: "" });
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full h-[calc(100svh-5rem)] flex flex-col items-center justify-center overflow-hidden bg-[#101014]">
      {/* Full Bleed Cinematic Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/services-assets/mortgagecta/mortgagecta-1.webp"
          alt="Luxury Mortgage"
          fill
          className="object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-[3s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/80 to-[#101014]/40" />
        <div className="absolute inset-0 bg-[#101014]/50" />
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="relative z-10 w-full max-w-7xl mx-auto px-5 py-4 md:py-8 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-16 h-full lg:h-auto overflow-y-auto lg:overflow-visible no-scrollbar"
      >
        <div className="lg:w-[55%] flex flex-col items-start text-left mt-auto lg:mt-0 pt-4 lg:pt-0">
          <div className="inline-flex items-center space-x-3 mb-4 lg:mb-8">
            <div className="w-8 lg:w-12 h-[1px] bg-[#d4af37]"></div>
            <span className="text-[#d4af37] font-mono tracking-widest uppercase text-xs lg:text-sm font-semibold">Start Today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4.5rem] font-serif text-white font-bold mb-3 lg:mb-8 leading-[1.1] tracking-tight">
            Embark on Your <br/>
            <span className="text-white/60 italic font-light">Property Journey</span>
          </h2>
          
          <p className="text-gray-300 text-sm sm:text-base lg:text-xl max-w-lg font-light leading-relaxed hidden sm:block">
            Whether you're purchasing your first home or expanding your investment portfolio, our expert advisory team is here to guide you with absolute discretion and secure the most favorable rates.
          </p>
          <p className="text-gray-300 text-sm max-w-lg font-light leading-relaxed sm:hidden">
            Expert guidance to secure favorable mortgage rates.
          </p>
        </div>

        <div className="lg:w-[45%] w-full flex justify-center lg:justify-end mb-auto lg:mb-0 pb-4 lg:pb-0">
           <div className="bg-white/5 backdrop-blur-xl rounded-[1.5rem] lg:rounded-[2rem] p-5 sm:p-6 lg:p-12 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),0_0_40px_rgba(212,175,55,0.15)] w-full max-w-md relative overflow-hidden">
             {/* Subtle Gold Flare inside card */}
             <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#d4af37]/20 rounded-full blur-3xl"></div>

             <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-8 relative z-10">
               <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                 <Calculator className="w-4 h-4 lg:w-5 lg:h-5 text-[#d4af37]" />
               </div>
               <h3 className="text-xl lg:text-2xl font-serif text-white font-bold">Ready to begin?</h3>
             </div>
             
             <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:gap-5 relative z-10">
                <div>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg lg:rounded-xl px-4 py-3 lg:py-4 text-sm lg:text-base text-white font-sans focus:outline-none focus:border-[#d4af37] focus:bg-white/10 transition-colors placeholder:text-gray-500"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    required
                    value={formData.contact}
                    placeholder="Phone or Email"
                    className="w-full bg-white/5 border border-white/10 rounded-lg lg:rounded-xl px-4 py-3 lg:py-4 text-sm lg:text-base text-white font-sans focus:outline-none focus:border-[#d4af37] focus:bg-white/10 transition-colors placeholder:text-gray-500"
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    value={formData.propertyValue}
                    placeholder="Property Value (AED)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg lg:rounded-xl px-4 py-3 lg:py-4 text-sm lg:text-base text-white font-sans focus:outline-none focus:border-[#d4af37] focus:bg-white/10 transition-colors placeholder:text-gray-500"
                    onChange={(e) => setFormData({...formData, propertyValue: e.target.value})}
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1 lg:mt-2 group flex items-center justify-center gap-2 lg:gap-3 bg-[#d4af37] hover:bg-white text-[#101014] font-semibold text-base lg:text-lg py-3 lg:py-4 rounded-lg lg:rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Speak with an Advisor"}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:translate-x-1" />}
                </button>
             </form>
             <p className="text-center text-gray-500 text-[10px] lg:text-xs mt-3 lg:mt-6 relative z-10">
               Your information is kept strictly confidential.
             </p>
           </div>
        </div>

      </motion.div>
    </section>
  );
}
