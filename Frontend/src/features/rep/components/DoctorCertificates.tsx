import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { CertificateDTO } from "../dto/DoctorDetailsDTO";

interface DoctorCertificatesProps {
  certificates?: CertificateDTO[];
}

export const DoctorCertificates = ({ certificates }: DoctorCertificatesProps) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Certificates & Licenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-muted/50 rounded-lg p-4 border border-border hover:border-accent transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="bg-accent/10 p-2 rounded-full">
                  <Award className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-1 truncate">
                    {certificate.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">{certificate.issuedBy}</p>
                  {certificate.issuedDate && (
                    <Badge variant="outline" className="text-xs">
                      {new Date(certificate.issuedDate).getFullYear()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
