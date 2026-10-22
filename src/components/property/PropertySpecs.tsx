"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useSettings } from "@/context/SettingsContext";
import { UNIT_DETAIL_FIELDS, cleanUnitDetail } from "@/lib/unitDetails";

interface PropertySpecsProps {
  property: {
    id: string;
    title: string;
    location: string;
    beds: number;
    baths: number;
    sqft: string;
    overview?: string;
    specifications?: { title: string; desc: string }[];
    amenities?: { title: string; desc: string }[];
    unitNo?: string | null;
    floor?: string | null;
    unitType?: string | null;
    subType?: string | null;
    view?: string | null;
    internalArea?: string | null;
    externalArea?: string | null;
  };
}

const detailedSpecifications = [
  {
    title: "Double-Height Volume Ceilings",
    desc: "14-foot architectural ceilings engineered for maximum spatial grandeur and natural light gallery acoustics."
  },
  {
    title: "Private Horizon Infinity Pool",
    desc: "Cantilevered heated terrace pool with unobstructed panoramic views over the Dubai skyline."
  },
  {
    title: "Imported Calacatta Marble Floors",
    desc: "Seamless large-format Italian book-matched marble flooring spanning all primary living salons."
  },
  {
    title: "Integrated Crestron Smart Home",
    desc: "Automated climate, architectural lighting, motorized drapery, and biometric security controlled via touch panels."
  },
  {
    title: "Custom Italian Kitchen Cabinetry",
    desc: "Handcrafted Poliform cabinetry paired with professional-grade Gaggenau and Sub-Zero culinary appliances."
  },
  {
    title: "Floor-to-Ceiling Motorized Glass",
    desc: "Acoustic double-glazed motorized glass walls that retract seamlessly to merge indoor and terrace spaces."
  }
];

const detailedPrivileges = [
  {
    title: "Championship PGA Golf Club Access",
    desc: "Priority tee times and private clubhouse privileges at Dubai's most premier PGA championship golf courses."
  },
  {
    title: "Private Deep-Water Yacht Marina",
    desc: "Dedicated VIP marina berth capable of accommodating vessels up to 120 feet with 24/7 shore assistance."
  },
  {
    title: "Gated VIP Sanctuary Perimeter",
    desc: "Multi-tiered biometric security perimeter with private subterranean elevator vestibules and discreet arrival."
  },
  {
    title: "24/7 Dedicated Butler Concierge",
    desc: "Round-the-clock bespoke residential concierge, sommelier service, and private dining arrangements."
  },
  {
    title: "Private Helicopter Landing Pad",
    desc: "Exclusive resident-only helipad access for seamless air transfers to Dubai International Airport."
  },
  {
    title: "Private Residents-Only Beach Club",
    desc: "Direct access to pristine white-sand beachfront, private cabanas, and Michelin-inspired seaside dining."
  }
];

const PropertySpecs = memo(function PropertySpecs({ property }: PropertySpecsProps) {
  const { formatArea } = useSettings();
  const specsToDisplay = property.specifications && property.specifications.length > 0 && property.specifications[0].title.trim() !== "" ? property.specifications : detailedSpecifications;
  // Only unit details the admin actually filled in are shown
  const unitDetails = UNIT_DETAIL_FIELDS.flatMap(({ key, label }) => {
    const value = cleanUnitDetail(property[key]);
    if (!value) return [];
    const isArea = key === "internalArea" || key === "externalArea";
    return [{ key, label: isArea ? label.replace(" (sq.ft)", "") : label, value: isArea ? formatArea(value) : value }];
  });
  const amenitiesToDisplay = property.amenities && property.amenities.length > 0 && property.amenities[0].title.trim() !== "" ? property.amenities : detailedPrivileges;

  return (
    <section 
      id="specifications" 
      className="relative w-full bg-[#faf9f7] text-[#101014] py-16 md:py-24 lg:py-32"
    >
      <div className="w-full mx-auto px-6 lg:px-12">
        
        {/* Top Overview Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-16 md:mb-24"
        >
          <motion.div variants={fadeInUp} className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-5xl font-serif text-[#101014] mb-6">Property Overview</h2>
            <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed whitespace-pre-wrap">
              {property.overview || `Every millimeter of this residence in ${property.location} has been conceptualized for ultra-luxury living. Featuring expansive double-height entertainment salons and motorized glass facades that dissolve the boundaries between indoor acoustic sanctuary and panoramic horizon vistas.`}
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border-l-2 border-[#d4af37] pl-5 py-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Bedrooms</p>
              <p className="text-2xl md:text-3xl font-serif text-[#101014]">{property.beds ?? 4}</p>
            </div>
            <div className="border-l-2 border-[#d4af37] pl-5 py-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Bathrooms</p>
              <p className="text-2xl md:text-3xl font-serif text-[#101014]">{property.baths ?? 5}</p>
            </div>
            <div className="border-l-2 border-[#d4af37] pl-5 py-2">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Area</p>
              <p className="text-2xl md:text-3xl font-serif text-[#101014]">{formatArea(property.sqft || "12,000")}</p>
            </div>
            <div className="border-l-2 border-[#d4af37] pl-5 py-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Status</p>
              <p className="text-2xl md:text-3xl font-serif text-[#101014]">Ready</p>
            </div>
          </motion.div>

          {unitDetails.length > 0 && (
            <motion.div variants={fadeInUp} className="mt-12">
              <h3 className="text-xl md:text-2xl font-serif text-[#101014] mb-6">Unit Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {unitDetails.map((item) => (
                  <div key={item.key} className="border-l-2 border-[#d4af37] pl-5 py-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                    <p className="text-lg md:text-xl font-serif text-[#101014] break-words">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-16 md:mb-24"
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <h3 className="text-2xl md:text-4xl font-serif text-[#101014] mb-4">Master Specifications</h3>
            <div className="w-16 h-1 bg-[#d4af37]"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specsToDisplay.map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="flex flex-col">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
                  <h4 className="text-lg font-serif text-[#101014]">{item.title}</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pl-8">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Amenities Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={fadeInUp} className="mb-10">
            <h3 className="text-2xl md:text-4xl font-serif text-[#101014] mb-4">Exclusive Privileges</h3>
            <div className="w-16 h-1 bg-[#d4af37]"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {amenitiesToDisplay.map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
                <h4 className="text-xl font-serif text-[#101014] mb-3">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
});

export default PropertySpecs;
