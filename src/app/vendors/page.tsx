"use client";
import React, { useState } from "react";

const vendors = [
  {
    id: 1,
    name: "Joe's Catering",
    service: "Food Catering",
    contact: "joe@example.com"
  },
  {
    id: 2,
    name: "Luna Photography",
    service: "Event Photography",
    contact: "luna@example.com"
  },
  {
    id: 3,
    name: "DJ Beats",
    service: "Music and DJ Services",
    contact: "djbeats@example.com"
  }
];

const VendorsPage = () => {
  const [search, setSearch] = useState("");
  
  const filteredVendors = vendors.filter(vendor =>
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
      <div className="grid gap-4 mt-6 w-full max-w-4xl mx-auto">
        {filteredVendors.map((vendor) => (
          <div 
            key={vendor.id} 
            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-300"
          >
            <h2 className="text-green-300 font-semibold text-lg">{vendor.name}</h2>
            <p className="text-gray-400">🛠 {vendor.service}</p>
            <p className="text-gray-300 mt-2">📧 {vendor.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorsPage;