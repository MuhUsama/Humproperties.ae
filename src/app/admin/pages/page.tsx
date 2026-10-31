"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Home, 
  Building, 
  Briefcase, 
  BookOpen, 
  Info, 
  TrendingUp, 
  HelpCircle, 
  PhoneCall, 
  BadgePercent,
  Search,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  MapPin,
  Key,
  Wrench,
  Compass,
  Palette,
  Hammer,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface SitePageConfig {
  slug: string;
  name: string;
  url: string;
  group: "main" | "buy" | "rent" | "services";
  category: string;
  description: string;
  icon: any;
}

interface MenuItemConfig {
  id: string; // slug
  title: string;
  url: string;
  icon: any;
  description: string;
}

const DEFAULT_MAIN_MENU_ITEMS: MenuItemConfig[] = [
  { id: "buy", title: "Buy", url: "/buy", icon: Home, description: "Properties for sale portal" },
  { id: "rent", title: "Rent", url: "/rent", icon: Building, description: "Rental properties portal" },
  { id: "sell", title: "Sell", url: "/sell", icon: BadgePercent, description: "Selling submission & valuation" },
  { id: "services", title: "Property Services", url: "/services", icon: Briefcase, description: "Advisory, mortgage, and management" },
  { id: "blogs", title: "Insights", url: "/blogs", icon: BookOpen, description: "Market news, guides and articles" },
  { id: "about", title: "About", url: "/about", icon: Info, description: "Company background and heritage" },
  { id: "invest", title: "Invest", url: "/invest", icon: TrendingUp, description: "Investment advisory and golden visa" },
  { id: "faq", title: "FAQs", url: "/faq", icon: HelpCircle, description: "Frequently asked questions" },
];

const SITE_PAGES: SitePageConfig[] = [
  // --- Main Site Pages ---
  {
    slug: "buy",
    name: "Buy (Overview)",
    url: "/buy",
    group: "main",
    category: "Main Page",
    description: "Main properties for sale portal across Dubai and Abu Dhabi.",
    icon: Home,
  },
  {
    slug: "rent",
    name: "Rent (Overview)",
    url: "/rent",
    group: "main",
    category: "Main Page",
    description: "Main rental properties portal across Dubai and Abu Dhabi.",
    icon: Building,
  },
  {
    slug: "sell",
    name: "Sell Property",
    url: "/sell",
    group: "main",
    category: "Main Page",
    description: "Property valuation, listing consultation, and selling submission portal.",
    icon: BadgePercent,
  },
  {
    slug: "services",
    name: "Property Services (Overview)",
    url: "/services",
    group: "main",
    category: "Main Page",
    description: "Main overview hub for real estate advisory, management, and brokerage services.",
    icon: Briefcase,
  },
  {
    slug: "blogs",
    name: "Insights & News",
    url: "/blogs",
    group: "main",
    category: "Main Page",
    description: "Real estate news, market forecasts, luxury investment articles, and blogs.",
    icon: BookOpen,
  },
  {
    slug: "about",
    name: "About Us",
    url: "/about",
    group: "main",
    category: "Main Page",
    description: "Company heritage, vision, leadership background, and profile.",
    icon: Info,
  },
  {
    slug: "invest",
    name: "Invest in Dubai",
    url: "/invest",
    group: "main",
    category: "Main Page",
    description: "Foreign direct investment guide, UAE Golden Visa details, and high-yield insights.",
    icon: TrendingUp,
  },
  {
    slug: "faq",
    name: "FAQs",
    url: "/faq",
    group: "main",
    category: "Main Page",
    description: "Frequently asked questions regarding buying, renting, and property laws.",
    icon: HelpCircle,
  },
  {
    slug: "contact",
    name: "Contact Us",
    url: "/contact",
    group: "main",
    category: "Main Page",
    description: "Advisory desk contact form, direct phone numbers, and corporate office address.",
    icon: PhoneCall,
  },

  // --- Buy Sub-Pages & Filter Pages ---
  {
    slug: "buy_ready",
    name: "Buy: Ready",
    url: "/buy?status=ready",
    group: "buy",
    category: "Buy Category",
    description: "Ready properties for sale in Dubai (Header Item).",
    icon: Home,
  },
  {
    slug: "buy_offplan",
    name: "Buy: Off Plan",
    url: "/off-plan",
    group: "buy",
    category: "Buy Category",
    description: "Off plan project investments in Dubai (Header Item).",
    icon: Building,
  },
  {
    slug: "buy_commercial",
    name: "Buy: Commercial",
    url: "/properties/category/commercial",
    group: "buy",
    category: "Buy Category",
    description: "Commercial properties for sale (Header Item).",
    icon: Building,
  },
  {
    slug: "buy_industrial",
    name: "Buy: Industrial",
    url: "/properties/category/industrial",
    group: "buy",
    category: "Buy Category",
    description: "Industrial properties for sale (Header Item).",
    icon: Key,
  },

  // --- Rent Sub-Pages & Filter Pages ---
  {
    slug: "rent_apartment",
    name: "Rent: Apartments",
    url: "/rent?category=Apartment&city=Dubai",
    group: "rent",
    category: "Rent Category",
    description: "Rental apartments in prime Dubai neighborhoods.",
    icon: Building,
  },
  {
    slug: "rent_villa",
    name: "Rent: Villas",
    url: "/rent?category=Villa&city=Dubai",
    group: "rent",
    category: "Rent Category",
    description: "Detached and semi-detached villas for yearly rent.",
    icon: Home,
  },
  {
    slug: "rent_townhouse",
    name: "Rent: Townhouses",
    url: "/rent?category=Townhouse&city=Dubai",
    group: "rent",
    category: "Rent Category",
    description: "Spacious townhouses for rent in prime Dubai communities.",
    icon: Home,
  },
  {
    slug: "rent_penthouse",
    name: "Rent: Penthouses",
    url: "/rent?category=Penthouse&city=Dubai",
    group: "rent",
    category: "Rent Category",
    description: "Sky-high luxury penthouses available for lease.",
    icon: Building,
  },
  {
    slug: "rent_office",
    name: "Rent: Offices",
    url: "/rent?category=Office&city=Dubai",
    group: "rent",
    category: "Rent Category",
    description: "Fitted and shell-and-core offices available for lease.",
    icon: Briefcase,
  },
  {
    slug: "rent_warehouse",
    name: "Rent: Warehouses",
    url: "/rent?category=Warehouse&city=Dubai",
    group: "rent",
    category: "Rent Category",
    description: "Industrial warehouses and storage facilities for rent.",
    icon: Key,
  },
  {
    slug: "rent_studio",
    name: "Rent: Studio Apartments",
    url: "/rent?category=Studio&city=Dubai",
    group: "rent",
    category: "Rent Category",
    description: "Modern studio apartments for rent in Dubai.",
    icon: Building,
  },

  // --- Services Sub-Pages ---
  {
    slug: "services_mortgage",
    name: "Services: Mortgage Advisory",
    url: "/services/mortgage-services",
    group: "services",
    category: "Service Page",
    description: "Mortgage rates, pre-approval advisory, and bank negotiation desk.",
    icon: TrendingUp,
  },
  {
    slug: "services_relocation",
    name: "Services: Relocation",
    url: "/services/relocation-services",
    group: "services",
    category: "Service Page",
    description: "Expat relocation, orientation, school search, and visa coordination.",
    icon: Compass,
  },
  {
    slug: "services_management",
    name: "Services: Property Management",
    url: "/services/property-management",
    group: "services",
    category: "Service Page",
    description: "Tenant screening, rent collection, maintenance, and Ejari support.",
    icon: Wrench,
  },
  {
    slug: "services_brokerage",
    name: "Services: Property Brokerage",
    url: "/services/property-brokerage",
    group: "services",
    category: "Service Page",
    description: "Professional licensed brokerage for private acquisitions and sales.",
    icon: Briefcase,
  },
  {
    slug: "services_commercial",
    name: "Services: Commercial Category",
    url: "/properties/category/commercial",
    group: "services",
    category: "Service Page",
    description: "Commercial properties category showcase and portfolio.",
    icon: Building,
  },
  {
    slug: "services_industrial",
    name: "Services: Industrial Category",
    url: "/properties/category/industrial",
    group: "services",
    category: "Service Page",
    description: "Industrial properties category showcase and logistics hubs.",
    icon: Key,
  },
  {
    slug: "services_interiordesign",
    name: "Services: Interior Design & Fit-Out",
    url: "/services/interior-design-and-fit-out",
    group: "services",
    category: "Service Page",
    description: "Turnkey luxury interior design, architectural planning, and fit-out.",
    icon: Palette,
  },
  {
    slug: "services_development",
    name: "Services: Real Estate Development",
    url: "/services/real-estate-development",
    group: "services",
    category: "Service Page",
    description: "Joint-venture development, master planning, and construction delivery.",
    icon: Hammer,
  },
];

export default function AdminPagesManager() {
  const { siteInfo, setSiteInfo } = useSettings();
  const [hiddenPages, setHiddenPages] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<"all" | "main" | "buy" | "rent" | "services" | "menu_order">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "visible" | "hidden">("all");

  // Menu positioning state
  const [menuOrder, setMenuOrder] = useState<string[]>(DEFAULT_MAIN_MENU_ITEMS.map((i) => i.title));
  const [savingOrder, setSavingOrder] = useState(false);

  // Fetch initial settings from DB
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, boolean> = {};
          data.forEach((s: { key: string; value: string }) => {
            if (s.key.startsWith("hide_page_")) {
              const slug = s.key.replace("hide_page_", "");
              map[slug] = s.value === "true";
            }
            if (s.key === "navbar_menu_order" && s.value) {
              try {
                const parsed = JSON.parse(s.value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  // Ensure all default items exist
                  const validTitles = DEFAULT_MAIN_MENU_ITEMS.map((i) => i.title);
                  const ordered = parsed.filter((t: string) => validTitles.includes(t));
                  validTitles.forEach((t) => {
                    if (!ordered.includes(t)) ordered.push(t);
                  });
                  setMenuOrder(ordered);
                }
              } catch (e) {
                console.error("Error parsing navbar_menu_order:", e);
              }
            }
          });
          setHiddenPages(map);
        }
      })
      .catch((err) => console.error("Error fetching settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const togglePageVisibility = async (slug: string, pageName: string) => {
    const isCurrentlyHidden = Boolean(hiddenPages[slug]);
    const nextHidden = !isCurrentlyHidden;

    // Optimistic UI update
    setHiddenPages((prev) => ({ ...prev, [slug]: nextHidden }));
    setSavingSlug(slug);

    // Update global SettingsContext
    const settingKey = `hide_page_${slug}`;
    if (setSiteInfo) {
      setSiteInfo((prev) => ({ ...prev, [settingKey]: nextHidden ? "true" : "false" }));
    }

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: settingKey,
          value: nextHidden ? "true" : "false",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(
          nextHidden 
            ? `"${pageName}" is now hidden across menus and site.` 
            : `"${pageName}" is now visible across menus and site.`
        );
      } else {
        throw new Error(data.error || "Failed to update setting");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      // Revert optimistic update
      setHiddenPages((prev) => ({ ...prev, [slug]: isCurrentlyHidden }));
      if (setSiteInfo) {
        setSiteInfo((prev) => ({ ...prev, [settingKey]: isCurrentlyHidden ? "true" : "false" }));
      }
      showToast("Error updating page visibility. Please try again.", "error");
    } finally {
      setSavingSlug(null);
    }
  };

  // Reorder and save menu positions
  const saveMenuOrder = async (orderToSave: string[]) => {
    setSavingOrder(true);
    const settingKey = "navbar_menu_order";
    const jsonVal = JSON.stringify(orderToSave);

    if (setSiteInfo) {
      setSiteInfo((prev) => ({ ...prev, [settingKey]: jsonVal }));
    }

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: settingKey,
          value: jsonVal,
        }),
      });

      if (res.ok) {
        showToast("Menu positions updated & saved successfully!");
      } else {
        throw new Error("Failed to save menu positions");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving menu positions. Please try again.", "error");
    } finally {
      setSavingOrder(false);
    }
  };

  const moveMenuItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= menuOrder.length) return;
    const next = [...menuOrder];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setMenuOrder(next);
    saveMenuOrder(next);
  };

  const changeMenuItemPosition = (itemTitle: string, targetPosition1Indexed: number) => {
    const curIdx = menuOrder.indexOf(itemTitle);
    if (curIdx === -1) return;
    const targetIdx = targetPosition1Indexed - 1;
    moveMenuItem(curIdx, targetIdx);
  };

  const resetMenuOrder = () => {
    const defaultOrder = DEFAULT_MAIN_MENU_ITEMS.map((i) => i.title);
    setMenuOrder(defaultOrder);
    saveMenuOrder(defaultOrder);
  };

  const filteredPages = useMemo(() => {
    return SITE_PAGES.filter((page) => {
      const isHidden = Boolean(hiddenPages[page.slug]);
      
      // Group filter
      if (selectedGroup !== "all" && selectedGroup !== "menu_order" && page.group !== selectedGroup) return false;

      // Status filter
      if (filterStatus === "visible" && isHidden) return false;
      if (filterStatus === "hidden" && !isHidden) return false;

      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          page.name.toLowerCase().includes(q) ||
          page.url.toLowerCase().includes(q) ||
          page.category.toLowerCase().includes(q) ||
          page.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [hiddenPages, selectedGroup, filterStatus, searchQuery]);

  const totalPages = SITE_PAGES.length;
  const hiddenCount = SITE_PAGES.filter((p) => hiddenPages[p.slug]).length;
  const visibleCount = totalPages - hiddenCount;

  const mainPagesCount = SITE_PAGES.filter((p) => p.group === "main").length;
  const buySubCount = SITE_PAGES.filter((p) => p.group === "buy").length;
  const rentSubCount = SITE_PAGES.filter((p) => p.group === "rent").length;
  const servicesSubCount = SITE_PAGES.filter((p) => p.group === "services").length;

  // Build ordered list of items for the Menu Positions manager
  const orderedMenuItems = useMemo(() => {
    const itemMap = new Map(DEFAULT_MAIN_MENU_ITEMS.map((item) => [item.title, item]));
    const result: MenuItemConfig[] = [];

    menuOrder.forEach((title) => {
      const found = itemMap.get(title);
      if (found) {
        result.push(found);
        itemMap.delete(title);
      }
    });

    itemMap.forEach((item) => {
      result.push(item);
    });

    return result;
  }, [menuOrder]);

  return (
    <div className="max-w-7xl mx-auto w-full pt-16 md:pt-0 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium transition-all animate-in slide-in-from-bottom-5 ${
          toastMessage.type === "success" 
            ? "bg-brand-black text-white border-brand-gold/40" 
            : "bg-red-900 text-white border-red-700"
        }`}>
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-brand-gold flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
                <Layers className="w-6 h-6" />
              </span>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-black">
                Site Pages & Menu Positions
              </h1>
            </div>
            <p className="text-gray-500 max-w-2xl text-sm sm:text-base">
              Control the visibility and customize the exact position order (1st, 2nd, etc.) of navigation menu buttons across the website.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm self-start md:self-auto">
            <div className="px-4 py-2 text-center border-r border-gray-100">
              <span className="block text-2xl font-bold text-emerald-600">{visibleCount}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600/80">Visible</span>
            </div>
            <div className="px-4 py-2 text-center">
              <span className="block text-2xl font-bold text-amber-600">{hiddenCount}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600/80">Hidden</span>
            </div>
          </div>
        </div>
      </div>

      {/* Group Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setSelectedGroup("menu_order")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
            selectedGroup === "menu_order"
              ? "bg-[#111116] text-[#d4af37] ring-2 ring-[#d4af37] shadow-lg"
              : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <ArrowUpDown className="w-4 h-4 text-[#d4af37]" />
          <span>Menu Order &amp; Positions ({DEFAULT_MAIN_MENU_ITEMS.length})</span>
        </button>

        <button
          onClick={() => setSelectedGroup("all")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            selectedGroup === "all"
              ? "bg-brand-black text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
          }`}
        >
          All Pages ({totalPages})
        </button>
        <button
          onClick={() => setSelectedGroup("main")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            selectedGroup === "main"
              ? "bg-brand-black text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
          }`}
        >
          Main Pages ({mainPagesCount})
        </button>
        <button
          onClick={() => setSelectedGroup("buy")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            selectedGroup === "buy"
              ? "bg-brand-black text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
          }`}
        >
          Buy Sub-Pages &amp; Filters ({buySubCount})
        </button>
        <button
          onClick={() => setSelectedGroup("rent")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            selectedGroup === "rent"
              ? "bg-brand-black text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
          }`}
        >
          Rent Sub-Pages &amp; Filters ({rentSubCount})
        </button>
        <button
          onClick={() => setSelectedGroup("services")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
            selectedGroup === "services"
              ? "bg-brand-black text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
          }`}
        >
          Services Sub-Pages ({servicesSubCount})
        </button>
      </div>

      {/* ========================================================== */}
      {/* 1. DEDICATED MENU ORDER & POSITIONS VIEW */}
      {/* ========================================================== */}
      {selectedGroup === "menu_order" && (
        <div className="space-y-6">
          {/* Header Preview & Info Box */}
          <div className="bg-[#101014] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Website Header Preview
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Header Navigation Button Order
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
                  Buttons appear on the website from left to right in this exact sequence. Hidden pages are indicated with a badge and will not appear to visitors.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetMenuOrder}
                  disabled={savingOrder}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 flex items-center gap-1.5 transition border border-white/10"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Default
                </button>
              </div>
            </div>

            {/* Simulated Navbar Strip */}
            <div className="relative z-10 bg-black/60 rounded-2xl p-4 sm:p-5 border border-white/10 backdrop-blur-md overflow-x-auto">
              <div className="flex items-center gap-2 sm:gap-3 min-w-max">
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-serif font-bold text-gray-300 tracking-wider mr-2">
                  [LOGO]
                </div>
                {orderedMenuItems.map((item, idx) => {
                  const isHidden = Boolean(hiddenPages[item.id]);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isHidden
                          ? "bg-amber-500/10 border border-amber-500/30 text-amber-300 line-through opacity-75"
                          : "bg-white/10 border border-[#d4af37]/40 text-white shadow-sm"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-[#d4af37] text-black text-[9px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{item.title}</span>
                      {isHidden && (
                        <span className="text-[9px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded font-normal uppercase">
                          Hidden
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reorderable Items List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Configure Button Positions</h4>
                <p className="text-xs text-gray-500">
                  Select a position number (1st, 2nd, 3rd, etc.) or click the arrows to move buttons up and down.
                </p>
              </div>
              {savingOrder && (
                <span className="inline-flex items-center gap-2 text-xs font-bold text-[#b5952f] animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving updates...
                </span>
              )}
            </div>

            <div className="space-y-3">
              {orderedMenuItems.map((item, index) => {
                const isHidden = Boolean(hiddenPages[item.id]);
                const isFirst = index === 0;
                const isLast = index === orderedMenuItems.length - 1;
                const IconComponent = item.icon;

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                      isHidden
                        ? "bg-amber-50/30 border-amber-200"
                        : "bg-[#faf9f7] hover:bg-white border-gray-200/80 hover:shadow-md"
                    }`}
                  >
                    {/* Left: Position Rank & Info */}
                    <div className="flex items-center gap-4">
                      {/* Big Position Badge */}
                      <div className="w-12 h-12 rounded-2xl bg-[#111116] text-[#d4af37] font-serif font-bold text-lg flex flex-col items-center justify-center shadow-md shrink-0 border border-[#d4af37]/30">
                        <span className="text-[9px] font-sans uppercase tracking-widest text-gray-400 leading-none">
                          POS
                        </span>
                        <span>#{index + 1}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 shrink-0 shadow-sm">
                        <IconComponent className="w-5 h-5 text-[#b5952f]" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-serif font-bold text-base sm:text-lg text-gray-900">
                            {item.title}
                          </h5>
                          {isHidden ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                              Hidden on Site
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                              Visible
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                          Route: {item.url} • {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Position Selector & Action Buttons */}
                    <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                      {/* Position Dropdown */}
                      <div className="flex items-center gap-1.5 bg-white border-2 border-gray-200 focus-within:border-[#d4af37] rounded-xl px-2.5 py-1.5 shadow-sm">
                        <span className="text-xs font-bold text-gray-500">Position:</span>
                        <select
                          value={index + 1}
                          onChange={(e) => changeMenuItemPosition(item.title, Number(e.target.value))}
                          disabled={savingOrder}
                          className="bg-transparent text-xs sm:text-sm font-bold text-gray-900 outline-none cursor-pointer pr-1"
                        >
                          {orderedMenuItems.map((_, posIdx) => (
                            <option key={posIdx + 1} value={posIdx + 1}>
                              {posIdx + 1} {posIdx === 0 ? "(1st)" : posIdx === 1 ? "(2nd)" : posIdx === 2 ? "(3rd)" : `(${posIdx + 1}th)`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Move Up / Down Buttons */}
                      <button
                        type="button"
                        onClick={() => moveMenuItem(index, index - 1)}
                        disabled={isFirst || savingOrder}
                        title="Move Up"
                        className={`p-2 rounded-xl border transition ${
                          isFirst
                            ? "opacity-30 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400"
                            : "bg-white hover:bg-[#d4af37] hover:text-black border-gray-200 text-gray-700 shadow-sm"
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveMenuItem(index, index + 1)}
                        disabled={isLast || savingOrder}
                        title="Move Down"
                        className={`p-2 rounded-xl border transition ${
                          isLast
                            ? "opacity-30 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400"
                            : "bg-white hover:bg-[#d4af37] hover:text-black border-gray-200 text-gray-700 shadow-sm"
                        }`}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Quick Toggle Visibility */}
                      <button
                        type="button"
                        onClick={() => togglePageVisibility(item.id, item.title)}
                        title={isHidden ? "Show in Menu" : "Hide from Menu"}
                        className={`p-2 rounded-xl border transition ${
                          isHidden
                            ? "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900 shadow-sm"
                            : "bg-white hover:bg-gray-100 border-gray-200 text-gray-600 shadow-sm"
                        }`}
                      >
                        {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. REGULAR PAGES VIEW (When not in menu_order mode) */}
      {/* ========================================================== */}
      {selectedGroup !== "menu_order" && (
        <>
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by page name, category, or path..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors text-sm"
                />
              </div>

              {/* Visibility Filter Pills */}
              <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    filterStatus === "all"
                      ? "bg-white text-brand-black shadow-sm"
                      : "text-gray-500 hover:text-brand-black"
                  }`}
                >
                  All Statuses
                </button>
                <button
                  onClick={() => setFilterStatus("visible")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    filterStatus === "visible"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-gray-500 hover:text-emerald-700"
                  }`}
                >
                  Visible Only
                </button>
                <button
                  onClick={() => setFilterStatus("hidden")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    filterStatus === "hidden"
                      ? "bg-white text-amber-700 shadow-sm"
                      : "text-gray-500 hover:text-amber-700"
                  }`}
                >
                  Hidden Only
                </button>
              </div>
            </div>
          </div>

          {/* Pages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => {
              const isHidden = Boolean(hiddenPages[page.slug]);
              const isSaving = savingSlug === page.slug;
              const PageIcon = page.icon;

              return (
                <div
                  key={page.slug}
                  className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between relative group ${
                    isHidden 
                      ? "border-amber-200/80 bg-amber-50/15 shadow-sm" 
                      : "border-gray-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-brand-gold/30"
                  }`}
                >
                  <div>
                    {/* Top Badge & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                        page.group === "main" 
                          ? "bg-blue-50 text-blue-700 border border-blue-100" 
                          : page.group === "buy"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : page.group === "rent"
                          ? "bg-purple-50 text-purple-700 border border-purple-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {page.category}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${isHidden ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                        <span className={`text-xs font-semibold ${isHidden ? "text-amber-600" : "text-emerald-600"}`}>
                          {isHidden ? "Hidden" : "Visible"}
                        </span>
                      </div>
                    </div>

                    {/* Page Title & Icon */}
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`p-3 rounded-2xl ${isHidden ? "bg-gray-100 text-gray-400" : "bg-brand-gold/10 text-brand-gold"}`}>
                        <PageIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-xl text-brand-black group-hover:text-brand-gold transition-colors">
                          {page.name}
                        </h3>
                        <p className="text-xs font-mono text-gray-400 mt-0.5 flex items-center gap-1">
                          <span>{page.url}</span>
                          <Link 
                            href={page.url} 
                            target="_blank" 
                            className="text-gray-400 hover:text-brand-gold inline-flex items-center"
                            title="Visit Page"
                          >
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </Link>
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 leading-relaxed mb-6 font-light">
                      {page.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      {isHidden ? "Excluded from site & menu" : "Active & displayed"}
                    </span>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => togglePageVisibility(page.slug, page.name)}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        isHidden
                          ? "bg-brand-black text-white hover:bg-brand-gold hover:text-brand-black"
                          : "bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-900 border border-gray-200"
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : isHidden ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Show Item</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                          <span>Hide Item</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPages.length === 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
              <p className="text-gray-500 font-medium">No pages or sub-pages matched your filter.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedGroup("all"); setFilterStatus("all"); }}
                className="mt-4 px-4 py-2 text-xs font-bold text-brand-gold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
