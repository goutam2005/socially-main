"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";

import { Button } from "./ui/button";
import {
  HeartIcon,
  LogInIcon,
  MessageCircleIcon,
  MessageSquare,
  SendIcon,
  UserPlus,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import { checkfollow } from "../action/post-action";
import UnfollowComponenet from "./unfollowComponenet";
import {
  commentOnPost,
  deletePost,
  getPost,
  toggleLike,
} from "@/action/post-action";
import { ScrollArea } from "./ui/scroll-area";

type Posts = Awaited<ReturnType<typeof getPost>>;
type Post = Posts[number];

function formatDistanceInWords(date: Date) {
  return formatDistanceToNow(date, { addSuffix: false });
}

export default function PostCard({
  post,
  UserId,
}: {
  post: Post;
  UserId: string | null;
}) {
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userID === UserId)
  );
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);

  const { user } = useAuthStore();

  const handleComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await commentOnPost(
        newComment,
        post.id,
        user?.id as string
      );
      if (result?.success) {
        toast.success("Comment added successfully");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Error commenting on post");
    } finally {
      setIsCommenting(false);
    }
  };
  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like a post");
      return;
    }
    if (isLiked) return; // Prevent multiple clicks or unauthorized users
    try {
      setIsLiked(true);
      // Optimistic UI update
      const newHasLiked = !hasLiked;
      setHasLiked(newHasLiked);
      setOptimisticLikes((prev) => prev + (newHasLiked ? 1 : -1));

      // Ensure toggleLike works correctly
      await toggleLike(post.id);
    } catch (error) {
      toast.error("Error liking post");
      // Revert state if an error occurs
      setOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userID === UserId));
    } finally {
      setIsLiked(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      if (!UserId) return;
      const result = await deletePost(post.id, UserId);
      if (result?.success) {
        toast.success("Post deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting post");
    } finally {
      setIsDeleting(false);
    }
  };



  return (
    <Card className="overflow-hidden shadow-lg rounded-lg">
      <CardContent className="p-4 sm:p-6 max-w-6xl">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4 items-center">
            <Link href={`/main/profile/${post.author.username}`}>
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={
                    post.author.image ||
                    "https://img.icons8.com/?size=100&id=ckaioC1qqwCu&format=png&color=000000"
                  }
                />
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/main/profile/${post.author.username}`}
                    className="font-semibold truncate hover:underline"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/main/profile/${post.author.username}`}>
                      @{post.author.username}
                    </Link>
                    <span>·</span>
                    <span>
                      {formatDistanceInWords(new Date(post.createdAt))} ago
                    </span>
                  </div>
                </div>
                {UserId === post.author.id && (
                  <DeleteAlertDialog
                    isDeleting={isDeleting}
                    handleDelete={handleDelete}
                  />
                )}
              </div>
              <p className="mt-2 text-sm text-foreground break-words">
                {post.content}
              </p>
            </div>
          </div>
          {post.image && (
            <div className="mt-4 overflow-hidden rounded-lg">
              <img
                src={post.image}
                alt={post.content}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <div className="flex items-center justify-between pt-2 space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={"ghost"}
                size={"sm"}
                className={`text-muted-foreground gap-2 cursor-pointer ${
                  hasLiked
                    ? "text-red-500 hover:text-red-600"
                    : "hover:text-red-500"
                }`}
                onClick={handleLike}
              >
                {hasLiked ? (
                  <HeartIcon className="size-5 fill-current" />
                ) : (
                  <HeartIcon className="size-5" />
                )}
                <span>{optimisticLikes}</span>
              </Button>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="gap-2 text-muted-foreground cursor-pointer"
                onClick={() => setShowComments((prev) => !prev)}
              >
                <MessageCircleIcon
                  className={`size-5 ${
                    showComments ? "fill-blue-500 text-blue-500" : ""
                  }`}
                />
                <span>{post.comments.length}</span>
              </Button>
              {UserId !== post.author.id && (
                <Link
                  href={`/main/chat?userId=${post.author.id}`}
                  className="gap-2 flex items-center text-muted-foreground"
                >
                  <MessageSquare size={20} />
                  Chat
                </Link>
              )}
            </div>
            {/* Only show follow button if not the user's own post */}
            {/* {UserId !== post.author.id &&
              (checkfollowUser ? (
                <UnfollowComponenet
                  handleUnfollow={handleUnfollow}
                  post={post}
                  isUnfollowing={isFollowing}
                />
              ) : (
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="gap-2 text-muted-foreground cursor-pointer"
                  onClick={() => handleFollow(post.author.id)}
                  disabled={isFollowing}
                >
                  <UserPlus className="size-5" />
                </Button>
              ))} */}
          </div>
          {showComments && (
            <div className="space-y-4 pt-4 border-t">
              <ScrollArea className="h-[200px]">
                <div className="space-y-4 pr-2">
                  {/* DISPLAY COMMENTS */}
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <Link href={`/main/profile/${comment.author.username}`}>
                          <AvatarImage
                            src={
                              comment.author.image ??
                              "https://img.icons8.com/?size=100&id=ckaioC1qqwCu&format=png&color=000000"
                            }
                          />
                        </Link>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <Link href={`/main/profile/${comment.author.username}`}>
                            <span className="font-medium text-sm">
                              {comment.author.name}
                            </span>
                          </Link>
                          <span className="text-sm text-muted-foreground">
                            @{comment.author.username}
                          </span>
                          <span className="text-sm text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                          </span>
                        </div>
                        <p className="text-sm break-words">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {user ? (
                <div className="flex space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage
                      src={
                        user?.image ||
                        "https://img.icons8.com/?size=100&id=ckaioC1qqwCu&format=png&color=000000"
                      }
                    />
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleComment}
                        className="flex items-center gap-2 cursor-pointer"
                        disabled={!newComment.trim() || isCommenting}
                      >
                        {isCommenting ? (
                          "Posting..."
                        ) : (
                          <>
                            <SendIcon className="size-4" />
                            Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                  <Button variant="outline" className="gap-2">
                    <LogInIcon className="size-4" />
                    Sign in to comment
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* {showUnfollowDialog && (
         
        )} */}
      </CardContent>
      {/* Add this at the end of your component, before the final closing tags */}
    </Card>
  );
}
