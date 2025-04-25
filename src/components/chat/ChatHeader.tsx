"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, MoreVertical, Phone, Video } from "lucide-react";
import { useUsersStore } from "@/store/usersStore";
import { ChatHeaderSkeleton } from "./ChatSkeletons";
import Link from "next/link";

type User = {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
};

export default function ChatHeader({
  isLoading,
  toggleSidebar,
}: {
  isLoading: boolean;
  toggleSidebar: () => void;  
}) {
  const { seletedUser } = useUsersStore(); 
  if (isLoading) {
    return <ChatHeaderSkeleton/>;
  }
  return (
    <div className="border-b p-3 flex items-center border-t border-r justify-between">
      <Link href={`/main/profile/${seletedUser?.username}`}>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarImage
            src={
              seletedUser?.image ||
              "https://img.icons8.com/?size=100&id=LPk9CY756Am8&format=png&color=000000"
            }
          />
          <AvatarFallback>
            {seletedUser?.name?.charAt(0) ||
              seletedUser?.username?.charAt(0) ||
              "?"}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-medium text-sm">
            {seletedUser?.name || seletedUser?.username || "Unknown User"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {seletedUser?.username ? `@${seletedUser.username}` : ""}
          </p>
        </div>
      </div>
      </Link>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
