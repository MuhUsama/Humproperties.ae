"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export type OffPlanDeveloper = {
  id: string;
  name: string;
  slug: string;
  logo: string;
};

export default function OffPlanListingCard({
  property,
  developer,
  index = 0,
}: {
  property: any;
  developer?: OffPlanDeveloper | null;
  index?: number;
}) {
  const { formatPrice, formatArea } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 6) * 0.08 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      <Link href={`/properties/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-black text-xs font-bold rounded-full uppercase tracking-wider">
            Off Plan
          </span>
          {property.category && (
            <span className="px-3 py-1 bg-brand-gold/90 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider">
              {property.category}
            </span>
          )}
        </div>
        {developer?.logo && (
          <div className="absolute bottom-4 right-4 z-10 h-10 max-w-[110px] bg-white/95 rounded-lg px-2 py-1.5 flex items-center shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={developer.logo} alt={developer.name} className="max-h-full max-w-full object-contain" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.image || "/placeholder-property.jpg"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        {developer && (
          <Link
            href={`/off-plan/${developer.slug}`}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-2 hover:underline w-fit"
          >
            {developer.name}
          </Link>
        )}
        <h3 className="font-serif text-xl text-brand-black line-clamp-1 group-hover:text-brand-gold transition-colors mb-2">
          <Link href={`/properties/${property.id}`}>{property.title}</Link>
        </h3>

        <div className="flex items-center text-gray-500 mb-4 text-sm">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{property.location}{property.city ? `, ${property.city}` : ""}</span>
        </div>

        <div className="mb-6">
          <span className="block text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Starting from</span>
          <span className="text-2xl font-bold text-brand-gold">{formatPrice(property.price)}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1.5 opacity-70" />
            <span>{property.beds}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1.5 opacity-70" />
            <span>{property.baths}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1.5 opacity-70" />
            <span>{formatArea(property.sqft)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
