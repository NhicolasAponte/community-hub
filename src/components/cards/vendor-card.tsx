import React from "react";
import { Vendor } from "@/lib/data-model/schema-types";
import { Mail, MapPin, Phone } from "lucide-react"; // Import Lucide icons

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard = ({ vendor }: VendorCardProps) => {
  return (
    <div className="hover:shadow-lg hover:scale-105 transition duration-100">
      <CardHeader title={vendor.name} />
      <CardContent>
        <p className="text-gray-400">{vendor.description}</p>
        <div>
          {vendor.services && vendor.services.split(",").length > 1 ? (
            <>
              <p className="text-gray-400">Services:</p>
              <ul className="list-disc list-inside text-gray-400">
                {vendor.services.split(",").map((service, index) => (
                  <li key={index}>{service.trim()}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-gray-400">Services: {vendor.services}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col space-y-2">
          {/* Conditionally render Address */}
          {vendor.address && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400">{vendor.address}</p>
            </div>
          )}
          {/* Conditionally render Email */}
          {vendor.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400">{vendor.email}</p>
            </div>
          )}
          {/* Conditionally render Phone */}
          {vendor.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400">{vendor.phone}</p>
            </div>
          )}
        </div>
      </CardFooter>
    </div>
  );
};

function CardHeader({ title }: { title: string }) {
  return (
    <div className="rounded-t-md text-xl font-semibold text-green-300 bg-slate-700 p-4">
      {title}
    </div>
  );
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4 bg-slate-800">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="bg-slate-800 p-4">{children}</div>;
}

export default VendorCard;
