import { Search, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConversationItem } from "./ConversationItem";
import { useEffect, useState } from "react";
import { doctorConversations } from "@/features/doctor/api";
import { repConversations } from "@/features/rep/api";
import { Spinner } from "../ui/spinner";
import { Conversation } from "../Dto/Conversation";

export const ConversationList = ({ owner }: { owner: "DOCTOR" | "REP" }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        let response;
        if (owner === "DOCTOR") { 
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
          />
        ))}
      </div>
    </div>
  );
};
