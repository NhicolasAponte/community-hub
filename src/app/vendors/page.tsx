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
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4 text-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-green-300">Local Vendors</h1>
      <input 
        type="text" 
        placeholder="Search vendors..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        className="p-2 mb-4 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
      <div className="w-full max-w-2xl space-y-4">
        {filteredVendors.map((vendor, index) => (
          <div key={vendor.id} className={`p-4 rounded-lg shadow-md border border-gray-700 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}` }>
            <h2 className="text-xl font-semibold text-blue-300">{vendor.name}</h2>
            <p className="text-gray-400">🛠 {vendor.service}</p>
            <p className="text-gray-300 mt-2">📧 {vendor.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorsPage;
