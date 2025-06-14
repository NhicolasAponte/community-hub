import React from "react";
import { Event } from "@/lib/data-model/schema-types";
import EventCard from "./event-card";

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => (
  <div>
    {events.length === 0 ? (
      <div className="text-muted-foreground text-center py-8 bg-card rounded-lg border border-border">
        No events found.
      </div>
    ) : (
      events.map((event) => <EventCard key={event.id} event={event} />)
    )}
  </div>
);

export default EventList;