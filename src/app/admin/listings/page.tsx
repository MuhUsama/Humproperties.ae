"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search, MoreVertical, Edit, Trash2, MapPin, Filter, Eye, EyeOff, ExternalLink } from "lucide-react";

export default function AllListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [visibilityFilter, setVisibilityFilter] = useState("All Visibility");
  const [bedsFilter, setBedsFilter] = useState("All Beds");
  const [areaFilter, setAreaFilter] = useState("");
  const [listingsData, setListingsData] = useState<any[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/listings?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setListingsData(data.data);
        }
      })
      .catch((err) => console.error("Error fetching admin listings:", err));
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this listing?")) {
      try {
        const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setListingsData((prev) => prev.filter((p) => p.id !== id));
        } else {
          alert("Failed to delete listing.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("An error occurred while deleting.");
      }
    }
  };

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    const nextVisible = !currentVisible;
    // Optimistic UI update
    setListingsData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isVisible: nextVisible } : item))
    );

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: nextVisible }),
      });
      const data = await res.json();
      if (!data.success) {
        // Rollback
        setListingsData((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isVisible: currentVisible } : item))
        );
        alert("Failed to update visibility: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Visibility toggle error:", err);
      // Rollback
      setListingsData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isVisible: currentVisible } : item))
      );
      alert("Network error updating visibility.");
    }
  };

  const handleEdit = (id: string) => {
    window.location.href = `/admin/edit-listing/${id}`;
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const filteredListings = useMemo(() => {
    return listingsData.filter((property) => {
      // Search matching (Title or Location)
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            property.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status matching
      const matchesStatus = statusFilter === "All Statuses" || property.status.toLowerCase() === statusFilter.toLowerCase();
      
      // Visibility matching
      const isVisible = property.isVisible !== false;
      let matchesVisibility = true;
      if (visibilityFilter === "Visible Only") matchesVisibility = isVisible;
      if (visibilityFilter === "Hidden Only") matchesVisibility = !isVisible;

      // Beds matching
      let matchesBeds = true;
      if (bedsFilter !== "All Beds") {
        const minBeds = parseInt(bedsFilter);
        matchesBeds = property.beds >= minBeds;
      }
      
      // Area matching
      const matchesArea = areaFilter === "" || property.location?.toLowerCase().includes(areaFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesVisibility && matchesBeds && matchesArea;
    });
  }, [searchQuery, statusFilter, visibilityFilter, bedsFilter, areaFilter, listingsData]);

  const totalListings = listingsData.length;
  const hiddenCount = listingsData.filter((p) => p.isVisible === false).length;
  const liveCount = totalListings - hiddenCount;

  return (
    <div className="max-w-7xl mx-auto w-full pt-16 md:pt-0">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-black mb-2">
            All Listings
          </h1>
          <p className="text-gray-500">
            Manage your {totalListings} property listings across Dubai. Toggle show or hide to control what is live across your site.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm self-start md:self-auto">
          <div className="px-3 py-1.5 text-center border-r border-gray-100">
            <span className="block text-xl font-bold text-brand-black">{totalListings}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total</span>
          </div>
          <div className="px-3 py-1.5 text-center border-r border-gray-100">
            <span className="block text-xl font-bold text-emerald-600">{liveCount}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600/80">Live</span>
          </div>
          <div className="px-3 py-1.5 text-center">
            <span className="block text-xl font-bold text-amber-600">{hiddenCount}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600/80">Hidden</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col space-y-4 bg-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by title or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-colors text-sm"
              />
            </div>
            <div className="flex items-center flex-wrap w-full lg:w-auto gap-3">
              <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 overflow-x-auto">
                <Filter className="w-4 h-4 text-gray-400 ml-2 hidden sm:block flex-shrink-0" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border-none text-gray-700 text-sm rounded-lg focus:ring-0 shadow-sm py-2 px-3 cursor-pointer outline-none"
                >
                  <option>All Statuses</option>
                  <option>For Sale</option>
                  <option>For Rent</option>
                </select>
                <select 
                  value={visibilityFilter}
                  onChange={(e) => setVisibilityFilter(e.target.value)}
                  className="bg-white border-none text-gray-700 text-sm rounded-lg focus:ring-0 shadow-sm py-2 px-3 cursor-pointer outline-none font-medium"
                >
                  <option>All Visibility</option>
                  <option>Visible Only</option>
                  <option>Hidden Only</option>
                </select>
                <select 
                  value={bedsFilter}
                  onChange={(e) => setBedsFilter(e.target.value)}
                  className="bg-white border-none text-gray-700 text-sm rounded-lg focus:ring-0 shadow-sm py-2 px-3 cursor-pointer outline-none"
                >
                  <option>All Beds</option>
                  <option value="1">1+ Beds</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                  <option value="4">4+ Beds</option>
                  <option value="5">5+ Beds</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Filter Area..." 
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="bg-white border-none text-gray-700 text-sm rounded-lg focus:ring-0 shadow-sm py-2 px-3 w-28 sm:w-32 outline-none"
                />
              </div>
              <Link 
                href="/admin/add-listing" 
                className="ml-auto lg:ml-2 flex items-center bg-brand-black text-white px-5 py-2.5 rounded-xl hover:bg-brand-gold hover:text-brand-black transition-colors shadow-md font-semibold whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Listing
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4 rounded-tl-3xl">Property</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Status & Visibility</th>
                <th className="px-6 py-4 text-right rounded-tr-3xl w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No properties match your exact filters. Try clearing them to see more results!
                  </td>
                </tr>
              ) : null}
              {filteredListings.map((property) => {
                const isHidden = property.isVisible === false;
                const isLive = !isHidden;

                return (
                  <tr 
                    key={property.id} 
                    className={`transition-colors group ${
                      isHidden ? "bg-amber-50/20 hover:bg-amber-50/40" : "hover:bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-5">
                        <div className="w-28 h-20 sm:w-32 sm:h-24 relative rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm border border-gray-200/50">
                          <img 
                            src={property.image} 
                            alt={property.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-serif text-lg font-bold text-brand-black line-clamp-1 hover:text-brand-gold transition-colors cursor-pointer">
                              {property.title}
                            </h3>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1.5 font-medium">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-brand-gold" />
                            <span className="line-clamp-1">{property.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-brand-black font-bold text-lg tracking-tight whitespace-nowrap">{property.price}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-600 flex flex-col space-y-1">
                        <span className="font-medium">{property.beds} Beds &bull; {property.baths} Baths</span>
                        <span className="text-gray-400 font-mono text-xs">{property.sqft} Sqft</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider whitespace-nowrap ${
                          property.status?.toLowerCase() === 'for sale' 
                            ? "bg-blue-50 text-blue-700 border border-blue-100" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {property.status}
                        </span>
                        
                        {isHidden ? (
                          <span className="px-2 py-0.5 inline-flex items-center text-[10px] font-bold rounded-full uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hidden from Site
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 inline-flex items-center text-[10px] font-semibold rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <Eye className="w-3 h-3 mr-1" />
                            Live on Site
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end space-x-1 bg-white border border-gray-200 shadow-sm rounded-xl p-1">
                        {/* Show / Hide Toggle Button */}
                        <button 
                          onClick={() => toggleVisibility(property.id, isLive)}
                          className={`p-2 rounded-lg transition-colors ${
                            isHidden 
                              ? "text-amber-600 bg-amber-50 hover:bg-amber-100" 
                              : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={isHidden ? "Listing is currently Hidden. Click to Show on live site." : "Listing is currently Live. Click to Hide from live site."}
                        >
                          {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        <button 
                          onClick={() => handleEdit(property.id)}
                          className="text-gray-500 hover:text-brand-gold transition-colors p-2 hover:bg-brand-gold/10 rounded-lg"
                          title="Edit Listing"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(property.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        {/* 3-dots dropdown */}
                        <div className="relative">
                          <button 
                            onClick={() => toggleDropdown(property.id)}
                            className={`text-gray-500 hover:text-brand-black transition-colors p-2 rounded-lg ${activeDropdown === property.id ? 'bg-gray-100 text-brand-black' : ''}`}
                            title="More Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeDropdown === property.id && (
                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-left">
                              <button 
                                onClick={() => { toggleVisibility(property.id, isLive); toggleDropdown(property.id); }}
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center"
                              >
                                {isHidden ? (
                                  <>
                                    <Eye className="w-4 h-4 mr-2 text-emerald-600" />
                                    Show on Live Site
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-2 text-amber-600" />
                                    Hide from Live Site
                                  </>
                                )}
                              </button>
                              <a 
                                href={`/properties/${property.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => toggleDropdown(property.id)} 
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center"
                              >
                                <ExternalLink className="w-4 h-4 mr-2 text-gray-400" />
                                View on Site
                              </a>
                              <button onClick={() => { alert("Duplicating..."); toggleDropdown(property.id); }} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                                Duplicate Listing
                              </button>
                              <button onClick={() => { alert("Marking as sold..."); toggleDropdown(property.id); }} className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left border-t border-gray-100 mt-1 pt-1">
                                Mark as Sold
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <span className="text-sm text-gray-500">
            Showing <span className="font-medium text-brand-black">{filteredListings.length > 0 ? 1 : 0}</span> to <span className="font-medium text-brand-black">{filteredListings.length}</span> of <span className="font-medium text-brand-black">{filteredListings.length}</span> results
          </span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-400 cursor-not-allowed bg-white">Previous</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-brand-black hover:bg-gray-50 transition-colors bg-white">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
