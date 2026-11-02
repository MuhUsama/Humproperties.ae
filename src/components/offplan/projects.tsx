"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
export function Slider({ children, count, label }: { children: React.ReactNode; count: number; label: string }) {
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

// Card used in the developer rows on /off-plan. Only filled-in details are shown.
export function ProjectCard({ project, href }: { project: OffPlanProject; href: string }) {
  const tag = project.discount;
  const stats = [
    project.startingPrice && { value: project.startingPrice, label: "Starting price" },
    project.handover && { value: project.handover, label: "Handover" },
    project.propertyTypes && { value: project.propertyTypes, label: project.bedrooms || "Property type" },
].filter(Boolean) as { value: string; label: string }[];

  return (
    <Link
      href={href}
      className="group flex-shrink-0 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 snap-start px-2"
    >
      <div className="bg-white h-full flex flex-col border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-black">
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
        <div className="p-5 flex-1 flex flex-col gap-4">
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

// Coverflow-style photo slider: the middle photo is large, its neighbours smaller and faded. Click opens a lightbox.
export function ProjectGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const count = images.length;

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [lightbox, count]);

  if (!count) return null;

  const offsetOf = (i: number) => {
    let d = i - active;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

  return (
    <div className="relative">
      <div className="relative h-[220px] sm:h-[300px] md:h-[380px] overflow-hidden">
        {images.map((src, i) => {
          const d = offsetOf(i);
          const abs = Math.abs(d);
          if (abs > 2) return null;
          const scale = abs === 0 ? 1 : abs === 1 ? 0.78 : 0.6;
          const shift = d * (abs === 1 ? 52 : 46);
          return (
            <button
              key={src + i}
              onClick={() => (d === 0 ? setLightbox(i) : setActive(i))}
              aria-label={d === 0 ? `Open photo ${i + 1} of ${name}` : `Show photo ${i + 1}`}
              className="absolute left-1/2 top-1/2 w-[70%] sm:w-[52%] md:w-[42%] aspect-[3/2] transition-all duration-500 ease-out"
              style={{
                transform: `translate(-50%, -50%) translateX(${shift}%) scale(${scale})`,
                zIndex: 10 - abs,
                opacity: abs === 0 ? 1 : abs === 1 ? 0.75 : 0.4,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${name} photo ${i + 1}`} className="w-full h-full object-cover shadow-2xl" />
            </button>
          );
        })}
      </div>
      {count > 1 && (
        <div className="flex justify-center items-center gap-6 mt-4">
          <button onClick={() => setActive((active - 1 + count) % count)} aria-label="Previous photo" className="w-10 h-10 flex items-center justify-center border border-brand-gold/60 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs tracking-[0.2em] text-gray-400">{active + 1} / {count}</span>
          <button onClick={() => setActive((active + 1) % count)} aria-label="Next photo" className="w-10 h-10 flex items-center justify-center border border-brand-gold/60 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {lightbox !== null && (
        <div className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} aria-label="Close" className="absolute top-5 right-5 text-white/80 hover:text-white p-2">
            <X className="w-7 h-7" />
          </button>
          {count > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + count) % count); }}
              aria-label="Previous photo"
              className="absolute left-3 md:left-8 text-white/80 hover:text-white p-2"
            >
              <ChevronLeft className="w-9 h-9" />
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[lightbox]} alt={`${name} photo ${lightbox + 1}`} className="max-w-[90vw] max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
          {count > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % count); }}
              aria-label="Next photo"
              className="absolute right-3 md:right-8 text-white/80 hover:text-white p-2"
            >
              <ChevronRight className="w-9 h-9" />
            </button>
          )}
        </div>
      )}
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
}: {
  project: OffPlanProject;
  propertiesHref?: string;
  propertyCount?: number;
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  const gallery = (project.galleryImages || []).filter(Boolean);

  return (
    <article className="bg-[#1c1c1c] text-white">
      {project.coverImage && (
        <div className="relative w-full h-[260px] sm:h-[380px] md:h-[520px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.coverImage} alt={project.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1c1c1c] to-transparent" />
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 py-10 md:py-14 text-center">
        <Heading className="font-serif text-3xl md:text-5xl text-brand-gold tracking-[0.04em] leading-tight">
          {project.name}
        </Heading>

        <div className="mt-8">
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
          <ProjectGallery images={gallery} name={project.name} />
        </div>
      )}
    </article>
  );
}
