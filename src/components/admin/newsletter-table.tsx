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
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <div className="w-full">
        <input
          type="text"
          placeholder="Search newsletters by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2 text-sm sm:text-base border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredNewsletters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No newsletters found.
          </div>
        ) : (
          filteredNewsletters.map((newsletter) => (
            <div key={newsletter.id} className="bg-card border border-border rounded-lg p-4 space-y-3 w-full">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-foreground text-sm flex-1 min-w-0 break-words">{newsletter.title}</h3>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(newsletter)}
                    className="flex items-center gap-1 px-2 py-1 text-xs border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(newsletter)}
                    className="flex items-center gap-1 px-2 py-1 text-xs border border-destructive text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium">Date:</span> {formatDate(newsletter.date)}</p>
                <p><span className="font-medium">Content:</span> <span className="break-words">{truncateContent(newsletter.content, 150)}</span></p>
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
                className="border-t border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-2 text-sm text-foreground max-w-[200px] truncate">
                  {newsletter.title}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground max-w-[120px] truncate">
                  {formatDate(newsletter.date)}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground max-w-[300px] truncate">
                  {truncateContent(newsletter.content)}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="inline-flex gap-x-2 justify-center">
                    <button
                      onClick={() => onEdit(newsletter)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(newsletter)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-destructive text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition"
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
                  className="px-4 py-6 text-center text-muted-foreground text-sm"
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
    </div>
  );
};

export default NewsletterTable;
