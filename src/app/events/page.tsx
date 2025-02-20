import { formatDateStringToLocal } from "@/lib/utils";
import React from "react";

const events = [
  {
    id: 1,
    title: "Spring Festival",
    description: "Enjoy food, music, and activities at the annual Spring Festival.",
    date: "2025-03-20",
    location: "Central Park"
  },
  {
    id: 2,
    title: "Valentine's Day Speed Dating",
    description: "Meet new people in a fun and relaxed environment.",
    date: "2025-02-14",
    location: "Downtown Cafe"
  },
  {
    id: 3,
    title: "Dog Day at the Park",
    description: "Bring your furry friends for a day of fun and socialization!",
    date: "2025-04-05",
    location: "Riverside Park"
  }
];

const EventsPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-4 text-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-green-300">Upcoming Events</h1>
      <div className="w-full max-w-2xl space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className={`p-4 rounded-lg shadow-md border border-gray-700 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}` }>
            <h2 className="text-xl font-semibold text-blue-300">{event.title}</h2>
            <p className="text-gray-400">📅 {formatDateStringToLocal(event.date)} | 📍 {event.location}</p>
            <p className="text-gray-300 mt-2">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
