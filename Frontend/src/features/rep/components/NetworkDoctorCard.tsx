import { DoctorCardProps } from "../dto/DoctorCardProps";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Building2, User } from "lucide-react";

const NetworkDoctorCard = ({
  name,
  specialty,
  institution,
  location,
  image,
  schedule
}: DoctorCardProps) => {
  return (
    <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-foreground">{name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{specialty}</p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{institution}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{schedule}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{location}</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <User className="h-4 w-4 flex-shrink-0" />
            <span>{age} years old</span>
          </div> */}
        </div>

        <Button className="w-full">Connect</Button>
      </div>
    </div>
  );
};

export default NetworkDoctorCard;
