"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Compass } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

const ContactMap = memo(function ContactMap() {
  return (
    <motion.section
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="min-h-[calc(100svh-5rem)] flex flex-col justify-center items-center py-6 sm:py-8 bg-[#faf9f7] relative border-t border-gray-200/60 w-full"
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-12 w-full max-w-6xl my-auto">
        
        {/* Left-Right Side-by-Side Executive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Side: Information & Address Panel (5 columns on lg+) */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start space-x-1.5 text-brand-gold font-extrabold uppercase tracking-[0.2em] text-[11px] mb-2">
              <Compass className="w-4 h-4 flex-shrink-0" />
              <span>Prime Accessibility</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-black mb-3">
              Visit Our Executive Sanctuary
            </h2>
            
            <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed mb-6">
              Conveniently situated in Oud Metha with dedicated VIP valet parking and private advisory meeting suites.
            </p>

            {/* Luxury Address & Action Card Box */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-[0_15px_35px_rgba(0,0,0,0.05)] text-left">
              <div className="flex items-start space-x-3.5 mb-5">
                <div className="w-12 h-12 rounded-xl bg-brand-black text-brand-gold flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold block">Private Advisory Office</span>
                  <h4 className="font-serif font-bold text-brand-black text-base sm:text-lg mt-0.5">Mohd. Alfalasi Real Estate</h4>
                  <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mt-1">
                    Snooker Point Building, Suite 204<br />
                    Oud Metha, Dubai, United Arab Emirates
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                <a
                  href="https://maps.google.com/?q=Snooker+Point+Building+Oud+Metha+Dubai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#c4a259] hover:bg-[#b08e45] text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl text-center transition-all flex items-center justify-center space-x-2 shadow-sm group"
                >
                  <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  <span>Google Maps</span>
                </a>
                <a
                  href="tel:+971043341131"
                  className="bg-gray-100 hover:bg-brand-black hover:text-white text-brand-black text-xs sm:text-sm font-bold py-3 px-5 rounded-xl text-center transition-colors"
                >
                  Call Desk
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Widescreen Unobstructed Map Embed (7 columns on lg+) */}
          <div className="lg:col-span-7 w-full">
            <div className="h-[300px] sm:h-[380px] lg:h-[440px] w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] border-2 border-white bg-gray-200 relative z-0">
              <iframe
                title="Mohd. Alfalasi Real Estate Office Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.6180373760447!2d55.30889241501174!3d25.23298818387979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43277cb70e17%3A0x7c7c34b17bfb6348!2sOud%20Metha%2C%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sae!4v1710000000000!5m2!1sen!2sae"
                className="w-full h-full border-0 filter contrast-[1.03] saturate-[1.1]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
});

export default ContactMap;
