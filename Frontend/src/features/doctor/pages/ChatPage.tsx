import { ConversationList } from "@/components/shared/ConversationList";
import { ChatView } from "@/components/shared/ChatView";
import { useState } from "react";
import { Conversation } from "@/components/Dto/Conversation";
import { Role } from "@/types/Role";

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<
    Conversation | null
  >(null);
  return (
    <div className="flex h-[90vh] overflow-hidden bg-background">
      <div className="w-96">
        <ConversationList owner={Role.DOCTOR} onSelect={(conv)=>setSelectedConversation(conv)} />
      </div>
      <div className="flex-1">
        <ChatView owner={Role.DOCTOR} conversation={selectedConversation} />
      </div>
    </div>
  );
};

export default ChatPage;
