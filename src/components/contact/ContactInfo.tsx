"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ExternalLink, ArrowRight, Sparkles, ArrowDownRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useSettings } from "@/context/SettingsContext";

const ContactInfo = memo(function ContactInfo() {
  const { siteInfo } = useSettings();
  const phone = siteInfo?.contact_phone || "+971 (04) 334 1131";
  const email = siteInfo?.contact_email || "info@mfreuae.com";
  const address = siteInfo?.contact_address || "Snooker Point Building, Suite 204\nOud Metha, Dubai, UAE";
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="flex flex-col space-y-4 sm:space-y-6 w-full max-w-5xl mx-auto my-auto justify-center"
    >
      {/* Luxury Section Header */}
      <div className="text-center max-w-xl mx-auto mb-2 sm:mb-4">
        <motion.span variants={fadeInUp} className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-extrabold block mb-1">
          Executive Sanctuary
        </motion.span>
        <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-black mb-2">
          Our Dubai Headquarters
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed">
          Step into our private consultation suites designed for discerning ultra-high-net-worth clientele, where bespoke architectural elegance meets absolute discretion and VIP valet concierge.
        </motion.p>
      </div>

      {/* True Diagonal Positioning Style of Cards (Dramatic Top-Left to Bottom-Right Step) */}
      <div className="relative w-full py-6 sm:py-8">
        
        {/* Visual Diagonal Connector Line & Shimmer in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-1 bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent rotate-12 pointer-events-none hidden md:block"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-44 bg-brand-gold/15 blur-3xl -rotate-12 pointer-events-none"></div>

        {/* Diagonal Center Indicator Badge (Visible on desktop between the cards) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-brand-gold text-brand-black shadow-lg border-2 border-white rotate-12">
          <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
        </div>

        {/* The Asymmetric Diagonal Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 w-full items-center">
          
          {/* Card 1: Office Location (Positioned High & Left: self-start md:-translate-y-8 md:-translate-x-2) */}
          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-b from-[#161a23] via-[#10131a] to-[#0b0d12] text-white p-6 sm:p-7 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/15 relative overflow-hidden group hover:border-brand-gold/80 transition-all duration-500 flex flex-col justify-between w-full self-start md:-translate-y-6 md:-translate-x-2 lg:-translate-y-8 hover:-translate-y-10"
          >
            {/* Diagonal Gold Corner Ribbon */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-bl from-brand-gold/30 via-brand-gold/10 to-transparent rotate-45 transform pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-brand-gold text-brand-black flex items-center justify-center font-bold shadow-md group-hover:scale-105 group-hover:rotate-12 transition-all duration-500 flex-shrink-0">
                  <MapPin className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-3.5 py-1 rounded-full flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  <span>Headquarters</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2 tracking-wide">
                Office Location
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-5 font-light whitespace-pre-line">
                {address}
              </p>
            </div>

            <div className="pt-3.5 border-t border-white/10 relative z-10 w-full">
              <a
                href="https://maps.google.com/?q=Snooker+Point+Building+Oud+Metha+Dubai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full bg-brand-gold hover:bg-white text-brand-black px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Get VIP Directions</span>
                <ExternalLink className="w-3.5 h-3.5 ml-2" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Hotlines & Hours (Positioned Low & Right: self-end md:translate-y-8 md:translate-x-2) */}
          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-b from-[#161a23] via-[#10131a] to-[#0b0d12] text-white p-6 sm:p-7 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-white/15 relative overflow-hidden group hover:border-brand-gold/80 transition-all duration-500 flex flex-col justify-between w-full self-end md:translate-y-6 md:translate-x-2 lg:translate-y-8 hover:translate-y-6"
          >
            {/* Diagonal Gold Corner Ribbon */}
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-brand-gold/30 via-brand-gold/10 to-transparent rotate-45 transform pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-brand-gold text-brand-black flex items-center justify-center font-bold shadow-md group-hover:scale-105 group-hover:-rotate-12 transition-all duration-500 flex-shrink-0">
                  <Phone className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-3.5 py-1 rounded-full">
                  Availability
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2 tracking-wide">
                Hotlines & Hours
              </h3>

              <div className="space-y-2 text-xs sm:text-sm mb-5">
                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-gray-400">Office Line</span>
                  <a href={`tel:${phone}`} className="font-extrabold text-white hover:text-brand-gold transition-colors text-sm sm:text-base">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-gray-400">Mon – Fri</span>
                  <span className="font-bold text-white text-[11px] sm:text-xs bg-white/10 px-2.5 py-0.5 rounded-md">9:00 AM – 6:30 PM</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-gray-400">Sun & Holidays</span>
                  <span className="font-extrabold text-brand-black bg-brand-gold px-2.5 py-0.5 rounded-full text-[11px] shadow-sm">By Appointment</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-white/10 relative z-10 w-full">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-between w-full bg-white/10 hover:bg-white hover:text-brand-black text-white px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 border border-white/20 group-hover:border-white shadow-md hover:-translate-y-0.5"
              >
                <span className="flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-2 text-brand-gold group-hover:text-brand-black transition-colors" />
                  <span>{email}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
});

export default ContactInfo;
