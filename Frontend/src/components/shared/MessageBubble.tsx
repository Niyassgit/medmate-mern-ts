import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isSent: boolean;
}

export const MessageBubble = ({ text, timestamp, isSent }: MessageBubbleProps) => {
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
        <span className="text-xs text-muted-foreground px-2">{timestamp}</span>
      </div>
    </div>
  );
};
