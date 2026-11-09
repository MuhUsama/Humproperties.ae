"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectRing from "@/components/offplan/ProjectRing";

export type OffPlanProject = {
  id: string;
  name: string;
  slug: string;
  developerId: string;
  coverImage?: string | null;
  galleryImages?: string[];
  location?: string | null;
  propertyTypes?: string | null;
  bedrooms?: string | null;
  startingPrice?: string | null;
  handover?: string | null;
  discount?: string | null;
  description?: string | null;
};

export const projectHref = (developerSlug: string, project: { slug: string }) => `/off-plan/${developerSlug}/${project.slug}`;

// Horizontal snap slider with arrows and page dots. Items size themselves with a `basis-*` class.
// With `autoPlayMs`, each item gets that long in turn (the row slides to bring it into view),
// and `onFinished` is called once the last one has had its turn.
export function Slider({
  children,
  count,
  label,
  autoPlayMs,
  paused = false,
  onFinished,
}: {
  children: React.ReactNode;
  count: number;
  label: string;
  autoPlayMs?: number;
  paused?: boolean;
  onFinished?: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    if (!autoPlayMs || paused) return;
    const timer = window.setTimeout(() => {
      const next = turn + 1;
      if (next >= count) {
        onFinished?.();
        return;
      }
      setTurn(next);
      // Bring item `next` into view if it isn't already
      const track = trackRef.current;
      const item = track?.children[next] as HTMLElement | undefined;
      if (track && item) {
        const left = item.offsetLeft - (track.children[0] as HTMLElement).offsetLeft;
        if (left + item.offsetWidth > track.scrollLeft + track.clientWidth + 1) {
          track.scrollTo({ left, behavior: "smooth" });
        }
      }
    }, autoPlayMs);
    return () => window.clearTimeout(timer);
  }, [autoPlayMs, paused, turn, count, onFinished]);

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
  }, [count]);

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
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-2"
      >
        {children}
      </div>
      {pageCount > 1 && (
        <>
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label={`Previous ${label}`}
            className="hidden md:flex absolute -left-5 top-[40%] -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-gray-200 text-brand-black disabled:opacity-0 hover:bg-brand-black hover:text-white transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= pageCount - 1}
            aria-label={`Next ${label}`}
            className="hidden md:flex absolute -right-5 top-[40%] -translate-y-1/2 w-10 h-10 items-center justify-center bg-white border border-gray-200 text-brand-black disabled:opacity-0 hover:bg-brand-black hover:text-white transition-all z-10"
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

// Card widths for a row of `count` cards: when there are fewer cards than fit in a row,
// they widen to fill it, so the row never ends in an empty gap.
function cardSizing(count: number) {
  // A lone card on a wide screen sits photo-left, details-right instead of becoming one huge photo
  if (count <= 1)
    return {
      width: "basis-full",
      card: "lg:flex-row",
      photo: "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] lg:w-2/3 lg:flex-shrink-0",
      body: "lg:p-10 lg:justify-center lg:[&>*]:mt-0",
    };
  if (count === 2) return { width: "basis-[85%] sm:basis-1/2", card: "", photo: "aspect-[4/3] lg:aspect-[16/9]", body: "" };
  if (count === 3) return { width: "basis-[85%] sm:basis-1/2 lg:basis-1/3", card: "", photo: "aspect-[4/3]", body: "" };
  return { width: "basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4", card: "", photo: "aspect-[4/3]", body: "" };
}

// Card used in the developer rows on /off-plan. Only filled-in details are shown.
// `count` is how many cards share the row (defaults to a full row of 4).
export function ProjectCard({ project, href, count = 4 }: { project: OffPlanProject; href: string; count?: number }) {
  const sizing = cardSizing(count);
  const tag = project.discount;
  const stats = [
    project.startingPrice && { value: project.startingPrice, label: "Starting price" },
    project.handover && { value: project.handover, label: "Handover" },
    project.propertyTypes && { value: project.propertyTypes, label: project.bedrooms || "Property type" },
].filter(Boolean) as { value: string; label: string }[];

  return (
    <Link
      href={href}
      className={`group flex-shrink-0 ${sizing.width} snap-start px-2`}
    >
      <div className={`bg-white h-full flex flex-col ${sizing.card} border border-gray-100 hover:shadow-xl transition-shadow duration-300`}>
        <div className={`relative ${sizing.photo} overflow-hidden bg-brand-black`}>
          {project.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImage}
              alt={project.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {tag && (
            <span className="absolute top-4 left-4 bg-brand-gold text-brand-black text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1.5">
              {tag}
            </span>
          )}
        </div>
        <div className={`p-5 flex-1 flex flex-col gap-4 ${sizing.body}`}>
          <div>
          <h3 className="font-serif text-2xl text-brand-black leading-tight">{project.name}</h3>
          {project.location && <p className="text-xs text-gray-500 mt-1">{project.location}</p>}
          </div>
          {stats.length > 0 && (
            <div className="flex justify-between gap-4 mt-auto pt-4 border-t border-gray-100">
              {stats.slice(0, 2).map((s, i) => (
                <div key={s.label} className={i === 1 ? "text-right" : ""}>
                  <div className="text-sm font-semibold text-brand-black">{s.value}</div>
                  <div className="text-[11px] text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// The 4 figures under a project title (discount, type, starting price, handover). Empty ones are left out.
export function ProjectStats({ project, dark = false }: { project: OffPlanProject; dark?: boolean }) {
  const stats = [
    project.discount && { value: project.discount, label: "Discount" },
    (project.propertyTypes || project.bedrooms) && {
      value: project.propertyTypes || project.bedrooms!,
      label: project.propertyTypes ? project.bedrooms || "Property type" : "Bedrooms",
    },
    project.startingPrice && { value: project.startingPrice, label: "Starting price" },
    project.handover && { value: project.handover, label: "Handover" },
  ].filter(Boolean) as { value: string; label: string }[];

  if (!stats.length) return null;

  return (
    <div className="flex flex-wrap justify-center">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`px-5 md:px-8 py-2 text-center basis-1/2 md:basis-auto ${i > 0 ? (dark ? "md:border-l md:border-brand-gold/40" : "md:border-l md:border-gray-300") : ""}`}
        >
          <div className={`text-lg md:text-2xl uppercase tracking-[0.18em] font-medium ${dark ? "text-white" : "text-brand-black"}`}>{s.value}</div>
          <div className={`text-[10px] md:text-[11px] uppercase tracking-[0.18em] mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// One project presented like a launch offer page: big photo, gold title, key figures, description,
// buttons and a photo slider. Used on the developer page (one per project) and at the top of the project page.
export function ProjectShowcase({
  project,
  propertiesHref,
  propertyCount,
  headingLevel = "h2",
  topLeft,
}: {
  project: OffPlanProject;
  propertiesHref?: string;
  propertyCount?: number;
  headingLevel?: "h1" | "h2";
  /** Shown over the top-left of the full-screen photo, e.g. a breadcrumb */
  topLeft?: React.ReactNode;
}) {
  const Heading = headingLevel;
  const gallery = (project.galleryImages || []).filter(Boolean);

  return (
    <article className="bg-[#1c1c1c] text-white">
      {project.coverImage ? (
        // Full-screen landing photo with the project name over it
        <div className="relative w-full h-[100svh] min-h-[520px] overflow-hidden flex items-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-black/25 to-black/40" />
          {topLeft && <div className="absolute top-28 md:top-32 left-6 lg:left-12 z-10">{topLeft}</div>}
          <div className="relative z-10 w-full px-6 lg:px-12 pb-14 md:pb-20 text-center">
            {project.location && (
              <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-white/80 mb-3">{project.location}</p>
            )}
            <Heading className="font-serif text-4xl md:text-7xl text-brand-gold tracking-[0.04em] leading-tight">
              {project.name}
            </Heading>
          </div>
        </div>
      ) : (
        topLeft && <div className="px-6 lg:px-12 pt-28 md:pt-32">{topLeft}</div>
      )}

      <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 py-10 md:py-14 text-center">
        {!project.coverImage && (
          <Heading className="font-serif text-3xl md:text-5xl text-brand-gold tracking-[0.04em] leading-tight">
            {project.name}
          </Heading>
        )}

        <div className={project.coverImage ? "" : "mt-8"}>
          <ProjectStats project={project} dark />
        </div>

        {(project.description || project.location) && (
          <div className="max-w-3xl mx-auto mt-8 text-sm md:text-base leading-relaxed text-gray-300 font-light">
            {project.description && <p className="whitespace-pre-line">{project.description}</p>}
            {project.location && (
              <p className="mt-3">
                Location: <span className="font-semibold text-white">{project.location}</span>
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {propertiesHref && (
            <Link
              href={propertiesHref}
              className="px-7 py-3 rounded-full bg-brand-gold text-brand-black text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-white transition-colors"
            >
              View properties{propertyCount ? ` (${propertyCount})` : ""}
            </Link>
          )}
          <Link
            href="/contact"
            className="px-7 py-3 rounded-full border border-brand-gold text-brand-gold text-[11px] font-bold uppercase tracking-[0.22em] hover:bg-brand-gold hover:text-brand-black transition-colors"
          >
            Enquire now
          </Link>
        </div>
      </div>

      {gallery.length > 0 && (
        <div className="pb-12 md:pb-16">
          <ProjectRing images={gallery} name={project.name} />
        </div>
      )}
    </article>
  );
}
