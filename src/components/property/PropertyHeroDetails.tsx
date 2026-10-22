"use client";

import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";
import { Bed, Bath, Square, MapPin, Share2, Check, ArrowLeft, Phone, MessageCircle } from "lucide-react";

export type HeroOptionProps = {
  property: {
    id: string;
    title: string;
    price: string;
    location: string;
    beds: number;
    baths: number;
    sqft: string;
    status?: string;
  };
  galleryImages: string[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  openZoom: (i: number) => void;
  formatPrice: (p: string) => string;
  formatArea: (a: string) => string;
  onShare: () => void;
  copied: boolean;
};

const unopt = (src?: string) => !!src?.startsWith("/uploads/");

function TopBar({ onShare, copied }: Pick<HeroOptionProps, "onShare" | "copied">) {
  return (
    <div className="flex items-center justify-between mb-5">
      <a href="/buy" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-brand-black transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to properties
      </a>
      <button onClick={onShare} type="button" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-brand-black transition-colors">
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
        {copied ? "Copied" : "Share"}
      </button>
    </div>
  );
}

// Property page header: photo + thumbnails on the left, sticky details card with enquiry buttons on the right
export default function PropertyHeroDetails(p: HeroOptionProps) {
  const { property, galleryImages, activeIndex, setActiveIndex, openZoom, formatPrice, formatArea } = p;
  const { siteInfo } = useSettings();
  const whatsappNumber = (siteInfo?.contact_phone || "+971 (04) 334 1131").replace(/[^0-9]/g, "");
  const whatsappText = encodeURIComponent(`Hello HUM Properties, I'm interested in ${property.title} (${property.location}).`);
  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6 pb-8 bg-[#faf9f7]">
      <TopBar onShare={p.onShare} copied={p.copied} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 items-start">
        <div>
          <button onClick={() => openZoom(activeIndex)} className="relative block w-full aspect-[16/10] rounded-3xl overflow-hidden group">
            <Image src={galleryImages[activeIndex]} alt={property.title} fill priority sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized={unopt(galleryImages[activeIndex])} />
            <span className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold">{activeIndex + 1} / {galleryImages.length}</span>
          </button>
          <div className="grid grid-cols-5 gap-2 md:gap-3 mt-3">
            {galleryImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${i === activeIndex ? "border-brand-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <Image src={src} alt="" fill sizes="20vw" className="object-cover" unoptimized={unopt(src)} />
              </button>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 bg-white rounded-3xl border border-gray-100 shadow-[0_15px_35px_rgba(0,0,0,0.06)] p-6 md:p-8">
          <span className="inline-block bg-brand-gold/15 text-brand-gold px-3 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full mb-4">{property.status}</span>
          <h1 className="text-2xl md:text-4xl font-serif text-brand-black mb-2">{property.title}</h1>
          <p className="flex items-center gap-1.5 text-gray-500 mb-6"><MapPin className="w-4 h-4 text-brand-gold" />{property.location}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Price</p>
          <p className="text-3xl md:text-4xl font-serif text-brand-gold mb-6">{formatPrice(property.price)}</p>
          <div className="grid grid-cols-3 gap-3 py-5 border-y border-gray-100 mb-6 text-center">
            <div><Bed className="w-5 h-5 text-brand-gold mx-auto mb-1" /><p className="font-serif text-xl text-brand-black">{property.beds}</p><p className="text-[10px] uppercase tracking-wider text-gray-400">Beds</p></div>
            <div><Bath className="w-5 h-5 text-brand-gold mx-auto mb-1" /><p className="font-serif text-xl text-brand-black">{property.baths}</p><p className="text-[10px] uppercase tracking-wider text-gray-400">Baths</p></div>
            <div><Square className="w-5 h-5 text-brand-gold mx-auto mb-1" /><p className="font-serif text-xl text-brand-black truncate">{formatArea(property.sqft)}</p><p className="text-[10px] uppercase tracking-wider text-gray-400">Area</p></div>
          </div>
          <a
            href="#consultation-desk"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("consultation-desk")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="flex items-center justify-center gap-2 w-full bg-brand-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-black transition-colors mb-3">
            <Phone className="w-4 h-4" /> Enquire Now
          </a>
          <a href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full border border-gray-200 text-brand-black py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:border-brand-black transition-colors">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </aside>
      </div>
    </section>
  );
}
