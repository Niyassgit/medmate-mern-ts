import { useEffect, useState } from "react";
import { DoctorDetails } from "@/features/superAdmin/Schemas/DoctorDetails";
import { getProfileDoctor } from "../api";
import { useSelector } from "react-redux";
import ProfileAvatar from "@/components/shared/ProfileAvatar";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { updateProfileImage } from "../api";
import toast from "react-hot-toast";
import LogoutButton from "@/components/shared/LogoutButton";

const ProfilePage = () => {
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openConfirm,setOpenConfirm]=useState(false);
  const [selectedFile,setSelectedFile]=useState<File | null>(null);

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
 
  const handleAvatarChange=(file:File)=>{
    setSelectedFile(file);
    setOpenConfirm(true);
  }
   const confirmAvatarChange = async () => {
    if (!doctor || !selectedFile) return;
    try {
      const response = await updateProfileImage(doctor.id, selectedFile); 
     if(response.success){
        setDoctor({ ...doctor, profileImage: response.imageUrl });
        toast.success(response.message || "Image changed");
     }else{
      toast.error(response.message || "Something has happend");
     }
    
    } catch (err: any) {
      toast.error("Failed to upload profile image:", err.message);
    }finally{
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
    doctor.licenseImageUrl,
  ];
  const filled = fields.filter((f) => f && f !== "").length;
  const completion = Math.round((filled / fields.length) * 100);

  // Determine border color based on completion
  const getBorderColor = () => {
    if (completion === 100) return "border-green-500";
    if (completion >= 60) return "border-blue-500";
    if (completion >= 30) return "border-yellow-400";
    return "border-red-500";
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
              name={doctor.name}
              email={doctor.email}
              image={doctor.profileImage}
              editable
              onImageChange={handleAvatarChange}
              className="w-32 h-32 border-4 border-white"
            />
            <ConfirmDialog 
             open={openConfirm}
             title="Change Profile Picture"
             message="Are you sure you want to change your profile picture?"
             onConfirm={confirmAvatarChange}
             onCancel={()=>setOpenConfirm(false)}
            />
          </div>
  

          {/* Doctor Info */}
          <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
          <p className="text-gray-600 mt-1">{doctor.hospital}</p>
          <div className="flex flex-col mt-2 space-y-1 text-gray-500 text-sm">
            {doctor.phone && <span>📞 {doctor.phone}</span>}
            {doctor.email && <span>✉️ {doctor.email}</span>}
          </div>

          {/* Modern Complete Profile Button */}
          {completion < 100 && (
            <button className="mt-4 flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow hover:from-blue-600 hover:to-blue-700 transition">
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

        {/* About Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">About</h2>
          <p className="text-gray-700">
            {doctor.about || "No information added yet."}
          </p>
        </div>

        {/* Professional Details Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Professional Details
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Hospital: {doctor.hospital || "Not provided"}</li>
            <li>
              Own Clinic: {doctor.hasOwnClinic ? "Yes" : "No / Not provided"}
            </li>
            <li>Registration ID: {doctor.registrationId}</li>
            <li>OP Hours: {doctor.opHours || "Not provided"}</li>
          </ul>
        </div>

        {/* Education Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Education
          </h2>
          {doctor.educations?.length ? (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {doctor.educations.map((edu, idx) => (
                <li key={idx}>{edu}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No education details added.</p>
          )}
        </div>

        {/* Certificates Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Certificates
          </h2>
          {doctor.certificates?.length ? (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {doctor.certificates.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No certificates uploaded.</p>
          )}
        </div>

        <LogoutButton 
        className="bg-[#E8618C] hover:bg-[#e64578]"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
