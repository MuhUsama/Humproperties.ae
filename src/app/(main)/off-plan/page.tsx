"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OffPlanDeveloper } from "@/components/offplan/OffPlanListingCard";
import { OffPlanProject, ProjectCard, Slider, projectHref } from "@/components/offplan/projects";
import FaqSection from "@/components/common/FaqSection";
import { getFaqsByCategory } from "@/lib/faqData";

type Developer = OffPlanDeveloper & { coverImage?: string | null };

const OFF_PLAN_FAQS = getFaqsByCategory("off-plan");

export default function OffPlanPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projects, setProjects] = useState<OffPlanProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/developers").then((res) => res.json()),
      fetch("/api/projects").then((res) => res.json()),
    ])
      .then(([devData, projectData]) => {
        if (devData.success) setDevelopers(devData.data);
        if (projectData.success) setProjects(projectData.data);
      })
      .catch((err) => console.error("Error loading off plan data:", err))
      .finally(() => setLoading(false));
  }, []);

  // One row per developer that has projects, in the developers' order
  const rows = useMemo(
    () =>
      developers
        .map((dev) => ({ dev, projects: projects.filter((p) => p.developerId === dev.id) }))
        .filter((row) => row.projects.length > 0),
    [developers, projects]
  );

  return (
    <main className="min-h-screen bg-[#faf9f7] pt-32 md:pt-36">

      {/* Developers carousel */}
      {!loading && developers.length > 0 && (
        <section className="w-full mx-auto px-6 lg:px-12 pt-4 md:pt-8">
          <h1 className="text-center font-serif text-2xl md:text-4xl uppercase tracking-[0.25em] text-brand-black mb-8 md:mb-10">
            Off-Plan Developers
          </h1>
          <DeveloperCarousel developers={developers} />
        </section>
      )}

      {/* Each developer's projects */}
      <section id="projects" className="w-full mx-auto px-6 lg:px-12 pt-10 md:pt-16 pb-6 scroll-mt-24">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100">
            <h3 className="text-2xl font-serif text-brand-black mb-2">New Launches Coming Soon</h3>
            <p className="text-gray-500">Contact us for early access to upcoming off plan projects.</p>
          </div>
        ) : (
          <div className="space-y-14 md:space-y-20">
            {rows.map(({ dev, projects: devProjects }) => (
              <div key={dev.id}>
                <div className="flex items-end justify-between gap-4 mb-6">
                  <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-[0.12em] text-brand-black">
                    {dev.name} Projects
                  </h2>
                  <Link
                    href={`/off-plan/${dev.slug}`}
                    className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-black border-b border-brand-black pb-0.5 hover:text-brand-gold hover:border-brand-gold transition-colors"
                  >
                    View all<span className="hidden sm:inline"> {dev.name}</span>
                  </Link>
                </div>
                <Slider count={devProjects.length} label={`${dev.name} projects`}>
                  {devProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} href={projectHref(dev.slug, project)} />
                  ))}
                </Slider>
              </div>
            ))}
          </div>
        )}
      </section>

      <FaqSection faqs={OFF_PLAN_FAQS} title="Frequently Asked Questions" subtitle="Everything you need to know about buying off plan in Dubai." />

      {/* SEO / editorial blocks */}
      <section className="w-full mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-6xl mx-auto">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-black mb-4">Ready to explore off-plan in Dubai?</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Off plan lets you secure a new home or investment at launch pricing, with payments spread across construction. We shortlist projects from developers with a proven delivery record and walk you through every step to handover.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-black mb-4">Top locations in Dubai</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Downtown Dubai, Dubai Hills Estate, Palm Jumeirah, Dubai Creek Harbour and Mohammed Bin Rashid City continue to lead on demand, rental yield and long-term capital growth.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-black mb-4">What actually matters</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              The developer&apos;s history, their handover record, how the surrounding area is growing, and who will want to rent or buy the home once it is complete. These matter more than launch-day brochures.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-brand-black mb-4">Why clients trust our timing</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              We follow launches, price movements and resale activity daily, so you hear about the right project early. When you&apos;re ready, <Link href="/contact" className="text-brand-gold font-medium hover:underline">let&apos;s talk</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function DeveloperCarousel({ developers }: { developers: Developer[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setPageCount(Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.01)));
      setPage(Math.round(track.scrollLeft / track.clientWidth));
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [developers.length]);

  const goTo = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(pageCount - 1, target));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-1.5"
      >
        {developers.map((dev) => (
          <Link
            key={dev.id}
            href={`/off-plan/${dev.slug}`}
            className="group relative flex-shrink-0 basis-1/2 sm:basis-1/3 lg:basis-1/5 snap-start px-1.5"
            aria-label={dev.name}
          >
            <div className="relative aspect-square overflow-hidden bg-brand-black">
              {dev.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dev.coverImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dev.logo} alt={dev.name} className="max-w-full max-h-[45%] object-contain brightness-0 invert" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {pageCount > 1 && (
        <>
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Previous developers"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-gray-200 text-brand-black disabled:opacity-30 hover:bg-brand-black hover:text-white transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= pageCount - 1}
            aria-label="Next developers"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-gray-200 text-brand-black disabled:opacity-30 hover:bg-brand-black hover:text-white transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`h-1.5 transition-all ${i === page ? "w-8 bg-brand-black" : "w-4 bg-gray-300"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
