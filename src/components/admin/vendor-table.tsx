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
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <div className="w-full">
        <input
          type="text"
          placeholder="Search vendors by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2 text-sm sm:text-base border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredVendors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No vendors found.
          </div>
        ) : (
          filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-card border border-border rounded-lg p-4 space-y-3 w-full">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-foreground text-sm flex-1 min-w-0 break-words">{vendor.name}</h3>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(vendor)}
                    className="flex items-center gap-1 px-2 py-1 text-xs border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(vendor)}
                    className="flex items-center gap-1 px-2 py-1 text-xs border border-destructive text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium">Description:</span> <span className="break-words">{vendor.description}</span></p>
                {vendor.email && <p><span className="font-medium">Email:</span> <span className="break-words">{vendor.email}</span></p>}
                {vendor.phone && <p><span className="font-medium">Phone:</span> {vendor.phone}</p>}
                {vendor.address && <p><span className="font-medium">Address:</span> <span className="break-words">{vendor.address}</span></p>}
                {vendor.services && <p><span className="font-medium">Services:</span> <span className="break-words">{vendor.services}</span></p>}
                {vendor.links && <p><span className="font-medium">Links:</span> <span className="break-words">{vendor.links}</span></p>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto w-full">
        <table className="min-w-full table-auto bg-card border border-border rounded-md">
          <thead>
            <tr className="bg-muted text-left text-sm font-semibold text-muted-foreground">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-t border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-2 text-sm text-foreground max-w-[200px] truncate">
                  {vendor.name}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground max-w-[300px] truncate">
                  {vendor.description}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="inline-flex gap-x-2 justify-center">
                    <button
                      onClick={() => onEdit(vendor)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(vendor)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-destructive text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition"
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
                  className="px-4 py-6 text-center text-muted-foreground text-sm"
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
    </div>
  );
};

export default VendorTable;
