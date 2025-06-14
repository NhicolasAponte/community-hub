import React, { useState } from "react";
import { Vendor } from "@/lib/data-model/schema-types";
import { Pencil, Trash } from "lucide-react";
import ConfirmDeleteModal from "@/components/cards/confirm-delete-modal";

interface VendorTableProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendorId: string) => void;
}

const VendorTable: React.FC<VendorTableProps> = ({
  vendors,
  onEdit,
  onDelete,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVendor) {
      onDelete(selectedVendor.id);
    }
    setConfirmOpen(false);
    setSelectedVendor(null);
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search vendors by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto bg-white border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-sm text-gray-800 max-w-[200px] truncate">
                  {vendor.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 max-w-[300px] truncate">
                  {vendor.description}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="inline-flex gap-x-2 justify-center">
                    <button
                      onClick={() => onEdit(vendor)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(vendor)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredVendors.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        vendorName={selectedVendor?.name}
      />
    </>
  );
};

export default VendorTable;
