"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";

export default function ManagementCTA() {
  const { siteInfo } = useSettings();
  const email = siteInfo?.contact_email || "info@mfreuae.com";
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    portfolioSize: "1-3 Units"
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
        inquiryType: `Property Management`,
        message: `Portfolio Size: ${formData.portfolioSize}`
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
        
        toast.success("Inquiry submitted. Our management team will contact you shortly.");
        setFormData({ name: "", contact: "", portfolioSize: "1-3 Units" });
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
    <section className="relative w-full h-[calc(100vh-4.5rem)] min-h-[700px] bg-[#101014] overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
      
      {/* Full Bleed Cinematic Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/services-assets/managementcta/managementcta-1.webp"
          alt="Luxury Lobby"
          fill
          className="object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-[3s]"
        />
        {/* Radial vignette to focus the center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#101014_100%)] opacity-90" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Massive Background Typography */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden">
        <motion.h2 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.05 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-[15vw] font-serif text-white tracking-tighter leading-none whitespace-nowrap"
        >
          DELEGATE.
        </motion.h2>
      </div>

      {/* Immersive Centered Form */}
      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 flex flex-col items-center">
        
        <div className="text-center mb-16">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif text-white tracking-tight mb-4"
          >
            Transfer the Operational Burden
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 font-light text-base md:text-lg max-w-xl mx-auto"
          >
            Initiate a confidential dialogue with our dedicated asset managers to maximize your real estate portfolio&apos;s potential.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            
            {/* 2-Column Inputs for wide screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  placeholder="Full Name"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white font-serif text-xl focus:outline-none focus:border-[#d4af37] transition-colors placeholder:text-gray-500"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={formData.contact}
                  placeholder="Email or Phone Number"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white font-serif text-xl focus:outline-none focus:border-[#d4af37] transition-colors placeholder:text-gray-500"
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
              
              {/* Portfolio Size Selector */}
              <div className="flex flex-col gap-3">
                <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Portfolio Size</span>
                <div className="flex gap-4 flex-wrap">
                  {["1-3 Units", "4-10 Units", "10+ Units", "Entire Building"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({...formData, portfolioSize: option})}
                      className={`pb-1 border-b-2 font-sans font-medium text-xs uppercase tracking-widest transition-all duration-300 ${
                        formData.portfolioSize === option 
                          ? 'border-white text-white' 
                          : 'border-transparent text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="group flex items-center justify-center gap-4 bg-white text-[#101014] px-8 py-4 rounded-full font-serif text-lg hover:bg-[#d4af37] hover:text-white transition-all duration-300 flex-shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Request Audit"}
                {!isSubmitting && <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
              </button>

            </div>
          </form>
        </motion.div>

      </div>

    </section>
  );
}
