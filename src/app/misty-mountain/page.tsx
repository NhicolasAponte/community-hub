/**
 * @fileoverview server component for the admin page 
 * @module app/misty-mountain/page
 * @author Nhicolas Aponte
 * @version 0.0.0
 * @date 03-03-2025
 */
"use server"
import React from 'react'
import { fetchVendors } from '@/lib/actions/vendor-actions'
import AdminClientWrapper from './client-wrapper'

const AdminPage = async () => {
  const vendors = await fetchVendors();

  return (
    <div className='page-content'>
      <AdminClientWrapper vendors={vendors} />
    </div>
  )
}

export default AdminPage
