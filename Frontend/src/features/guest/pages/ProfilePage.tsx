import ProfileAvatar from "@/components/shared/ProfileAvatar";
import { useEffect, useState } from "react";
import { getProfile } from "../api";
import toast from "react-hot-toast";
import LogoutButton from "@/components/shared/LogoutButton";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { GuestProfile } from "../dto/GuestProfileDTO";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        Profile not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <div className="mb-4">
          <ProfileAvatar name={profile.name} className="w-24 h-24 text-2xl" />
        </div>
        <Button
          className="bg-gray-300"
          onClick={() => navigate(`/guest/complete-profile`, { state: { isEdit: true } })}
        >
          <Edit />
          Edit
        </Button>
        <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
        <p className="text-gray-600 mb-6">{profile.email}</p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold text-gray-700">Phone</h3>
            <p className="text-gray-900">{profile.phone || "N/A"}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold text-gray-700">Territory</h3>
            <p className="text-gray-900">{profile.territoryName}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold text-gray-700">Status</h3>
            <p
              className={`font-medium ${profile.isRegistered ? "text-green-600" : "text-yellow-600"
                }`}
            >
              {profile.isRegistered ? "Registered" : "Guest"}
            </p>
          </div>
        </div>
        <LogoutButton redirectTo="/auth/login/guest" />
      </div>
    </div>
  );
};

export default ProfilePage;
