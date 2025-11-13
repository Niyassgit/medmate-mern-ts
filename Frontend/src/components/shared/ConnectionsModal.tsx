import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { User, X } from "lucide-react";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export type ConnectionItem = {
  id: string;
  name: string;
  profileImage?: string | null;
};

type Fetcher = () => Promise<ConnectionItem[]>;

type ConnectionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  fetcher: Fetcher;
  viewerRole: "doctor" | "rep";
};

export default function ConnectionsModal({
  isOpen,
  onClose,
  title = "Connections",
  fetcher,
  viewerRole,
}: ConnectionsModalProps) {
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    setLoading(true);

    fetcher()
      .then((data) => mounted && setConnections(data ?? []))
      .catch(console.error)
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [isOpen, fetcher]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <Card className="p-4 max-h-[80vh] overflow-hidden sm:rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex justify-center py-12">
              <SpinnerButton />
            </div>
          ) : connections.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 text-sm">
              No connections found.
            </p>
          ) : (
            <div className="overflow-auto max-h-[64vh] touch-pan-y">
              <ul className="space-y-3">
                {connections.map((conn) => (
                  <li
                    key={conn.id}
                    className="flex items-center gap-3 rounded-md hover:bg-muted/30 p-2 cursor-pointer"
                    onClick={() => {
                      if (viewerRole === "doctor") {
                        navigate(`/doctor/rep/details/${conn.id}`);
                      } else {
                        navigate(`/rep/doctor/details/${conn.id}`);
                      }
                    }}
                  >
                    <Avatar className="w-10 h-10">
                      {conn.profileImage ? (
                        <AvatarImage
                          src={conn.profileImage}
                          alt={conn.name}
                          className="object-cover w-full h-full rounded-4xl"
                        />
                      ) : (
                        <AvatarFallback>
                          <User className="w-5 h-5 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <p className="font-medium text-sm text-foreground">
                      {conn.name}
                    </p>

                    <p className="font-medium text-sm text-foreground">
                      {conn.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
