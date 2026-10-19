"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useSettings } from "@/context/SettingsContext";

const servicesList = [
  { 
    id: "services_mortgage",
    title: "Mortgage Services", 
    slug: "mortgage-services", 
    image: "/page-assets/services/services-1.webp",
    desc: "Expert financial guidance and bespoke mortgage solutions tailored for high-net-worth individuals, ensuring seamless acquisition of prime assets." 
  },
  { 
    id: "services_relocation",
    title: "Relocation Services", 
    slug: "relocation-services", 
    image: "/page-assets/services/services-2.webp",
    desc: "Comprehensive end-to-end relocation assistance, providing a seamless transition to your new luxury residence in Dubai with absolute discretion." 
  },
  { 
    id: "services_management",
    title: "Property Management", 
    slug: "property-management", 
    image: "/page-assets/services/services-3.webp",
    desc: "Elite management of your premium real estate portfolio, maximizing yields while maintaining your properties in pristine, turnkey condition." 
  },
  { 
    id: "services_brokerage",
    title: "Property Brokerage", 
    slug: "property-brokerage", 
    image: "/page-assets/services/services-4.webp",
    desc: "Exclusive access to off-market luxury listings and unparalleled advisory in elite property transactions and strategic acquisitions." 
  },
  { 
    id: "services_commercial",
    title: "Commercial Services", 
    slug: "commercial-services", 
    href: "/properties/category/commercial",
    image: "/page-assets/services/services-5.webp",
    desc: "Strategic advisory and bespoke brokerage for prime commercial real estate investments, corporate headquarters, and high-yield leasing." 
  },
  { 
    id: "services_industrial",
    title: "Industrial Services", 
    slug: "industrial-services", 
    href: "/properties/category/industrial",
    image: "/page-assets/services/services-6.webp",
    desc: "Specialized real estate solutions for industrial acquisitions, logistics hubs, and large-scale operational facilities across the UAE." 
  },
  { 
    id: "services_interiordesign",
    title: "Interior Design & Fit Out", 
    slug: "interior-design-and-fit-out", 
    image: "/page-assets/services/services-7.webp",
    desc: "World-class interior architecture and bespoke fit-out services designed to elevate your living spaces to the pinnacle of luxury." 
  },
  { 
    id: "services_development",
    title: "Real Estate Development", 
    slug: "real-estate-development", 
    image: "/page-assets/services/services-8.webp",
    desc: "Visionary development consulting, navigating from land acquisition and master planning to the architectural execution of landmark projects." 
  },
];

export default function ServicesPage() {
  const { isPageHidden } = useSettings();

  const visibleServices = useMemo(() => {
    return servicesList.filter((service) => {
      if (service.id && isPageHidden(service.id)) return false;
      if (service.slug && isPageHidden(service.slug)) return false;
      if (service.slug && isPageHidden(`services_${service.slug}`)) return false;
      return true;
    });
  }, [isPageHidden]);

  return (
    <main className="min-h-screen bg-[#faf9f7] pt-20 pb-20 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center h-[calc(100svh-5rem)]">
        <div className="relative w-full flex-1 min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-center justify-center text-center shadow-none group px-6 py-12 md:px-24 md:py-20 animate-[fadeInUp_0.8s_ease-out_forwards]">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out z-0">
            <img 
              src="/page-assets/services/services-9.webp" 
              alt="Luxury Real Estate" 
              className="w-full h-full object-cover rounded-[2rem] md:rounded-[2.5rem]"
            />
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10"></div>
          </div>

          <div className="relative z-20 max-w-3xl flex flex-col items-center justify-center pt-8">
            <span className="text-[#d4af37] font-semibold tracking-[0.2em] text-xs md:text-sm uppercase mb-3 md:mb-4">
              Comprehensive Real Estate Solutions
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4 leading-tight drop-shadow-md">
              Our Advisory <span className="text-gray-400 italic font-light">&</span> Services
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto font-light drop-shadow">
              Delivering unparalleled expertise across all facets of luxury real estate. From strategic acquisitions to bespoke property management, our comprehensive services are designed for the elite.
            </p>
          </div>
        </div>
      </section>

      {/* Image-Driven Editorial Services Grid */}
      <section className="py-8 relative z-10">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {visibleServices.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No services currently available.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              {visibleServices.map((service) => {
                return (
                  <motion.div 
                    key={service.slug}
                    variants={fadeInUp}
                    className="group"
                  >
                    <Link 
                      href={service.href || `/services/${service.slug}`} 
                      className="relative block w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl md:rounded-[2rem] bg-gray-900"
                    >
                      {/* Background Image with Slow Zoom on Hover */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.05]" 
                        style={{ backgroundImage: `url('${service.image}')` }}
                      />
                      
                      {/* Deep Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-colors duration-700 group-hover:via-black/40" />
                      
                      {/* Content Block at Bottom */}
                      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 flex flex-col justify-end">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-2 md:mb-4 group-hover:-translate-y-2 transition-transform duration-700 ease-out">
                          {service.title}
                        </h3>
                        
                        {/* Hidden Description & Button that reveals on hover */}
                        <div className="overflow-hidden md:h-0 md:opacity-0 md:group-hover:h-[80px] md:group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                          <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed max-w-lg mb-5">
                            {service.desc}
                          </p>
                          <div className="flex items-center space-x-3 text-[#d4af37] font-semibold text-[10px] md:text-xs tracking-[0.2em] uppercase">
                            <span className="relative before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[1px] before:bg-[#d4af37] group-hover:before:w-full before:transition-all before:duration-700 before:delay-200">
                              Explore Service
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transform group-hover:translate-x-2 transition-transform duration-500 delay-100" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
      
    </main>
  );
}
