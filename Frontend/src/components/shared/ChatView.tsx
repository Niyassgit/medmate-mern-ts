import { Video, Phone, MoreVertical } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { useCallback, useEffect, useState, useRef } from "react";
import { MessageDTO } from "../Dto/MessageDTO";
import useFetchItem from "@/hooks/useFetchItem";
import { getMessagesRep, messageMarkAsReadForRep } from "@/features/rep/api";
import {
  doctorMessages,
  messageMarkAsReadForDoctor,
} from "@/features/doctor/api";
import { SpinnerButton } from "./SpinnerButton";
import { Conversation } from "../Dto/Conversation";
import { Role } from "@/types/Role";
import { getSocket } from "@/lib/socket";
import { ChatResponseDTO } from "../Dto/ChatResponseDTO";

interface ChatViewProps {
  conversation: Conversation | null;
  owner: Role;
}

export const ChatView = ({ conversation, owner }: ChatViewProps) => {
  const [localMessages, setLocalMessages] = useState<MessageDTO[]>([]);
  const hasMarkedAsReadRef = useRef(false);
  const isMarkingAsReadRef = useRef(false);

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(() => {
    if (!conversation)
      return Promise.resolve<ChatResponseDTO>({
        messages: [],
        nextCursor: null,
      });
    return owner === Role.MEDICAL_REP
      ? getMessagesRep(conversation.id)
      : doctorMessages(conversation.id);
  }, [conversation, owner]);

  const {
    data: messagesResponse,
    error,
    loading,
  } = useFetchItem<ChatResponseDTO>(fetchMessages);

  useEffect(() => {
    if (messagesResponse) {
      const reversedMessages = [...messagesResponse.messages].reverse();
      setLocalMessages(reversedMessages);
      setNextCursor(messagesResponse.nextCursor);
      hasMarkedAsReadRef.current = false;
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop =
            scrollContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messagesResponse]);

  const handleMessageSent = (newMessage: MessageDTO) => {
    setLocalMessages((prev) => [...prev, newMessage]);
  };

  const loadMoreMessages = useCallback(async () => {
    if (!conversation || !nextCursor || isFetchingMore) return;

    setIsFetchingMore(true);
    const div = scrollContainerRef.current;
    const previousScrollHeight = div?.scrollHeight || 0;

    try {
      const res =
        owner === Role.MEDICAL_REP
          ? await getMessagesRep(conversation.id, nextCursor)
          : await doctorMessages(conversation.id, nextCursor);

      const reversedMessages = [...res.messages].reverse();
      setLocalMessages((prev) => [...reversedMessages, ...prev]);
      setNextCursor(res.nextCursor);


      setTimeout(() => {
        if (div) {
          const newScrollHeight = div.scrollHeight;
          const scrollDifference = newScrollHeight - previousScrollHeight;
          div.scrollTop = scrollDifference;
        }
      }, 0);
    } catch (err) {
      console.error("Failed to load more messages", err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [conversation, nextCursor, isFetchingMore, owner]);

  useEffect(() => {
    const div = scrollContainerRef.current;
    if (!div || !nextCursor) return;

    const handleScroll = () => {
      if (div.scrollTop < 40 && !isFetchingMore) {
        loadMoreMessages();
      }
    };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [nextCursor, isFetchingMore, loadMoreMessages]);

  useEffect(() => {
    if (!conversation) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const socket = getSocket(token);
    socket.emit("join_conversation", conversation.id);

    const handleIncoming = (newMessage: MessageDTO) => {
      if (newMessage.senderRole !== owner) {
        setLocalMessages((prev) => [...prev, newMessage]);

        if (!isMarkingAsReadRef.current) {
          isMarkingAsReadRef.current = true;
          if (owner === Role.MEDICAL_REP) {
            messageMarkAsReadForRep(conversation.id).finally(() => {
              isMarkingAsReadRef.current = false;
            });
          } else {
            messageMarkAsReadForDoctor(conversation.id).finally(() => {
              isMarkingAsReadRef.current = false;
            });
          }
        }
      }
    };

    const handleSeen = () => {
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.senderRole === owner ? { ...msg, isRead: true } : msg
        )
      );
    };

    socket.on("new_message", handleIncoming);
    socket.on("message_seen", handleSeen);

    return () => {
      socket.off("new_message", handleIncoming);
      socket.off("message_seen", handleSeen);
      socket.emit("leave_conversation", conversation.id);
    };
  }, [conversation?.id, owner]);

  useEffect(() => {
    if (!conversation || !localMessages.length) return;

    const hasUnread = localMessages.some(
      (msg) => msg.senderRole !== owner && !msg.isRead
    );

    if (!hasUnread || hasMarkedAsReadRef.current || isMarkingAsReadRef.current)
      return;

    hasMarkedAsReadRef.current = true;
    isMarkingAsReadRef.current = true;

    const markAsRead =
      owner === Role.MEDICAL_REP
        ? messageMarkAsReadForRep(conversation.id)
        : messageMarkAsReadForDoctor(conversation.id);

    markAsRead.finally(() => {
      isMarkingAsReadRef.current = false;
    });
  }, [conversation?.id, localMessages, owner]);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-2">
        <img src="/logo.png" className="h-50 opacity-70" alt="Logo" />
        <p className="text-sm">Select a conversation to start messaging</p>
      </div>
    );
  }

  if (loading) return <SpinnerButton />;

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Something went wrong
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={conversation.profilImage}
                alt={conversation.name}
              />
              <AvatarFallback>
                {conversation.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-online border-2 border-background" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              {conversation.name}
            </h2>
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
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4  [scrollbar-width:none] 
             [-ms-overflow-style:none] 
             [&::-webkit-scrollbar]:hidden"
      >
        {isFetchingMore && (
          <div className="flex justify-center py-2">
            <SpinnerButton />
          </div>
        )}
        {localMessages.map((message) => (
          <MessageBubble
            key={message.id}
            text={message.content ?? ""}
            timestamp={new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            isSent={message.senderRole === owner}
            isRead={message.isRead}
          />
        ))}
      </div>

      {/* Input */}
      <MessageInput
        conversationId={conversation.id}
        senderRole={owner}
        receiverId={
          owner === Role.MEDICAL_REP
            ? conversation.doctorId
            : conversation.repId
        }
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};
