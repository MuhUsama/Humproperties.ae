"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, Plus, UploadCloud, X, Pencil, Eye, EyeOff, ExternalLink, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

type Developer = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage?: string | null;
  description?: string | null;
  website?: string | null;
  order: number;
  isVisible: boolean;
};

const emptyForm = {
  name: "",
  slug: "",
  logo: "",
  coverImage: "",
  description: "",
  website: "",
  order: 0,
  isVisible: true,
};

export default function DevelopersManagementPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [projectCounts, setProjectCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const [devRes, listingRes] = await Promise.all([
        fetch("/api/developers?all=true"),
        fetch("/api/listings?all=true"),
      ]);
      const devData = await devRes.json();
      const listingData = await listingRes.json();
      if (devData.success) setDevelopers(devData.data);
      if (listingData.success) {
        const counts: Record<string, number> = {};
        listingData.data.forEach((l: any) => {
          if (l.developerId) counts[l.developerId] = (counts[l.developerId] || 0) + 1;
        });
        setProjectCounts(counts);
      }
    } catch (error) {
      console.error("Failed to fetch developers", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setLogoFile(null);
    setLogoPreview("");
    setCoverFile(null);
    setCoverPreview("");
  };

  const openNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (dev: Developer) => {
    setFormData({
      name: dev.name,
      slug: dev.slug,
      logo: dev.logo,
      coverImage: dev.coverImage || "",
      description: dev.description || "",
      website: dev.website || "",
      order: dev.order || 0,
      isVisible: dev.isVisible !== false,
    });
    setEditingId(dev.id);
    setLogoFile(null);
    setLogoPreview(dev.logo);
    setCoverFile(null);
    setCoverPreview(dev.coverImage || "");
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Developer name is required");
      return;
    }
    if (!logoFile && !formData.logo) {
      toast.error("Please upload the developer's logo");
      return;
    }

    setSaving(true);
    try {
      const logo = logoFile ? await uploadImage(logoFile) : formData.logo;
      const coverImage = coverFile ? await uploadImage(coverFile) : formData.coverImage;
      const payload = { ...formData, logo, coverImage };

      const res = await fetch(editingId ? `/api/developers/${editingId}` : "/api/developers", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? "Developer updated" : "Developer added");
        setDevelopers((prev) =>
          (editingId ? prev.map((d) => (d.id === editingId ? data.data : d)) : [...prev, data.data])
            .sort((a, b) => (a.order || 0) - (b.order || 0))
        );
        setIsFormOpen(false);
        resetForm();
      } else {
        toast.error(data.error || "Failed to save developer");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (dev: Developer) => {
    try {
      const res = await fetch(`/api/developers/${dev.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !dev.isVisible }),
      });
      const data = await res.json();
      if (data.success) {
        setDevelopers((prev) => prev.map((d) => (d.id === dev.id ? data.data : d)));
        toast.success(data.data.isVisible ? "Developer is now visible" : "Developer hidden from site");
      } else {
        toast.error(data.error || "Failed to update developer");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  const [addingDefaults, setAddingDefaults] = useState(false);

  const addDefaultDevelopers = async () => {
    if (!confirm("Add the default off plan developers (Emaar, DAMAC, Meraas, Binghatti, Sobha, Nakheel and more)? Developers you already have are left as they are.")) return;

    setAddingDefaults(true);
    try {
      const res = await fetch("/api/developers/defaults", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success(data.added ? `Added ${data.added} developers` : "All default developers are already added");
        await fetchDevelopers();
      } else {
        toast.error(data.error || "Failed to add default developers");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setAddingDefaults(false);
    }
  };

  const handleDelete = async (dev: Developer) => {
    if (!confirm(`Remove ${dev.name}? Their listings stay on the site but are no longer linked to a developer.`)) return;

    try {
      const res = await fetch(`/api/developers/${dev.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Developer removed");
        setDevelopers((prev) => prev.filter((d) => d.id !== dev.id));
      } else {
        toast.error(data.error || "Failed to remove developer");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  if (loading) return <div className="p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pt-16 md:pt-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-black">Off Plan Developers</h1>
          <p className="text-gray-500 mt-1">
            Developers shown on the public Off Plan page. Link listings to a developer by choosing the &quot;Off Plan&quot; status on a listing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 flex-shrink-0">
        <button
          onClick={addDefaultDevelopers}
          disabled={addingDefaults}
          className="flex items-center justify-center gap-2 border border-gray-300 text-brand-black px-4 py-2 rounded-lg font-semibold hover:border-brand-black transition-colors"
        >
          {addingDefaults ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Add Default Developers
        </button>
        <button
          onClick={() => (isFormOpen ? (setIsFormOpen(false), resetForm()) : openNew())}
          className="flex items-center justify-center gap-2 bg-brand-gold text-brand-black px-4 py-2 rounded-lg font-semibold hover:bg-brand-black hover:text-white transition-colors flex-shrink-0"
        >
          {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isFormOpen ? "Cancel" : "Add Developer"}
        </button>
        </div>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-6">{editingId ? `Edit ${formData.name || "Developer"}` : "New Developer"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg p-3" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="Emaar Properties" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Website (optional)</label>
              <input type="url" className="w-full border border-gray-200 rounded-lg p-3" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://www.emaar.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Logo</label>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="w-28 h-20 rounded-lg border border-gray-200 bg-white p-2 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <UploadCloud className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">{logoPreview ? "Change Logo" : "Upload Logo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setLogoFile(file);
                        setLogoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-2">A transparent PNG or SVG looks best. It is shown in white on the Off Plan page.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Image (optional)</label>
              <div className="flex items-center gap-4">
                {coverPreview && (
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
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
                  <span className="text-sm font-medium">{coverPreview ? "Change Cover" : "Upload Cover"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file);
                        setCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-2">Background photo behind the logo on the Off Plan page, and the banner on the developer&apos;s page. A city or skyline shot works best.</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows={5}
              className="w-full border border-gray-200 rounded-lg p-3"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="A short introduction to the developer, their track record and signature projects."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Page URL Slug</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg p-3" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="Generated from the name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Order</label>
              <input type="number" className="w-full border border-gray-200 rounded-lg p-3" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Visibility</label>
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 cursor-pointer">
                <input type="checkbox" checked={formData.isVisible} onChange={e => setFormData({ ...formData, isVisible: e.target.checked })} className="w-4 h-4 accent-[#d4af37]" />
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
            {saving ? "Saving..." : editingId ? "Save Changes" : "Save Developer"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {developers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No developers yet. Click &quot;Add Default Developers&quot; to load the main Dubai and Abu Dhabi developers, or add your own above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Developer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Projects</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {developers.map(dev => (
                  <tr key={dev.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-14 rounded-lg border border-gray-100 bg-white p-1.5 flex items-center justify-center flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={dev.logo} alt={dev.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-brand-black">{dev.name}</div>
                          <div className="text-xs text-gray-400 font-mono truncate">/off-plan/{dev.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{projectCounts[dev.id] || 0} linked</td>
                    <td className="px-6 py-4">
                      {dev.isVisible !== false ? (
                        <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">Visible</span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Hidden</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <a href={`/off-plan/${dev.slug}`} target="_blank" rel="noreferrer" title="View on site" className="p-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        <button onClick={() => toggleVisibility(dev)} title={dev.isVisible ? "Hide" : "Show"} className="p-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors">
                          {dev.isVisible !== false ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button onClick={() => openEdit(dev)} title="Edit" className="p-2 text-gray-400 hover:text-brand-black hover:bg-gray-100 rounded-lg transition-colors">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(dev)} title="Delete" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
