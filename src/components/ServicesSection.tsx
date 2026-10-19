"use client";

import { memo, useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Building2, 
  Briefcase, 
  Factory, 
  Home, 
  Plane, 
  Paintbrush, 
  HardHat, 
  Wallet,
  ArrowRight
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useSettings } from "@/context/SettingsContext";

const smoothScrollTo = (element: HTMLDivElement, target: number, duration: number) => {
  const start = element.scrollLeft;
  const change = target - start;
  const startTime = performance.now();
  
  const originalSnap = element.style.scrollSnapType;
  element.style.scrollSnapType = "none";
  element.style.scrollBehavior = "auto";

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animate = (currentTime: number) => {
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, start, change, duration);
    element.scrollLeft = run;

    if (timeElapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      element.scrollLeft = target;
      element.style.scrollSnapType = originalSnap;
      element.style.scrollBehavior = "";
    }
  };

  requestAnimationFrame(animate);
};

const servicesList = [
  { 
    id: "services_mortgage",
    title: "Mortgage", 
    slug: "mortgage-services", 
    badge: "Premium",
    icon: Wallet,
    image: "/home-assets/services/services-1.webp",
    desc: "Expert financial guidance and bespoke mortgage solutions tailored for high-net-worth individuals. We secure optimal terms and seamless transactions for luxury acquisitions." 
  },
  { 
    id: "services_relocation",
    title: "Relocation", 
    slug: "relocation-services",
    badge: "Global",
    icon: Plane,
    image: "/home-assets/services/services-2.webp",
    desc: "Comprehensive end-to-end relocation assistance, providing a seamless transition to your new luxury residence with full concierge and logistical support." 
  },
  { 
    id: "services_management",
    title: "Management", 
    slug: "property-management",
    badge: "Exclusive",
    icon: Home,
    image: "/home-assets/services/services-3.webp",
    desc: "Elite management of your premium real estate portfolio, maximizing yields while maintaining pristine condition. We handle everything from tenant relations to proactive maintenance." 
  },
  { 
    id: "services_brokerage",
    title: "Brokerage", 
    slug: "property-brokerage",
    badge: "Elite",
    icon: Building2,
    image: "/home-assets/services/services-4.webp",
    desc: "Exclusive access to off-market luxury listings and unparalleled advisory in elite property transactions. Designed for discerning global investors and buyers." 
  },
  { 
    id: "services_commercial",
    title: "Commercial", 
    slug: "commercial-services",
    href: "/properties/category/commercial",
    badge: "Strategic",
    icon: Briefcase,
    image: "/home-assets/services/services-5.webp",
    desc: "Strategic advisory and bespoke brokerage for prime commercial real estate investments, corporate leasing, and high-yield institutional assets." 
  },
  { 
    id: "services_industrial",
    title: "Industrial", 
    slug: "industrial-services",
    href: "/properties/category/industrial",
    badge: "Scale",
    icon: Factory,
    image: "/home-assets/services/services-6.webp",
    desc: "Specialized real estate solutions for industrial acquisitions, logistics hubs, and operational facilities engineered for maximum supply chain efficiency." 
  },
  { 
    id: "services_interiordesign",
    title: "Interior Design", 
    slug: "interior-design-and-fit-out",
    href: "/services/interior-design-and-fit-out",
    badge: "Bespoke",
    icon: Paintbrush,
    image: "/home-assets/services/services-7.webp",
    desc: "World-class interior architecture and bespoke fit-out services designed to elevate your living spaces. Bringing visionary concepts into luxurious reality." 
  },
  { 
    id: "services_development",
    title: "Development", 
    slug: "real-estate-development",
    href: "/services/real-estate-development",
    badge: "Visionary",
    icon: HardHat,
    image: "/home-assets/services/services-8.webp",
    desc: "Visionary development consulting, navigating seamlessly from land acquisition and feasibility studies to the architectural execution of landmark projects." 
  },
];

const ServicesSection = memo(function ServicesSection() {
  const { isPageHidden } = useSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Filter services by site visibility settings
  const visibleServices = useMemo(() => {
    return servicesList.filter((service) => {
      if (service.id && isPageHidden(service.id)) return false;
      if (service.slug && isPageHidden(service.slug)) return false;
      if (service.slug && isPageHidden(`services_${service.slug}`)) return false;
      return true;
    });
  }, [isPageHidden]);

  // Keep activeIndex within visible bounds
  useEffect(() => {
    if (visibleServices.length === 0) return;
    if (activeIndex >= visibleServices.length) {
      setActiveIndex(0);
    }
  }, [visibleServices.length, activeIndex]);

  useEffect(() => {
    if (isHovered || visibleServices.length <= 1) return;

    // Desktop split-screen auto-cycle
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleServices.length);
    }, 4500);

    // Mobile carousel auto-scroll
    const scrollTimer = setInterval(() => {
      if (window.innerWidth < 1024 && mobileScrollRef.current) {
        const container = mobileScrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const scrollAmount = container.firstElementChild?.clientWidth || container.clientWidth;
        
        if (maxScroll > 0) {
          if (container.scrollLeft >= maxScroll - 10) {
            smoothScrollTo(container, 0, 800);
          } else {
            const currentIndex = Math.round(container.scrollLeft / scrollAmount);
            const targetScroll = (currentIndex + 1) * scrollAmount;
            smoothScrollTo(container, targetScroll, 800);
          }
        }
      }
    }, 4500);

    return () => {
      clearInterval(timer);
      clearInterval(scrollTimer);
    };
  }, [isHovered, visibleServices.length]);

  // If entire services page is hidden or no services are visible, do not render this section
  if (isPageHidden("services") || visibleServices.length === 0) {
    return null;
  }

  const safeActiveIndex = activeIndex < visibleServices.length ? activeIndex : 0;
  const currentService = visibleServices[safeActiveIndex];

  if (!currentService) return null;

  return (
    <section 
      id="services" 
      className="py-8 md:p-10 lg:p-12 bg-[#101014] relative overflow-hidden h-auto min-h-[calc(100svh-5rem)] lg:h-[calc(100svh-5rem)] flex flex-col items-center justify-center w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full flex-1 flex flex-col z-10 min-h-0">
        <motion.div 
          className="text-left mb-4 sm:mb-8 lg:mb-10 flex-shrink-0 px-2 lg:px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Our Premium Services</motion.h2>
          <motion.div variants={fadeInUp} className="w-24 h-1 bg-[#d4af37]"></motion.div>
        </motion.div>

        {/* Mobile Layout: Horizontal Scrolling Cards */}
        <div 
          ref={mobileScrollRef}
          className="flex lg:hidden overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 flex-1 items-stretch px-0"
        >
          {visibleServices.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="flex-[0_0_100%] px-4 sm:px-6 snap-center flex justify-center h-full">
                <div className="group relative flex flex-col bg-[#1a1a1e] rounded-[2rem] overflow-hidden w-full max-w-[380px] shadow-lg border border-white/5 h-full">
                  <Link href={service.href || `/services/${service.slug}`} className="block absolute inset-0 z-20"></Link>
                  
                  {/* Top Image Section */}
                  <div className="relative w-full h-56 sm:h-64 shrink-0 overflow-hidden bg-gray-900">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.05]" 
                    />
                    <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/10">
                      <span className="text-[#d4af37] text-[9px] font-extrabold uppercase tracking-widest">{service.badge}</span>
                    </div>
                  </div>
                  
                  {/* Bottom Content Section */}
                  <div className="p-5 md:p-6 flex flex-col flex-1 bg-[#1a1a1e] relative">
                    <div className="absolute -top-6 left-5 w-12 h-12 rounded-2xl bg-[#2a2a2e] shadow-md flex items-center justify-center border border-white/5 text-[#d4af37] z-10">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    
                    <div className="pt-8 flex-1 flex flex-col">
                      <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 font-light flex-1">
                        {service.desc}
                      </p>
                      
                      <div className="mt-auto pt-4">
                        <div className="flex items-center justify-center space-x-2 w-full py-3 bg-white/5 hover:bg-[#d4af37] border border-white/10 hover:border-[#d4af37] text-white font-bold text-[10px] tracking-widest uppercase transition-all duration-300 rounded-full group/btn">
                          <span>Explore Service</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Layout: Interactive Split Screen */}
        <div className="hidden lg:flex flex-row gap-16 items-stretch flex-1 min-h-0">
          {/* Left Side: Interactive List */}
          <div className="w-full lg:w-[35%] flex flex-col justify-between py-2 order-2 lg:order-1 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {visibleServices.map((service, index) => {
              const isActive = index === safeActiveIndex;
              return (
                <div 
                  key={service.title}
                  className="group relative cursor-pointer py-2.5 md:py-3 lg:py-0 flex-1 flex flex-col justify-center"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Active Indicator Line */}
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 transition-all duration-500 ease-out ${isActive ? 'h-3/4 bg-[#d4af37]' : 'h-0 bg-white/10 group-hover:h-1/3'}`}></div>
                  
                  <div className={`pl-5 transition-all duration-500 transform ${isActive ? 'translate-x-3' : 'group-hover:translate-x-2'}`}>
                    <div className={`text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5 transition-colors duration-500 ${isActive ? 'text-[#d4af37]' : 'text-gray-500'}`}>
                      0{index + 1}
                    </div>
                    <h3 className={`text-xl md:text-2xl lg:text-3xl font-serif transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                      {service.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Dynamic Image Display */}
          <div className="w-full lg:w-[65%] relative rounded-[2rem] overflow-hidden shadow-2xl h-[400px] lg:h-full bg-gray-900 order-1 lg:order-2 flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={safeActiveIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img 
                  src={currentService.image} 
                  alt={currentService.title}
                  className="w-full h-full object-cover"
                />
                {/* Refined Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/95 via-[#101014]/40 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end text-white z-10">
                  <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#d4af37]">
                      {(() => {
                        const Icon = currentService.icon;
                        return <Icon className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={1.5} />;
                      })()}
                    </div>
                    <span className="bg-black/40 backdrop-blur-md border border-white/10 text-[#d4af37] text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.2em] py-1.5 px-3 rounded-full shadow-lg">
                      {currentService.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif text-white mb-3 lg:mb-4 drop-shadow-md">
                    {currentService.title}
                  </h3>
                  <p className="text-xs md:text-sm lg:text-lg font-light text-gray-200 mb-6 lg:mb-8 max-w-2xl leading-relaxed drop-shadow line-clamp-3 lg:line-clamp-none">
                    {currentService.desc}
                  </p>
                  
                  <Link 
                    href={currentService.href || `/services/${currentService.slug}`}
                    className="inline-flex items-center space-x-3 text-[#d4af37] font-bold text-[10px] lg:text-sm tracking-widest uppercase group/link w-fit"
                  >
                    <span className="relative before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-[#d4af37] group-hover/link:before:w-full before:transition-all before:duration-500">
                      Explore Service
                    </span>
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transform group-hover/link:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ServicesSection;
