import { Smile, Paperclip, Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageDTO } from "../Dto/MessageDTO";
import { useState } from "react";
import { createMessageForDoctor } from "@/features/doctor/api";
import { MessageType } from "@/types/MessageTypes";
import { createMessageForRep } from "@/features/rep/api";
import { Role } from "@/types/Role";

interface MessageInputProps {
  conversationId: string;
  senderRole: Role;
  receiverId: string;
  onMessageSent: (message: MessageDTO) => void;
}

export const MessageInput = ({
  conversationId,
  senderRole,
  receiverId,
  onMessageSent,
}: MessageInputProps) => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;

    const payload = {
      conversationId,
      content: text,
      messageType: MessageType.TEXT,
      senderRole,
      receiverId,
    };

    const res =
      senderRole === Role.DOCTOR
        ? await createMessageForDoctor(payload)
        : await createMessageForRep(payload);

    onMessageSent(res.data);
    setText("");
  };

  return (
    <div className="px-6 py-4 border-t border-border bg-background">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-background border-border"
        />
        <Button
          size="icon"
          className="h-9 w-9 shrink-0 bg-primary"
          onClick={handleSend}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
