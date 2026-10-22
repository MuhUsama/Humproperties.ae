"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bed, Bath, Square } from "lucide-react";
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
      transition={{ delay: Math.min(index % 3, 2) * 0.08 }}
      className="group bg-brand-black overflow-hidden flex flex-col h-full"
    >
      <Link href={`/properties/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.image || "/placeholder-property.jpg"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {developer?.logo && (
          <div className="absolute top-4 left-4 h-9 max-w-[110px] bg-white/95 px-2 py-1.5 flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={developer.logo} alt={developer.name} className="max-h-full max-w-full object-contain" />
          </div>
        )}
      </Link>

      <div className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 flex-grow">
        <div className="min-w-0">
          <h3 className="font-serif text-lg md:text-xl text-white line-clamp-2 mb-2">
            <Link href={`/properties/${property.id}`}>{property.title}</Link>
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mb-3 whitespace-nowrap">
            <span className="flex items-center"><Bed className="w-3.5 h-3.5 mr-1.5" />{property.beds} Beds</span>
            <span className="flex items-center"><Bath className="w-3.5 h-3.5 mr-1.5" />{property.baths} Baths</span>
            <span className="flex items-center"><Square className="w-3.5 h-3.5 mr-1.5" />{formatArea(property.sqft)}</span>
          </div>
          <div className="text-white text-lg font-semibold tracking-wide">{formatPrice(property.price)}</div>
        </div>
        <Link
          href={`/properties/${property.id}`}
          className="flex-shrink-0 text-center border border-white/40 text-white text-xs font-semibold uppercase tracking-[0.15em] px-5 py-3 hover:bg-white hover:text-brand-black transition-colors"
        >
          See property
        </Link>
      </div>
    </motion.div>
  );
}
