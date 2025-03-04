/**
 * @fileoverview server component for the admin page 
 * @module app/misty-mountain/page
 * @author Nhicolas Aponte
 * @version 0.0.0
 * @date 03-03-2025
 */
"use server"
import { CardWithForm } from '@/components/cards/card-with-form'
import NewVendorForm from '@/components/forms/new-vendor-form'
import React from 'react'

const AdminPage = () => {
  return (
    <div className='page-content'>
        <NewVendorForm />
      <CardWithForm />
    </div>
  )
}

export default AdminPage
