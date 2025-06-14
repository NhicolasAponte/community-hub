"server";
import { fetchEvents } from "@/lib/data/event-data";
import React from "react";
import EventController from "./event-controller";

const EventsPage = async () => {
  const events = await fetchEvents();

  return (
    <div>
      <EventController events={events} />
    </div>
  );
};

export default EventsPage;
