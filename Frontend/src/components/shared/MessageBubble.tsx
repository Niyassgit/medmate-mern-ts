import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
}

export const MessageBubble = ({
  text,
  timestamp,
  isSent,
  isRead,
}: MessageBubbleProps) => {
  return (
    <div className={cn("flex", isSent ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[70%] space-y-1", isSent && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm",
            isSent
              ? "bg-chat-sent text-chat-sent-foreground rounded-br-sm"
              : "bg-chat-received text-chat-received-foreground rounded-bl-sm"
          )}
        >
          {text}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground px-2">
          <span>{timestamp}</span>

          {isSent &&
            (isRead ? (
              <CheckCheck className="w-3 h-3 text-blue-500" /> 
            ) : (
              <Check className="w-3 h-3 opacity-70" /> 
            ))}
        </div>
      </div>
    </div>
  );
};
