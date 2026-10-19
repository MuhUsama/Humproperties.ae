"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ArrowUpDown, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  Sparkles, 
  User, 
  Check, 
  X, 
  AlertCircle,
  Eye,
  MessageCircle
} from "lucide-react";
import toast from "react-hot-toast";

interface ClientLead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  inquiryType: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function ClientLeadsPage() {
  const [leads, setLeads] = useState<ClientLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<ClientLead | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLeads = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLeads(data.data);
        if (showToast) toast.success("Leads refreshed.");
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      toast.error("Failed to load client leads.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Toggle read status
  const toggleReadStatus = async (lead: ClientLead, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = !lead.read;
    
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, read: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === lead.id) {
      setSelectedLead({ ...selectedLead, read: newStatus });
    }

    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, read: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(newStatus ? "Marked as read." : "Marked as unread.");
    } catch (err) {
      // Revert on error
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, read: lead.read } : l))
      );
      toast.error("Failed to update status.");
    }
  };

  // Delete lead
  const handleDeleteLead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
        toast.success("Lead removed successfully.");
      } else {
        toast.error(data.error || "Failed to delete lead.");
      }
    } catch (err) {
      toast.error("Error deleting lead.");
    } finally {
      setDeletingId(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast.error("No leads to export.");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Inquiry Type", "Status", "Date", "Message"];
    const rows = filteredLeads.map((l) => [
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${(l.inquiryType || "General").replace(/"/g, '""')}"`,
      `"${l.read ? "Read" : "Unread"}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`,
      `"${(l.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mfreuae_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leads exported to CSV.");
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Status filter
      if (statusFilter === "UNREAD" && lead.read) return false;
      if (statusFilter === "READ" && !lead.read) return false;

      // Inquiry type filter
      if (typeFilter !== "ALL" && lead.inquiryType?.toLowerCase() !== typeFilter.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = lead.name?.toLowerCase().includes(query);
        const matchEmail = lead.email?.toLowerCase().includes(query);
        const matchPhone = lead.phone?.toLowerCase().includes(query);
        const matchMessage = lead.message?.toLowerCase().includes(query);
        const matchType = lead.inquiryType?.toLowerCase().includes(query);
        return matchName || matchEmail || matchPhone || matchMessage || matchType;
      }

      return true;
    });
  }, [leads, statusFilter, typeFilter, searchQuery]);

  // Metrics
  const totalCount = leads.length;
  const unreadCount = leads.filter((l) => !l.read).length;
  const readCount = leads.filter((l) => l.read).length;

  // Extract distinct inquiry types
  const inquiryTypes = useMemo(() => {
    const types = new Set<string>();
    leads.forEach((l) => {
      if (l.inquiryType) types.add(l.inquiryType);
    });
    return Array.from(types);
  }, [leads]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 pb-16 font-sans">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/15 text-brand-black border border-brand-gold/30 mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-brand-gold" />
            <span>Client Relationship Management (CRM)</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-brand-black">
            Client Leads & Inquiries
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review incoming property inquiries, investor consultations, and advisory requests.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => fetchLeads(true)}
            disabled={refreshing}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-black hover:bg-brand-gold hover:text-brand-black text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Inquiries */}
        <div 
          onClick={() => setStatusFilter("ALL")}
          className={`p-6 rounded-3xl shadow-sm border transition-all cursor-pointer ${
            statusFilter === "ALL" 
              ? "bg-white border-brand-gold ring-2 ring-brand-gold/20" 
              : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Leads</span>
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-brand-black">{totalCount}</h3>
          <p className="text-xs text-gray-400 mt-1">All incoming website inquiries</p>
        </div>

        {/* Unread Leads */}
        <div 
          onClick={() => setStatusFilter("UNREAD")}
          className={`p-6 rounded-3xl shadow-sm border transition-all cursor-pointer ${
            statusFilter === "UNREAD" 
              ? "bg-white border-brand-gold ring-2 ring-brand-gold/20" 
              : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending Follow-up</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-brand-black">{unreadCount}</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Action Required
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">Unread messages needing review</p>
        </div>

        {/* Completed Leads */}
        <div 
          onClick={() => setStatusFilter("READ")}
          className={`p-6 rounded-3xl shadow-sm border transition-all cursor-pointer ${
            statusFilter === "READ" 
              ? "bg-white border-brand-gold ring-2 ring-brand-gold/20" 
              : "bg-white border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Contacted / Read</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-brand-black">{readCount}</h3>
          <p className="text-xs text-gray-400 mt-1">Reviewed and handled inquiries</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, phone, or keyword..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Select */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "ALL" ? "bg-white text-brand-black shadow-xs font-bold" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter("UNREAD")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "UNREAD" ? "bg-amber-100 text-amber-900 shadow-xs font-bold" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setStatusFilter("READ")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === "READ" ? "bg-emerald-100 text-emerald-900 shadow-xs font-bold" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Read ({readCount})
            </button>
          </div>

          {/* Inquiry Type Dropdown */}
          {inquiryTypes.length > 0 && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 cursor-pointer"
            >
              <option value="ALL">All Inquiry Types</option>
              {inquiryTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Leads Content List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Loading client leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-24 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-brand-black">No client leads found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              {searchQuery || statusFilter !== "ALL" || typeFilter !== "ALL"
                ? "Try clearing your search query or adjusting your filters to see more results."
                : "New client inquiries submitted via the contact desk and property pages will appear here in real time."}
            </p>
            {(searchQuery || statusFilter !== "ALL" || typeFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                  setTypeFilter("ALL");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-brand-black transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredLeads.map((lead) => {
              const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9+]/g, "") : "";
              const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone.replace("+", "")}` : null;

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-5 md:p-6 transition-all cursor-pointer hover:bg-gray-50/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    !lead.read ? "bg-[#d4af37]/[0.03]" : ""
                  }`}
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Status Dot & Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-black to-gray-800 text-brand-gold font-bold flex items-center justify-center text-base shadow-sm">
                        {lead.name ? lead.name.charAt(0).toUpperCase() : "C"}
                      </div>
                      {!lead.read && (
                        <span 
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white ring-2 ring-amber-100" 
                          title="Unread"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-brand-black text-base truncate">
                          {lead.name}
                        </h4>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-black border border-brand-gold/25">
                          {lead.inquiryType || "General"}
                        </span>
                        {!lead.read && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">
                        {lead.message}
                      </p>

                      {/* Contact Info Pills */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                        {lead.email && (
                          <span className="inline-flex items-center gap-1.5 text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-brand-gold" />
                            <span>{lead.email}</span>
                          </span>
                        )}
                        {lead.phone && (
                          <span className="inline-flex items-center gap-1.5 text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-brand-gold" />
                            <span>{lead.phone}</span>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(lead.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {/* Direct WhatsApp */}
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        title="Open WhatsApp Chat"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}

                    {/* Direct Email */}
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}?subject=Inquiry Response - Mohd. Alfalasi Real Estate`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-brand-black transition-colors"
                        title="Send Direct Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}

                    {/* Toggle Read */}
                    <button
                      onClick={(e) => toggleReadStatus(lead, e)}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        lead.read 
                          ? "border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600" 
                          : "border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold"
                      }`}
                      title={lead.read ? "Mark as Unread" : "Mark as Read"}
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    {/* View Details */}
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="px-3.5 py-2.5 rounded-xl border border-brand-gold/40 bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-black text-brand-black font-semibold text-xs transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => handleDeleteLead(lead.id, e)}
                      disabled={deletingId === lead.id}
                      className="p-2.5 rounded-xl border border-red-100 hover:border-red-200 bg-white hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-black text-brand-gold font-bold flex items-center justify-center text-lg">
                  {selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-black">{selectedLead.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-black">
                      {selectedLead.inquiryType || "General"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Received {formatDate(selectedLead.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</span>
                  <p className="text-sm font-semibold text-brand-black">
                    {selectedLead.email ? (
                      <a href={`mailto:${selectedLead.email}`} className="text-brand-gold hover:underline">
                        {selectedLead.email}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone Number</span>
                  <p className="text-sm font-semibold text-brand-black">
                    {selectedLead.phone ? (
                      <a href={`tel:${selectedLead.phone}`} className="hover:underline">
                        {selectedLead.phone}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Inquiry Message
                </label>
                <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message}
                </div>
              </div>

              {/* Status Banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${selectedLead.read ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                  <span className="text-xs font-semibold text-gray-700">
                    Status: {selectedLead.read ? "Reviewed & Handled" : "Pending Follow-up"}
                  </span>
                </div>

                <button
                  onClick={() => toggleReadStatus(selectedLead)}
                  className="text-xs font-bold text-brand-gold hover:underline cursor-pointer"
                >
                  {selectedLead.read ? "Mark as Unread" : "Mark as Read"}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/30">
              <button
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Delete Lead
              </button>

              <div className="flex items-center gap-2.5">
                {selectedLead.phone && (
                  <a
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {selectedLead.email && (
                  <a
                    href={`mailto:${selectedLead.email}?subject=Follow-up: Your Inquiry with Mohd. Alfalasi Real Estate`}
                    className="px-5 py-2.5 rounded-xl bg-brand-black hover:bg-brand-gold hover:text-brand-black text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
