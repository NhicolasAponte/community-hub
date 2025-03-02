import React from "react";
import { Vendor } from "@/lib/data-model/schema-types";
import Link from "next/link";

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard = ({ vendor }: VendorCardProps) => {
  return (
    <div className=" hover:shadow-lg hover:scale-105 transition duration-100">
      {/* <h2 className="text-green-300 font-semibold text-lg">{vendor.name}</h2> */}
      <CardHeader title={vendor.name} />
      <CardContent>
        <p className="text-gray-400">🛠 {vendor.description}</p>
        <div>
          <ul className="flex flex-row flex-wrap gap-2 mt-2">
            {vendor.services.map((service, index) => (
              <li key={index} className="text-gray-400">
                {index > 0 ? `| ${service}` : service}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col space-y-2">
          <p className="text-gray-400">🏠 {vendor.address}</p>
          <div className="flex space-x-2">
            <p className="text-gray-400">📧 {vendor.email}</p>
            <p className="text-gray-400">📞 {vendor.phone}</p>
          </div>
          <div className="flex space-x-2">
            {vendor.website && (
              <Link
                href={vendor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                🌐 Website
              </Link>
            )}
            {vendor.instagram && (
              <a
                href={vendor.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                📸 Instagram
              </a>
            )}
            {vendor.twitter && (
              <a
                href={vendor.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                🐦 Twitter
              </a>
            )}
            {vendor.linkedin && (
              <a
                href={vendor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                💼 LinkedIn
              </a>
            )}
            {vendor.facebook && (
              <a
                href={vendor.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                📘 Facebook
              </a>
            )}
          </div>
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
