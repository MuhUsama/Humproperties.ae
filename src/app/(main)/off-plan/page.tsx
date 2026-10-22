"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, CalendarClock, TrendingUp, Building2 } from "lucide-react";
import OffPlanListingCard, { OffPlanDeveloper } from "@/components/offplan/OffPlanListingCard";
import FaqSection from "@/components/common/FaqSection";
import { getFaqsByCategory } from "@/lib/faqData";
import { isOffPlanStatus } from "@/lib/listingStatus";

type Developer = OffPlanDeveloper & { description?: string | null };

const OFF_PLAN_FAQS = getFaqsByCategory("off-plan");

const WHY_OFF_PLAN = [
  {
    icon: CalendarClock,
    title: "Flexible Payment Plans",
    desc: "Spread the cost across construction milestones, with many developers offering post-handover instalments.",
  },
  {
    icon: ShieldCheck,
    title: "Escrow Protection",
    desc: "Every project is registered with DLD and RERA, and your payments are held in a regulated escrow account.",
  },
  {
    icon: TrendingUp,
    title: "Capital Growth",
    desc: "Launch prices are typically below the value of completed homes, giving early buyers room for appreciation.",
  },
  {
    icon: Building2,
    title: "Brand-New Homes",
    desc: "Modern layouts, the latest specifications and full developer warranties from the day you move in.",
  },
];

export default function OffPlanPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDeveloper, setActiveDeveloper] = useState<string>("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/developers").then((res) => res.json()),
      fetch("/api/listings").then((res) => res.json()),
    ])
      .then(([devData, listingData]) => {
        if (devData.success) setDevelopers(devData.data);
        if (listingData.success) setListings(listingData.data.filter((l: any) => isOffPlanStatus(l.status)));
      })
      .catch((err) => console.error("Error loading off plan data:", err))
      .finally(() => setLoading(false));
  }, []);

  const developerById = useMemo(
    () => Object.fromEntries(developers.map((d) => [d.id, d])),
    [developers]
  );

  const projectCount = (developerId: string) => listings.filter((l) => l.developerId === developerId).length;

  const displayedListings = activeDeveloper === "all"
    ? listings
    : listings.filter((l) => l.developerId === activeDeveloper);

  const developersWithProjects = developers.filter((d) => projectCount(d.id) > 0);

  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] pt-20">

      {/* Hero */}
      <section className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center min-h-[70svh]">
        <div className="relative w-full flex-1 min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-center justify-center text-center px-6 py-12 md:px-24 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent opacity-50 z-0"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-20 flex flex-col items-center">
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-5">Off Plan Projects</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-5 max-w-4xl leading-tight">
              Off Plan Projects, Apartments &amp; Villas for Sale in <span className="text-[#d4af37]">Dubai</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-light max-w-2xl mx-auto mb-8">
              Secure tomorrow&apos;s landmark homes at today&apos;s prices. Explore new launches from the UAE&apos;s most trusted developers, with flexible payment plans and expert guidance from first viewing to handover.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#developers" className="px-7 py-3 rounded-full bg-[#d4af37] text-brand-black text-sm font-bold tracking-wider uppercase hover:bg-white transition-colors">
                Browse Developers
              </a>
              <a href="#projects" className="px-7 py-3 rounded-full border border-white/30 text-white text-sm font-bold tracking-wider uppercase hover:bg-white/10 transition-colors">
                View Projects
              </a>
            </div>
            {!loading && (developers.length > 0 || listings.length > 0) && (
              <div className="flex items-center gap-10 mt-12 text-white">
                <div>
                  <div className="text-3xl md:text-4xl font-serif text-[#d4af37]">{developers.length}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mt-1">Developers</div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div>
                  <div className="text-3xl md:text-4xl font-serif text-[#d4af37]">{listings.length}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mt-1">Projects</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Developers */}
      <section id="developers" className="w-full mx-auto px-6 lg:px-12 pt-12 md:pt-20 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-gold">Our Developer Partners</span>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-black mt-3 mb-4">Explore by Developer</h2>
          <p className="text-gray-500 font-light">
            We work with the developers behind Dubai&apos;s most sought-after communities. Choose a developer to see their latest off plan launches.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : developers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <h3 className="text-2xl font-serif text-brand-black mb-2">Developers Coming Soon</h3>
            <p className="text-gray-500">Our off plan developer partners will be listed here shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {developers.map((dev, idx) => {
              const count = projectCount(dev.id);
              return (
                <motion.div
                  key={dev.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(idx, 8) * 0.06 }}
                >
                  <Link
                    href={`/off-plan/${dev.slug}`}
                    className="group h-full bg-white rounded-2xl border border-gray-100 hover:border-brand-gold/40 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    <div className="h-36 flex items-center justify-center px-8 py-6 bg-white border-b border-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={dev.logo}
                        alt={dev.name}
                        className="max-h-full max-w-full object-contain grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-serif text-2xl text-brand-black group-hover:text-brand-gold transition-colors mb-2">{dev.name}</h3>
                      {dev.description && (
                        <p className="text-sm text-gray-500 font-light line-clamp-3 mb-5">{dev.description}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {count} {count === 1 ? "Project" : "Projects"}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-black group-hover:text-brand-gold transition-colors">
                          View <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Projects */}
      {!loading && listings.length > 0 && (
        <section id="projects" className="w-full mx-auto px-6 lg:px-12 pt-16 md:pt-24 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-gold">New Launches</span>
              <h2 className="text-3xl md:text-5xl font-serif text-brand-black mt-3">Latest Off Plan Projects</h2>
            </div>
            {developersWithProjects.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveDeveloper("all")}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                    activeDeveloper === "all"
                      ? "bg-brand-black text-white shadow-md"
                      : "bg-white text-gray-500 hover:bg-gray-100 hover:text-brand-black border border-gray-100"
                  }`}
                >
                  All <span className="opacity-60 ml-1 font-medium text-xs">({listings.length})</span>
                </button>
                {developersWithProjects.map((dev) => (
                  <button
                    key={dev.id}
                    onClick={() => setActiveDeveloper(dev.id)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                      activeDeveloper === dev.id
                        ? "bg-brand-black text-white shadow-md"
                        : "bg-white text-gray-500 hover:bg-gray-100 hover:text-brand-black border border-gray-100"
                    }`}
                  >
                    {dev.name} <span className="opacity-60 ml-1 font-medium text-xs">({projectCount(dev.id)})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedListings.map((prop, idx) => (
              <OffPlanListingCard key={prop.id} property={prop} developer={developerById[prop.developerId]} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* Why off plan */}
      <section className="w-full mx-auto px-6 lg:px-12 pt-16 md:pt-24">
        <div className="bg-brand-black rounded-[2rem] md:rounded-[2.5rem] px-6 py-12 md:px-16 md:py-16">
          <div className="max-w-2xl mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Why Buy Off Plan</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white mt-3">What Actually Matters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_OFF_PLAN.map((item) => (
              <div key={item.title}>
                <div className="w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-[#d4af37]" />
                </div>
                <h3 className="text-white font-serif text-xl mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-white/10">
            <p className="text-gray-300 font-light max-w-xl">
              Not sure which launch fits your goals? Our advisors will share availability, payment plans and floor plans for any project.
            </p>
            <Link href="/contact" className="flex-shrink-0 px-7 py-3 rounded-full bg-[#d4af37] text-brand-black text-sm font-bold tracking-wider uppercase hover:bg-white transition-colors text-center">
              Speak to an Advisor
            </Link>
          </div>
        </div>
      </section>

      <FaqSection faqs={OFF_PLAN_FAQS} title="Buying Off Plan in Dubai" subtitle="Common questions about payment plans, protection and choosing a developer." />
    </main>
  );
}
