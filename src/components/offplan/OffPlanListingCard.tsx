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

// Same card as the Buy page, so off plan listings look like the rest of the site
export default function OffPlanListingCard({
  property,
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
      transition={{ delay: Math.min(index, 6) * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      <Link href={`/properties/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brand-black text-xs font-bold rounded-full uppercase tracking-wider">
            {property.status}
          </span>
          {property.category && (
            <span className="px-3 py-1 bg-brand-gold/90 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider">
              {property.category}
            </span>
          )}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.image || "/placeholder-property.jpg"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-serif text-xl text-brand-black line-clamp-1 group-hover:text-brand-gold transition-colors">
            <Link href={`/properties/${property.id}`}>
              {property.title}
            </Link>
          </h3>
        </div>

        <div className="flex items-center text-gray-500 mb-4 text-sm">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{property.location}{property.city ? `, ${property.city}` : ""}</span>
        </div>

        <div className="text-2xl font-bold text-brand-gold mb-6">
          {formatPrice(property.price)}
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
