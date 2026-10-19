"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    author: "Mohd. Alfalasi",
    published: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: val };
      if (name === "title") {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/blogs");
      } else {
        alert("Failed to create blog post");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <Link href="/admin/blogs" className="inline-flex items-center text-gray-500 hover:text-brand-gold mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
        </Link>
        <h1 className="text-3xl font-heading font-bold text-gray-900">Create New Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                placeholder="E.g., Top 5 Luxury Areas in Dubai"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
              <input 
                type="text" 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                required 
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                placeholder="top-5-luxury-areas"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image URL (Optional)</label>
            <input 
              type="text" 
              name="image" 
              value={formData.image} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Short Excerpt</label>
            <textarea 
              name="excerpt" 
              value={formData.excerpt} 
              onChange={handleChange} 
              required 
              rows={2}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              placeholder="A brief summary of the article..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content (Markdown Supported)</label>
            <textarea 
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              required 
              rows={15}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
              placeholder="Write your article content here using Markdown formatting..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="published" 
                checked={formData.published} 
                onChange={handleChange}
                className="w-5 h-5 text-brand-gold rounded border-gray-300 focus:ring-brand-gold"
              />
              <span className="font-semibold text-gray-700">Publish Immediately</span>
            </label>

            <button 
              type="submit" 
              disabled={loading}
              className="bg-brand-black text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-brand-gold hover:text-brand-black transition-colors shadow-lg disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? "Saving..." : "Save Post"}</span>
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
