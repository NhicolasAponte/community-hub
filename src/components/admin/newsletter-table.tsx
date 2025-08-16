import React, { useState } from "react";
import { Newsletter } from "@/lib/data-model/schema-types";
import { Pencil, Trash } from "lucide-react";
import ConfirmDeleteModal from "@/components/cards/confirm-delete-modal";

interface NewsletterTableProps {
  newsletters: Newsletter[];
  onEdit: (newsletter: Newsletter) => void;
  onDelete: (newsletterId: string) => void;
}

const NewsletterTable: React.FC<NewsletterTableProps> = ({
  newsletters,
  onEdit,
  onDelete,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<Newsletter | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteClick = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedNewsletter) {
      onDelete(selectedNewsletter.id);
    }
    setConfirmOpen(false);
    setSelectedNewsletter(null);
  };

  const filteredNewsletters = newsletters.filter((newsletter) =>
    newsletter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search newsletters by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto bg-white border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Content Preview</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNewsletters.map((newsletter) => (
              <tr
                key={newsletter.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-sm text-gray-800 max-w-[200px] truncate">
                  {newsletter.title}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 max-w-[120px] truncate">
                  {formatDate(newsletter.date)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 max-w-[300px] truncate">
                  {truncateContent(newsletter.content)}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="inline-flex gap-x-2 justify-center">
                    <button
                      onClick={() => onEdit(newsletter)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(newsletter)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredNewsletters.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  No newsletters found.
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
        vendorName={selectedNewsletter?.title}
      />
    </>
  );
};

export default NewsletterTable;
