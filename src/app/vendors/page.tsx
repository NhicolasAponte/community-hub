"use client";
import VendorCard from "@/components/cards/vendor-card";
import { Vendor } from "@/lib/data-model/schema-types";
import React, { useState } from "react";

const vendors: Vendor[] = [
  {
    id: 1,
    name: "John's Plumbing",
    description: "Expert plumbing services for all your needs.",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Springfield, IL",
    services: ["Sink Repair", "Pipe Installation", "Leak Detection"],
    website: "https://johnsplumbing.com",
    instagram: "https://instagram.com/johnsplumbing",
    twitter: "https://twitter.com/johnsplumbing",
    linkedin: "https://linkedin.com/company/johnsplumbing",
    facebook: "https://facebook.com/johnsplumbing"
  },
  {
    id: 2,
    name: "Sally's Catering",
    email: "sally@example.com",
    description: "Delicious catering services for any event.",
    phone: "987-654-3210",
    address: "456 Elm St, Springfield, IL",
    services: ["Catering", "Event Planning"],
    website: "https://sallyscatering.com",
    instagram: "https://instagram.com/sallyscatering",
    twitter: "https://twitter.com/sallyscatering",
    linkedin: "https://linkedin.com/company/sallyscatering",
    facebook: "https://facebook.com/sallyscatering"
  },
  {
    id: 3,
    name: "Mike's Landscaping",
    email: "mike@example.com",
    description: "Professional landscaping services to beautify your space.",
    phone: "555-123-4567",
    address: "789 Oak St, Springfield, IL",
    services: ["Lawn Care", "Garden Design", "Tree Trimming"],
    website: "https://mikeslandscaping.com",
    instagram: "https://instagram.com/mikeslandscaping",
    twitter: "https://twitter.com/mikeslandscaping",
    linkedin: "https://linkedin.com/company/mikeslandscaping",
    facebook: "https://facebook.com/mikeslandscaping"
  }
];

const VendorsPage = () => {
  const [search, setSearch] = useState("");

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-6">
      <input
        type="text"
        placeholder="Search vendors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field w-full max-w-md p-2 bg-gray-800 text-gray-300 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
      />
      <div className="card-wrapper">  
        {filteredVendors.map((vendor) => (
          <div key={vendor.id}>
            <VendorCard vendor={vendor} />
          </div>
        ))}
      </div>
      {filteredVendors.length === 0 && (
        <p className="text-gray-500 mt-4">No vendors found.</p>
      )}
    </div>
  );
};

export default VendorsPage;
