"use client";

import { useState, useEffect } from "react";
import { UploadCloud, CheckCircle2, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { addWatermarkAndCompress } from "@/lib/imageProcessor";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { UnitDetailsFields } from "@/components/admin/UnitDetailsFields";
import { readUnitDetails, formatAedPrice } from "@/lib/unitDetails";
import DeveloperSelect from "@/components/admin/DeveloperSelect";

export default function EditListingPage() {
  const { id } = useParams();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // Dynamic Fields State
  const [propertyType, setPropertyType] = useState("Residential");
  const [status, setStatus] = useState("FOR SALE");
  const [developerId, setDeveloperId] = useState("");
  const [category, setCategory] = useState("Apartment");
  const [overview, setOverview] = useState("");
  const [specifications, setSpecifications] = useState<{ title: string, desc: string }[]>([]);
  const [amenities, setAmenities] = useState<{ title: string, desc: string }[]>([]);
  
  // Gallery Files State
  const [galleryFiles, setGalleryFiles] = useState<{ file: File | null, previewUrl: string | null, existingUrl?: string }[]>([
    { file: null, previewUrl: null },
    { file: null, previewUrl: null },
    { file: null, previewUrl: null },
    { file: null, previewUrl: null },
  ]);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInitialData(data.data);
          setPreviewUrl(data.data.image);
          
          if (data.data.propertyType) setPropertyType(data.data.propertyType);
          if (data.data.status) setStatus(data.data.status);
          if (data.data.developerId) setDeveloperId(data.data.developerId);
          if (data.data.category) setCategory(data.data.category);
          if (data.data.overview) setOverview(data.data.overview);
          
          if (data.data.specifications && data.data.specifications.length > 0) {
            setSpecifications(data.data.specifications);
          } else {
            setSpecifications([{ title: "", desc: "" }]);
          }

          if (data.data.amenities && data.data.amenities.length > 0) {
            setAmenities(data.data.amenities);
          } else {
            setAmenities([{ title: "", desc: "" }]);
          }

          if (data.data.galleryImages && data.data.galleryImages.length > 0) {
            const loadedFiles = data.data.galleryImages.map((url: string) => ({
              file: null,
              previewUrl: url,
              existingUrl: url
            }));
            // Ensure at least 4 slots exist
            while (loadedFiles.length < 4) {
              loadedFiles.push({ file: null, previewUrl: null });
            }
            setGalleryFiles(loadedFiles);
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [id]);

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
        previewUrl: URL.createObjectURL(file),
        existingUrl: undefined // it's a new file now
      };
      setGalleryFiles(newGallery);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const price = (form.elements.namedItem("price") as HTMLInputElement).value;
    const city = (form.elements.namedItem("city") as HTMLSelectElement).value;
    const location = (form.elements.namedItem("location") as HTMLInputElement).value;
    const beds = parseInt((form.elements.namedItem("beds") as HTMLInputElement).value);
    const baths = parseInt((form.elements.namedItem("baths") as HTMLInputElement).value);
    const sqft = (form.elements.namedItem("sqft") as HTMLInputElement).value;
    const directionLink = (form.elements.namedItem("directionLink") as HTMLInputElement)?.value || "";
    const unitDetails = readUnitDetails(form);

    // Enforce 5 images minimum rule
    const validGalleryFiles = galleryFiles.filter(item => item.file !== null || item.existingUrl !== undefined);
    if (validGalleryFiles.length < 4) {
      alert("Please provide at least 4 gallery images (5 images total including cover).");
      return;
    }

    setIsPublishing(true);

    try {
      let finalImageUrl = initialData.image;

      if (selectedFile) {
        // Process Image (Watermark + Compress) before uploading
        const processedFile = await addWatermarkAndCompress(selectedFile);
        
        const formData = new FormData();
        formData.append("file", processedFile);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        
        if (!uploadData.success) throw new Error("Image upload failed");
        finalImageUrl = uploadData.url;
      }

      // Process Gallery Images (New uploads)
      const uploadedGalleryUrls: string[] = [];
      for (const item of validGalleryFiles) {
        if (item.existingUrl) {
          uploadedGalleryUrls.push(item.existingUrl);
        } else if (item.file) {
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

      let finalPrice = formatAedPrice(price);

      // Add / Yearly for Rentals
      if (status === "FOR RENT" && !finalPrice.toLowerCase().includes("yearly")) {
        finalPrice += " / Yearly";
      }

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
        ...unitDetails,
        image: finalImageUrl,
        overview,
        specifications: specifications.filter(s => s.title.trim() !== ""),
        amenities: amenities.filter(a => a.title.trim() !== ""),
        galleryImages: uploadedGalleryUrls,
      };

      const dbRes = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });
      
      const dbData = await dbRes.json();
      if (!dbData.success) throw new Error("Database save failed");

      alert("Listing updated successfully!");
      window.location.href = "/admin/listings";
      
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) return <div className="max-w-4xl mx-auto pt-16 md:pt-0"><div className="text-center p-10 text-gray-500">Loading listing data...</div></div>;
  if (!initialData) return <div className="max-w-4xl mx-auto pt-16 md:pt-0"><div className="text-center p-10 text-red-500">Listing not found</div></div>;

  return (
    <div className="max-w-4xl mx-auto w-full pt-16 md:pt-0">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-brand-black mb-2">
          Edit Listing
        </h1>
        <p className="text-gray-500">
          Update the details of your property listing.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-6 md:p-10">
        <form className="space-y-8" onSubmit={handleSubmit}>
          
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
              Cover Image (Leave empty to keep current)
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
              
              <div className="flex flex-col items-center w-full h-full p-4 relative">
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-30">
                  {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />}
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-brand-black bg-white/80 p-6 rounded-2xl backdrop-blur-sm shadow-sm border border-gray-100">
                  {selectedFile ? (
                    <>
                      <CheckCircle2 className="w-10 h-10 mb-2 text-green-600" />
                      <p className="text-lg font-medium text-brand-black mb-1">New file selected!</p>
                      <p className="text-sm text-gray-600 flex items-center font-medium">
                        <ImageIcon className="w-4 h-4 mr-2 text-brand-gold" />
                        {selectedFile.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 mb-2 text-brand-gold" />
                      <p className="text-lg font-medium text-brand-black mb-1">Current Image</p>
                      <p className="text-sm text-gray-500 text-center">Drag a new image here to replace it</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100 my-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Property Title
              </label>
              <input 
                type="text" 
                name="title"
                defaultValue={initialData.title}
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
                defaultValue={initialData.price}
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
              <CustomSelect 
                name="propertyType"
                value={propertyType}
                onChange={setPropertyType}
                options={["Residential", "Commercial", "Industrial"]}
                required
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
                options={
                  propertyType === "Residential" 
                    ? ["Apartment", "Studio", "Villa", "Townhouse", "Penthouse", "Duplex"]
                    : propertyType === "Commercial"
                    ? ["Office", "Retail", "Warehouse", "Full Floor", "Commercial Building"]
                    : ["Jebel Ali", "Technology Park", "Dubai Industrial Park", "Al Quoz", "Dubai South", "DIP"]
                }
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
                defaultValue={initialData.city || "Dubai"}
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
                defaultValue={initialData.location}
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
                defaultValue={initialData.beds}
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
                defaultValue={initialData.baths}
                required
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-brand-black uppercase tracking-wider">
                Total Area (sq.ft)
              </label>
              <input 
                type="text" 
                name="sqft"
                defaultValue={initialData.sqft}
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
                defaultValue={initialData.directionLink}
                placeholder="Paste the Google Maps link of the exact building (Share → Copy link)" 
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          <UnitDetailsFields defaults={initialData} />

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
              {isPublishing ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
