"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChatSidebarSkeleton } from "./ChatSkeletons";
import { getUsers } from "@/action/user-actions";


// Define ChatUser type
type ChatUser = {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  image: string | null;
  lastMessage?: string;
  lastMessageTime?: Date;
};

// Define expected API response type

export default function ChatSidebar({
  selectedUserId,
}: {
  selectedUserId?: string | null;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chats, setChats] = useState<ChatUser[]>([]);
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const users = await getUsers();
        if (users?.success && Array.isArray(users.users)) {
          setChats(users.users);
        } else {
          setChats([]);
        }
      } catch (error) {
        console.error("Failed to fetch chats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter(
    (chat) =>
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <ChatSidebarSkeleton />;
  }

  return (
    <div className="h-full flex flex-col border">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          <div className="divide-y">
            {filteredChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/main/chat?userId=${chat.id}`}
                className={`block p-4 hover:bg-muted/50 transition-colors ${
                  selectedUserId === chat.id ? "bg-muted" : ""
                }`}
              >
                <div                 
                  className="flex items-start gap-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        chat.image ||
                        "https://img.icons8.com/?size=100&id=LPk9CY756Am8&format=png&color=000000"
                      }
                      alt={chat.name || chat.username || "User Avatar"}
                    />
                    <AvatarFallback>
                      {chat.name?.charAt(0) || chat.username?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">
                        {chat.name || chat.username || "Unknown User"}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {chat.email}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        )}
      </div>
    </div>
  );
}
