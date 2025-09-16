import React, { useState } from "react";
import { Event } from "@/lib/data-model/schema-types";
import { Pencil, Trash } from "lucide-react";

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const EventTable: React.FC<EventTableProps> = ({
  events,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      <div className="w-full">
        <input
          type="text"
          placeholder="Search events by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2 text-sm sm:text-base border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No events found.
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-card border border-border rounded-lg p-4 space-y-3 w-full">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-foreground text-sm flex-1 min-w-0 break-words">{event.name}</h3>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(event)}
                    className="flex items-center gap-1 px-2 py-1 text-xs border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    className="flex items-center gap-1 px-2 py-1 text-xs border border-destructive text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium">Date:</span> {event.date}</p>
                <p><span className="font-medium">Location:</span> <span className="break-words">{event.location}</span></p>
                <p><span className="font-medium">Description:</span> <span className="break-words">{event.description}</span></p>
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
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr
                key={event.id}
                className="border-t border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-4 py-2 text-sm text-foreground max-w-[200px] truncate">
                  {event.name}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground max-w-[120px] truncate">
                  {event.date}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground max-w-[180px] truncate">
                  {event.location}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground max-w-[300px] truncate">
                  {event.description}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="inline-flex gap-x-2 justify-center">
                    <button
                      onClick={() => onEdit(event)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary text-primary rounded hover:bg-primary hover:text-primary-foreground transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(event.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-destructive text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition"
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredEvents.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-muted-foreground text-sm"
                >
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;