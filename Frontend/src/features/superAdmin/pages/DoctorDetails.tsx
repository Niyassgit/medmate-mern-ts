import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { viewDoctor } from "../api/superAdminApi";
import { DoctorDetails } from "../Schemas/DoctorDetails";
import { Button } from "@/components/ui/button";

const DoctorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      viewDoctor(id)
        .then((res) => {
          if (res.success && res.data) {
            setDoctor(res.data);
            setLoading(false);
          } else {
            setLoading(false);
            setError("Doctor not found");
          }
        })
        .catch(() => setError("Failed to fetch doctor"));
    }
  }, [id]);

  if (loading)
    return <p className="p-6 text-gray-500">Loading doctor details....</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">
          Doctor Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-gray-500 font-medium">Name</span>
            <p className="text-gray-800 mt-1">{doctor.name}</p>
          </div>

          <div>
            <span className="text-gray-500 font-medium">Email</span>
            <p className="text-gray-800 mt-1">{doctor.email || "N/A"}</p>
          </div>

          <div>
            <span className="text-gray-500 font-medium">Phone</span>
            <p className="text-gray-800 mt-1">{doctor.phone}</p>
          </div>

          <div>
            <span className="text-gray-500 font-medium">Status</span>
            <p
              className={`mt-1 inline-block px-2 py-1 rounded-full text-sm font-medium ${
                doctor.isBlocked
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {doctor.isBlocked ? "Blocked" : "Active"}
            </p>
          </div>

          <div>
            <span className="text-gray-500 font-medium">Hospital</span>
            <p className="text-gray-800 mt-1">{doctor.hospital}</p>
          </div>

          <div>
            <span className="text-gray-500 font-medium">Own Clinic</span>
            <p className="text-gray-800 mt-1">
              {doctor.hasOwnClinic ? "Yes" : "No"}
            </p>
          </div>

          <div>
            <span className="text-gray-500 font-medium">Registration ID</span>
            <p className="text-gray-800 mt-1">{doctor.registrationId}</p>
          </div>

          <div>
            <span className="text-gray-500 font-medium">OP Hours</span>
            <p className="text-gray-800 mt-1">{doctor.opHours || "N/A"}</p>
          </div>

          <div className="md:col-span-2">
            <span className="text-gray-500 font-medium">License Image</span>
            {doctor.licenseImageUrl ? (
              <img
                src={
                  doctor.licenseImageUrl
                    ? `${import.meta.env.VITE_API_IMG}${doctor.licenseImageUrl}`
                    : ""
                }
                alt="License"
                className="mt-2 w-full max-w-sm rounded-md border"
              />
            ) : (
              <p className="text-gray-400 mt-1">No license image available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
