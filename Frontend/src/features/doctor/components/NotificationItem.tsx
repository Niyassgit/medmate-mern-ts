import { CheckCircle2, Bell, MessageSquare, Heart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type NotificationType =
  | "CONNECTION_REQUEST"
  | "CONNECTION_ACCEPTED"
  | "LIKE"
  | "INTEREST";

interface NotificationItemProps {
  type: NotificationType;
  userName: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  onClick?: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  const iconClass = "h-4 w-4";

  switch (type) {
    case "CONNECTION_REQUEST":
      return <Users className={cn(iconClass, "text-primary")} />;
    case "CONNECTION_ACCEPTED":
      return <CheckCircle2 className={cn(iconClass, "text-accent")} />;
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
    case "LIKE":
      return "bg-destructive/10 p-1 rounded-full";
    case "INTEREST":
      return "bg-primary/10 p-1 rounded-full";
    default:
      return "bg-muted p-1 rounded-full";
  }
};

export const NotificationItem = ({
  type,
  userName,
  avatarUrl,
  content,
  timestamp,
  isRead,
  onClick,
}: NotificationItemProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer border",
        !isRead && {
          "bg-blue-50 border-blue-200": type === "CONNECTION_REQUEST",
          "bg-green-50 border-green-200": type === "CONNECTION_ACCEPTED",
          "bg-pink-50 border-pink-200": type === "LIKE",
          "bg-purple-50 border-purple-200": type === "INTEREST",
        },
        isRead && "bg-muted/20 border-transparent",
        "hover:brightness-95"
      )}
    >
      <Avatar className="flex-shrink-0 h-12 w-12">
        <AvatarImage src={avatarUrl} alt={userName} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-card-foreground text-sm">
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
        <p className="text-muted-foreground text-xs mt-2">{timestamp}</p>
      </div>
    </div>
  );
};
