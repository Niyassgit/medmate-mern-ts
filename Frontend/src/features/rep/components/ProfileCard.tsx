import { Mail, MapPin, Phone, User, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MedicalRepDetailsDTO } from "../dto/MedicalRepDetailsDTO";
import { Link } from "react-router-dom";
import { getProfileRep } from "../api";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProfileCardProps {
  rep: MedicalRepDetailsDTO | null;
}

const ProfileCard = ({ rep }: ProfileCardProps) => {
  const [imageUrl, setImageUrl] = useState(rep?.profileImage || null);
  if (!rep) {
    return (
      <Card className="p-6 text-center">
        <p>Loading profile...</p>
      </Card>
    );
  }

  const handleImageError = async () => {
    try {
      const response = await getProfileRep(rep.loginId);
      if (
        (response.data.success && response.data?.data?.profileImage) ||
        null
      ) {
        setImageUrl(response.data.data.profileimage);
      } else {
        setImageUrl(null);
      }
    } catch {
      toast.error("Failed to refresh signed URL");
      setImageUrl(null);
    }
  };
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="mb-4 h-24 w-24">
          <AvatarImage
            src={imageUrl || undefined}
            alt={rep.name}
            onError={handleImageError}
          />
          <AvatarFallback>{rep.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <h2 className="mb-1 text-xl font-bold text-foreground">{rep.name}</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {rep.companyName || "No company info"}
        </p>

        <div className="mb-6 grid w-full grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <User className="mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Company</p>
            <p className="text-sm font-medium">{rep.companyName}</p>
          </div>
          <div className="flex flex-col items-center">
            <Briefcase className="mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Emp ID</p>
            <p className="text-sm font-medium">{rep.employeeId || "N/A"}</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Connections</p>
            <p className="text-sm font-medium">
              {rep.maxConnectionsPerDay ?? 0}
            </p>
          </div>
        </div>

        <div className="mb-4 w-full space-y-2 text-left">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{rep.companyName ? `${rep.companyName} HQ` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{rep.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{rep.phone}</span>
          </div>
        </div>

        <p
          className={`mb-6 text-sm ${
            !rep.about ? "text-red-500" : "text-foreground/80"
          }`}
        >
          {rep.about || "Complete your Profile to continue..."}
        </p>

        <Link to="/rep/profile">
          <Button className="w-full" variant="outline">
            View Profile
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ProfileCard;
