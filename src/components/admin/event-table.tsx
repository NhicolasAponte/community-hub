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
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search events by name..."
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
                className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-sm text-gray-800 max-w-[200px] truncate">
                  {event.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 max-w-[120px] truncate">
                  {event.date}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 max-w-[180px] truncate">
                  {event.location}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 max-w-[300px] truncate">
                  {event.description}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="inline-flex gap-x-2 justify-center">
                    <button
                      onClick={() => onEdit(event)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(event.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
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
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EventTable;