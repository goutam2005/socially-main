"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Smile } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";

export default function ChatInput({userId}: { userId: string}) {
  const [message, setMessage] = useState("");  
  const { sendMessageFe,sendLoading} = useChatStore();
  const {user}= useAuthStore()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
   if (user?.id) {
     await sendMessageFe(userId, message, user.id);
     setMessage("");
   }  
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 border-b border-r">
      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[2.5rem] max-h-[10rem] pr-10 resize-none"
            disabled={sendLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 bottom-1"
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <Button
          type="submit"
          size="icon"
          className="flex-shrink-0"
          disabled={!message.trim() || sendLoading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
