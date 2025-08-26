"use client";
import React, { useState } from 'react';
import { Event } from '@/lib/data-model/schema-types';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import Modal from '@/components/cards/modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EventCalendarProps {
  events: Event[];
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
  // Initialize to current date (August 2025)
  const [displayDate, setDisplayDate] = useState(new Date(2025, 7, 1)); // Month is 0-indexed, so 7 = August
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);

  const today = new Date(2025, 7, 25); // August 25, 2025
  
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  
  // Calculate calendar grid
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  // Create calendar grid
  const calendarGrid = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarGrid.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarGrid.push(day);
  }

  // Helper function to format date for comparison
  const formatDateForComparison = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Helper function to parse event date string to Date object
  const parseEventDate = (dateString: string) => {
    // Try different date formats
    let date = new Date(dateString);
    
    // If that fails, try parsing MM/DD/YYYY format
    if (isNaN(date.getTime())) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const month = parseInt(parts[0]) - 1; // Month is 0-indexed
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        date = new Date(year, month, day);
      }
    }
    
    // If that fails, try parsing DD/MM/YYYY format
    if (isNaN(date.getTime())) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed
        const year = parseInt(parts[2]);
        date = new Date(year, month, day);
      }
    }
    
    // Try parsing YYYY-MM-DD format
    if (isNaN(date.getTime())) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed
        const day = parseInt(parts[2]);
        date = new Date(year, month, day);
      }
    }
    
    return isNaN(date.getTime()) ? null : date;
  };

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const dayDate = new Date(year, month, day);
    const dayDateString = formatDateForComparison(dayDate);
    
    return events.filter(event => {
      const eventDate = parseEventDate(event.date);
      return eventDate && formatDateForComparison(eventDate) === dayDateString;
    });
  };

  // Check if a day is today
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year;
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setDisplayDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setDisplayDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-orange-50 dark:bg-orange-950/20 text-card-foreground rounded-lg border border-border p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="p-2 bg-pink-100 hover:bg-pink-200 border-pink-200 text-pink-800 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 dark:border-pink-800 dark:text-pink-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h2 className="text-xl font-semibold text-foreground">
          {monthNames[month]} {year}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="p-2 bg-pink-100 hover:bg-pink-200 border-pink-200 text-pink-800 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 dark:border-pink-800 dark:text-pink-200"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarGrid.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="p-2 h-24 bg-gray-50 dark:bg-gray-900/30 rounded-md border border-border"></div>;
          }

          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          const isTodayDay = isToday(day);

          return (
            <div
              key={`day-${day}`}
              className={`p-1 h-24 border border-border rounded-md relative overflow-hidden transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-800/50`}
              onClick={() => {
                if (dayEvents.length === 1) {
                  setSelectedEvent(dayEvents[0]);
                } else if (dayEvents.length > 1) {
                  setSelectedDayEvents(dayEvents);
                }
              }}
            >
              {/* Purple bar for days with events */}
              {hasEvents && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-purple-400 dark:bg-purple-500"></div>
              )}

              {/* Day number */}
              <div className={`text-sm font-medium mb-1 relative ${
                isTodayDay 
                  ? 'text-white font-bold' 
                  : 'text-foreground'
              }`}>
                {/* Blue circle behind today's date */}
                {isTodayDay && (
                  <div className="absolute top-0 left-0 w-6 h-6 bg-blue-500 rounded-full">
                  </div>
                )}
                <span className="relative z-10 inline-flex items-center justify-center w-6 h-6">{day}</span>
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.length === 1 ? (
                  // Single event - show more details
                  <div
                    key={dayEvents[0].id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(dayEvents[0]);
                    }}
                    className="bg-purple-200 dark:bg-purple-800/60 text-purple-800 dark:text-purple-200 text-xs p-1 rounded hover:bg-purple-300 dark:hover:bg-purple-700/80 transition-colors cursor-pointer overflow-hidden"
                    title={`${dayEvents[0].name} - ${dayEvents[0].location} - ${dayEvents[0].description}`}
                  >
                    <div className="font-medium truncate">{dayEvents[0].name}</div>
                    <div className="text-xs opacity-80 truncate">{dayEvents[0].location}</div>
                    <div className="text-xs opacity-70 line-clamp-2 leading-tight">{dayEvents[0].description}</div>
                  </div>
                ) : (
                  // Multiple events - show compact view
                  <>
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        className="bg-purple-200 dark:bg-purple-800/60 text-purple-800 dark:text-purple-200 text-xs px-1 py-0.5 rounded truncate hover:bg-purple-300 dark:hover:bg-purple-700/80 transition-colors cursor-pointer"
                        title={event.name}
                      >
                        {event.name}
                      </div>
                    ))}
                    
                    {/* Show "more" indicator if there are additional events */}
                    {dayEvents.length > 2 && (
                      <div 
                        className="text-xs text-muted-foreground px-1 hover:text-foreground cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDayEvents(dayEvents);
                        }}
                      >
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Detail Modal */}
      <Modal
        open={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <CardHeader className="pb-3 px-0 pt-6">
              <CardTitle className="text-xl font-semibold text-foreground">
                {selectedEvent.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="px-0 space-y-4">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
                <span>{selectedEvent.date}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
                <span>{selectedEvent.location}</span>
              </div>
              
              <div className="pt-2">
                <h4 className="font-medium text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </CardContent>
          </div>
        )}
      </Modal>

      {/* Multiple Events Modal */}
      <Modal
        open={selectedDayEvents.length > 0}
        onClose={() => setSelectedDayEvents([])}
        fullScreenOnDesktop={true}
      >
        {selectedDayEvents.length > 0 && (
          <div className="space-y-4">
            <CardHeader className="pb-3 px-0 pt-6">
              <CardTitle className="text-xl font-semibold text-foreground">
                Events on {selectedDayEvents[0] && (() => {
                  const eventDate = parseEventDate(selectedDayEvents[0].date);
                  return eventDate ? eventDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : selectedDayEvents[0].date;
                })()}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="px-0 space-y-4">
              <div className="grid gap-4">
                {selectedDayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedDayEvents([]);
                      setSelectedEvent(event);
                    }}
                  >
                    <h3 className="font-semibold text-foreground mb-2">{event.name}</h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-accent flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventCalendar;
