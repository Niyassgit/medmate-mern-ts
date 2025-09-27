import { useState, useEffect } from "react";
import { viewRep } from "../api/superAdminApi";
import { useNavigate, useParams } from "react-router-dom";
import { MedicalRepDetails } from "../Schemas/MedicalRepDetails";

const RepDetails = () => {
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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Medical Representative Details
      </h2>

      {/* Company Logo */}
      {rep.companyLogoUrl && (
        <div className="mb-4">
          <img
            src={`${import.meta.env.VITE_API_IMG}${rep.companyLogoUrl}`}
            alt="Company Logo"
            className="h-20 w-20 object-contain border rounded-md"
          />
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-gray-500 font-medium">Name:</span>
          <p className="text-gray-800">{rep.name}</p>
        </div>

        <div>
          <span className="text-gray-500 font-medium">Email:</span>
          <p className="text-gray-800">{rep.email || "N/A"}</p>
        </div>

        <div>
          <span className="text-gray-500 font-medium">Phone:</span>
          <p className="text-gray-800">{rep.phone}</p>
        </div>

        <div>
          <span className="text-gray-500 font-medium">Company:</span>
          <p className="text-gray-800">{rep.companyName}</p>
        </div>

        <div>
          <span className="text-gray-500 font-medium">Employee ID:</span>
          <p className="text-gray-800">{rep.employeeId || "N/A"}</p>
        </div>

        <div>
          <span className="text-gray-500 font-medium">Subscription Status:</span>
          <p className="text-gray-800">
            {rep.subscriptionStatus ? "Active" : "Inactive"}
          </p>
        </div>

        <div>
          <span className="text-gray-500 font-medium">Max Connections/Day:</span>
          <p className="text-gray-800">{rep.maxConnectionsPerDay ?? "N/A"}</p>
        </div>

        <div>
          <span className="text-gray-500 font-medium">Blocked:</span>
          <p className="text-gray-800">
            {rep.isBlocked ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default RepDetails;
