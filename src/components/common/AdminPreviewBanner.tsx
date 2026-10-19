"use client";

import React from "react";
import Link from "next/link";
import { Construction, Settings, ShieldAlert, ArrowRight } from "lucide-react";

export default function AdminPreviewBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-600 via-brand-gold to-amber-600 text-brand-black px-4 py-2.5 shadow-md relative z-[100] text-xs font-semibold">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
          <Construction className="w-4 h-4 text-brand-black shrink-0" />
          <span>
            <strong>ADMIN PREVIEW MODE:</strong> "Under Construction" is currently <strong>ACTIVE</strong>. Regular visitors see the Under Construction page.
          </span>
        </div>

        <Link
          href="/admin/under-construction"
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-black hover:bg-gray-800 text-white rounded-lg text-xs font-bold transition-all shrink-0"
        >
          <Settings className="w-3.5 h-3.5 text-brand-gold" />
          <span>Under Construction Settings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
