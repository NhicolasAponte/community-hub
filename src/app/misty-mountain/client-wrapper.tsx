"use client";
import React, { useState } from "react";
import NewVendorForm from "@/components/forms/new-vendor-form";
import VendorTable from "./vendor-table";
import { Vendor } from "@/lib/data-model/schema-types";
import { deleteVendor } from "@/lib/actions/vendor-actions";

interface AdminClientWrapperProps {
  vendors: Vendor[];
}

const AdminClientWrapper: React.FC<AdminClientWrapperProps> = ({ vendors }) => {
  const [isFormVisible, setIsFormVisible] = useState(false); // State to toggle form visibility

  const handleEdit = (vendor: Vendor) => {
    // Add edit logic here
    console.log("Edit vendor:", vendor);
  };

  const handleDelete = (vendorId: string) => {
    deleteVendor(vendorId);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev); // Toggle the form visibility
  };

  return (
    <div className="page-content">
      <div className="mb-4 ">
        <button
          onClick={toggleFormVisibility}
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          {isFormVisible ? "Cancel" : "New Vendor"}
        </button>
      </div>
      {isFormVisible && (
        <div className="mb-4">
          <NewVendorForm />
        </div>
      )}
      <VendorTable vendors={vendors} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default AdminClientWrapper;