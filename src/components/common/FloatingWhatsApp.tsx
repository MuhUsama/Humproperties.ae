"use client";
import React from "react";

export default function FloatingWhatsApp() {
  // Temporarily hidden as requested. Change `isVisible` to `true` to re-enable in the future!
  const isVisible = false;
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex items-center">
      <a
        href="https://wa.me/971043341131?text=Hello%20Mohd.%20Alfalasi%20Real%20Estate,%20I%20would%20like%20to%20inquire%20about%20your%20luxury%20properties."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with our Private WhatsApp Advisory Desk"
        className="relative group flex items-center justify-center"
      >
        {/* Pulsing Outer Ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-75 animate-ping duration-1000 group-hover:opacity-100 transition-opacity"></span>
        <span className="absolute -inset-2 rounded-full bg-[#25D366]/30 animate-pulse duration-2000"></span>

        {/* Main WhatsApp Button */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.5)] border-2 border-white/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </div>

        {/* Sleek Tooltip Label on Hover (Slides out to the left) */}
        <div className="absolute right-full mr-3 opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap bg-brand-black text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xl border border-white/10 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          <span>WhatsApp Concierge</span>
        </div>
      </a>
    </div>
  );
}
