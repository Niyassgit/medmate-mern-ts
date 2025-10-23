import { useEffect, useState } from "react";
import { DoctorDetails } from "@/components/Dto/DoctorDetails";
import { getProfileDoctor } from "../api";
import { useSelector } from "react-redux";
import ProfileAvatar from "@/components/shared/ProfileAvatar";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { updateProfileImage } from "../api";
import toast from "react-hot-toast";
import LogoutButton from "@/components/shared/LogoutButton";
import { useNavigate } from "react-router-dom";
import { getProfileRep } from "@/features/rep/api";
import { DetailItem } from "../components/DetailItem";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const id = useSelector((state: any) => state.auth.user?.id);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return null;
      setLoading(true);
      setError(null);
      try {
        const res = await getProfileDoctor(id);
        if (res.success && res.data) {
          setDoctor(res.data);
        } else {
          setError("Invalid request");
        }
      } catch (error: any) {
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleAvatarChange = (file: File) => {
    setSelectedFile(file);
    setOpenConfirm(true);
  };

  const confirmAvatarChange = async () => {
    if (!doctor || !selectedFile) return;
    try {
      const response = await updateProfileImage(id, selectedFile);
      if (response.success) {
        setDoctor({ ...doctor, profileImage: response.imageUrl });
        toast.success(response.message || "Image changed");
      } else {
        toast.error(response.message || "Something has happened");
      }
    } catch (err: any) {
      toast.error("Failed to upload profile image:", err.message);
    } finally {
      setOpenConfirm(false);
      setSelectedFile(null);
    }
  };

  if (loading) return <p className="text-center py-6">Loading profile...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!doctor) return <p className="text-center">No doctor details found</p>;

  // Calculate profile completion %
  const fields = [
    doctor.name,
    doctor.email,
    doctor.phone,
    doctor.hospital,
    doctor.registrationId,
    doctor.about,
    doctor.educations?.length,
    doctor.certificates?.length,
    doctor.opHours,
    doctor.hasOwnClinic,
    doctor.departmentName, // added
    doctor.territoryName, // added
  ];
  const filled = fields.filter((f) => f && f !== "").length;
  const completion = Math.round((filled / fields.length) * 100);

  const handleImageError = async () => {
    try {
      const res = await getProfileRep(id);
      if (res.success && res.data?.profileImage) {
        return res.data.profileImage;
      }
    } catch (error) {
      toast.error("Failed to refresh profile image");
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative">
          {/* Profile Image with Completion Ring */}
          <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
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

            <ProfileAvatar
              name={doctor.name}
              email={doctor.email}
              image={doctor.profileImage}
              onImageError={handleImageError}
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

          {/* Doctor Info */}
          <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
          <p className="text-gray-600 mt-1">{doctor.hospital}</p>
          <div className="flex flex-col mt-2 space-y-1 text-gray-500 text-sm">
            {doctor.phone && <span>📞 {doctor.phone}</span>}
            {doctor.email && <span>✉️ {doctor.email}</span>}
          </div>

          {/* Complete Profile Button */}
          {completion < 100 && (
            <button
              onClick={() => navigate(`/doctor/profile/complete/${id}`)}
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

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* About Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">About</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {doctor.about || "No information added yet."}
            </p>
          </div>

          {/* Professional Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Professional Details
              </h2>
            </div>
            <div className="space-y-3">
              <DetailItem
                icon="🏥"
                label="Hospital"
                value={doctor.hospital || "Not provided"}
              />
              <DetailItem
                icon="🏢"
                label="Own Clinic"
                value={doctor.hasOwnClinic ? "Yes" : "No"}
              />
              <DetailItem
                icon="🆔"
                label="Registration"
                value={doctor.registrationId}
              />
              <DetailItem
                icon="🏥"
                label="Department"
                value={doctor.departmentName || "Not assigned"}
              />
              <DetailItem
                icon="📍"
                label="Territory"
                value={doctor.territoryName || "Not assigned"}
              />
              <DetailItem
                icon="🕐"
                label="OP Hours"
                value={doctor.opHours || "Not provided"}
              />
            </div>
          </div>

          {/* Education Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Education</h2>
            </div>
            {doctor.educations?.length ? (
              <div className="space-y-3">
                {doctor.educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-3 bg-gray-50 rounded-lg border-l-4 border-green-500 hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-semibold text-gray-800">{edu.degree}</p>
                    <p className="text-sm text-gray-600">{edu.institute}</p>
                    <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                No education details added
              </p>
            )}
          </div>

          {/* Certificates Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Certificates</h2>
            </div>
            {doctor.certificates?.length ? (
              <div className="space-y-3">
                {doctor.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3 bg-gray-50 rounded-lg border-l-4 border-yellow-500 hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-semibold text-gray-800">{cert.name}</p>
                    <p className="text-sm text-gray-600">{cert.issuedBy}</p>
                    <p className="text-xs text-gray-500 mt-1">{cert.year}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                No certificates uploaded
              </p>
            )}
          </div>
        </div>

        <LogoutButton className="bg-[#E8618C] hover:bg-[#e64578]" />
      </div>
    </div>
  );
};

export default ProfilePage;
