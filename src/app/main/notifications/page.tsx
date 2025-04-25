"use client";
import {
  getNotifications,
  markNotificationsAsRead,
} from "@/action/notification.action";
import { toggleFollow } from "@/action/post-action";
import { getCurrentUser } from "@/action/user-actions";
import NotificationSkeleton from "@/components/NotificationSkeleton";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Notificatons = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notificatons[number];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "LIKE":
      return <HeartIcon className="w-5 h-5 text-red-500 fill-red-500" />;
    case "COMMENT":
      return <MessageCircleIcon className="w-5 h-5 text-blue-500" />;
    case "FOLLOW":
      return <UserPlusIcon className="w-5 h-5 text-green-500" />;
    default:
      return null;
  }
};
export default function page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);
        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length > 0) await markNotificationsAsRead(unreadIds);
      } catch (error) {
        toast.error("Failed to fetch notifications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);
  const follow = async (targetUserId: string) => {
    if (isFollowing) return;
    const user = await getCurrentUser();
    const UserId = user?.user?.id;
    try {
      setIsFollowing(true);
      if (!UserId) return;
      const res = await toggleFollow(targetUserId, UserId);
      if (res.success) {
        toast.success("Followed user");
      }
    } catch (error) {
      toast.error("Failed to follow user");
    }
  };
  if (isLoading) {
    return <NotificationSkeleton />;
  }

  return (
    <div className="space-y-4 max-w-6xl w-full mx-auto shadow-lg rounded-lg p-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <span className="text-sm text-muted-foreground">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                >
                  <Link href={`/main/profile/${notification.creator.username}`}>
                    <Avatar className="mt-1 size-13">
                      <AvatarImage
                        src={
                          notification.creator.image ??
                          "https://img.icons8.com/?size=100&id=ckaioC1qqwCu&format=png&color=000000"
                        }
                      />
                    </Avatar>
                  </Link>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span className="flex items-center gap-1">
                        <Link
                          href={`/main/profile/${notification.creator.username}`}
                        >
                          <span className="font-medium">
                            {notification.creator.name ??
                              notification.creator.username}
                          </span>{" "}
                        </Link>
                        {notification.type === "FOLLOW" ? (
                          <div className="flex items-center gap-1 ">
                            <p>started following you</p>{" "}
                            <button
                              className="px-4 mx-4 py-1 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 text-sm font-medium"
                              onClick={() => follow(notification.creator.id)}
                            >
                              Follow back
                            </button>
                          </div>
                        ) : notification.type === "LIKE" ? (
                          "liked your post"
                        ) : (
                          "commented on your post"
                        )}
                      </span>
                    </div>

                    {notification.post &&
                      (notification.type === "LIKE" ||
                        notification.type === "COMMENT") && (
                        <div className="pl-6 space-y-2">
                          <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                            <p>{notification.post.content}</p>
                            {notification.post.image && (
                              <img
                                src={notification.post.image}
                                alt="Post content"
                                className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                              />
                            )}
                          </div>

                          {notification.type === "COMMENT" &&
                            notification.comment && (
                              <div className="text-sm p-2 bg-accent/50 rounded-md">
                                {notification.comment.content}
                              </div>
                            )}
                        </div>
                      )}

                    <p className="text-sm text-muted-foreground pl-6">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
