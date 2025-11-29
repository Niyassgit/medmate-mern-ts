import { Search, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConversationItem } from "./ConversationItem";
import { useEffect, useState, useMemo } from "react";
import { doctorConversations } from "@/features/doctor/api";
import { repConversations } from "@/features/rep/api";
import { Spinner } from "../ui/spinner";
import { Conversation } from "../Dto/Conversation";
import { Role } from "@/types/Role";
import { getSocket } from "@/lib/socket";
import { MessageDTO } from "../Dto/MessageDTO";
import { useSelector } from "react-redux";

export const ConversationList = ({
  owner,
  onSelect,
}: {
  owner: Role;
  onSelect: (conv: Conversation) => void;
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const userId = useSelector((state: any) => state.auth.user?.id);

  const handleSelect = (conv: Conversation) => {
    setSelectedConversationId(conv.id);
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unread: 0 } : c))
    );
    onSelect(conv);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        let response;
        if (owner === Role.DOCTOR) {
          response = await doctorConversations();
        } else {
          response = await repConversations();
        }
        setConversations(response.data);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [owner]);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const dateA = new Date(a.lastMessageAt).getTime();
      const dateB = new Date(b.lastMessageAt).getTime();
      return dateB - dateA;
    });
  }, [conversations]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !conversations.length) return;

    const socket = getSocket(token);

    conversations.forEach((conv) => {
      socket.emit("join_conversation", conv.id);
    });

    const handleNewMessage = (message: MessageDTO) => {
      setConversations((prev) => {
        const updated = prev.map((conv) => {
          if (conv.id === message.conversationId) {
            const lastMessageAt =
              message.createdAt instanceof Date
                ? message.createdAt.toISOString()
                : message.createdAt;

            // Check if message was sent by the current user
            // senderId is the profile ID (doctorId or repId), so we compare with conversation's doctorId/repId
            const isSentByOwner = 
              (owner === Role.DOCTOR && message.senderId === conv.doctorId) ||
              (owner === Role.MEDICAL_REP && message.senderId === conv.repId);
            
            return {
              ...conv,
              lastMessage: message.content ?? "No messages yet",
              lastMessageAt: lastMessageAt,
              senderId: message.senderId,
              // If sent by owner, mark as unread initially (will be updated when other person sees it)
              // If sent by other person, reset lastMessageIsRead (not applicable for their messages)
              lastMessageIsRead: isSentByOwner ? false : (conv.lastMessageIsRead ?? false),
              unread:
                message.senderRole !== owner ? conv.unread + 1 : conv.unread,
            };
          }
          return conv;
        });
        return updated;
      });
    };

    const handleMessageSeen = (conversationId: string) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            // Only mark as read if the last message was sent by the owner
            // senderId is the profile ID of who sent the last message
            const isLastMessageSentByOwner = 
              (owner === Role.DOCTOR && conv.senderId === conv.doctorId) ||
              (owner === Role.MEDICAL_REP && conv.senderId === conv.repId);
            
            return {
              ...conv,
              // Only update if the last message was sent by us
              lastMessageIsRead: isLastMessageSentByOwner ? true : (conv.lastMessageIsRead ?? false),
            };
          }
          return conv;
        })
      );
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_seen", handleMessageSeen);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_seen", handleMessageSeen);
      // Leave all conversation rooms
      conversations.forEach((conv) => {
        socket.emit("leave_conversation", conv.id);
      });
    };
  }, [conversations, owner]);

  console.log("conversations list:", conversations);

  if (loading) return <Spinner />;
  return (
    <div className="flex flex-col h-full border-r border-border bg-sidebar-bg">
      {/* HEADER */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Messages</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 bg-background border-border"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 px-4 py-3 border-b border-border">
        <Badge variant="secondary" className="rounded-full">
          {owner === "DOCTOR" ? "Reps" : "Doctors"}
        </Badge>
        <Badge variant="outline" className="rounded-full">
          Unread
        </Badge>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.map((c) => (
          <ConversationItem
            key={c.id}
            name={c.name}
            avatar={c.profilImage}
            lastMessage={c.lastMessage ?? "No messages yet"}
            timestamp={c.lastMessageAt}
            unread={c.unread}
            isActive={c.id === selectedConversationId}
            onClick={() => handleSelect(c)}
            lastMessageIsRead={c.lastMessageIsRead ?? false}
            lastMessageSenderId={c.senderId}
            ownerId={owner === Role.DOCTOR ? c.doctorId : c.repId}
          />
        ))}
      </div>
    </div>
  );
};
