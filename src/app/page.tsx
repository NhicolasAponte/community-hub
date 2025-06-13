import InstagramCarousel from "@/components/main-page/carousel";

const events = [
  {
    id: 1,
    name: "Thrifty Photo Shoot!",
    place: "Central Park",
    description: "bring your favorite thrifted pieces for a sunny photoshoot.",
  },
  {
    id: 2,
    name: "Dog Day at the Park",
    place: "Riverside Park",
    description: "A fun day for dog lovers and their furry friends.",
  },
  {
    id: 3,
    name: "Valentine's Speed Dating",
    place: "Downtown Cafe",
    description: "Meet new people in a relaxed and friendly environment.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 space-y-12">
      {/* Instagram Carousel */}
      <InstagramCarousel />

      {/* Events Section */}
      <div className="w-full max-w-2xl p-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">Upcoming Events</h1>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-card rounded-xl shadow-sm border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground">{event.name}</h2>
              <p className="text-muted-foreground">📍 {event.place}</p>
              <p className="text-muted-foreground mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
