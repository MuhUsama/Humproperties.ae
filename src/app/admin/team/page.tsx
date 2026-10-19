"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Trash2, Plus, UploadCloud, X } from "lucide-react";
import toast from "react-hot-toast";

export default function TeamManagementPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    phone: "",
    email: "",
    whatsapp: "",
    languages: [] as string[]
  });
  const [languageInput, setLanguageInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      if (data.success) {
        setAgents(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch agents", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.url;
  };

  const handleAddLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData({ ...formData, languages: [...formData.languages, languageInput.trim()] });
      setLanguageInput("");
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error("Name and Role are required");
      return;
    }
    if (!selectedFile && !formData.image) {
      toast.error("Please provide an image");
      return;
    }

    setUploading(true);
    try {
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const payload = { ...formData, image: imageUrl };

      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Agent added successfully");
        setAgents([data.data, ...agents]);
        setIsAdding(false);
        setFormData({ name: "", role: "", image: "", phone: "", email: "", whatsapp: "", languages: [] });
        setSelectedFile(null);
        setPreviewUrl("");
      } else {
        toast.error(data.error || "Failed to add agent");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    
    try {
      const res = await fetch(`/api/agents/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Agent removed");
        setAgents(agents.filter(a => a.id !== id));
      } else {
        toast.error("Failed to remove agent");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  if (loading) return <div className="p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-black">Team Management</h1>
          <p className="text-gray-500 mt-1">Add or remove real estate agents from your team.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-brand-gold text-brand-black px-4 py-2 rounded-lg font-semibold hover:bg-brand-black hover:text-white transition-colors"
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isAdding ? "Cancel" : "Add Agent"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-6">New Team Member</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg p-3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg p-3" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required placeholder="Senior Luxury Advisor" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Photo</label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <UploadCloud className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium">Upload Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg p-3" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+971 50 123 4567" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
              <input type="email" className="w-full border border-gray-200 rounded-lg p-3" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@mfreuae.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp</label>
              <input type="text" className="w-full border border-gray-200 rounded-lg p-3" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="+971 50 123 4567" />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Languages Spoken</label>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                className="flex-1 border border-gray-200 rounded-lg p-3" 
                value={languageInput} 
                onChange={e => setLanguageInput(e.target.value)} 
                placeholder="e.g. English"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
              />
              <button type="button" onClick={handleAddLanguage} className="bg-gray-100 hover:bg-gray-200 px-4 rounded-lg font-medium">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.languages.map(lang => (
                <span key={lang} className="bg-brand-gold/10 text-brand-black px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-brand-gold/20">
                  {lang}
                  <button type="button" onClick={() => handleRemoveLanguage(lang)}><X className="w-3 h-3 hover:text-red-500" /></button>
                </span>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-brand-black text-white p-4 rounded-lg font-bold hover:bg-brand-gold hover:text-brand-black transition-all flex justify-center items-center gap-2"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {uploading ? "Adding Agent..." : "Save Team Member"}
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {agents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No team members found. Add your first agent above.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Languages</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agents.map(agent => (
                <tr key={agent.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                        <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-brand-black">{agent.name}</div>
                        <div className="text-sm text-brand-gold font-medium">{agent.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {agent.email && <div>{agent.email}</div>}
                      {agent.phone && <div>{agent.phone}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {agent.languages?.map((lang: string) => (
                        <span key={lang} className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">{lang}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(agent.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
