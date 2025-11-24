import { ConversationList } from "@/components/shared/ConversationList";
import { ChatView } from "@/components/shared/ChatView";

const RepChatPage = () => {

  return (
    <div className="flex h-[90vh] overflow-hidden bg-background">
      <div className="w-96">
        <ConversationList  owner="REP" />
      </div>
      <div className="flex-1">
        <ChatView />
      </div>
    </div>
  );
};

export default RepChatPage;
