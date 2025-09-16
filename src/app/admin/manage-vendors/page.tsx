/**
 * @fileoverview server component for the admin page
 * @module app/misty-mountain/page
 * @author Nhicolas Aponte
 * @version 0.0.0
 * @date 03-03-2025
 */
"use server";
import React from "react";
import { fetchVendors } from "@/lib/data/vendor-actions";
import VendorAdminController from "../../../components/admin/vendor-admin-controller";

const ManageVendorsPage = async () => {
  const vendors = await fetchVendors();

  return (
    <section className="bg-background text-foreground p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Manage Vendors</h1>
        <p className="text-muted-foreground">
          View, edit, or add vendors to your business listing.
        </p>
      </div>
      <VendorAdminController vendors={vendors} />
    </section>
  );
};

export default ManageVendorsPage;
