"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Trash2, Plus, UploadCloud, X, Pencil, Eye, EyeOff, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

type Developer = { id: string; name: string; slug: string; logo: string };

type Project = {
  id: string;
  name: string;
  slug: string;
  developerId: string;
  coverImage?: string | null;
  galleryImages: string[];
  location?: string | null;
  propertyTypes?: string | null;
  bedrooms?: string | null;
  startingPrice?: string | null;
  handover?: string | null;
  discount?: string | null;
  description?: string | null;
  order: number;
  isVisible: boolean;
};

const emptyForm = {
  name: "",
  slug: "",
  developerId: "",
  coverImage: "",
  galleryImages: [] as string[],
  location: "",
  propertyTypes: "",
  bedrooms: "",
  startingPrice: "",
  handover: "",
  discount: "",
  description: "",
  order: 0,
  isVisible: true,
};

const inputClass = "w-full border border-gray-200 rounded-lg p-3";
const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2";

export default function ProjectsManagementPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [listingCounts, setListingCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [developerFilter, setDeveloperFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/developers?all=true").then((r) => r.json()),
      fetch("/api/projects?all=true").then((r) => r.json()),
      fetch("/api/listings?all=true").then((r) => r.json()),
    ])
      .then(([devData, projectData, listingData]) => {
        if (devData.success) setDevelopers(devData.data);
        if (projectData.success) setProjects(projectData.data);
        if (listingData.success) {
          const counts: Record<string, number> = {};
          listingData.data.forEach((l: any) => {
            if (l.projectId) counts[l.projectId] = (counts[l.projectId] || 0) + 1;
          });
          setListingCounts(counts);
        }
      })
      .catch((error) => console.error("Failed to load projects", error))
      .finally(() => setLoading(false));
  }, []);

  const developerById = useMemo(() => Object.fromEntries(developers.map((d) => [d.id, d])), [developers]);

  // Grouped by developer (in the developers' order), then by project order
  const visibleProjects = useMemo(() => {
    const devOrder = Object.fromEntries(developers.map((d, i) => [d.id, i]));
    return projects
      .filter((p) => !developerFilter || p.developerId === developerFilter)
      .sort((a, b) => (devOrder[a.developerId] ?? 999) - (devOrder[b.developerId] ?? 999) || (a.order || 0) - (b.order || 0));
  }, [projects, developers, developerFilter]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setCoverFile(null);
    setCoverPreview("");
    setGalleryFiles([]);
  };

  const openNew = () => {
    resetForm();
    const developerId = developerFilter || "";
    const nextOrder = projects
      .filter((p) => p.developerId === developerId)
      .reduce((max, p) => Math.max(max, (p.order || 0) + 1), 0);
    setFormData({ ...emptyForm, developerId, order: nextOrder });
    setIsFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setFormData({
      name: project.name,
      slug: project.slug,
      developerId: project.developerId,
      coverImage: project.coverImage || "",
      galleryImages: project.galleryImages || [],
      location: project.location || "",
      propertyTypes: project.propertyTypes || "",
      bedrooms: project.bedrooms || "",
      startingPrice: project.startingPrice || "",
      handover: project.handover || "",
      discount: project.discount || "",
      description: project.description || "",
      order: project.order || 0,
      isVisible: project.isVisible !== false,
    });
    setEditingId(project.id);
    setCoverFile(null);
    setCoverPreview(project.coverImage || "");
    setGalleryFiles([]);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.developerId) {
      toast.error("Please choose the developer");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setSaving(true);
    try {
      const coverImage = coverFile ? await uploadImage(coverFile) : formData.coverImage;
      const uploaded = await Promise.all(galleryFiles.map(uploadImage));
      const payload = { ...formData, coverImage, galleryImages: [...formData.galleryImages, ...uploaded] };

      const res = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? "Project updated" : "Project added");
        setProjects((prev) => (editingId ? prev.map((p) => (p.id === editingId ? data.data : p)) : [...prev, data.data]));
        setIsFormOpen(false);
        resetForm();
      } else {
        toast.error(data.error || "Failed to save project");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !project.isVisible }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.map((p) => (p.id === project.id ? data.data : p)));
        toast.success(data.data.isVisible ? "Project is now visible" : "Project hidden from site");
      } else {
        toast.error(data.error || "Failed to update project");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Remove ${project.name}? Its properties stay on the site under the developer, but are no longer in a project.`)) return;
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Project removed");
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
      } else {
        toast.error(data.error || "Failed to remove project");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [key]: e.target.value });

  if (loading) return <div className="p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pt-16 md:pt-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-black">Off Plan Projects</h1>
          <p className="text-gray-500 mt-1">
            Projects shown under each developer on the Off Plan page. When you add an &quot;Off Plan&quot; property, you pick its project first.
          </p>
        </div>
        <button
          onClick={() => (isFormOpen ? (setIsFormOpen(false), resetForm()) : openNew())}
          disabled={developers.length === 0}
          className="flex items-center justify-center gap-2 bg-brand-gold text-brand-black px-4 py-2 rounded-lg font-semibold hover:bg-brand-black hover:text-white transition-colors flex-shrink-0 disabled:opacity-40"
        >
          {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isFormOpen ? "Cancel" : "Add Project"}
        </button>
      </div>

      {developers.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-8 text-sm">
          Add a developer first in{" "}
          <Link href="/admin/developers" className="font-semibold underline">Off Plan Developers</Link>, then add its projects here.
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-6">{editingId ? `Edit ${formData.name || "Project"}` : "New Project"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={labelClass}>Developer</label>
              <select className={`${inputClass} bg-white`} value={formData.developerId} onChange={set("developerId")} required>
                <option value="">Choose a developer</option>
                {developers.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Project Name</label>
              <input type="text" className={inputClass} value={formData.name} onChange={set("name")} required placeholder="Verdana Apartments" />
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-4">Everything below is optional. Anything you leave empty is not shown on the site.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className={labelClass}>Location</label>
              <input type="text" className={inputClass} value={formData.location} onChange={set("location")} placeholder="DIP, Dubai" />
            </div>
            <div>
              <label className={labelClass}>Property Type</label>
              <input type="text" className={inputClass} value={formData.propertyTypes} onChange={set("propertyTypes")} placeholder="Apartments" />
            </div>
            <div>
              <label className={labelClass}>Bedrooms</label>
              <input type="text" className={inputClass} value={formData.bedrooms} onChange={set("bedrooms")} placeholder="Studio to 4 Bedroom" />
            </div>
            <div>
              <label className={labelClass}>Starting Price</label>
              <input type="text" className={inputClass} value={formData.startingPrice} onChange={set("startingPrice")} placeholder="AED 550K" />
            </div>
            <div>
              <label className={labelClass}>Handover</label>
              <input type="text" className={inputClass} value={formData.handover} onChange={set("handover")} placeholder="2028" />
            </div>
            <div>
              <label className={labelClass}>Discount / Offer</label>
              <input type="text" className={inputClass} value={formData.discount} onChange={set("discount")} placeholder="Up to 15%" />
            </div>
          </div>

          <div className="mb-6">
            <label className={labelClass}>Description</label>
            <textarea rows={4} className={inputClass} value={formData.description} onChange={set("description")} placeholder="A short introduction to the project." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={labelClass}>Main Photo</label>
              <div className="flex items-center gap-4">
                {coverPreview && (
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverPreview} alt="Main photo preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setCoverFile(null); setCoverPreview(""); setFormData({ ...formData, coverImage: "" }); }}
                      className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 text-gray-600 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <UploadCloud className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">{coverPreview ? "Change Photo" : "Upload Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file);
                        setCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-2">The big photo at the top of the project, and its card in the sliders.</p>
            </div>
            <div>
              <label className={labelClass}>Gallery Photos</label>
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <UploadCloud className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">Add Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length) setGalleryFiles((prev) => [...prev, ...files]);
                    e.target.value = "";
                  }}
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">Interior and exterior renders, shown in the photo slider.</p>
            </div>
          </div>

          {(formData.galleryImages.length > 0 || galleryFiles.length > 0) && (
            <div className="flex flex-wrap gap-3 mb-6">
              {formData.galleryImages.map((url) => (
                <div key={url} className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, galleryImages: formData.galleryImages.filter((u) => u !== url) })}
                    className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 text-gray-600 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {galleryFiles.map((file, i) => (
                <div key={`${file.name}-${i}`} className="relative w-24 h-16 rounded-lg overflow-hidden border border-dashed border-brand-gold">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setGalleryFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 text-gray-600 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className={labelClass}>Page URL Slug</label>
              <input type="text" className={inputClass} value={formData.slug} onChange={set("slug")} placeholder="Generated from the name" />
            </div>
            <div>
              <label className={labelClass}>Order</label>
              <input type="number" className={inputClass} value={formData.order} onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 0 })} />
            </div>
            <div>
              <label className={labelClass}>Visibility</label>
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 cursor-pointer">
                <input type="checkbox" checked={formData.isVisible} onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })} className="w-4 h-4 accent-[#d4af37]" />
                <span className="text-sm font-medium">Show on Off Plan page</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-black text-white p-4 rounded-lg font-bold hover:bg-brand-gold hover:text-brand-black transition-all flex justify-center items-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {saving ? "Saving..." : editingId ? "Save Changes" : "Save Project"}
          </button>
        </form>
      )}

      {developers.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-semibold text-gray-600">Developer</label>
          <select value={developerFilter} onChange={(e) => setDeveloperFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm">
            <option value="">All developers</option>
            {developers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {visibleProjects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No projects yet. Click &quot;Add Project&quot; to add the first one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Developer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Properties</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleProjects.map((project) => {
                  const dev = developerById[project.developerId];
                  return (
                    <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-14 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0">
                            {project.coverImage && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-brand-black">{project.name}</div>
                            <div className="text-xs text-gray-400 truncate">{[project.location, project.handover && `Handover ${project.handover}`].filter(Boolean).join(" · ")}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{dev?.name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{listingCounts[project.id] || 0} linked</td>
                      <td className="px-6 py-4">
                        {project.isVisible !== false ? (
                          <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">Visible</span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Hidden</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          {dev && (
                            <a href={`/off-plan/${dev.slug}/${project.slug}`} target="_blank" rel="noreferrer" title="View on site" className="p-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors">
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                          <button onClick={() => toggleVisibility(project)} title={project.isVisible ? "Hide" : "Show"} className="p-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors">
                            {project.isVisible !== false ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          <button onClick={() => openEdit(project)} title="Edit" className="p-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors">
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(project)} title="Delete" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
