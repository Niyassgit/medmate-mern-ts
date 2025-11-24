import { Video, Phone, MoreVertical } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

const messages = [
  {
    id: "1",
    text: "Hi Dr. Turner, hope you are having a good week.",
    timestamp: "10:00 AM",
    isSent: true,
  },
  {
    id: "2",
    text: "Hello! It's been busy but productive. How can I help you today?",
    timestamp: "10:02 AM",
    isSent: false,
  },
  {
    id: "3",
    text: "I wanted to confirm the patient file updates for Mrs. Davis. Are they complete?",
    timestamp: "10:05 AM",
    isSent: true,
  },
  {
    id: "4",
    text: "Yes, they are. I just finished uploading the latest diagnostic reports. You should see them in her profile now.",
    timestamp: "10:08 AM",
    isSent: false,
  },
  {
    id: "5",
    text: "Great, thank you! I will review the patient records by end of day. Please let me know if anything else comes up.",
    timestamp: "10:30 AM",
    isSent: true,
  },
  {
    id: "6",
    text: "Will do! Have a good day.",
    timestamp: "10:32 AM",
    isSent: false,
  },
];

export const ChatView = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
                alt="Dr. Emily Turner"
              />
              <AvatarFallback>ET</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-online border-2 border-background" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Dr. Emily Turner</h2>
            <p className="text-xs text-online">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} {...message} />
        ))}
        <div className="text-sm text-muted-foreground italic">
          Dr. Emily Turner is typing...
        </div>
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};
