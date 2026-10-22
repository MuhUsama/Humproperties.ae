"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Globe } from "lucide-react";
import OffPlanListingCard from "@/components/offplan/OffPlanListingCard";

export default function DeveloperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [developer, setDeveloper] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/developers/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDeveloper(data.data);
      })
      .catch((err) => console.error("Error fetching developer:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!developer) {
    return (
      <main className="min-h-screen bg-[#faf9f7] pt-32 pb-20 px-6 text-center">
        <h1 className="text-3xl font-serif text-brand-black mb-3">Developer Not Found</h1>
        <p className="text-gray-500 mb-8">This developer is no longer listed.</p>
        <Link href="/off-plan" className="px-6 py-3 bg-brand-gold text-white rounded-full font-medium hover:bg-brand-black transition-colors">
          Back to Off Plan
        </Link>
      </main>
    );
  }

  const listings: any[] = developer.listings || [];
  const devSummary = { id: developer.id, name: developer.name, slug: developer.slug, logo: developer.logo };

  return (
    <main className="min-h-screen bg-[#faf9f7] pt-20 pb-20">

      {/* Hero */}
      <section className="relative w-full p-5 md:p-10 lg:p-12">
        <div className="relative w-full min-h-[420px] md:min-h-[480px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-end">
          {developer.coverImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={developer.coverImage} alt={developer.name} className="absolute inset-0 w-full h-full object-cover z-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-0" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent opacity-50 z-0"></div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
            </>
          )}

          <Link href="/off-plan" className="absolute top-6 left-6 md:top-8 md:left-10 z-20 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Developers
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full px-6 pb-10 pt-24 md:px-12 md:pb-14 flex flex-col md:flex-row md:items-end gap-6 md:gap-10"
          >
            <div className="w-40 h-28 md:w-52 md:h-36 bg-white rounded-2xl p-5 flex items-center justify-center flex-shrink-0 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={developer.logo} alt={developer.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Off Plan Developer</span>
              <h1 className="text-4xl md:text-6xl font-serif text-white mt-2">{developer.name}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-300">
                <span>{listings.length} {listings.length === 1 ? "Project" : "Projects"} Available</span>
                {developer.website && (
                  <a href={developer.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Globe className="w-4 h-4" /> Official Website
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      {developer.description && (
        <section className="w-full mx-auto px-6 lg:px-12 pt-8 md:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-16">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-gold">About</span>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-black mt-3">About {developer.name}</h2>
            </div>
            <p className="lg:col-span-2 text-gray-600 font-light leading-relaxed whitespace-pre-line text-base md:text-lg">
              {developer.description}
            </p>
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="w-full mx-auto px-6 lg:px-12 pt-16 md:pt-20">
        <h2 className="text-3xl md:text-4xl font-serif text-brand-black mb-8">
          Projects by {developer.name}
        </h2>
        {listings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <h3 className="text-2xl font-serif text-brand-black mb-2">New Launches Coming Soon</h3>
            <p className="text-gray-500 mb-6">Contact us for early access to upcoming {developer.name} projects.</p>
            <Link href="/contact" className="px-6 py-3 bg-brand-gold text-white rounded-full font-medium hover:bg-brand-black transition-colors">
              Register Interest
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {listings.map((prop, idx) => (
              <OffPlanListingCard key={prop.id} property={prop} developer={devSummary} index={idx} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
