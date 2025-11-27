import { Search, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConversationItem } from "./ConversationItem";
import { useEffect, useState, useCallback } from "react";
import { doctorConversations } from "@/features/doctor/api";
import { repConversations } from "@/features/rep/api";
import { Spinner } from "../ui/spinner";
import { Conversation } from "../Dto/Conversation";
import { Role } from "@/types/Role";
import { getSocket } from "@/lib/socket";

interface ConversationUpdate {
  conversationId: string;
  lastMessage: string;
  lastMessageAt: Date;
  senderRole?: Role;
  unread?: number;
}

export const ConversationList = ({
  owner,
  selectedConversationId,
  onSelect
}: {
  owner: Role;
  selectedConversationId?: string | null;
  onSelect: (conv:Conversation) => void;
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
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
  }, [owner]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const socket = getSocket(token);

    const handleConversationUpdate = (update: ConversationUpdate) => {
      setConversations((prevConversations) => {
        const index = prevConversations.findIndex(
          (c) => c.id === update.conversationId
        );

        if (index === -1) {
          fetchConversations();
          return prevConversations;
        }

        const conversation = prevConversations[index];
        const isMessageFromOtherUser = update.senderRole && update.senderRole !== owner;
        const isConversationSelected = update.conversationId === selectedConversationId;
        const isMessageFromCurrentUser = update.senderRole && update.senderRole === owner;
        
        let newUnread = conversation.unread;
        
        if (update.unread !== undefined) {
          newUnread = update.unread;
        } else if (isMessageFromOtherUser && !isMessageFromCurrentUser && !isConversationSelected) {
          newUnread = conversation.unread + 1;
        }

        const updatedConversations = [...prevConversations];
        const updatedConversation = {
          ...conversation,
          lastMessageAt: new Date(update.lastMessageAt).toISOString(),
          unread: newUnread,
        };

        if (update.lastMessage) {
          updatedConversation.lastMessage = update.lastMessage;
        }

        updatedConversations[index] = updatedConversation;

        updatedConversations.sort((a, b) => {
          const dateA = new Date(a.lastMessageAt).getTime();
          const dateB = new Date(b.lastMessageAt).getTime();
          return dateB - dateA;
        });

        return updatedConversations;
      });
    };

    socket.on("conversation_update", handleConversationUpdate);

    return () => {
      socket.off("conversation_update", handleConversationUpdate);
    };
  }, [fetchConversations, owner, selectedConversationId]);

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
        {conversations.map((c) => (
          <ConversationItem
            key={c.id}
            name={c.name}
            avatar={c.profilImage}
            lastMessage={c.lastMessage ?? "No messages yet"}
            timestamp={c.lastMessageAt}
            unread={c.unread}
            onClick={() => onSelect(c)}
          />
        ))}
      </div>
    </div>
  );
};
