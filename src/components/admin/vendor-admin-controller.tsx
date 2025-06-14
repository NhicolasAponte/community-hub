"use client";
import React, { useState } from "react";
import VendorForm from "@/components/forms/vendor-form";
import VendorTable from "./vendor-table";
import { Vendor } from "@/lib/data-model/schema-types";
import {
  createVendor,
  deleteVendor,
  updateVendor,
} from "@/lib/data/vendor-actions";
import Modal from "@/components/cards/modal";
import { VendorFormData } from "@/lib/zod-schema/form-schema";

interface VendorClientWrapperProps {
  vendors: Vendor[];
}

const VendorAdminController: React.FC<VendorClientWrapperProps> = ({
  vendors,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string>();
  const [vendorFields, setVendorFields] = useState<VendorFormData>();

  const handleEdit = (vendor: Vendor) => {
    setIsEditOpen(true);
    setSelectedVendorId(vendor.id);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Add a Connection!
        </button>
      </div>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <div className="p-4 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">
            Create Vendor
          </h3>
          <VendorForm
            action={createVendor}
            closeForm={() => setIsCreateOpen(false)}
          />
        </div>
      </Modal>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <div className="p-4 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">
            Edit Vendor
          </h3>
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

export default VendorAdminController;
