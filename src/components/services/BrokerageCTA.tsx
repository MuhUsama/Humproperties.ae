"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";

export default function BrokerageCTA() {
  const { siteInfo } = useSettings();
  const email = siteInfo?.contact_email || "info@mfreuae.com";
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    intent: "Buy"
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
        inquiryType: `Property Brokerage (${formData.intent})`,
        message: `Intent: ${formData.intent}`
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
        
        toast.success("Inquiry submitted. Our private client team will contact you shortly.");
        setFormData({ name: "", contact: "", intent: "Buy" });
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
    <section className="relative w-full h-[calc(100vh-4.5rem)] min-h-[700px] bg-[#101014] flex flex-col md:flex-row overflow-hidden">
      
      {/* Left: Expansive Form & Typography (No Cards) */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-8 lg:px-20 xl:px-32 py-16">
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-12 lg:mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-white tracking-tight leading-none mb-6">
            Let's Talk.
          </h2>
          <p className="text-gray-400 font-light text-base lg:text-lg max-w-md leading-relaxed">
            Initiate a strictly confidential dialogue with our senior partners regarding the acquisition or disposal of prime assets.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="w-full max-w-xl"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 lg:gap-10">
            
            <div className="relative">
              <input 
                type="text" 
                required
                value={formData.name}
                placeholder="Full Name"
                className="w-full bg-transparent border-b border-white/20 py-4 text-white font-serif text-xl md:text-2xl focus:outline-none focus:border-[#d4af37] transition-colors placeholder:text-gray-600"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="relative">
              <input 
                type="text" 
                required
                value={formData.contact}
                placeholder="Email or Phone Number"
                className="w-full bg-transparent border-b border-white/20 py-4 text-white font-serif text-xl md:text-2xl focus:outline-none focus:border-[#d4af37] transition-colors placeholder:text-gray-600"
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <span className="font-sans font-medium text-[10px] uppercase tracking-widest text-gray-500">I am looking to...</span>
              <div className="flex gap-6">
                {["Buy", "Sell", "Off-Market"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({...formData, intent: option})}
                    className={`pb-2 border-b-2 font-sans font-medium text-[11px] md:text-xs uppercase tracking-widest transition-all duration-300 ${
                      formData.intent === option 
                        ? 'border-[#d4af37] text-[#d4af37]' 
                        : 'border-transparent text-gray-500 hover:text-white'
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
              className="group mt-4 inline-flex items-center gap-4 text-white font-serif text-xl hover:text-[#d4af37] transition-colors duration-300 self-start disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Submit Inquiry"}
              {!isSubmitting && <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />}
            </button>
          </form>
        </motion.div>

      </div>

      {/* Right: Full Bleed Image (Expansive, touching edges) */}
      <div className="w-full md:w-1/2 h-[40%] md:h-full relative overflow-hidden hidden md:block">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="w-full h-full relative"
        >
          <Image
            src="/services-assets/brokeragecta/brokeragecta-1.webp"
            alt="Luxury Office"
            fill
            className="object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-[2s]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101014] to-transparent opacity-80" />
        </motion.div>
      </div>

    </section>
  );
}
