import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { EducationDTO } from "../dto/DoctorDetailsDTO";

interface DoctorEducationProps {
  educations?: EducationDTO[];
}

export const DoctorEducation = ({ educations }: DoctorEducationProps) => {
  if (!educations || educations.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {educations.map((education) => (
            <div
              key={education.id}
              className="border-l-2 border-primary/30 pl-4 py-2 hover:border-primary transition-colors"
            >
              <h4 className="font-semibold text-foreground">{education.degree}</h4>
              <p className="text-sm text-muted-foreground">{education.institution}</p>
              {education.year && (
                <p className="text-xs text-muted-foreground mt-1">{education.year}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
