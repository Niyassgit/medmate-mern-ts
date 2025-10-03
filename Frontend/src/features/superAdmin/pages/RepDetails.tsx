import { useState, useEffect } from "react";
import { viewRep } from "../api/superAdminApi";
import { useNavigate, useParams } from "react-router-dom";
import { MedicalRepDetails } from "@/components/Dto/MedicalRepDetails";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";

const RepDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rep, setRep] = useState<MedicalRepDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      viewRep(id)
        .then((res) => {
          if (res.success && res.data) {
            setRep(res.data);
            setLoading(false);
          } else {
            setLoading(false);
            setError("Medical rep not found");
          }
        })
        .catch(() => setError("Failed to fetch medical rep"));
    }
  }, [id]);

  if (loading)
    return <p className="p-6 text-gray-500">Loading medical rep details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!rep) return null;

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
        {/* Profile Header */}
        <Card>
          <CardContent className="flex items-center gap-6 p-6">
            {rep.profileImage ? (
              <img
                src={`${rep.profileImage}`}
                alt={rep.name}
                className="w-32 h-32 rounded-full border object-cover"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center rounded-full border bg-gray-100">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-800">{rep.name}</h2>
              <p className="text-gray-600">{rep.email || "N/A"}</p>
              <p className="text-gray-600">{rep.phone}</p>
              <span
                className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  rep.isBlocked
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {rep.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        {rep.about && (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{rep.about}</p>
            </CardContent>
          </Card>
        )}

        {/* Professional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-gray-500">Company</span>
              <p className="font-medium">{rep.companyName}</p>
            </div>
            <div>
              <span className="text-gray-500">Employee ID</span>
              <p className="font-medium">{rep.employeeId || "N/A"}</p>
            </div>
            <div>
              <span className="text-gray-500">Subscription Status</span>
              <p className="font-medium">
                {rep.subscriptionStatus ? "Active" : "Inactive"}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Max Connections/Day</span>
              <p className="font-medium">{rep.maxConnectionsPerDay ?? "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Company Logo */}
        {rep.companyLogoUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={`${import.meta.env.VITE_API_IMG}${rep.companyLogoUrl}`}
                alt="Company Logo"
                className="h-24 object-contain border rounded-md bg-white p-2"
              />
            </CardContent>
          </Card>
        )}

        {/* Education */}
        {rep.educations && rep.educations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rep.educations.map((edu) => (
                <div
                  key={edu.id}
                  className="border p-3 rounded-md bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">{edu.degree}</p>
                  <p className="text-gray-600">{edu.institute}</p>
                  <p className="text-sm text-gray-500">Year: {edu.year}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Certificates */}
        {rep.certificates && rep.certificates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rep.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="border p-3 rounded-md bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">{cert.name}</p>
                  <p className="text-gray-600">Issued By: {cert.issuedBy}</p>
                  <p className="text-sm text-gray-500">Year: {cert.year}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RepDetailsPage;
