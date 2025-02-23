import React from 'react'
import { Vendor } from '@/lib/data-model/schema-types'

interface VendorCardProps {
    vendor: Vendor;
  }

const VendorCard = ({ vendor }: VendorCardProps) => {
  return (
    <div className="card bg-gray-800 hover:shadow-lg hover:scale-105 transition duration-100">
      <h2 className="text-green-300 font-semibold text-lg">{vendor.name}</h2>
      <p className="text-gray-400">🛠 {vendor.service}</p>
      <p className="text-gray-300 mt-2">📧 {vendor.contact}</p>
    </div>
  )
}

export default VendorCard
