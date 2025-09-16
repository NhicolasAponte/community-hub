"use client";
import EventList from '@/components/events/event-list';
import EventCalendar from '@/components/events/event-calendar';
import { Event } from '@/lib/data-model/schema-types';
import React, { useState } from 'react';

interface EventControllerProps {
  events: Event[];
}

const EventController = ({ events }: EventControllerProps) => {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div className="bg-background text-foreground rounded-lg shadow-sm p-4">
      <div className="flex items-center mb-4">
        <span className="mr-2 font-medium text-muted-foreground">View:</span>
        <button
          className={`px-3 py-1 rounded-l border border-border ${
            view === "list"
              ? "bg-accent text-accent-foreground font-semibold"
              : "bg-muted text-muted-foreground"
          }`}
          onClick={() => setView("list")}
          aria-pressed={view === "list"}
        >
          List
        </button>
        <button
          className={`px-3 py-1 rounded-r border-l-0 border border-border ${
            view === "calendar"
              ? "bg-accent text-accent-foreground font-semibold"
              : "bg-muted text-muted-foreground"
          }`}
          onClick={() => setView("calendar")}
          aria-pressed={view === "calendar"}
        >
          Calendar
        </button>
      </div>

      {view === "list" ? (
        <div>
          <EventList events={events} />
        </div>
      ) : (
        <div>
          <EventCalendar events={events} />
        </div>
      )}
    </div>
  );
};

export default EventController;