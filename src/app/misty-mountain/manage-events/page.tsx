"use server";
import React from "react";
import { fetchEvents } from "@/lib/data/event-data";
import EventAdminController from "@/components/admin/event-admin-controller";

const ManageEventsPage = async () => {
    const events = await fetchEvents();
    
    return (
        <section className="bg-background text-foreground p-6 rounded-lg shadow-sm">
        <div className="mb-6">
            <h1 className="text-2xl font-semibold">Manage Events</h1>
            <p className="text-muted-foreground">
            View, edit, or add events to your business listing.
            </p>
        </div>
        <EventAdminController events={events} />
        </section>
    );
}

export default ManageEventsPage;