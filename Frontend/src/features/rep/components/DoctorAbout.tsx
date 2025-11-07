import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface DoctorAboutProps {
  about?: string | null;
}

export const DoctorAbout = ({ about }: DoctorAboutProps) => {
  if (!about) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          About
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{about}</p>
      </CardContent>
    </Card>
  );
};
