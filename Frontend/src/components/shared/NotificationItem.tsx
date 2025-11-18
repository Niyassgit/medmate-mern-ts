import {
  CheckCircle2,
  Bell,
  MessageSquare,
  Heart,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export type NotificationType =
  | "CONNECTION_REQUEST"
  | "CONNECTION_ACCEPTED"
  | "CONNECTION_REJECTED"
  | "LIKE"
  | "INTEREST";

interface NotificationItemProps {
  id: string;
  type: NotificationType;
  userName: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  roleId: string;
  viewerRole: "DOCTOR" | "MEDICAL_REP";
  postImage?: string;
  onAccept?: (notificationId:string,roleId: string) => void;
  onReject?: (notificationId: string, roleId: string) => void;
  onClick?: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  const iconClass = "h-4 w-4";
  switch (type) {
    case "CONNECTION_REQUEST":
      return <Users className={cn(iconClass, "text-primary")} />;
    case "CONNECTION_ACCEPTED":
      return <CheckCircle2 className={cn(iconClass, "text-accent")} />;
    case "CONNECTION_REJECTED":
      return <X className={cn(iconClass, "text-red-600")} />;
    case "LIKE":
      return <Heart className={cn(iconClass, "text-destructive")} />;
    case "INTEREST":
      return <MessageSquare className={cn(iconClass, "text-primary")} />;
    default:
      return <Bell className={cn(iconClass, "text-muted-foreground")} />;
  }
};

const getIconBgClass = (type: NotificationType) => {
  switch (type) {
    case "CONNECTION_REQUEST":
      return "bg-primary/10 p-1 rounded-full";
    case "CONNECTION_ACCEPTED":
      return "bg-accent/10 p-1 rounded-full";
    case "CONNECTION_REJECTED":
      return "bg-red-100 p-1 rounded-full";
    case "LIKE":
      return "bg-destructive/10 p-1 rounded-full";
    case "INTEREST":
      return "bg-primary/10 p-1 rounded-full";
    default:
      return "bg-muted p-1 rounded-full";
  }
};

export const NotificationItem = ({
  id,
  type,
  userName,
  avatarUrl,
  content,
  timestamp,
  isRead,
  roleId,
  viewerRole,
  postImage,
  onAccept,
  onReject,
  onClick,
}: NotificationItemProps) => {
  const navigate = useNavigate();

  const handleOpenProfile = () => {
    if (viewerRole === "DOCTOR") {
      navigate(`/doctor/rep/details/${roleId}`);
    } else {
      navigate(`/rep/doctor/details/${roleId}`);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer border",
        !isRead && {
          "bg-blue-50 border-blue-200": type === "CONNECTION_REQUEST",
          "bg-green-50 border-green-200": type === "CONNECTION_ACCEPTED",
          "bg-red-50 border-red-200": type === "CONNECTION_REJECTED",
          "bg-pink-50 border-pink-200": type === "LIKE",
          "bg-purple-50 border-purple-200": type === "INTEREST",
        },
        isRead && "bg-muted/20 border-transparent",
        "hover:brightness-95"
      )}
    >
      <Avatar
        className="flex-shrink-0 h-12 w-12 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          handleOpenProfile();
        }}
      >
        <AvatarImage src={avatarUrl} alt={userName} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3
                className="font-semibold text-card-foreground text-sm cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenProfile();
                }}
              >
                {userName}
              </h3>
              <div className={cn("flex-shrink-0", getIconBgClass(type))}>
                {getNotificationIcon(type)}
              </div>
            </div>

            {!isRead && (
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-notification-unread mt-1" />
            )}
          </div>

          <p className="text-card-foreground text-sm mt-1 leading-relaxed">
            {content}
          </p>

          {(type === "LIKE" || type === "INTEREST") && postImage && (
            <img
              src={postImage}
              alt="Post thumbnail"
              className="w-14 h-14 rounded-md mt-3 object-cover border border-border"
            />
          )}

          <p className="text-muted-foreground text-xs mt-2">{timestamp}</p>
        </div>

        {/* 🔥 ACTION UI MOVED TO THE RIGHT */}
        <div className="flex-shrink-0 flex items-center">
          {(() => {
            switch (type) {
              case "CONNECTION_REQUEST":
                return (
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={22}
                      className="text-green-600 hover:text-green-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAccept?.(id,roleId);
                      }}
                    />
                    <X
                      size={22}
                      className="text-red-600 hover:text-red-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject?.(id, roleId);
                      }}
                    />
                  </div>
                );

              case "CONNECTION_ACCEPTED":
                return (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md">
                    Connected
                  </span>
                );

              case "CONNECTION_REJECTED":
                return (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-md">
                    Request Rejected
                  </span>
                );

              default:
                return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
};
