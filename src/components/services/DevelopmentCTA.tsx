"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";

export default function DevelopmentCTA() {
  const { siteInfo } = useSettings();
  const email = siteInfo?.contact_email || "info@mfreuae.com";
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    entity: "",
    projectType: "Commercial"
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
        inquiryType: `Real Estate Development (${formData.projectType})`,
        message: `Entity/Company: ${formData.entity || 'N/A'}\nProject Type: ${formData.projectType}`
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
        
        toast.success("Inquiry submitted. Our development directors will contact you shortly.");
        setFormData({ name: "", contact: "", entity: "", projectType: "Commercial" });
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
    <section className="relative w-full py-24 lg:py-32 bg-[#101014] overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
      
      {/* Structural Tower Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/services-assets/developmentcta/developmentcta-1.webp"
          alt="Luxury Skyscraper"
          fill
          className="object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-[5s] object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Side Typography */}
        <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <span className="flex items-center gap-2 text-[#d4af37] font-mono text-[10px] tracking-[0.3em] uppercase mb-6 border border-[#d4af37]/30 rounded-full px-4 py-2 w-fit">
              <ShieldCheck className="w-3 h-3" />
              Private Inquiry
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white tracking-tighter leading-[1.05] mb-6">
              Commission <br/>
              <span className="text-gray-400 italic font-light">The Extraordinary.</span>
            </h2>
            <p className="text-gray-400 font-light text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 border-l border-white/20 pl-6">
              Initiate a confidential dialogue with our development directors to evaluate land acquisition, architectural feasibility, and structural execution of your next landmark project.
            </p>
          </motion.div>
        </div>

        {/* Right Side Dossier Form */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="w-full lg:w-1/2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            <div className="flex flex-col gap-6">
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  placeholder="Principal Name"
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] focus:bg-black/60 transition-colors"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.entity}
                  placeholder="Entity / Company Name (Optional)"
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] focus:bg-black/60 transition-colors"
                  onChange={(e) => setFormData({...formData, entity: e.target.value})}
                />
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={formData.contact}
                  placeholder="Private Contact (Phone or Email)"
                  className="w-full bg-black/40 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] focus:bg-black/60 transition-colors"
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">Development Sector</span>
              <div className="grid grid-cols-2 gap-3">
                {["Residential", "Commercial", "Mixed-Use", "Hospitality"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({...formData, projectType: option})}
                    className={`py-3 rounded-lg border text-xs tracking-wider transition-all duration-300 ${
                      formData.projectType === option 
                        ? 'bg-[#d4af37] border-[#d4af37] text-[#101014] font-semibold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                        : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#d4af37] text-[#101014] font-semibold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-white transition-colors group mt-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Submit Confidential Dossier"}
              {!isSubmitting && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
            </button>

            <p className="text-center text-gray-500 text-[10px] uppercase tracking-widest mt-2">
              Strictly Confidential
            </p>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
