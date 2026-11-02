"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OffPlanListingCard from "@/components/offplan/OffPlanListingCard";
import { ProjectShowcase } from "@/components/offplan/projects";

export default function OffPlanProjectPage({ params }: { params: Promise<{ slug: string; project: string }> }) {
  const { slug, project: projectSlug } = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${encodeURIComponent(projectSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProject(data.data);
      })
      .catch((err) => console.error("Error fetching project:", err))
      .finally(() => setLoading(false));
  }, [projectSlug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#faf9f7] pt-32 pb-20 px-6 text-center">
        <h1 className="text-3xl font-serif text-brand-black mb-3">Project Not Found</h1>
        <p className="text-gray-500 mb-8">This project is no longer listed.</p>
        <Link href={`/off-plan/${slug}`} className="px-6 py-3 bg-brand-gold text-white rounded-full font-medium hover:bg-brand-black transition-colors">
          Back to Developer
        </Link>
      </main>
    );
  }

  const developer = project.developer;
  const listings: any[] = project.listings || [];
  const devSummary = { id: developer.id, name: developer.name, slug: developer.slug, logo: developer.logo };

  return (
    <main className="min-h-screen bg-[#faf9f7] pb-20">
      <ProjectShowcase
        project={project}
        headingLevel="h1"
        topLeft={
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.15em] text-white/70">
            <Link href={`/off-plan/${developer.slug}`} className="flex items-center gap-1.5 text-white hover:text-brand-gold transition-colors mr-3">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <Link href="/off-plan" className="hover:text-white">Off Plan</Link>
            <span>/</span>
            <Link href={`/off-plan/${developer.slug}`} className="hover:text-white">{developer.name}</Link>
          </nav>
        }
      />

      <section id="properties" className="w-full mx-auto px-6 lg:px-12 pt-14 md:pt-20 scroll-mt-24">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="font-serif text-2xl md:text-4xl uppercase tracking-[0.25em] text-brand-black">Available Properties</h2>
          {listings.length > 0 && (
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-3">
              {listings.length} {listings.length === 1 ? "property" : "properties"} in {project.name}
            </p>
          )}
        </div>
        {listings.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100">
            <h3 className="text-2xl font-serif text-brand-black mb-2">Units Releasing Soon</h3>
            <p className="text-gray-500 mb-6">Contact us for the latest availability and prices in {project.name}.</p>
            <Link href="/contact" className="px-6 py-3 bg-brand-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-gold hover:text-brand-black transition-colors">
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
