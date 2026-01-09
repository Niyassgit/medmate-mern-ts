import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageDTO } from "../Dto/MessageDTO";
import { useEffect, useRef, useState } from "react";
import { createMessageForDoctor } from "@/features/doctor/api";
import { MessageType } from "@/types/MessageTypes";
import { createMessageForRep } from "@/features/rep/api";
import { Role } from "@/types/Role";
import { useAppSelector } from "@/app/hooks";
import { getSocket } from "@/lib/socket";

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
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const userId = useAppSelector((state) => state.auth.user?.id);

  const handleSend = async () => {
    if (!text.trim()) return;

    emitTypingStop();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
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

  const emitTypingStart = () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !userId || !conversationId) {
      return;
    }

    const socket = getSocket(token);
    if (!socket || !socket.connected) {
      return;
    }
    socket.emit("typing:start", { conversationId, userId });
    isTypingRef.current = true;
  };

  const emitTypingStop = () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !userId || !conversationId) {
      return;
    }

    const socket = getSocket(token);
    if (!socket || !socket.connected) {
      return;
    }
    socket.emit("typing:stop", { conversationId, userId });
    isTypingRef.current = false;
  };

  const handleTextChange = (value: string) => {
    setText(value);
    if (value && !isTypingRef.current) {
      emitTypingStart();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value) {
      typingTimeoutRef.current = setTimeout(() => {
        emitTypingStop();
      }, 2000);
    } else {
      emitTypingStop();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current) {
        emitTypingStop();
      }
    };
  }, [conversationId]);
  return (
    <div className="px-6 py-4 border-t border-border bg-background">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type your message..."
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
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
