"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Construction, 
  Save, 
  Loader2, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Layers,
  Globe
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUnderConstructionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isActive, setIsActive] = useState(false);
  const [title, setTitle] = useState("Something Extraordinary is Coming Soon");
  const [message, setMessage] = useState(
    "We are meticulously crafting a new digital experience for MFRE. Our premium selection of Dubai's most exclusive properties will be available shortly."
  );
  const [customPhone, setCustomPhone] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          data.forEach((item: { key: string; value: string }) => {
            if (item.key === "under_construction") {
              setIsActive(item.value === "true");
            } else if (item.key === "under_construction_title") {
              if (item.value) setTitle(item.value);
            } else if (item.key === "under_construction_message") {
              if (item.value) setMessage(item.value);
            } else if (item.key === "contact_phone" && !customPhone) {
              setCustomPhone(item.value);
            } else if (item.key === "contact_email" && !customEmail) {
              setCustomEmail(item.value);
            }
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load under construction settings", err);
        setLoading(false);
      });
  }, []);

  const handleToggle = async (newStatus: boolean) => {
    setIsActive(newStatus);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "under_construction",
          value: newStatus ? "true" : "false",
        }),
      });

      if (res.ok) {
        toast.success(
          newStatus
            ? "Under Construction mode turned ON. Public visitors now see the under construction page."
            : "Under Construction mode turned OFF. Website is now live for all visitors!"
        );
      } else {
        throw new Error();
      }
    } catch (e) {
      setIsActive(!newStatus);
      toast.error("Failed to update status. Please try again.");
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const settingsPayload = {
        under_construction: isActive ? "true" : "false",
        under_construction_title: title.trim(),
        under_construction_message: message.trim(),
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsPayload }),
      });

      if (res.ok) {
        toast.success("Under Construction configuration saved successfully!");
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
        <p className="text-xs uppercase tracking-wider text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 pb-16 font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/15 text-brand-black border border-brand-gold/30 mb-3">
            <Construction className="w-3.5 h-3.5 text-brand-gold" />
            <span>Site Mode & Maintenance Controls</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-brand-black">
            Under Construction Mode
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Activate or deactivate the public Under Construction page and customize visitor messaging.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/under-construction"
            target="_blank"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all shadow-sm"
          >
            <Eye className="w-4 h-4 text-brand-gold" />
            <span>Preview Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Big Master Toggle Switch Card */}
      <div className={`rounded-3xl p-6 md:p-8 border transition-all duration-300 shadow-sm ${
        isActive 
          ? "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-300 ring-2 ring-amber-300/30" 
          : "bg-white border-gray-100"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isActive 
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" 
                : "bg-gray-100 text-gray-500"
            }`}>
              <Construction className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-brand-black">
                  Under Construction Status
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isActive 
                    ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse" 
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                }`}>
                  {isActive ? "ACTIVE (ON)" : "INACTIVE (OFF)"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
                {isActive ? (
                  <span className="text-amber-800 font-medium">
                    🔴 <strong>Under Construction mode is currently ON.</strong> All regular website visitors will be shown the Under Construction page. Logged-in administrators can still preview the live site.
                  </span>
                ) : (
                  <span>
                    🟢 <strong>Website is currently LIVE.</strong> All public pages (Homepage, Buy, Rent, About, Services) are fully accessible to visitors.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* iOS Style Luxury Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isActive ? "Turn OFF" : "Turn ON"}
            </span>
            <button
              type="button"
              onClick={() => handleToggle(!isActive)}
              className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                isActive ? "bg-amber-500 shadow-md shadow-amber-500/30" : "bg-gray-300"
              }`}
              role="switch"
              aria-checked={isActive}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                  isActive ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Content Customization Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-black">Customize Under Construction Page</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Edit the headline and message displayed to visitors when this mode is enabled.
            </p>
          </div>
          <span className="text-xs font-bold text-brand-gold bg-brand-gold/15 px-3 py-1 rounded-full">
            VIP Lead Capture Active
          </span>
        </div>

        <form onSubmit={handleSaveContent} className="p-6 md:p-8 space-y-6">
          {/* Headline */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Page Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-sm font-medium"
              placeholder="e.g. Crafting an Elevated Luxury Real Estate Experience"
            />
            <p className="text-xs text-gray-400 mt-1.5">Main bold heading shown prominently on the maintenance screen.</p>
          </div>

          {/* Subtitle / Message */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Maintenance Message
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-sm leading-relaxed"
              placeholder="Describe why the site is updating and when visitors can expect your return..."
            />
            <p className="text-xs text-gray-400 mt-1.5">Detailed explanation informing clients and investors.</p>
          </div>

          {/* Features note */}
          <div className="p-4 rounded-2xl bg-brand-gold/5 border border-brand-gold/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-brand-black">Automatic VIP Lead Capture:</span>
              <p className="mt-0.5 text-gray-500">
                While Under Construction mode is enabled, the page automatically includes your contact phone, WhatsApp link, and a VIP Registration form. Any client inquiries submitted are instantly saved to your <Link href="/admin/leads" className="font-semibold text-brand-gold underline">Client Leads CRM</Link>.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/under-construction"
              target="_blank"
              className="text-xs font-bold text-gray-500 hover:text-brand-black inline-flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live Appearance</span>
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="bg-brand-black hover:bg-brand-gold hover:text-brand-black text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
