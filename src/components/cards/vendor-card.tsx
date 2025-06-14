import React from "react";
import { Vendor } from "@/lib/data-model/schema-types";
import { Mail, MapPin, Phone } from "lucide-react";

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard = ({ vendor }: VendorCardProps) => {
  return (
    <div className="rounded-lg overflow-hidden bg-card text-card-foreground shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-200">
      <CardHeader title={vendor.name} />
      <CardContent>
        <p className="text-muted-foreground mb-2">{vendor.description}</p>
        {vendor.services && vendor.services.split(",").length > 1 ? (
          <>
            <p className="text-muted-foreground">Services:</p>
            <ul className="list-disc list-inside text-muted-foreground">
              {vendor.services.split(",").map((service, index) => (
                <li key={index}>{service.trim()}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-muted-foreground">Services: {vendor.services}</p>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col space-y-2">
          {vendor.address && (
            <InfoRow icon={<MapPin className="w-4 h-4 text-accent" />} text={vendor.address} />
          )}
          {vendor.email && (
            <InfoRow icon={<Mail className="w-4 h-4 text-accent" />} text={vendor.email} />
          )}
          {vendor.phone && (
            <InfoRow icon={<Phone className="w-4 h-4 text-accent" />} text={vendor.phone} />
          )}
        </div>
      </CardFooter>
    </div>
  );
};

function CardHeader({ title }: { title: string }) {
  return (
    <div className="bg-primary text-primary-foreground p-4 text-xl font-semibold">
      {title}
    </div>
  );
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="bg-muted p-4 space-y-2">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="bg-muted p-4">{children}</div>;
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center space-x-2 text-muted-foreground">
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default VendorCard;
