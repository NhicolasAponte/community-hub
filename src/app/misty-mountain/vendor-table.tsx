"use client";

import React from "react";
import { Vendor } from "@/lib/data-model/schema-types";
import { Pencil, Trash } from "lucide-react"; // Import Pencil and Trash icons

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
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Name
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Description
            </th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr
              key={vendor.id}
              className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-2 text-sm text-gray-800">{vendor.name}</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {vendor.description}
              </td>
              <td className="px-4 py-2 text-center flex">
                <button
                  onClick={() => onEdit(vendor)}
                  className="flex items-center justify-center px-2 py-1 text-sm text-black hover:text-white border rounded hover:bg-blue-600"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(vendor.id)}
                  className="flex items-center justify-center ml-2 px-2 py-1 text-sm text-black hover:text-white border rounded hover:bg-red-600"
                >
                  <Trash className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorTable;
