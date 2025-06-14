"use client";
import React, { useState } from "react";
import EventForm from "@/components/forms/event-form";
import EventTable from "./event-table";
import { Event } from "@/lib/data-model/schema-types";

import Modal from "@/components/cards/modal";
import { EventFormData } from "@/lib/zod-schema/form-schema";
import { createEvent, deleteEvent, updateEvent } from "@/lib/data/event-data";

interface EventAdminControllerProps {
  events: Event[];
}

const EventAdminController: React.FC<EventAdminControllerProps> = ({
  events,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>();
  const [eventFields, setEventFields] = useState<EventFormData>();

  const handleEdit = (event: Event) => {
    setIsEditOpen(true);
    setSelectedEventId(event.id);
    setEventFields({
      name: event.name,
      description: event.description,
      date: event.date,
      location: event.location,
    });
  };

  const handleDelete = (eventId: string) => {
    deleteEvent(eventId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Add Event
        </button>
      </div>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <div className="p-4 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">
            Create Event
          </h3>
          <EventForm
            action={createEvent}
            closeForm={() => setIsCreateOpen(false)}
          />
        </div>
      </Modal>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <div className="p-4 bg-card rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">
            Edit Event
          </h3>
          <EventForm
            defaultValues={eventFields}
            action={(data) => updateEvent(selectedEventId!, data)}
            closeForm={() => setIsEditOpen(false)}
          />
        </div>
      </Modal>

      <EventTable events={events} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default EventAdminController;
