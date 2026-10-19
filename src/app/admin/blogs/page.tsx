"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Globe, EyeOff } from "lucide-react";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Failed to delete blog", error);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading blogs...</div>;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Manage Blogs</h1>
          <p className="text-gray-500">Create, edit, and manage your original insights.</p>
        </div>
        <Link 
          href="/admin/blogs/new" 
          className="bg-brand-black text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:bg-brand-gold hover:text-brand-black transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Blog Post</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No blog posts found. Create your first post!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold hidden md:table-cell">Author</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 text-base">{blog.title}</div>
                    <div className="text-xs text-gray-400 font-mono mt-1">/{blog.slug}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-gray-600">{blog.author}</td>
                  <td className="p-4">
                    {blog.published ? (
                      <span className="inline-flex items-center space-x-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Published</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Draft</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteBlog(blog.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
