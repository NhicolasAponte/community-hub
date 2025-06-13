"use client";
import React, { useState } from "react";
import VendorForm from "@/components/forms/vendor-form";
import VendorTable from "./vendor-table";
import { Vendor } from "@/lib/data-model/schema-types";
import {
  createVendor,
  deleteVendor,
  updateVendor,
} from "@/lib/actions/vendor-actions";
import Modal from "@/components/cards/modal";
import { VendorFormData } from "@/lib/zod-schema/vendor-schema";

interface AdminClientWrapperProps {
  vendors: Vendor[];
}

const AdminClientWrapper: React.FC<AdminClientWrapperProps> = ({ vendors }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false); // State to manage opening the form
  const [isEditOpen, setIsEditOpen] = useState(false); // State to manage closing the form
  const [selectedVendorId, setSelectedVendorId] = useState<string>(); // State to manage the selected vendor for editing
  // todo: add a default values constructor function to set the default values
  // todo: create a utility function to convert from the schema type to the zod type
  const [vendorFields, setVendorFields] = useState<VendorFormData>(); // State to manage vendor fields for the form

  const handleEdit = (vendor: Vendor) => {
    // Add edit logic here
    setIsEditOpen(true); // Open the modal for editing
    console.log("Edit vendor:", vendor);
    setSelectedVendorId(vendor.id); // Set the selected vendor for editing
    setVendorFields({
      name: vendor.name,
      description: vendor.description,
      email: vendor.email || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
      services: vendor.services || "",
      links: vendor.links || "",
    });
  };

  const handleDelete = (vendorId: string) => {
    deleteVendor(vendorId);
  };

  // const handleCreateBtnClick = () => {
  //   setIsCreateOpen(true); // Open the modal for creating a new vendor

  // }

  // const handleCloseForm = () => {
  //   setIsClosing(true); // Set closing state to true
  //   setTimeout(() => {
  //     setCreateNewVendor(false); // Hide the form after a delay
  //     setIsClosing(false); // Reset closing state
  //   }, 300); // Adjust the delay as needed for animation
  // }

  return (
    <div className="page-content">
      <div className="mb-4 ">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Add a Connection! 
        </button>
      </div>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <div className="p-2">
          <h2 className="text-black text-lg font-semibold mb-4">
            Create Vendor
          </h2>
          <VendorForm action={createVendor} closeForm={() => setIsCreateOpen(false)}/>
        </div>
      </Modal>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <div className="p-2">
          <h2 className="text-black text-lg font-semibold mb-4">Edit Vendor</h2>
          <VendorForm
            defaultValues={vendorFields}
            action={(data) => updateVendor(selectedVendorId!, data)}
            closeForm={() => setIsEditOpen(false)}
          />
        </div>
      </Modal>

      <VendorTable
        vendors={vendors}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminClientWrapper;
