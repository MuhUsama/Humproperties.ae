import Link from "next/link";
import { 
  Building, 
  Users, 
  TrendingUp, 
  Home, 
  Factory, 
  MessageSquare, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Eye, 
  Mail, 
  Phone, 
  Plus,
  Edit3,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Settings,
  CheckCircle2
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  let activeListingsCount = 0;
  let totalListingsCount = 0;
  let forSaleCount = 0;
  let forRentCount = 0;
  let residentialCount = 0;
  let commercialCount = 0;
  let industrialCount = 0;
  let recentListings: any[] = [];
  
  let totalInquiriesCount = 0;
  let unreadInquiriesCount = 0;
  let recentInquiries: any[] = [];
  
  let blogsCount = 0;
  let agentsCount = 0;
  let faqsCount = 0;

  try {
    const [
      totalListings,
      activeListings,
      saleListings,
      rentListings,
      residential,
      commercial,
      industrial,
      listings,
      inquiriesTotal,
      inquiriesUnread,
      inquiries,
      blogs,
      agents,
      faqs
    ] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { NOT: { isVisible: false } } }),
      prisma.listing.count({ where: { status: { contains: "SALE", mode: "insensitive" } } }),
      prisma.listing.count({ where: { status: { contains: "RENT", mode: "insensitive" } } }),
      prisma.listing.count({ where: { propertyType: "Residential" } }),
      prisma.listing.count({ where: { propertyType: "Commercial" } }),
      prisma.listing.count({ where: { propertyType: "Industrial" } }),
      prisma.listing.findMany({ 
        take: 5, 
        orderBy: { createdAt: "desc" } 
      }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.contactMessage.findMany({ 
        take: 5, 
        orderBy: { createdAt: "desc" } 
      }),
      prisma.blog.count(),
      prisma.agent.count(),
      prisma.faq.count()
    ]);

    totalListingsCount = totalListings;
    activeListingsCount = activeListings;
    forSaleCount = saleListings;
    forRentCount = rentListings;
    residentialCount = residential;
    commercialCount = commercial;
    industrialCount = industrial;
    recentListings = listings;

    totalInquiriesCount = inquiriesTotal;
    unreadInquiriesCount = inquiriesUnread;
    recentInquiries = inquiries;

    blogsCount = blogs;
    agentsCount = agents;
    faqsCount = faqs;
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
  }

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
      
      {/* Top Banner / Welcome Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/15 text-brand-black border border-brand-gold/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Mohd. Alfalasi Real Estate Management Portal</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-brand-black">
            Executive Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back. Monitor property listings, inbound leads, and site operations in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            href="/"
            target="_blank"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
            <span>View Public Site</span>
          </Link>
          
          <Link
            href="/admin/add-listing/residential"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-black hover:bg-brand-gold hover:text-brand-black text-white font-bold text-sm transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Active Listings Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Active Properties
            </span>
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-brand-black">{activeListingsCount}</h3>
            <span className="text-xs text-gray-400">of {totalListingsCount} total</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {forSaleCount} For Sale
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {forRentCount} For Rent
            </span>
          </div>
          <Link href="/admin/listings" className="absolute inset-0 z-10" aria-label="View listings"></Link>
        </div>

        {/* Total Inquiries Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Inquiries & Leads
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-brand-black">{totalInquiriesCount}</h3>
            {unreadInquiriesCount > 0 ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {unreadInquiriesCount} new
              </span>
            ) : (
              <span className="text-xs text-emerald-600 font-medium">All answered</span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
            <span>Direct Client Messages</span>
            <span className="font-semibold text-emerald-600">Active Desk</span>
          </div>
          <Link href="/admin/leads" className="absolute inset-0 z-10" aria-label="View client leads"></Link>
        </div>

        {/* Published Blogs Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Insights & Blogs
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-brand-black">{blogsCount}</h3>
            <span className="text-xs text-gray-400">Articles</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
            <span>Market Reports</span>
            <span className="font-semibold text-blue-600">Live</span>
          </div>
          <Link href="/admin/blogs" className="absolute inset-0 z-10" aria-label="View blogs"></Link>
        </div>

        {/* Licensed Team / Agents Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Brokers & Team
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-brand-black">{agentsCount}</h3>
            <span className="text-xs text-gray-400">Agents</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
            <span>Client Advisory</span>
            <span className="font-semibold text-purple-600">Public</span>
          </div>
          <Link href="/admin/team" className="absolute inset-0 z-10" aria-label="View team"></Link>
        </div>

      </div>

      {/* Quick Access & Listing Creation Hub */}
      <div className="bg-gradient-to-r from-gray-900 via-brand-black to-gray-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Quick Listing Creator</span>
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5">
              Select a property classification to create and publish a new Dubai real estate listing.
            </p>
          </div>
          <Link 
            href="/admin/listings" 
            className="text-xs font-bold text-brand-gold hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <span>Manage All Listings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {/* Residential */}
          <Link 
            href="/admin/add-listing/residential"
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-gold/50 rounded-2xl p-5 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-gray-300">
                {residentialCount} Active
              </span>
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-brand-gold transition-colors">
              Add Residential
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Apartments, luxury villas, townhouses, penthouses, and studios.
            </p>
          </Link>

          {/* Commercial */}
          <Link 
            href="/admin/add-listing/commercial"
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-gold/50 rounded-2xl p-5 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-gray-300">
                {commercialCount} Active
              </span>
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-brand-gold transition-colors">
              Add Commercial
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Fitted offices, retail storefronts, corporate floors, and business towers.
            </p>
          </Link>

          {/* Industrial */}
          <Link 
            href="/admin/add-listing/industrial"
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-gold/50 rounded-2xl p-5 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Factory className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-gray-300">
                {industrialCount} Active
              </span>
            </div>
            <h3 className="font-bold text-white text-base group-hover:text-brand-gold transition-colors">
              Add Industrial
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Warehouses, logistics facilities, storage yards, and distribution hubs.
            </p>
          </Link>
        </div>
      </div>

      {/* Main Content Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Recent Property Listings & Management Shortcuts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Listings Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-brand-black">Recent Property Listings</h2>
                <p className="text-xs text-gray-500 mt-0.5">Most recently updated or created property inventory.</p>
              </div>
              <Link 
                href="/admin/listings" 
                className="text-xs font-bold text-brand-gold hover:text-brand-black uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <span>View All ({totalListingsCount})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentListings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
                <Building className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-gray-700">No properties added yet</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Click the button below to add your first luxury real estate property.
                </p>
                <Link
                  href="/admin/add-listing/residential"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold text-brand-black font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Listing</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentListings.map((property) => (
                  <div key={property.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative border border-gray-100">
                        {property.image ? (
                          <img 
                            src={property.image} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Building className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-brand-black truncate">
                          {property.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-gold" />
                            {property.city || "Dubai"}
                          </span>
                          <span>•</span>
                          <span>{property.category || "Property"}</span>
                        </div>
                        <p className="text-xs font-semibold text-brand-gold mt-1">
                          {property.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        property.status?.toUpperCase().includes("RENT") 
                          ? "bg-blue-50 text-blue-700 border border-blue-200" 
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {property.status}
                      </span>
                      
                      <Link
                        href={`/admin/edit-listing/${property.id}`}
                        className="p-2 rounded-xl border border-gray-200 hover:border-brand-gold hover:bg-brand-gold/10 text-gray-600 hover:text-brand-black transition-all"
                        title="Edit Listing"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Management Shortcuts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Site Pages & Navigation Control */}
            <Link
              href="/admin/pages"
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-gold transition-all group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-brand-black text-sm group-hover:text-brand-gold transition-colors">
                    Site Pages & Menus
                  </h4>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Reorder menu tabs, toggle subpage visibility, and manage dropdown items.
                </p>
              </div>
            </Link>

            {/* Knowledge Base FAQs */}
            <Link
              href="/admin/faqs"
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-gold transition-all group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-brand-black text-sm group-hover:text-brand-gold transition-colors">
                    Knowledge Base FAQs
                  </h4>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{faqsCount} FAQs</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add, edit, and organize frequently asked questions by main page & subpage.
                </p>
              </div>
            </Link>

          </div>

        </div>

        {/* Right 1 Column: Recent Leads & Inquiries + System Status */}
        <div className="space-y-8">
          
          {/* Latest Client Inquiries */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-brand-black">Latest Client Leads</h3>
                <p className="text-xs text-gray-500 mt-0.5">Inbound inquiries from website visitors.</p>
              </div>
              <Link
                href="/admin/leads"
                className="text-xs font-bold text-brand-gold hover:text-brand-black uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <span>View All ({totalInquiriesCount})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-xs">No client messages received yet.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {recentInquiries.map((msg) => (
                  <div key={msg.id} className="p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-black truncate max-w-[140px]">
                        {msg.name}
                      </span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-black">
                        {msg.inquiryType || "General"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      {msg.email ? (
                        <a href={`mailto:${msg.email}`} className="text-brand-gold hover:underline truncate max-w-[150px]">
                          {msg.email}
                        </a>
                      ) : (
                        <span>No email provided</span>
                      )}
                      {msg.phone && (
                        <a href={`tel:${msg.phone}`} className="hover:text-brand-black shrink-0">
                          {msg.phone}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Portal Health & Security Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-brand-black flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-gold" />
              <span>Portal Operations</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Database Engine</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  MongoDB Atlas
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Currencies Supported</span>
                <span className="font-semibold text-brand-black">AED • USD • EUR</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Admin Authentication</span>
                <span className="font-semibold text-emerald-600">Active (Protected)</span>
              </div>
            </div>

            <Link
              href="/admin/settings"
              className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-200 hover:border-brand-gold hover:bg-brand-gold/10 text-xs font-bold text-brand-black transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-brand-gold" />
              <span>Change Admin Password</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
