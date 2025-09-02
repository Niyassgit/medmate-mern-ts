// import AdminNavbar from '@/components/navbar/AdminNavbar'
// import React from 'react'

// const DoctorsList = () => {
//   return (
//         <>
//         <AdminNavbar/>
//            <span className='text-blue-800 font-bold'>Doctors are listed here.....</span>
//         </>
   
//   )
// }

// export default DoctorsList

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: string;
  name: string;
  email: string;
  role: string;
  territory: string;
  registrationDate: string;
  status: "Active" | "Blocked";
}

const DoctorsList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      name: "Dr. John Doe",
      email: "johndoe@example.com",
      role: "DOCTOR",
      territory: "New York",
      registrationDate: "2025-01-15",
      status: "Active",
    },
    {
      id: "2",
      name: "Dr. Jane Smith",
      email: "janesmith@example.com",
      role: "DOCTOR",
      territory: "California",
      registrationDate: "2025-02-20",
      status: "Blocked",
    },
  ]);

  const handleBlockToggle = (id: string) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? { ...doc, status: doc.status === "Active" ? "Blocked" : "Active" }
          : doc
      )
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Doctors List</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-medium">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Territory</th>
            <th className="p-3">Registration Date</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{doctor.name}</td>
              <td className="p-3">{doctor.email}</td>
              <td className="p-3">{doctor.role}</td>
              <td className="p-3">{doctor.territory}</td>
              <td className="p-3">{doctor.registrationDate}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    doctor.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {doctor.status}
                </span>
              </td>
              <td className="p-3 flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Viewing ${doctor.name}`)}
                >
                  View
                </Button>
                <Button
                  variant={doctor.status === "Active" ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleBlockToggle(doctor.id)}
                >
                  {doctor.status === "Active" ? "Block" : "Unblock"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsList;
