"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

interface UnderConstructionProps {
  content?: {
    title?: string | null;
    message?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  } | null;
}

export default function UnderConstructionView({ content }: UnderConstructionProps) {
  const phone = content?.phone || "+971 (04) 334 1131";
  const email = content?.email || "info@mfreuae.com";
  const address = content?.address || "Snooker Point Building, Suite 204\nOud Metha, Dubai, United Arab Emirates";
  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  return (
    <main className="min-h-[100dvh] w-full relative flex items-center justify-center overflow-x-hidden overflow-y-auto bg-brand-black py-12 sm:py-0 font-sans selection:bg-brand-gold selection:text-brand-black">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-black/80 z-10"></div>
        <Image
          src="/hero_poster.jpg"
          alt="Dubai Luxury Real Estate"
          fill
          className="object-cover opacity-40"
          priority
        />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 z-20" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
            backgroundSize: '40px 40px', 
            opacity: 0.2 
          }}
        ></div>
      </div>



      <div className="container mx-auto px-6 relative z-30 flex flex-col items-center">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 sm:mb-8"
        >
          <Image
            src="/logo-hum-transparent.png"
            alt="HUM Properties Logo"
            width={280}
            height={110}
            className="w-auto h-20 sm:h-28 object-contain drop-shadow-md"
          />
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-3xl mb-8 sm:mb-12"
        >
          <div className="inline-block mb-4">
            <span className="text-brand-gold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm font-semibold border border-brand-gold/30 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-brand-gold/10 backdrop-blur-sm">
              Under Construction
            </span>
          </div>

          {content?.title && content.title !== "Something Extraordinary is Coming Soon" ? (
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 sm:mb-6 tracking-tight">
              {content.title}
            </h1>
          ) : (
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold">Extraordinary</span><br />
              is Coming Soon
            </h1>
          )}

          <p className="text-gray-400 text-sm sm:text-lg font-light leading-relaxed max-w-2xl mx-auto px-4 sm:px-0 hidden sm:block">
            {content?.message || 
              "We are meticulously crafting a new digital experience for MFRE. Our premium selection of Dubai's most exclusive properties will be available shortly."
            }
          </p>
          <p className="text-gray-400 text-sm font-light leading-relaxed max-w-2xl mx-auto px-4 sm:hidden">
            {content?.message || "We are meticulously crafting a new digital experience for MFRE."}
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 w-full max-w-4xl"
        >
          {/* Email */}
          <a 
            href={`mailto:${email}`} 
            className="group flex flex-row md:flex-col items-center md:justify-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-brand-gold/50 transition-all duration-300 text-left md:text-center gap-4 md:gap-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold/20 flex items-center justify-center sm:mb-4 text-brand-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-0 sm:mb-2">Email Us</h3>
              <p className="text-gray-400 group-hover:text-brand-gold transition-colors text-xs sm:text-base">{email}</p>
            </div>
          </a>

          {/* Phone */}
          <a 
            href={`tel:${cleanPhone}`} 
            className="group flex flex-row md:flex-col items-center md:justify-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-brand-gold/50 transition-all duration-300 text-left md:text-center gap-4 md:gap-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold/20 flex items-center justify-center sm:mb-4 text-brand-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-0 sm:mb-2">Call Us</h3>
              <p className="text-gray-400 group-hover:text-brand-gold transition-colors text-xs sm:text-base">{phone}</p>
            </div>
          </a>

          {/* Address */}
          <a 
            href="https://maps.google.com/?q=Snooker+Point+Building,+Oud+Metha,+Dubai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex flex-row md:flex-col items-center md:justify-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-brand-gold/50 transition-all duration-300 text-left md:text-center gap-4 md:gap-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold/20 flex items-center justify-center sm:mb-4 text-brand-gold group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-0 sm:mb-2">Visit Us</h3>
              <p className="text-gray-400 group-hover:text-brand-gold transition-colors text-[10px] sm:text-sm leading-snug">
                Snooker Point Building, Suite 204<br className="hidden sm:block" />
                <span className="sm:hidden">, </span>Oud Metha, Dubai, United Arab Emirates
              </p>
            </div>
          </a>
        </motion.div>
        
        {/* Simple Footer/Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 text-gray-500 text-xs sm:text-sm text-center"
        >
          &copy; {new Date().getFullYear()} MFRE. All rights reserved.
        </motion.div>
      </div>
    </main>
  );
}
