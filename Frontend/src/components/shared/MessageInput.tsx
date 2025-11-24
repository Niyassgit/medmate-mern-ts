import { Smile, Paperclip, Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const MessageInput = () => {
  return (
    <div className="px-6 py-4 border-t border-border bg-background">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Smile className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input
          placeholder="Type your message..."
          className="flex-1 bg-background border-border"
        />
        <Button size="icon" className="h-9 w-9 shrink-0 bg-primary hover:bg-primary/90">
          <Send className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Mic className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
