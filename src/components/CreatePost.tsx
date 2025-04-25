"use client";
import { createPost } from "@/action/post-action";
import { useAuthStore } from "@/store/authStore";
import React from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import AuthComponent from "./AuthComponent";
import UploadImage from "./uploadthing";

export default function CreatePost() {
  const { user } = useAuthStore();
  const [content, setContent] = React.useState("");
  const [image, setImage] = React.useState(""); // Changed to lowercase for consistency
  const [showImageUpload, setShowImageUpload] = React.useState(false); // Fixed casing
  const [isPosting, setIsPosting] = React.useState(false);

  const createPosts = async () => {
    if (isPosting) {
      return;
    }
    console.log(image, content)
    if (!content.trim() && !image) {
      toast.error("Please add content or an image");
      return;
    }
    try {
      setIsPosting(true);
      if (!user) {
        console.log("User not authenticated");
        return;
      }
      await createPost(content, user.id, image);
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setContent("");
      setImage("");
      setIsPosting(false);
    }
  };
  if (!user) {
    return <AuthComponent />;
  }

  return (
    <Card className="mb-6 w-full ">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={
                  user?.image ||
                  "https://img.icons8.com/?size=100&id=ckaioC1qqwCu&format=png&color=000000"
                }
              />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {(showImageUpload || image) && (
            <div className="border rounded-lgp-4">
              <UploadImage
                endpoint="postImage"
                value={image}
                onChange={(url) => {
                  setImage(url);
                  if (url) setShowImageUpload(false);
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={"ghost"}
                size="sm"
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="text-muted-foreground hover:text-primary"
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center cursor-pointer "
              onClick={createPosts}
              disabled={(!content.trim() && !Image) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="mr-2 size-4" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
