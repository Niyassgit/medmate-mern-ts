import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ConnectionStatusProps {
  connectionStatus: string | null;
  doctorName: string;
}

export const ConnectionStatus = ({ connectionStatus, doctorName }: ConnectionStatusProps) => {
  const handleConnect = () => {
    toast.success(`Your request to connect with Dr. ${doctorName} has been sent.`);
  };

  return (
    <Card className="mb-6 border-2 border-border">
      <CardHeader>
        <CardTitle className="text-lg">Connection Status</CardTitle>
      </CardHeader>
      <CardContent>
        {connectionStatus === null ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-muted-foreground mb-1">Not connected yet</p>
              <p className="text-sm text-muted-foreground">
                Connect with this doctor to start collaboration
              </p>
            </div>
            <Button onClick={handleConnect} className="gap-2 w-full sm:w-auto">
              <UserPlus className="h-4 w-4" />
              Send Connection Request
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <div className="flex-1">
              <Badge variant="outline" className="border-success text-success mb-2">
                {connectionStatus}
              </Badge>
              <p className="text-sm text-muted-foreground">
                You are connected with this doctor
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
