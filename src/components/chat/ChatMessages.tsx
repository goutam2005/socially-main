"use client";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { ChatMessagesSkeleton } from "./ChatSkeletons";
import { useChatStore } from "@/store/chatStore";
import { io } from "socket.io-client";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
  read: boolean;
  sender: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  receiver: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}
export default function ChatMessages({ userId }: { userId: string }) {
  const { user: currentUser } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, addMessage, setSocket, getMessages, currentChatPartnerId } =
    useChatStore();

  useEffect(() => {
    if (!currentUser?.id) return;
    // Initialize socket connection
    const socketInstance = io("/", {
      path: "/socket.io",
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected"); // Join room with currentUserId to receive messages
      socketInstance.emit("join-room", currentUser?.id);
    });

    // Only handle receive-message event, not both events
    socketInstance.on("receive-message", (message: Message) => {
      // Only add message if it's from the current chat partner or to the current chat partner
      if ((message.senderId === userId && message.receiverId === currentUser?.id) || 
          (message.receiverId === userId && message.senderId === currentUser?.id)) {
        addMessage(message);
      }
    });

    // Don't add messages on message-sent, just log confirmation
    socketInstance.on("message-sent", (message: Message) => {
      console.log("Message saved:", message);
      // No addMessage here to avoid duplicates
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [currentUser?.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      await getMessages(userId);
    };
    fetchMessages();
  }, [
    userId,
    currentUser?.id,
    currentUser?.name,
    currentUser?.username,
    currentUser?.image,
  ]);
  // Update the filter function to be more specific
  const filterMessages = (messages: Message[]) => {
    return messages.filter(
      (message) =>
        (message.senderId === currentUser?.id && message.receiverId === userId) ||
        (message.receiverId === currentUser?.id && message.senderId === userId)
    );
  };
  // Scroll to bottom when messages change
  useEffect(() => {
    if (!loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const formatMessageTime = (date: Date | string) => {
    const dateObject = date instanceof Date ? date : new Date(date);
    return dateObject.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <ChatMessagesSkeleton />;
  }

  // Update the return statement
  return (
    <div className="flex-1 overflow-y-auto border-r p-4 space-y-4">
      {filterMessages(messages).map((message) => {
        const isCurrentUser = message.senderId === currentUser?.id;
        
          return (
            <div
              key={message.id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-2 max-w-[80%] ${
                  isCurrentUser ? "flex-row-reverse" : ""
                }`}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    <AvatarImage
                      src={
                        message.sender.image ||
                        "https://img.icons8.com/?size=100&id=15265&format=png&color=000000"
                      }
                    />
                    <AvatarFallback>
                      {message.sender.name?.charAt(0) ||
                        message.sender.username?.charAt(0) ||
                        "?"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                  <div
                    className={`text-xs text-muted-foreground mt-1 ${
                      isCurrentUser ? "text-right" : ""
                    }`}
                  >
                    {formatMessageTime(message.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <div ref={messagesEndRef} />
    </div>
  );
}
