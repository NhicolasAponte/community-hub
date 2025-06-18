import { eventTable, newsletterTable, vendorTable } from "@/db";

// export type Vendor = {
//     id: string;
//     name: string;
//     description: string;
//     email: string | null;
//     phone: string | null;
//     address: string | null;
//     services: string | null; // parse into string array 
//     links: string | null;
//     // use generic links: string[] and programmatically determine type of link 
//     // if the url contains "instagram" then it's an instagram link 
//   }

  export type Vendor = typeof vendorTable.$inferSelect

//   import { Vendor } from "@/lib/data-model/schema-types";
// import { VendorFormData } from "@/lib/zod-schema/vendor-schema";

// export function vendorToFormData(vendor: Vendor): VendorFormData {
//   return {
//     name: vendor.name,
//     description: vendor.description,
//     email: vendor.email || "",
//     phone: vendor.phone || "",
//     address: vendor.address || "",
//     services: vendor.services || "",
//     links: vendor.links || "",
//   };
// }

  export type Event = typeof eventTable.$inferSelect

  export type Newsletter = typeof newsletterTable.$inferSelect 

  export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
  }