"use client";
import VendorCard from "@/components/cards/vendor-card";
import { Vendor } from "@/lib/data-model/schema-types";
import React, { useState } from "react";

const vendors: Vendor[] = [
  {
    id: 1,
    name: "Joe's Catering",
    service: "Food Catering",
    contact: "joe@example.com",
  },
  {
    id: 2,
    name: "Luna Photography",
    service: "Event Photography",
    contact: "luna@example.com",
  },
  {
    id: 3,
    name: "DJ Beats",
    service: "Music and DJ Services",
    contact: "djbeats@example.com",
  },
  {
    id: 1,
    name: "Joe's Catering",
    service: "Food Catering",
    contact: "joe@example.com",
  },
  {
    id: 2,
    name: "Luna Photography",
    service: "Event Photography",
    contact: "luna@example.com",
  },
  {
    id: 3,
    name: "DJ Beats",
    service: "Music and DJ Services",
    contact: "djbeats@example.com",
  },
  {
    id: 1,
    name: "Joe's Catering",
    service: "Food Catering",
    contact: "joe@example.com",
  },
  {
    id: 2,
    name: "Luna Photography",
    service: "Event Photography",
    contact: "luna@example.com",
  },
  {
    id: 3,
    name: "DJ Beats",
    service: "Music and DJ Services",
    contact: "djbeats@example.com",
  },
];

const VendorsPage = () => {
  const [search, setSearch] = useState("");

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.service.toLowerCase().includes(search.toLowerCase())
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
