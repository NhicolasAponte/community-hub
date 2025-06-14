import React from "react";
import { Event } from "@/lib/data-model/schema-types";
import { Calendar, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => (
  <Card className="rounded-lg overflow-hidden bg-card text-card-foreground shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-200 mb-4 border border-border">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-foreground">{event.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center text-muted-foreground mb-2">
        <Calendar className="w-4 h-4 mr-2 text-accent" />
        <span>{event.date}</span>
      </div>
      <div className="flex items-center text-muted-foreground mb-2">
        <MapPin className="w-4 h-4 mr-2 text-accent" />
        <span>{event.location}</span>
      </div>
      <p className="text-muted-foreground">{event.description}</p>
    </CardContent>
  </Card>
);

export default EventCard;