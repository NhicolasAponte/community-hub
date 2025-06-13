"use client";
import VendorCard from "@/components/cards/vendor-card";
import { Vendor } from "@/lib/data-model/schema-types";
import React, { useState } from "react";

interface VendorListProps {
  vendors: Vendor[];
}

const VendorList = ({ vendors }: VendorListProps) => {
  const [search, setSearch] = useState("");

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center bg-background text-foreground p-6">
      <input
        type="text"
        placeholder="Search vendors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md p-3 rounded-lg bg-muted text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
      />
      <div className="card-wrapper">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id}>
            <VendorCard vendor={vendor} />
          </div>
        ))}
      </div>
      {filteredVendors.length === 0 && (
        <p className="text-muted mt-4">No vendors found.</p>
      )}
    </div>
  );
};

export default VendorList;