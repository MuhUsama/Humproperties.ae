"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  HelpCircle, 
  Layers, 
  Filter, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  BookOpen
} from "lucide-react";
import toast from "react-hot-toast";

interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  page: string;
  subpage: string | null;
  category: string;
  order: number;
  createdAt: string;
}

const MAIN_PAGES = [
  "Home",
  "Buy",
  "Rent",
  "Sell",
  "Invest",
  "Property Details",
  "Property Services",
];

const SERVICES_SUBPAGES = [
  "Mortgage Advisory",
  "Relocation Services",
  "Property Management",
  "Property Brokerage",
  "Commercial Advisory",
  "Industrial Services",
  "Interior Design & Fit-Out",
  "Real Estate Development",
];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageFilter, setPageFilter] = useState("All Pages");
  const [subpageFilter, setSubpageFilter] = useState("All Subpages");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqRecord | null>(null);
  const [formPage, setFormPage] = useState("Home");
  const [formSubpage, setFormSubpage] = useState<string>("Mortgage Advisory");
  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [formOrder, setFormOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expanded FAQ state for viewing answers
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faqs?all=true");
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data);
      } else {
        toast.error("Failed to load FAQs");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error loading FAQs");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingFaq(null);
    setFormPage(pageFilter !== "All Pages" ? pageFilter : "Home");
    setFormSubpage(subpageFilter !== "All Subpages" ? subpageFilter : "Mortgage Advisory");
    setFormQuestion("");
    setFormAnswer("");
    setFormOrder(0);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FaqRecord) => {
    setEditingFaq(faq);
    setFormPage(faq.page);
    setFormSubpage(faq.subpage || "Mortgage Advisory");
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormOrder(faq.order || 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }
    if (!formAnswer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        page: formPage,
        subpage: formPage === "Property Services" ? formSubpage : null,
        order: Number(formOrder) || 0,
      };

      let res;
      if (editingFaq) {
        res = await fetch(`/api/faqs/${editingFaq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        toast.success(editingFaq ? "FAQ updated successfully!" : "FAQ created successfully!");
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        toast.error(data.error || "Failed to save FAQ");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Error saving FAQ: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`Are you sure you want to delete this FAQ?\n\n"${question}"`)) {
      return;
    }

    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("FAQ deleted");
        setFaqs((prev) => prev.filter((f) => f.id !== id));
      } else {
        toast.error("Failed to delete FAQ");
      }
    } catch (err) {
      toast.error("Network error deleting FAQ");
    }
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      // Search matching
      const qMatch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      if (!qMatch) return false;

      // Page matching
      if (pageFilter !== "All Pages" && faq.page !== pageFilter) return false;

      // Subpage matching
      if (pageFilter === "Property Services" || pageFilter === "All Pages") {
        if (subpageFilter !== "All Subpages" && faq.subpage !== subpageFilter) {
          return false;
        }
      }

      return true;
    });
  }, [faqs, searchQuery, pageFilter, subpageFilter]);

  // Statistics
  const totalCount = faqs.length;
  const mainPagesCount = faqs.filter((f) => f.page !== "Property Services").length;
  const servicesCount = faqs.filter((f) => f.page === "Property Services").length;

  return (
    <div className="max-w-7xl mx-auto w-full pt-16 md:pt-0 pb-16">
      {/* Top Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-gold font-semibold text-xs uppercase tracking-widest mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Content Management</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-black mb-2">
            FAQs Management
          </h1>
          <p className="text-gray-500 max-w-2xl text-sm md:text-base">
            Easily add, edit, and organize frequently asked questions across all website main pages and services subpages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-brand-black hover:bg-brand-gold text-white hover:text-brand-black px-5 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Total FAQs
            </span>
            <span className="text-2xl font-bold text-brand-black">{totalCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-gold flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Main Pages FAQs
            </span>
            <span className="text-2xl font-bold text-emerald-600">{mainPagesCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Services Subpages FAQs
            </span>
            <span className="text-2xl font-bold text-blue-600">{servicesCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-sm transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Page Filter */}
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-sm">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Page:</span>
            <select
              value={pageFilter}
              onChange={(e) => {
                setPageFilter(e.target.value);
                if (e.target.value !== "Property Services" && e.target.value !== "All Pages") {
                  setSubpageFilter("All Subpages");
                }
              }}
              className="bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All Pages">All Pages</option>
              {MAIN_PAGES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Subpage Filter (Active if Property Services or All Pages) */}
          {(pageFilter === "Property Services" || pageFilter === "All Pages") && (
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 text-sm">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Subpage:</span>
              <select
                value={subpageFilter}
                onChange={(e) => setSubpageFilter(e.target.value)}
                className="bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="All Subpages">All Subpages</option>
                {SERVICES_SUBPAGES.map((sp) => (
                  <option key={sp} value={sp}>{sp}</option>
                ))}
              </select>
            </div>
          )}

          {(searchQuery || pageFilter !== "All Pages" || subpageFilter !== "All Subpages") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setPageFilter("All Pages");
                setSubpageFilter("All Subpages");
              }}
              className="text-xs text-gray-400 hover:text-brand-black transition-colors font-semibold underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* FAQs List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full mb-3" />
          <p className="font-medium text-sm">Loading FAQs...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-1">No FAQs found</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            {searchQuery || pageFilter !== "All Pages"
              ? "No questions match your current search or page filters. Try adjusting your filter."
              : "No FAQs added yet. Click below to add the first FAQ to your website."}
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 bg-brand-gold hover:bg-brand-black text-brand-black hover:text-white px-5 py-2.5 rounded-xl font-semibold transition-all text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add FAQ</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all p-5 shadow-sm hover:shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Badge Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/50">
                        Page: {faq.page}
                      </span>
                      {faq.subpage && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/50">
                          Subpage: {faq.subpage}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400">
                        Category: <code className="bg-gray-50 px-1 rounded">{faq.category}</code>
                      </span>
                    </div>

                    {/* Question */}
                    <h3
                      onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                      className="text-base sm:text-lg font-bold text-brand-black hover:text-brand-gold cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <span>{faq.question}</span>
                      <button className="text-gray-400 hover:text-brand-black p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </h3>

                    {/* Answer (expandable / preview) */}
                    <div className={`mt-2 text-sm text-gray-600 transition-all leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
                      {faq.answer}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0 pt-1 border-t md:border-t-0 md:pt-0 border-gray-100">
                    <button
                      onClick={() => openEditModal(faq)}
                      className="p-2 text-gray-500 hover:text-brand-gold hover:bg-gray-50 rounded-xl transition-all"
                      title="Edit FAQ"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id, faq.question)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-brand-black">
                  {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select the target page and subpage, then input the question and answer.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Page Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  1. Select Page <span className="text-red-500">*</span>
                </label>
                <select
                  value={formPage}
                  onChange={(e) => {
                    setFormPage(e.target.value);
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-sm font-medium"
                >
                  {MAIN_PAGES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Choose which page on the website will display this FAQ.
                </p>
              </div>

              {/* Subpage Selection (Shown only when Property Services is selected) */}
              {formPage === "Property Services" && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
                    2. Select Services Subpage <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formSubpage}
                    onChange={(e) => setFormSubpage(e.target.value)}
                    className="w-full px-4 py-3 bg-amber-50/50 border border-brand-gold/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold text-sm font-medium text-brand-black"
                  >
                    {SERVICES_SUBPAGES.map((sp) => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">
                    This FAQ will be tied to the selected services subpage (e.g. <code>/services/{formSubpage.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</code>).
                  </p>
                </div>
              )}

              {/* Question Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. What are the typical property management fees in Dubai?"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-sm"
                  required
                />
              </div>

              {/* Answer Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Provide a comprehensive, professional answer for the client..."
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold text-sm leading-relaxed"
                  required
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                  className="w-28 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-sm"
                />
                <span className="text-[11px] text-gray-400 ml-2">Lower numbers appear first.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-brand-gold hover:bg-brand-black text-brand-black hover:text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? "Saving..." : editingFaq ? "Update FAQ" : "Save FAQ"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
