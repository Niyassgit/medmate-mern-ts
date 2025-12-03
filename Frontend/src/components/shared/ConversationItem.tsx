import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatMessageTimestamp } from "@/lib/formatMessageTimestamp";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface ConversationItemProps {
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  // online: boolean;
  isActive?: boolean;
  onClick?: () => void;

  lastMessageIsRead: boolean;
  lastMessageSenderId: string;
  ownerId: string;
}

export const ConversationItem = ({
  name,
  avatar,
  lastMessage,
  timestamp,
  unread,
  // online,
  isActive,
  onClick,
  lastMessageIsRead,
  lastMessageSenderId,
  ownerId,
}: ConversationItemProps) => {
  const isLastMessageSentByOwner = lastMessageSenderId === ownerId;
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50",
        isActive && "bg-muted"
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-medium text-foreground truncate">{name}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {formatMessageTimestamp(timestamp)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground max-w-[170px]">
            {/* Tick */}
            {isLastMessageSentByOwner &&
              (lastMessageIsRead ? (
                <CheckCheck className="w-3 h-3 text-blue-500 shrink-0 mr-1" />
              ) : (
                <Check className="w-3 h-3 opacity-70 shrink-0 mr-1" />
              ))}

            {/* Text that truncates */}
            <span className="truncate block overflow-hidden whitespace-nowrap">
              {lastMessage}
            </span>
          </div>

          {/* Unread bubble */}
          {unread === 1 && (
            <div className="h-3 w-3 rounded-full bg-green-600 ml-2"></div>
          )}
          {unread > 1 && (
            <div className="min-w-[22px] h-5 bg-green-600 text-white rounded-full text-[11px] flex items-center justify-center ml-2">
              {unread}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
