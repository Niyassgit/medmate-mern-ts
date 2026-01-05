import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, RefreshCcw, Share2, X } from "lucide-react";
import { NetworkResponseDTO } from "../dto/NetworkResponseDTO";
import { connectionToggle, acceptRequest } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ConnectionCardProps {
  user: NetworkResponseDTO;
  onConnect: (userId: string, status: string | null) => void;
  isConnected: boolean;
}

export default function Networks({
  user,
  onConnect,
}: ConnectionCardProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(user.connectionStatus);
  const [initiator, setInitiator] = useState<string | null>(
    user.connectionInitiator
  );
  const [isRemoving, setIsRemoving] = useState(false);
  const navigate = useNavigate();
  const handleConnect = async () => {
    let newStatus: string | null = status;
    let newInitiator: string | null = initiator;

    if (status === null) {
      newStatus = "PENDING";
      newInitiator = "DOCTOR";
    } else if (status === "ACCEPTED") {
      newStatus = null;
      newInitiator = null;
    }

    setStatus(newStatus);
    setInitiator(newInitiator);
    onConnect(user.id, newStatus);

    setLoading(true);
    try {
      const data = await connectionToggle(user.id);
      toast.success(data.message || "Action successful");
    } catch (error: unknown) {
      setStatus(status);
      setInitiator(initiator);
      onConnect(user.id, status);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    const previousStatus = status;
    const previousInitiator = initiator;

    setStatus("ACCEPTED");
    setInitiator(null);
    onConnect(user.id, "ACCEPTED");

    setLoading(true);
    try {
      const data = await acceptRequest(user.id);
      toast.success(data.message || "Connection accepted");

      setTimeout(() => {
        setIsRemoving(true);
      }, 500);
    } catch (error: unknown) {
      setStatus(previousStatus);
      setInitiator(previousInitiator);
      onConnect(user.id, previousStatus);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    const previousStatus = status;
    const previousInitiator = initiator;

    setStatus(null);
    setInitiator(null);
    onConnect(user.id, null);

    setLoading(true);
    try {
      const data = await connectionToggle(user.id);
      toast.success(data.message || "Request cancelled");
    } catch (error: unknown) {
      setStatus(previousStatus);
      setInitiator(previousInitiator);
      onConnect(user.id, previousStatus);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  let buttonLabel = "Connect";
  let buttonClass = "bg-[#3175B4] hover:bg-[#25629A] text-white";
  let showCancelButton = false;
  let onClickHandler = handleConnect;

  if (status === "PENDING" && initiator === "DOCTOR") {
    buttonLabel = "Pending";
    buttonClass = "bg-gray-300 text-gray-600 cursor-not-allowed";
    showCancelButton = true;
  } else if (status === "PENDING" && initiator === "REP") {
    buttonLabel = "Follow Back";
    buttonClass = "bg-[#3175B4] hover:bg-[#25629A] text-white";
    onClickHandler = handleAcceptRequest;
  } else if (status === "ACCEPTED") {
    buttonLabel = "Connected";
    buttonClass = "bg-green-600 hover:bg-green-700 text-white";
  }

  if (isRemoving) {
    return null;
  }

  return (
    <div
      className={`group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ${
        status === "ACCEPTED" && loading === false ? "animate-fadeOut" : ""
      }`}
    >
      <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5" />
      <div className="relative px-6 pb-4">
        <div
          className="flex flex-col items-center -mt-16 mb-4 cursor-pointer"
          onClick={() => navigate(`/doctor/rep/details/${user.id}`)}
        >
          {/* Profile Image */}
          <img
            src={user.profileImage || "/placeholder.svg"}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-card object-cover shadow-md"
          />

          {/* Name & Company */}
          <div className="text-center mt-3">
            <h3 className="text-lg font-semibold text-foreground transition">
              {user.name}
            </h3>
            <p className="text-sm text-[#3175B4] font-medium mt-1">
              {user.companyName}
            </p>
            {user.territoryNames && user.territoryNames.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {user.territoryNames.map((territory, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    📍 {territory}
                  </span>
                ))}
              </div>
            )}
            {user.about && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {user.about}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            onClick={onClickHandler}
            className={`flex-1 gap-2 ${buttonClass}`}
            size="sm"
            disabled={
              loading || (status === "PENDING" && initiator === "DOCTOR")
            }
          >
            {loading ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : status === "ACCEPTED" ? (
              <UserCheck className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {loading ? "Processing..." : buttonLabel}
          </Button>

          {showCancelButton && (
            <Button
              onClick={handleCancelRequest}
              variant="outline"
              size="sm"
              className="px-3 bg-transparent hover:bg-red-50 hover:border-red-300"
              disabled={loading}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="px-3 bg-transparent hover:bg-[#f5f5f5]"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
