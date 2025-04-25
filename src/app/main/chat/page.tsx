"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { getNotification } from "@/action/chat-action";
import { getSelectedUser } from "@/action/user-actions";
import { useUsersStore } from "@/store/usersStore";

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const selectedUserId = searchParams.get("userId");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setSelectedUser, seletedUser } = useUsersStore();

  useEffect(() => {
    const res = async () => {
      setIsLoading(true);
      if (!selectedUserId) return;
      const result = await getSelectedUser(selectedUserId);
      if (result?.success && result.user) {
        setSelectedUser(result.user);
      }
      setIsLoading(false);
      // const result = await getNotification(selectedUserId);
    };
    res();
  }, [selectedUserId]);

  return (
    <>
      <div className="h-screen bg-base-200 -m-9">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-base-100 shadow-cl w-full rounded-lg max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex overflow-hidden h-full rounded-lg">
              <ChatSidebar selectedUserId={selectedUserId} />
              {selectedUserId ? (
                <div className="flex-1 flex flex-col">
                  <ChatHeader
                    isLoading={isLoading}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  />
                  <ChatMessages userId={selectedUserId} />
                  <ChatInput userId={selectedUserId} />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-muted/10">
                  <div className="text-center">
                    <h3 className="text-xl font-medium">
                      Welcome to your messages
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Select a conversation or start a new one
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
