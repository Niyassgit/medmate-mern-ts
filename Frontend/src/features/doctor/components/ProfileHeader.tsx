import { MedicalRep } from "../dto/RepFullDetailsDTO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Building2, IdCard, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ProfileHeaderProps {
  rep: MedicalRep;
}

export const ProfileHeader = ({ rep }: ProfileHeaderProps) => {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-8">
        {/* Profile Picture and Basic Info */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-primary/10">
            <img
              src={rep.profileImage}
              alt={rep.name}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{rep.name}</h1>
          <p className="text-sm text-muted-foreground">{rep.companyName} - Medical Representative</p>
        </div>

        {/* Contact Information Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">Email</p>
              <p className="truncate text-sm text-foreground">{rep.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">Phone</p>
              <p className="text-sm text-foreground">{rep.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">Company</p>
              <p className="text-sm text-foreground">{rep.companyName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <IdCard className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">Employee ID</p>
              <p className="text-sm text-foreground">{rep.employeeId}</p>
            </div>
          </div>

          {rep.educations.length > 0 && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground">Territory</p>
                <p className="text-sm text-foreground">{rep.educations[0].institute}</p>
              </div>
            </div>
          )}
        </div>

        {/* About Me Section */}
        <div className="mt-6 border-t border-border pt-6">
          <button
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
            className="flex w-full items-center justify-between text-left"
          >
            <h2 className="text-base font-semibold text-foreground">About Me</h2>
            {isAboutExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {isAboutExpanded && (
            <div className="mt-3 space-y-2">
              <p className="text-sm leading-relaxed text-muted-foreground ">
                {rep.about}
              </p>
              {rep.educations.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-medium text-foreground">Education:</p>
                  <p className="text-sm text-muted-foreground">
                    {rep.educations[0].degree} - {rep.educations[0].institute} ({rep.educations[0].year})
                  </p>
                </div>
              )}
              {rep.certificates.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-medium text-foreground">Certifications:</p>
                  {rep.certificates.map((cert) => (
                    <p key={cert.id} className="text-sm text-muted-foreground">
                      • {cert.name} - {cert.issuedBy} ({cert.year})
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact Button */}
        <div className="mt-6 flex justify-end">
          <Button variant="outline" className="border-pink-500 text-pink-500 hover:border-pink-700 hover:text-pink-700">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
