import { ConversationList } from "@/components/shared/ConversationList";
import { ChatView } from "@/components/shared/ChatView";
import { useState } from "react";
import { Conversation } from "@/components/Dto/Conversation";
import { Role } from "@/types/Role";

const RepChatPage = () => {

  const [selectedConversation,setSelectedConversation]=useState<Conversation | null>(null);
  return (
    <div className="flex h-[90vh] overflow-hidden bg-background">
      <div className="w-96">
        <ConversationList  owner={Role.MEDICAL_REP} onSelect={setSelectedConversation} />
      </div>
      <div className="flex-1">
        <ChatView conversation={selectedConversation} owner={Role.MEDICAL_REP}/>
      </div>
    </div>
  );
};

export default RepChatPage;
