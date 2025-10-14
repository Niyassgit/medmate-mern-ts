import { useEffect, useState } from "react";
import { MedicalRepDetails } from "@/components/Dto/MedicalRepDetails";
import { useSelector } from "react-redux";
import { getProfileRep, updateProfileImage } from "../api";
import ProfileAvatar from "@/components/shared/ProfileAvatar";
import toast from "react-hot-toast";
import LogoutButton from "@/components/shared/LogoutButton";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [rep, setRep] = useState<MedicalRepDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const id = useSelector((state: any) => state.auth.user?.id);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfileRep(id);
        if (res.success && res.data) {
          setRep(res.data);
        } else {
          setError("Invalid request");
        }
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleAvatarChange = (file: File) => {
    setSelectedFile(file);
    setOpenConfirm(true);
  };
  const confirmAvatarChange = async () => {
    if (!rep || !selectedFile) return;
    try {
      const response = await updateProfileImage(id, selectedFile);
      if (response.success) {
        setRep({ ...rep, profileImage: response.imageUrl });
        toast.success(response.message || "Image changed");
      } else {
        toast.error(response.message || "Something has happend");
      }
    } catch (err: any) {
      toast.error("Failed to upload profile image:", err.message);
    } finally {
      setOpenConfirm(false);
      setSelectedFile(null);
    }
  };

  if (loading) return <p className="p-6 text-blue-600">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!rep) return <p className="p-6">No profile found</p>;

  // Profile completion calculation
  const fields = [
    rep.name,
    rep.phone,
    rep.companyName,
    rep.companyLogoUrl,
    rep.employeeId,
    rep.about,
    rep.subscriptionStatus,
    rep.maxConnectionsPerDay,
    rep.educations?.length,
    rep.certificates?.length,
  ];

  const filled = fields.filter((f) => f && f !== "").length;
  const completion = Math.round((filled / fields.length) * 100);

  const getBorderColor = () => {
    if (completion === 100) return "border-green-500";
    if (completion >= 60) return "border-blue-500";
    if (completion >= 30) return "border-yellow-400";
    return "border-red-500";
  };
  
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="relative bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          {/* Profile Image with Completion Ring */}
          <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 120 120"
            >
              {/* Background Circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - completion / 100)}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>

            {/* Avatar stays centered */}
            <ProfileAvatar
              image={rep.profileImage}
              name={rep.name}
              email={rep.email}
              editable
              onImageChange={handleAvatarChange}
              className="w-32 h-32 border-4 border-white"
            />
            <ConfirmDialog
              open={openConfirm}
              title="Change Profile Picture"
              message="Are you sure you want to change your profile picture?"
              onConfirm={confirmAvatarChange}
              onCancel={() => setOpenConfirm(false)}
            />
          </div>

          {/* Name & Company */}
          <h1 className="text-2xl font-bold text-gray-800">{rep.name}</h1>
          <div className="flex items-center space-x-3 mt-1">
            <p className="text-gray-600 text-lg">{rep.companyName}</p>
            {rep.companyLogoUrl && (
              <img
                src={`${import.meta.env.VITE_API_IMG}${rep.companyLogoUrl}`}
                alt="Company Logo"
                className="w-12 h-12 object-contain rounded"
              />
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col mt-2 space-y-1 text-gray-500 text-sm text-center">
            {rep.phone && <span>📞 {rep.phone}</span>}
            {rep.email && <span>✉️ {rep.email}</span>}
          </div>

          {/* Complete Profile Button */}
          {completion < 100 && (
            <button
              onClick={() => navigate(`/rep/profile/complete/${id}`)}
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow hover:from-blue-600 hover:to-blue-700 transition"
            >
              <span>Complete Profile</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-800">Email</h2>
            <p className="text-gray-700">{rep.email || "N/A"}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-800">Phone</h2>
            <p className="text-gray-700">{rep.phone || "N/A"}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-800">Employee ID</h2>
            <p className="text-gray-700">{rep.employeeId || "N/A"}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-800">
              Max Connections / Day
            </h2>
            <p className="text-gray-700">{rep.maxConnectionsPerDay || "N/A"}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-800">Subscription</h2>
            <p
              className={
                rep.subscriptionStatus
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {rep.subscriptionStatus ? "Active" : "Inactive"}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-800">Status</h2>
            <p
              className={
                rep.isBlocked
                  ? "text-red-600 font-medium"
                  : "text-green-600 font-medium"
              }
            >
              {rep.isBlocked ? "Blocked" : "Active"}
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">About</h2>
          <p className="text-gray-700">
            {rep.about || "No information added yet."}
          </p>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-800">Education</h2>
          {rep.educations && rep.educations.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              {rep.educations.map((edu) => (
                <li key={edu.id}>
                  {edu.degree} from {edu.institute}{" "}
                  {edu.year ? `(${edu.year})` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">Not updated yet</p>
          )}
        </div>

        {/* Certificates Section */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-gray-800">Certificates</h2>
          {rep.certificates && rep.certificates.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              {rep.certificates.map((cert) => (
                <li key={cert.id}>
                  {cert.name} {cert.issuedBy ? `by ${cert.issuedBy}` : ""}{" "}
                  {cert.year ? `(${cert.year})` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">Not updated yet</p>
          )}
        </div>

        <LogoutButton className="bg-gray-400 hover:bg-gray-600" />
      </div>
    </div>
  );
};

export default ProfilePage;
