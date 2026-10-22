"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { addWatermarkAndCompress } from "@/lib/imageProcessor";
import { CustomSelect } from "@/components/ui/CustomSelect";
import toast from "react-hot-toast";
import DeveloperSelect from "@/components/admin/DeveloperSelect";

export default function AddListingPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Dynamic Fields State
  const propertyType = "Residential";
  const [status, setStatus] = useState("FOR SALE");
  const [developerId, setDeveloperId] = useState("");
  const [category, setCategory] = useState("Apartment");
  const [overview, setOverview] = useState("");
  const [specifications, setSpecifications] = useState([{ title: "", desc: "" }]);
  const [amenities, setAmenities] = useState([{ title: "", desc: "" }]);
  
  // Gallery Files State (minimum 4 to meet 5 total requirement)
  const [galleryFiles, setGalleryFiles] = useState<{ file: File | null, previewUrl: string | null }[]>([
    { file: null, previewUrl: null },
    { file: null, previewUrl: null },
    { file: null, previewUrl: null },
    { file: null, previewUrl: null },
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGalleryFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newGallery = [...galleryFiles];
      newGallery[index] = {
        file,
        previewUrl: URL.createObjectURL(file)
      };
      setGalleryFiles(newGallery);
    }
  };

  const [isPublishing, setIsPublishing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please upload a cover image to publish this listing.");
      return;
    }

    // Enforce 5 images minimum rule
    const validGalleryFiles = galleryFiles.filter(item => item.file !== null);
    if (validGalleryFiles.length < 4) {
      alert("Please upload at least 4 gallery images (5 images total including cover).");
      return;
    }

    // Capture form data synchronously before any awaits!
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const status = (form.elements.namedItem("status") as any).value;
    const propertyType = (form.elements.namedItem("propertyType") as HTMLSelectElement).value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const city = (form.elements.namedItem("city") as HTMLSelectElement).value;
    const location = (form.elements.namedItem("location") as HTMLInputElement).value;
    const beds = parseInt((form.elements.namedItem("beds") as HTMLInputElement).value);
    const baths = parseInt((form.elements.namedItem("baths") as HTMLInputElement).value);
    const sqft = (form.elements.namedItem("sqft") as HTMLInputElement).value;
    const directionLink = (form.elements.namedItem("directionLink") as HTMLInputElement)?.value || "";

    setIsPublishing(true);

    try {
      // 1. Process and Upload Main Cover Image
      const processedCover = await addWatermarkAndCompress(selectedFile);
      const coverFormData = new FormData();
      coverFormData.append("file", processedCover);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: coverFormData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error("Cover image upload failed");

      // 2. Process and Upload Gallery Images sequentially
      const uploadedGalleryUrls: string[] = [];
      for (const item of validGalleryFiles) {
        if (item.file) {
          const processedGalleryFile = await addWatermarkAndCompress(item.file);
          const fd = new FormData();
          fd.append("file", processedGalleryFile);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (data.success) {
            uploadedGalleryUrls.push(data.url);
          }
        }
      }

      // Format price automatically
      let finalPrice = price;
      const numericPrice = price.replace(/[^\d]/g, "");
      if (numericPrice) {
        finalPrice = `AED ${Number(numericPrice).toLocaleString()}`;
      } else if (!price.toUpperCase().startsWith("AED")) {
        finalPrice = `AED ${price}`;
      }

      // Add / Yearly for Rentals
      if (status === "FOR RENT" && !finalPrice.toLowerCase().includes("yearly")) {
        finalPrice += " / Yearly";
      }

      // 2. Prepare listing data payload
      const listingData = {
        title,
        price: finalPrice,
        status,
        developerId: status === "OFF PLAN" ? developerId || null : null,
        propertyType,
        category,
        city,
        location,
        beds,
        baths,
        sqft,
        directionLink,
        image: uploadData.url,
        overview,
        specifications: specifications.filter(s => s.title.trim() !== ""),
        amenities: amenities.filter(a => a.title.trim() !== ""),
        galleryImages: uploadedGalleryUrls,
      };

      // 3. Save to local JSON database
      const dbRes = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });
      
      const dbData = await dbRes.json();
      if (!dbData.success) throw new Error(dbData.error || "Database save failed");

      toast.success("Listing published successfully!");
      setTimeout(() => {
        window.location.href = "/admin/listings";
      }, 1500);
      
    } catch (err: any) {
      console.error(err);
      toast.error("Error publishing listing: " + (err.message || "Unknown error"));
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pt-16 md:pt-0">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-black mb-2">
          Add Residential Listing
        </h1>
        <p className="text-gray-500">
          Create a new residential property listing.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-6 md:p-10">
        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* Cover Image Dropzone */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
              Cover Image
            </label>
            <div 
              className={`
                relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300
                ${dragActive ? "border-brand-gold bg-brand-gold/5 scale-[1.01]" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}
                ${selectedFile ? "border-solid border-green-500 bg-green-50/30" : ""}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept="image/*"
                onChange={handleChange}
              />
              
              {!selectedFile ? (
                <>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-brand-gold">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-medium text-brand-black mb-1">
                    Drag & Drop your image here
                  </p>
                  <p className="text-sm text-gray-400">
                    or click to browse from your computer
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center w-full h-full p-4 relative">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-30">
                    {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />}
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-green-600 bg-white/80 p-6 rounded-2xl backdrop-blur-sm shadow-sm border border-green-100">
                    <CheckCircle2 className="w-10 h-10 mb-2" />
                    <p className="text-lg font-medium text-brand-black mb-1">File selected!</p>
                    <p className="text-sm text-gray-600 flex items-center font-medium">
                      <ImageIcon className="w-4 h-4 mr-2 text-brand-gold" />
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">
              *The watermark will be automatically applied when processing this image.
            </p>
          </div>

          <div className="h-px w-full bg-gray-100 my-8"></div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Property Title
              </label>
              <input 
                type="text" 
                name="title"
                placeholder="e.g. Bluewaters Sea View Apartment" 
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Price (AED)
              </label>
              <input 
                type="text" 
                name="price"
                placeholder={status === "FOR RENT" ? "e.g. 140,000 / Yearly" : "e.g. 14,500,000"} 
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="cursor-pointer">
                  <input type="radio" name="status" value="FOR SALE" className="peer sr-only" checked={status === "FOR SALE"} onChange={(e) => setStatus(e.target.value)} />
                  <div className="text-center px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-400 font-bold tracking-wider transition-all peer-checked:border-brand-gold peer-checked:bg-brand-gold/10 peer-checked:text-brand-gold hover:bg-gray-100">
                    FOR SALE
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="status" value="FOR RENT" className="peer sr-only" checked={status === "FOR RENT"} onChange={(e) => setStatus(e.target.value)} />
                  <div className="text-center px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-400 font-bold tracking-wider transition-all peer-checked:border-brand-gold peer-checked:bg-brand-gold/10 peer-checked:text-brand-gold hover:bg-gray-100">
                    FOR RENT
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="status" value="OFF PLAN" className="peer sr-only" checked={status === "OFF PLAN"} onChange={(e) => setStatus(e.target.value)} />
                  <div className="text-center px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-400 font-bold tracking-wider transition-all peer-checked:border-brand-gold peer-checked:bg-brand-gold/10 peer-checked:text-brand-gold hover:bg-gray-100">
                    OFF PLAN
                  </div>
                </label>
              </div>
            </div>

            {status === "OFF PLAN" && (
              <DeveloperSelect value={developerId} onChange={setDeveloperId} />
            )}

            <div className="space-y-2 md:col-span-1">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Property Type
              </label>
              <input 
                type="hidden" 
                name="propertyType"
                value="Residential"
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Category
              </label>
              <CustomSelect 
                name="category"
                value={category}
                onChange={setCategory}
                options={["Apartment", "Studio", "Villa", "Townhouse", "Penthouse", "Duplex"]}
                placeholder="Select Category"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                City / Emirate
              </label>
              <select
                name="city"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all appearance-none cursor-pointer text-gray-700 font-medium"
                required
                defaultValue="Dubai"
              >
                <option value="Dubai">Dubai</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Ajman">Ajman</option>
                <option value="Umm Al Quwain">Umm Al Quwain</option>
                <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                <option value="Fujairah">Fujairah</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Location
              </label>
              <input 
                type="text" 
                name="location"
                placeholder="e.g. Bluewaters Island" 
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Bedrooms
              </label>
              <input 
                type="number" 
                name="beds"
                placeholder="e.g. 3" 
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Bathrooms
              </label>
              <input 
                type="number" 
                name="baths"
                placeholder="e.g. 4" 
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Square Footage
              </label>
              <input 
                type="text" 
                name="sqft"
                placeholder="e.g. 2,800" 
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Direction Link (Google Maps)
              </label>
              <input 
                type="url" 
                name="directionLink"
                placeholder="e.g. https://maps.google.com/?q=..." 
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* OVERVIEW */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
              Property Overview
            </label>
            <p className="text-xs text-gray-400 mb-2">A detailed, multi-paragraph description of the property.</p>
            <textarea 
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              rows={4}
              placeholder="Every millimeter of this residence has been conceptualized for ultra-luxury living..."
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium resize-y"
            />
          </div>

          <hr className="border-gray-100" />

          {/* GALLERY IMAGES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                  Gallery Images
                </label>
                <p className="text-xs text-gray-400 mt-1">Upload at least 4 images to meet the 5 image minimum (including cover). Max 9 additional images.</p>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  if (galleryFiles.length < 9) setGalleryFiles([...galleryFiles, { file: null, previewUrl: null }]);
                }}
                disabled={galleryFiles.length >= 9}
                className="flex items-center gap-1 text-sm text-brand-gold font-bold bg-brand-gold/10 px-3 py-1.5 rounded-lg hover:bg-brand-gold/20 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Add Image Slot
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryFiles.map((item, index) => (
                <div key={`file-${index}`} className="relative bg-gray-50 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 hover:border-brand-gold transition-colors aspect-[4/3] group overflow-hidden">
                  {item.previewUrl ? (
                    <>
                      <img src={item.previewUrl} alt={`Preview ${index}`} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-brand-black p-2 rounded-full hover:scale-110 transition-transform">
                          <ImageIcon className="w-5 h-5" />
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGalleryFileChange(index, e)} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center text-gray-400 hover:text-brand-gold w-full h-full justify-center">
                      <UploadCloud className="w-6 h-6 mb-2" />
                      <span className="text-xs font-semibold">Image {index + 2}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGalleryFileChange(index, e)} />
                    </label>
                  )}
                  {/* Delete Slot Button */}
                  <button 
                    type="button"
                    onClick={() => {
                      if (galleryFiles.length > 4) {
                        setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
                      }
                    }}
                    disabled={galleryFiles.length <= 4}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity hover:bg-red-600 shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SPECIFICATIONS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                  Master Specifications
                </label>
                <p className="text-xs text-gray-400 mt-1">Add architectural details and premium features.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setSpecifications([...specifications, { title: "", desc: "" }])}
                className="flex items-center gap-1 text-sm text-brand-gold font-bold bg-brand-gold/10 px-3 py-1.5 rounded-lg hover:bg-brand-gold/20"
              >
                <Plus className="w-4 h-4" /> Add Spec
              </button>
            </div>
            <div className="space-y-4">
              {specifications.map((spec, index) => (
                <div key={`spec-${index}`} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      value={spec.title}
                      onChange={(e) => {
                        const newSpecs = [...specifications];
                        newSpecs[index].title = e.target.value;
                        setSpecifications(newSpecs);
                      }}
                      placeholder="Title (e.g. Double-Height Ceilings)" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:border-brand-gold outline-none font-medium text-sm"
                    />
                    <input 
                      type="text" 
                      value={spec.desc}
                      onChange={(e) => {
                        const newSpecs = [...specifications];
                        newSpecs[index].desc = e.target.value;
                        setSpecifications(newSpecs);
                      }}
                      placeholder="Description" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:border-brand-gold outline-none text-sm text-gray-600"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSpecifications(specifications.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 bg-white rounded-lg border border-gray-200 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* AMENITIES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                  Amenities & Privileges
                </label>
                <p className="text-xs text-gray-400 mt-1">Add exclusive building or community amenities.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setAmenities([...amenities, { title: "", desc: "" }])}
                className="flex items-center gap-1 text-sm text-brand-gold font-bold bg-brand-gold/10 px-3 py-1.5 rounded-lg hover:bg-brand-gold/20"
              >
                <Plus className="w-4 h-4" /> Add Amenity
              </button>
            </div>
            <div className="space-y-4">
              {amenities.map((amenity, index) => (
                <div key={`amenity-${index}`} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      value={amenity.title}
                      onChange={(e) => {
                        const newAmens = [...amenities];
                        newAmens[index].title = e.target.value;
                        setAmenities(newAmens);
                      }}
                      placeholder="Title (e.g. Private Beach Club)" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:border-brand-gold outline-none font-medium text-sm"
                    />
                    <input 
                      type="text" 
                      value={amenity.desc}
                      onChange={(e) => {
                        const newAmens = [...amenities];
                        newAmens[index].desc = e.target.value;
                        setAmenities(newAmens);
                      }}
                      placeholder="Description" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:border-brand-gold outline-none text-sm text-gray-600"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAmenities(amenities.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 bg-white rounded-lg border border-gray-200 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isPublishing}
              className={`w-full md:w-auto px-8 py-4 bg-brand-black text-white font-medium rounded-xl shadow-lg shadow-brand-black/20 hover:shadow-brand-black/30 hover:-translate-y-0.5 transition-all focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 ${isPublishing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isPublishing ? "Publishing..." : "Publish Listing"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
