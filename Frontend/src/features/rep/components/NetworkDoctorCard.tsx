import { DoctorCardProps } from "../dto/DoctorCardProps";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Building2,
  UserPlus,
  UserCheck,
  RefreshCcw,
  Share2,
  X,
  User,
} from "lucide-react";
import { connectionToggle, acceptConnection } from "../api";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const NetworkDoctorCard = ({
  id,
  name,
  specialty,
  institution,
  location,
  image,
  schedule,
  connectionStatus,
  connectionInitiator,
}: DoctorCardProps) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(connectionStatus);
  const [initiator, setInitiator] = useState<string | null>(
    connectionInitiator
  );
  const [isRemoving, setIsRemoving] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    let newStatus: string | null = status;
    let newInitiator: string | null = initiator;

    if (status === null) {
      newStatus = "PENDING";
      newInitiator = "REP";
    } else if (status === "ACCEPTED") {
      newStatus = null;
      newInitiator = null;
    }

    setStatus(newStatus);
    setInitiator(newInitiator);
    setLoading(true);

    try {
      const res = await connectionToggle(id);
      toast.success(res.data.message || "Action successful");
    } catch (error: unknown) {
      setStatus(status);
      setInitiator(initiator);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptConnection = async () => {
    const previousStatus = status;
    const previousInitiator = initiator;

    setStatus("ACCEPTED");
    setInitiator(null);
    setLoading(true);

    try {
      const res = await acceptConnection(id);
      toast.success(res.message || "Connection accepted");
      setTimeout(() => setIsRemoving(true), 500);
    } catch (error: unknown) {
      setStatus(previousStatus);
      setInitiator(previousInitiator);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong.";
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
    setLoading(true);

    try {
      const res = await connectionToggle(id);
      toast.success(res.data.message || "Request cancelled");
    } catch (error: unknown) {
      setStatus(previousStatus);
      setInitiator(previousInitiator);
      const erroMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong.";
      toast.error(erroMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/rep/doctor/details/${id}`);
  };

  let buttonLabel = "Connect";
  let buttonClass = "bg-[#3175B4] hover:bg-[#25629A] text-white";
  let ButtonIcon = UserPlus;
  let showCancelButton = false;
  let onClickHandler = handleConnect;

  if (status === "PENDING" && initiator === "REP") {
    buttonLabel = "Pending";
    buttonClass = "bg-gray-300 text-gray-600 cursor-not-allowed";
    ButtonIcon = UserPlus;
    showCancelButton = true;
  } else if (status === "PENDING" && initiator === "DOCTOR") {
    buttonLabel = "Follow Back";
    buttonClass = "bg-[#3175B4] hover:bg-[#25629A] text-white";
    ButtonIcon = UserPlus;
    onClickHandler = handleAcceptConnection;
  } else if (status === "ACCEPTED") {
    buttonLabel = "Connected";
    buttonClass = "bg-green-600 hover:bg-green-700 text-white";
    ButtonIcon = UserCheck;
  }

  if (isRemoving) return null;

  return (
    <div
      className={`bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-500 ease-out cursor-pointer ${
        status === "ACCEPTED" && !loading ? "animate-fadeOut" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className="relative w-full h-48 bg-muted flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-primary/5 text-primary">
            <User className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Content */}
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
        </div>

        {/* Buttons */}
        <div
          className="flex gap-2 pt-4 border-t border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            onClick={onClickHandler}
            className={`flex-1 gap-2 ${buttonClass}`}
            size="sm"
            disabled={loading || (status === "PENDING" && initiator === "REP")}
          >
            {loading ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : (
              <ButtonIcon className="w-4 h-4" />
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
};

export default NetworkDoctorCard;
