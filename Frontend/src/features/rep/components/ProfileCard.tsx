import { Mail, MapPin, Phone, User, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import profilePhoto from "@/assets/profile-photo.jpg";

const ProfileCard = () => {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="mb-4 h-24 w-24">
          <AvatarImage src={profilePhoto} alt="Elena Rodriguez" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        
        <h2 className="mb-1 text-xl font-bold text-foreground">Elena Rodriguez</h2>
        <p className="mb-4 text-sm text-muted-foreground">Cardiology, Practitioner</p>
        
        <div className="mb-6 grid w-full grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <User className="mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Specialty</p>
          </div>
          <div className="flex flex-col items-center">
            <Briefcase className="mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Experience</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Patients</p>
          </div>
          <p className="text-sm font-medium">Cardiology</p>
          <p className="text-sm font-medium">7 years</p>
          <p className="text-sm font-medium">2.5k+</p>
        </div>
        
        <div className="mb-4 w-full space-y-2 text-left">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>Boston, Massachusetts</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>elena.rodriguez@medmate.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
        
        <p className="mb-6 text-sm text-foreground/80">
          "Passionate medical representative dedicated to providing excellent care and achieving strong relationships with healthcare initiatives and fostering strong relationships with healthcare professionals."
        </p>
        
        <Button className="w-full" variant="outline">
          Edit Profile
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCard;