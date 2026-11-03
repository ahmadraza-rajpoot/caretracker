import React from 'react'
import FindingForm from './form'

const page = () => {

     const audits = [
    {
      id: "15decc91-9bae-444f-9207-00678051c8bb",
      title: "Infection Control Audit",
    },
  ];

  const users = [
    {
      user_id: "92c0bf0b-a5ad-4b6d-b782-73dec2337a34",
      full_name: "Ahmed Raza",
    },
  ];


  return (
    <div>

      <FindingForm audits={audits} users={users} />
    </div>
  )
}

export default page