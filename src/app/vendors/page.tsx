"use server";
import { fetchVendors } from "@/lib/data/vendor-actions";
import React from "react";
import VendorList from "./vendor-list";

const VendorsPage = async () => {
  const vendors = await fetchVendors();
  return (
    <div>
      <VendorList vendors={vendors} />
    </div>
  );
};

export default VendorsPage;
