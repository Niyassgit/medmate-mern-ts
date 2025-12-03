import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { viewDoctor } from "../api/superAdminApi";
import { DoctorDetails } from "../../../components/Dto/DoctorDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
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

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <Card>
          <CardContent className="flex items-center gap-6 p-6">
            {doctor.profileImage ? (
              <img
                src={doctor.profileImage}
                alt={doctor.name}
                className="w-32 h-32 rounded-full border object-cover"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center rounded-full border bg-gray-100">
                <User className="w-16 h-16 text-gray-400" />{" "}
                {/* fallback icon */}
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {doctor.name}
              </h2>
              <p className="text-gray-600">{doctor.email || "N/A"}</p>
              <p className="text-gray-600">{doctor.phone}</p>
              <span
                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  doctor.isBlocked
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {doctor.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        {doctor.about && (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
            </CardContent>
          </Card>
        )}

        {/* Hospital & Clinic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-gray-500">Hospital</span>
              <p className="font-medium">{doctor.hospital}</p>
            </div>
            <div>
              <span className="text-gray-500">Own Clinic</span>
              <p className="font-medium">
                {doctor.hasOwnClinic ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Registration ID</span>
              <p className="font-medium">{doctor.registrationId}</p>
            </div>
            <div>
              <span className="text-gray-500">OP Hours</span>
              <p className="font-medium">{doctor.opHours || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        {doctor.educations && doctor.educations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctor.educations.map((edu) => (
                <div key={edu.id} className="border p-3 rounded-md bg-gray-50">
                  <p className="font-semibold text-gray-800">{edu.degree}</p>
                  <p className="text-gray-600">{edu.institute}</p>
                  <p className="text-sm text-gray-500">Year: {edu.year}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Certificates */}
        {doctor.certificates && doctor.certificates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctor.certificates.map((cert) => (
                <div key={cert.id} className="border p-3 rounded-md bg-gray-50">
                  <p className="font-semibold text-gray-800">{cert.name}</p>
                  <p className="text-gray-600">Issued By: {cert.issuedBy}</p>
                  <p className="text-sm text-gray-500">Year: {cert.year}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* License */}
        <Card>
          <CardHeader>
            <CardTitle>License</CardTitle>
          </CardHeader>
          <CardContent>
            {doctor.licenseImageUrl ? (
              <img
                src={`${import.meta.env.VITE_API_IMG}${doctor.licenseImageUrl}`}
                alt="License"
                className="w-full max-w-sm rounded-md border"
              />
            ) : (
              <p className="text-gray-400">No license image available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
