import { User, Phone, Building2, Stethoscope, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DoctorDetailsOnRepDTO } from "../dto/DoctorDetailsDTO";

interface DoctorProfileHeaderProps {
  doctor: DoctorDetailsOnRepDTO;
}

export const DoctorProfileHeader = ({ doctor }: DoctorProfileHeaderProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        <Avatar className="h-24 w-24 border-4 border-primary/10">
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
            {getInitials(doctor.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{doctor.name}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              {doctor.departmentName && (
                <Badge variant="secondary" className="gap-1">
                  <Stethoscope className="h-3 w-3" />
                  {doctor.departmentName}
                </Badge>
              )}
              {doctor.hasOwnClinic && (
                <Badge variant="secondary" className="gap-1">
                  <Building2 className="h-3 w-3" />
                  Own Clinic
                </Badge>
              )}
              {doctor.territoryName && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {doctor.territoryName}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{doctor.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{doctor.hospital}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Reg ID: {doctor.registrationId}</span>
            </div>
            {doctor.opHours && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Stethoscope className="h-4 w-4" />
                <span>{doctor.opHours}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
