import { Video, Phone, MoreVertical } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { useCallback, useEffect, useState } from "react";
import { MessageDTO } from "../Dto/MessageDTO";
import useFetchItem from "@/hooks/useFetchItem";
import { getMessagesRep } from "@/features/rep/api";
import { doctorMessages } from "@/features/doctor/api";
import { SpinnerButton } from "./SpinnerButton";
import { Conversation } from "../Dto/Conversation";
import { Role } from "@/types/Role";

interface ChatViewProps {
  conversation: Conversation | null;
  owner:Role;
}

export const ChatView = ({ conversation, owner }: ChatViewProps) => {
  const [localMessages, setLocalMessages] = useState<MessageDTO[]>([]);
  const fetchMessages = useCallback(() => {
    if (!conversation) return Promise.resolve<MessageDTO[]>([]);
    if (owner === Role.MEDICAL_REP) {
      const data = getMessagesRep(conversation.id);
      return data;
    } else {
      const data = doctorMessages(conversation.id);
      return data;
    }
  }, [conversation]);
  const {
    data: messages,
    error,
    loading,
  } = useFetchItem<MessageDTO[]>(fetchMessages);

  useEffect(() => {
    setLocalMessages(messages || []);
  }, [messages]);

  const handleMessageSent = (newMessage: MessageDTO) => {
    setLocalMessages((prev) => [...prev, newMessage]);
  };

  if (loading) return <SpinnerButton />;

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Something went wrong
      </div>
    );

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
        <img src="/logo.png" className="h-50 opacity-70" />
        <p className="text-sm">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
        {/* LEFT SIDE — Avatar + Name */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={conversation?.profilImage}
                alt={conversation?.name}
              />
              <AvatarFallback>
                {conversation?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-online border-2 border-background" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              {conversation?.name}
            </h2>
            <p className="text-xs text-online">Online</p>
          </div>
        </div>

        {/* RIGHT SIDE — Call & options */}
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
        {localMessages.map((message) => (
          <MessageBubble
            key={message.id}
            text={message.content ?? ""}
            timestamp={new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            isSent={message.senderRole === owner}
          />
        ))}
      </div>

      {/* Input */}
      <MessageInput
        conversationId={conversation.id}
        senderRole={owner}
        receiverId={
          owner === Role.MEDICAL_REP ? conversation.doctorId : conversation.repId
        }
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};
