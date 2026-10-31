"use client";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, ChevronDown, Globe, Check } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import AnimatedLogo from "@/components/common/AnimatedLogo";

const menuVariants: any = {
  closed: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren"
    }
  },
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariants: any = {
  closed: { opacity: 0, y: 30 },
  open: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const dropdownVariants: any = {
  hidden: { opacity: 0, y: -10, x: "-50%", scale: 0.95, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, x: "-50%", scale: 1, filter: "blur(0px)", transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -5, x: "-50%", scale: 0.98, filter: "blur(2px)", transition: { duration: 0.15, ease: "easeIn" } }
};

interface SubPageItem {
  id: string;
  title: string;
  href: string;
  category?: string | null;
  city?: string | null;
  isClickable?: boolean;
}

const subServices: SubPageItem[] = [
  { id: "services_mortgage", title: "Mortgage", href: "/services/mortgage-services" },
  { id: "services_relocation", title: "Relocation", href: "/services/relocation-services" },
  { id: "services_management", title: "Management", href: "/services/property-management" },
  { id: "services_brokerage", title: "Brokerage", href: "/services/property-brokerage" },
  { id: "services_commercial", title: "Commercial", href: "/properties/category/commercial" },
  { id: "services_industrial", title: "Industrial", href: "/properties/category/industrial" },
  { id: "services_interiordesign", title: "Interior Design", href: "/services/interior-design-and-fit-out" },
  { id: "services_development", title: "Development", href: "/services/real-estate-development" },
];

const buyCategories: SubPageItem[] = [
  { id: "buy_ready", title: "Ready", href: "/buy?status=ready" },
  { id: "buy_offplan", title: "Off Plan", href: "/off-plan" },
];

const rentCategories: SubPageItem[] = [
  { id: "rent_apartment", title: "Apartments", href: "/rent?category=Apartment", category: "Apartment" },
  { id: "rent_villa", title: "Villas", href: "/rent?category=Villa", category: "Villa" },
  { id: "rent_townhouse", title: "Townhouses", href: "/rent?category=Townhouse", category: "Townhouse" },
  { id: "rent_penthouse", title: "Penthouses", href: "/rent?category=Penthouse", category: "Penthouse" },
  { id: "rent_office", title: "Offices", href: "/rent?category=Office", category: "Office" },
  { id: "rent_warehouse", title: "Warehouses", href: "/rent?category=Warehouse", category: "Warehouse" },
  { id: "rent_studio", title: "Studio Apartments", href: "/rent?category=Studio", category: "Studio" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isBuyHovered, setIsBuyHovered] = useState(false);
  const [isRentHovered, setIsRentHovered] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileBuyOpen, setIsMobileBuyOpen] = useState(false);
  const [isMobileRentOpen, setIsMobileRentOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname();
  // On the home page the header sits transparent over the full-screen hero film until the visitor scrolls
  const overHero = !scrolled && !isOpen && pathname === "/";
  const dark = scrolled || isOpen || overHero;

  const { currency, setCurrency, areaUnit, setAreaUnit, siteInfo, isPageHidden } = useSettings();
  const [liveListings, setLiveListings] = useState<any[] | null>(null);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setLiveListings(data.data);
        } else if (Array.isArray(data)) {
          setLiveListings(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  
  const phone = siteInfo?.contact_phone || "+971 (04) 334 1131";
  const email = siteInfo?.contact_email || "info@mfreuae.com";

  // Buy dropdown: Ready (ready properties) and Off Plan (developers page)
  const visibleBuyCategories = useMemo(() => {
    return buyCategories.filter((item) => !isPageHidden(item.id));
  }, [isPageHidden]);

  // Rent dropdown: show categories ONLY if there is a property available for that category
  const visibleRentCategories = useMemo(() => {
    if (!liveListings || liveListings.length === 0) return [];
    return rentCategories.filter((item) => {
      if (isPageHidden(item.id)) return false;
      return liveListings.some((p) => {
        const isRent = p.status?.toUpperCase().includes("RENT");
        if (!isRent) return false;
        if (item.category) {
          const cat = (p.category || "").toLowerCase();
          const target = item.category.toLowerCase();
          return cat.includes(target) || target.includes(cat);
        }
        return true;
      });
    });
  }, [liveListings, isPageHidden]);

  const isRentHasDropdown = visibleRentCategories.length > 0;

  // Filter Services sub-pages
  const visibleSubServices = useMemo(() => {
    return subServices.filter((item) => !isPageHidden(item.id));
  }, [isPageHidden]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setIsMobileServicesOpen(false); // Reset accordion on close
      setIsMobileBuyOpen(false); // Reset accordion on close
      setIsMobileRentOpen(false); // Reset accordion on close
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const PAGE_SLUG_MAP: Record<string, string> = {
    "Buy": "buy",
    "Rent": "rent",
    "Sell": "sell",
    "Property Services": "services",
    "Insights": "blogs",
    "About": "about",
    "Invest": "invest",
    "FAQs": "faq",
  };

  const DEFAULT_MENU_ORDER = ["Buy", "Rent", "Sell", "Property Services", "Insights", "About", "Invest", "FAQs"];

  const navLinks = useMemo(() => {
    let order = DEFAULT_MENU_ORDER;
    if (siteInfo?.navbar_menu_order) {
      try {
        const parsed = JSON.parse(siteInfo.navbar_menu_order);
        if (Array.isArray(parsed) && parsed.length > 0) {
          order = parsed;
        }
      } catch (e) {
        console.error("Failed to parse navbar_menu_order:", e);
      }
    }

    const availableSet = new Set(DEFAULT_MENU_ORDER);
    const result: string[] = [];

    // Add ordered items that exist in our menu
    order.forEach((title) => {
      if (availableSet.has(title)) {
        const slug = PAGE_SLUG_MAP[title];
        if (!slug || !isPageHidden(slug)) {
          result.push(title);
        }
        availableSet.delete(title);
      }
    });

    // Append any default items that weren't in saved order
    availableSet.forEach((title) => {
      const slug = PAGE_SLUG_MAP[title];
      if (!slug || !isPageHidden(slug)) {
        result.push(title);
      }
    });

    return result;
  }, [siteInfo?.navbar_menu_order, isPageHidden]);

  // The right half also carries the settings and Contact buttons, so the left takes one more link
  const leftCount = Math.ceil((navLinks.length + 1) / 2);

  // One desktop nav item with its dropdown; used for both halves of the split menu
  const renderNavItem = (item: string, i: number) => {
            const isDropdownActive =
        (item === "Property Services" && isServicesHovered) ||
        (item === "Buy" && isBuyHovered) ||
        (item === "Rent" && isRentHovered && isRentHasDropdown);

      return (
        <motion.div
          key={item}
          className="relative hum-intro-item"
          style={{ "--i": i + 1 } as React.CSSProperties}
          onMouseEnter={() => {
            if (item === "Property Services") setIsServicesHovered(true);
            if (item === "Buy") setIsBuyHovered(true);
            if (item === "Rent" && isRentHasDropdown) setIsRentHovered(true);
          }}
          onMouseLeave={() => {
            if (item === "Property Services") setIsServicesHovered(false);
            if (item === "Buy") setIsBuyHovered(false);
            if (item === "Rent") setIsRentHovered(false);
          }}
        >
          <Link
            href={
              item === "Buy"
                ? "/buy"
                : item === "Rent"
                  ? "/rent"
                  : item === "About" 
                  ? "/about" 
                  : item === "Insights"
                    ? "/blogs"
                    : item === "Sell"
                      ? "/sell"
                      : item === "Property Services" 
                        ? "/services" 
                        : item === "Invest"
                          ? "/invest"
                          : item === "FAQs"
                            ? "/faq"
                            : `/#${item.toLowerCase().replace(" ", "-")}`
            }
            className={`group flex items-center space-x-1 whitespace-nowrap font-luxe font-medium uppercase text-[11px] xl:text-[13px] tracking-[0.14em] transition-all duration-200 cursor-pointer py-4 px-1 relative z-[80] ${
              isDropdownActive
                ? "font-bold text-brand-gold"
                : "font-medium hover:font-bold"
            } ${
              dark
                ? isDropdownActive
                  ? "text-brand-gold"
                  : "text-white hover:text-brand-gold"
                : isDropdownActive
                  ? "text-brand-gold"
                  : "text-brand-black hover:text-brand-gold"
            }`}
          >
            <span className="relative inline-flex items-center">
              {item === "Property Services" ? "Services" : item}
              {/* Noticeable animated bottom gold accent line on hover */}
              <span
                className={`absolute -bottom-1 left-0 h-[2.5px] bg-brand-gold rounded-full transition-all duration-300 pointer-events-none ${
                  isDropdownActive
                    ? "w-full opacity-100"
                    : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                }`}
              />
            </span>
            {(item === "Property Services" || item === "Buy" || (item === "Rent" && isRentHasDropdown)) && (
              <svg
                className={`w-4 h-4 ml-1 transition-all duration-300 ${
                  isDropdownActive
                    ? "rotate-180 text-brand-gold stroke-[2.5]"
                    : "opacity-70 group-hover:opacity-100 group-hover:text-brand-gold group-hover:stroke-[2.5]"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </Link>

        {/* Desktop Dropdown Menu for Property Services */}
        {item === "Property Services" && (
          <AnimatePresence>
            {isServicesHovered && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-full left-1/2 pt-2"
              >
                <div className="w-[280px] bg-white border border-gray-200 rounded-2xl overflow-hidden p-6 shadow-none">
                  <div className="flex flex-col space-y-4">
                    {visibleSubServices.map((sub, idx) => (
                      <Link 
                        key={sub.title}
                        href={sub.href}
                        className="group flex items-center space-x-2 py-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/30 group-hover:bg-brand-gold group-hover:scale-125 transition-all duration-300" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-brand-black group-hover:font-bold transition-all duration-200">
                          {sub.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <Link href="/services" className="text-xs font-bold text-brand-gold uppercase tracking-widest hover:text-brand-black transition-colors">
                      View All Services
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Desktop Dropdown Menu for Buy */}
        {item === "Buy" && visibleBuyCategories.length > 0 && (
          <AnimatePresence>
            {isBuyHovered && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-full left-1/2 pt-2"
              >
                <div className="w-[320px] bg-white border border-gray-200 rounded-2xl overflow-hidden p-6 shadow-none">
                  <div className="flex flex-col space-y-4">
                    {visibleBuyCategories.map((sub, idx) => {
                      if (sub.isClickable === false) {
                        return (
                          <div 
                            key={sub.id || sub.title}
                            className="flex items-center space-x-2 py-2 cursor-default select-none pointer-events-none"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                            <span className="text-sm font-semibold text-brand-black tracking-wide">
                              {sub.title}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <Link 
                          key={sub.title}
                          href={sub.href}
                          className="group flex items-center space-x-2 py-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/30 group-hover:bg-brand-gold group-hover:scale-125 transition-all duration-300" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-brand-black group-hover:font-bold transition-all duration-200">
                            {sub.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Desktop Dropdown Menu for Rent */}
        {item === "Rent" && visibleRentCategories.length > 0 && (
          <AnimatePresence>
            {isRentHovered && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-full left-1/2 pt-2"
              >
                <div className="w-[320px] bg-white border border-gray-200 rounded-2xl overflow-hidden p-6 shadow-none">
                  <div className="flex flex-col space-y-4">
                    {visibleRentCategories.map((sub, idx) => (
                      <Link 
                        key={sub.title}
                        href={sub.href}
                        className="group flex items-center space-x-2 py-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/30 group-hover:bg-brand-gold group-hover:scale-125 transition-all duration-300" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-brand-black group-hover:font-bold transition-all duration-200">
                          {sub.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    );
  };

  return (
    <nav
      data-hum-header
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-none shadow-none ${
        isOpen 
          ? "bg-transparent py-2" // Transparent when menu is open so it blends
          : overHero
            ? "bg-gradient-to-b from-black/50 to-transparent py-2"
          : scrolled 
            ? "bg-black/70 backdrop-blur-lg py-1 border-none shadow-none" 
            : "bg-[#faf9f7] py-2 border-none shadow-none"
      }`}
      style={{ boxShadow: "none" }}
    >
      <div className="w-full mx-auto px-6 lg:px-12 flex lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center relative z-50">
        {/* Desktop links, left half */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-6 z-[80]">
          {navLinks.slice(0, leftCount).map((item, i) => renderNavItem(item, i))}
        </div>

        {/* Logo, centred between the two halves on desktop */}
        <div className="flex-none relative z-[60] w-40 sm:w-44 lg:mx-8 xl:mx-12">
          <a href="/" className="flex items-center lg:justify-center space-x-2 w-full" onClick={() => setIsOpen(false)}>
            <div className="relative flex items-center lg:justify-center h-20 sm:h-24 w-full transition-all duration-500">
              <AnimatedLogo
                introTarget
                size="compact"
                light={dark}
                className={`transition-transform duration-500 origin-left lg:origin-center ${scrolled && !isOpen ? 'scale-90' : 'scale-100'}`}
              />
            </div>
          </a>
        </div>


        {/* Desktop Right CTA Button - flex-none ml-auto so it never stretches over center menu */}
        <div className="hidden lg:flex items-center justify-end gap-3 xl:gap-6">
        {navLinks.slice(leftCount).map((item, i) => renderNavItem(item, i + leftCount))}
        <div
          className="flex flex-none justify-end items-center space-x-4 relative z-[60] hum-intro-item ml-2 xl:ml-4"
          style={{ "--i": navLinks.length + 2 } as React.CSSProperties}
        >
          
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                dark
                  ? "border-gray-600/50 text-white hover:border-brand-gold hover:text-brand-gold bg-black/20"
                  : "border-gray-200 text-brand-black hover:border-brand-gold hover:text-brand-gold bg-gray-50 hover:bg-white"
              }`}
              title="Global Settings"
            >
              <Globe className="w-4 h-4" />
            </button>
            
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-none"
                >
                  <div className="p-4 space-y-4">
                    {/* Currency Setting */}
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Currency</h4>
                      <div className="flex bg-gray-50 rounded-lg p-1">
                        <button onClick={() => setCurrency("AED")} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${currency === "AED" ? "bg-white text-brand-black" : "text-gray-500 hover:text-brand-black"}`}>AED</button>
                        <button onClick={() => setCurrency("USD")} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${currency === "USD" ? "bg-white text-brand-black" : "text-gray-500 hover:text-brand-black"}`}>USD</button>
                        <button onClick={() => setCurrency("EUR")} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${currency === "EUR" ? "bg-white text-brand-black" : "text-gray-500 hover:text-brand-black"}`}>EUR</button>
                      </div>
                    </div>
                    {/* Area Setting */}
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Area Unit</h4>
                      <div className="flex bg-gray-50 rounded-lg p-1">
                        <button onClick={() => setAreaUnit("SQFT")} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${areaUnit === "SQFT" ? "bg-white text-brand-black" : "text-gray-500 hover:text-brand-black"}`}>Sq.Ft</button>
                        <button onClick={() => setAreaUnit("SQM")} className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${areaUnit === "SQM" ? "bg-white text-brand-black" : "text-gray-500 hover:text-brand-black"}`}>Sq.M</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!isPageHidden("contact") && (
            <Link
              href="/contact"
              className={`px-6 py-2.5 font-luxe font-semibold uppercase text-xs tracking-[0.2em] transition-all duration-300 border ${
                dark
                  ? "bg-brand-gold text-brand-black border-brand-gold hover:bg-white hover:border-white"
                  : "bg-brand-black text-white border-brand-black hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold"
              }`}
            >
              Contact Us
            </Link>
          )}
        </div>

        </div>

        {/* Mobile Menu Button */}
        <div
          className="flex-1 flex justify-end lg:hidden relative z-[60] hum-intro-item"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          <button 
            className={`w-10 h-10 flex flex-col justify-center items-center transition-colors ${
              dark ? "text-white" : "text-brand-black"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: -4 }}
              className="w-6 h-[2px] bg-current block absolute transition-all duration-300 ease-out"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-[2px] bg-current block absolute transition-all duration-300 ease-out"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 4 }}
              className="w-6 h-[2px] bg-current block absolute transition-all duration-300 ease-out"
            />
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 h-[100dvh] w-full bg-black/95 backdrop-blur-2xl z-40 flex flex-col lg:hidden overflow-y-auto"
          >
            {/* Top spacer to account for the navbar */}
            <div className="h-28 flex-none"></div>

            {/* Menu Links */}
            <motion.div 
              className="flex-1 flex flex-col justify-center px-8 space-y-4 min-h-min pb-8"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {navLinks.map((item) => (
                <motion.div key={item} variants={itemVariants} className="overflow-hidden">
                  {item === "Property Services" || item === "Buy" || (item === "Rent" && isRentHasDropdown) ? (
                    <div className="flex flex-col">
                      <button 
                        onClick={() => {
                          if (item === "Buy") setIsMobileBuyOpen(!isMobileBuyOpen);
                          else if (item === "Rent") setIsMobileRentOpen(!isMobileRentOpen);
                          else setIsMobileServicesOpen(!isMobileServicesOpen);
                        }}
                        className="flex items-center justify-between text-xl sm:text-2xl font-heading text-white hover:text-brand-gold hover:font-bold transition-all py-1.5 w-full text-left"
                      >
                        <span>{item}</span>
                        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${
                          (item === "Buy" && isMobileBuyOpen) || (item === "Rent" && isMobileRentOpen && isRentHasDropdown) || (item === "Property Services" && isMobileServicesOpen) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      <AnimatePresence>
                        {((item === "Buy" && isMobileBuyOpen) || (item === "Rent" && isMobileRentOpen && isRentHasDropdown) || (item === "Property Services" && isMobileServicesOpen)) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 flex flex-col space-y-3 pt-3"
                          >
                            <Link href={item === "Buy" ? "/buy" : item === "Rent" ? "/rent" : "/services"} className="text-brand-gold font-bold text-sm tracking-wider uppercase mb-1" onClick={() => setIsOpen(false)}>
                              Overview
                            </Link>
                            {(item === "Buy" ? visibleBuyCategories : item === "Rent" ? visibleRentCategories : visibleSubServices).map((sub) => {
                              if (sub.isClickable === false) {
                                return (
                                  <div 
                                    key={sub.id || sub.title}
                                    className="text-brand-gold font-semibold text-base py-1 cursor-default select-none"
                                  >
                                    {sub.title}
                                  </div>
                                );
                              }
                              return (
                                <Link 
                                  key={sub.title}
                                  href={sub.href}
                                  className="text-gray-300 hover:text-white text-lg transition-colors py-1"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {sub.title}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={
                        item === "Buy"
                          ? "/buy"
                          : item === "Rent"
                            ? "/rent"
                            : item === "About" 
                            ? "/about" 
                            : item === "Insights"
                              ? "/blogs"
                              : item === "Sell"
                                ? "/sell"
                                : item === "Invest"
                                  ? "/invest"
                                  : item === "FAQs"
                                    ? "/faq"
                                    : `/#${item.toLowerCase().replace(" ", "-")}`
                      }
                      className="block text-xl sm:text-2xl font-heading text-white hover:text-brand-gold hover:font-bold transition-all py-1.5"
                      onClick={() => setIsOpen(false)}
                    >
                      {item}
                    </Link>
                  )}
                </motion.div>
              ))}
              
              <motion.div variants={itemVariants} className="pt-6 mt-2 border-t border-white/10 space-y-4">
                  {/* Mobile Settings */}
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-4">
                    <div className="flex items-center space-x-2 text-brand-gold mb-4">
                      <Globe className="w-5 h-5" />
                      <span className="font-heading text-lg">Global Settings</span>
                    </div>
                    
                    <div className="space-y-4">
                      
                      <div className="flex bg-black/40 rounded-xl p-1">
                        <button onClick={() => setCurrency("AED")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${currency === "AED" ? "bg-brand-gold text-brand-black" : "text-gray-400 hover:text-white"}`}>AED</button>
                        <button onClick={() => setCurrency("USD")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${currency === "USD" ? "bg-brand-gold text-brand-black" : "text-gray-400 hover:text-white"}`}>USD</button>
                        <button onClick={() => setCurrency("EUR")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${currency === "EUR" ? "bg-brand-gold text-brand-black" : "text-gray-400 hover:text-white"}`}>EUR</button>
                      </div>

                      <div className="flex bg-black/40 rounded-xl p-1">
                        <button onClick={() => setAreaUnit("SQFT")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${areaUnit === "SQFT" ? "bg-brand-gold text-brand-black" : "text-gray-400 hover:text-white"}`}>Sq.Ft</button>
                        <button onClick={() => setAreaUnit("SQM")} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${areaUnit === "SQM" ? "bg-brand-gold text-brand-black" : "text-gray-400 hover:text-white"}`}>Sq.M</button>
                      </div>
                    </div>
                  </div>

                  {!isPageHidden("contact") && (
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center w-full bg-brand-gold hover:bg-white text-brand-black px-6 py-3.5 font-luxe font-semibold uppercase tracking-[0.2em] transition-all text-sm sm:text-base"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact an Agent
                    </Link>
                  )}
              </motion.div>
            </motion.div>

            {/* Footer Contact Info */}
            <motion.div 
              className="flex-none pb-12 px-8 flex flex-col space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 mr-4 text-brand-gold" />
                <a href={`tel:${phone}`} className="text-sm hover:text-white transition-colors">{phone}</a>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="w-5 h-5 mr-4 text-brand-gold" />
                <a href={`mailto:${email}`} className="text-sm hover:text-white transition-colors">{email}</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
