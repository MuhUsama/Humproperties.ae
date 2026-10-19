export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  status: "FOR SALE" | "FOR RENT";
}

export const mockListings: Property[] = [
  {
    id: "prop-1",
    title: "Palm Jumeirah Signature Villa",
    price: "AED 35,000,000",
    location: "Palm Jumeirah, Dubai",
    beds: 6,
    baths: 7,
    sqft: "12,000",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    status: "FOR SALE",
  },
  {
    id: "prop-2",
    title: "Downtown Burj Vista Penthouse",
    price: "AED 18,500,000",
    location: "Downtown Dubai",
    beds: 4,
    baths: 5,
    sqft: "6,500",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
    status: "FOR SALE",
  },
  {
    id: "prop-3",
    title: "Dubai Marina Waterfront Apartment",
    price: "AED 9,200,000",
    location: "Dubai Marina",
    beds: 3,
    baths: 4,
    sqft: "3,200",
    image: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=800&q=80",
    status: "FOR SALE",
  },
  {
    id: "prop-4",
    title: "Emirates Hills Golf Estate",
    price: "AED 42,000,000",
    location: "Emirates Hills",
    beds: 7,
    baths: 8,
    sqft: "15,500",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    status: "FOR SALE",
  },
  {
    id: "prop-5",
    title: "Business Bay Luxury Duplex",
    price: "AED 12,000,000",
    location: "Business Bay",
    beds: 4,
    baths: 4,
    sqft: "4,100",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    status: "FOR SALE",
  },
  {
    id: "prop-6",
    title: "Jumeirah Bay Island Mansion",
    price: "AED 85,000,000",
    location: "Jumeirah Bay Island",
    beds: 8,
    baths: 10,
    sqft: "22,000",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    status: "FOR SALE",
  },
  {
    id: "prop-7",
    title: "Bluewaters Sea View Apartment",
    price: "AED 14,500,000",
    location: "Bluewaters Island",
    beds: 3,
    baths: 4,
    sqft: "2,800",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    status: "FOR SALE",
  },
  {
    id: "prop-8",
    title: "District One Crystal Lagoon Villa",
    price: "AED 28,000,000",
    location: "Mohammed Bin Rashid City",
    beds: 5,
    baths: 6,
    sqft: "8,500",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    status: "FOR SALE",
  },
  {
    id: "prop-9",
    title: "Address Sky View Penthouse",
    price: "AED 22,000,000",
    location: "Downtown Dubai",
    beds: 4,
    baths: 5,
    sqft: "5,200",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    status: "FOR SALE",
  }
];
