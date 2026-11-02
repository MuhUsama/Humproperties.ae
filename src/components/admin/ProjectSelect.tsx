"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Option = { id: string; name: string; developerId?: string; location?: string | null };

const selectClass =
  "w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all font-medium cursor-pointer";

// For an Off Plan listing the admin picks the developer, then one of its projects (managed under /admin/projects).
// The project is required, so the listing always shows up inside a project on the Off Plan page.
export default function ProjectSelect({
  developerId,
  projectId,
  onChange,
}: {
  developerId: string;
  projectId: string;
  onChange: (value: { developerId: string; projectId: string }) => void;
}) {
  const [developers, setDevelopers] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/developers?all=true").then((res) => res.json()),
      fetch("/api/projects?all=true").then((res) => res.json()),
    ])
      .then(([devData, projectData]) => {
        if (devData.success) setDevelopers(devData.data);
        if (projectData.success) setProjects(projectData.data);
      })
      .catch((err) => console.error("Failed to fetch developers and projects", err))
      .finally(() => setLoading(false));
  }, []);

  // A listing saved before projects existed may only have a project; fill in its developer
  useEffect(() => {
    if (!developerId && projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project?.developerId) onChange({ developerId: project.developerId, projectId });
    }
  }, [projects, developerId, projectId, onChange]);

  const developerProjects = projects.filter((p) => p.developerId === developerId);

  return (
    <div className="md:col-span-2 rounded-2xl border border-brand-gold/40 bg-brand-gold/5 p-5 md:p-6 space-y-4">
      <p className="text-sm font-semibold text-brand-black">
        Off plan: choose the developer and project first, then fill in this property&apos;s details below.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">Developer</label>
          <select
            name="developerId"
            value={developerId}
            onChange={(e) => onChange({ developerId: e.target.value, projectId: "" })}
            disabled={loading}
            required
            className={selectClass}
          >
            <option value="">{loading ? "Loading developers..." : "Choose a developer"}</option>
            {developers.map((dev) => (
              <option key={dev.id} value={dev.id}>{dev.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">Project</label>
          <select
            name="projectId"
            value={projectId}
            onChange={(e) => onChange({ developerId, projectId: e.target.value })}
            disabled={loading || !developerId}
            required
            className={`${selectClass} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <option value="">
              {!developerId ? "Choose a developer first" : developerProjects.length ? "Choose a project" : "This developer has no projects yet"}
            </option>
            {developerProjects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        The property appears inside this project on the Off Plan page.{" "}
        <Link href="/admin/projects" target="_blank" className="text-brand-gold font-semibold hover:underline">
          Add or manage projects
        </Link>
      </p>
    </div>
  );
}
