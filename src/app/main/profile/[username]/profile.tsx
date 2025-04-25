"use client";
import { getPost, toggleFollow } from "@/action/post-action";
import PostCard from "@/components/PostCard";
import { Edit, Link, MapPinIcon } from "lucide-react";

import React from "react";
import toast from "react-hot-toast";
import { EditUser } from "./Edit";
import UploadImage from "@/components/uploadthing";
import { Button } from "@/components/ui/button";
import { UpdateImgeProfile } from "@/action/profile-action";

type User = {
  id: string;
  name: string;
  image: string;
  bio: string;
  username: string;
  location: string;
  websites: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
};
type Posts = Awaited<ReturnType<typeof getPost>>;
type Post = Posts[number];
type ProfilePageProps = {
  username: string;
  UserProfile: User;
  Posts: Post[];
  CurrentUserID: string;
  currentUser: {
    user: User;
  };
  isFollowUser: {
    isFollow: boolean;
  };
};
export default function Profile({
  username,
  CurrentUserID,
  UserProfile,
  Posts,
  currentUser,
  isFollowUser,
}: ProfilePageProps) {
  const [isLoading, setIsLoading] = React.useState(false); // Changed initial state to false
  const [showImageUpload, setShowImageUpload] = React.useState(false);
  const [image, setImage] = React.useState<string | null>(null);
  const [loadingImage, setLoadingImage] = React.useState(false);

  const handleOnToggleFollow = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      const isFollow = await toggleFollow(UserProfile.id, CurrentUserID);
      if (isFollow.success) {
        if (isFollowUser.isFollow) {
          toast.success("user unfollow successfully");
        } else {
          toast.success("user follow successfully");
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  
  const ChangeImage = async(image: string) => {
    if(loadingImage) return;
    try {
      setLoadingImage(true);
      const res = await UpdateImgeProfile(UserProfile.id, image);
      if (res && res.success) {
        toast.success("Profile image updated successfully");
        // Refresh the page to show updated image
        window.location.reload();
      } else {
        toast.error("Failed to update profile image");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoadingImage(false);
      setShowImageUpload(false);
    }
  }
  
  return (
    <div className="w-full p-6 m-3 gap-6 max-w-6xl flex mx-auto">
      {!showImageUpload ? (
        <>
          <div className="md:sticky shadow-lg rounded-lg md:top-20 p-6 h-fit w-full md:max-w-[400px] order-1 md:order-1 ">
            <div className="flex items-start gap-8">
              {/* Avatar */}
              <div className="max-w-20 h-20 w-full rounded-full bg-gray-200 overflow-hidden">
                <img
                  src={
                    UserProfile.image ??
                    "https://img.icons8.com/?size=100&id=ckaioC1qqwCu&format=png&color=000000"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => currentUser?.user?.username === username && setShowImageUpload(true)}
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-2xl font-light">{username}</h1>
                  {currentUser?.user?.username !== username ? (
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs cursor-pointer font-medium"
                      onClick={handleOnToggleFollow}
                    >
                      {isFollowUser?.isFollow ? "Unfollow" : "Follow"}
                    </button>
                  ) : (
                    <EditUser {...UserProfile} />
                  )}
                </div>
                <div className="flex gap-8 mb-4">
                  <div className="text-center">
                    <span className="font-semibold block">
                      {UserProfile._count.posts}
                    </span>
                    <span className="text-gray-600">posts</span>
                  </div>
                  <div className="text-center">
                    <span className="font-semibold block">
                      {UserProfile._count.followers}
                    </span>
                    <span className="text-gray-600">followers</span>
                  </div>
                  <div className="text-center">
                    <span className="font-semibold block">
                      {UserProfile._count.following}
                    </span>
                    <span className="text-gray-600">following</span>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <p className="font-semibold">{UserProfile.name}</p>
                  <p className="text-gray-800">{UserProfile.bio}</p>
                  {UserProfile.location === null ? (
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPinIcon size={15} />:{"None"}
                    </p>
                  ) : (
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPinIcon size={15} />: {UserProfile.location}
                    </p>
                  )}
                  {UserProfile.websites === null ? (
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Link size={15} />:{"None"}
                    </p>
                  ) : (
                    <p className=" text-muted-foreground flex items-center gap-2">
                      <Link size={15} />: {UserProfile.websites}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        (showImageUpload || image) && (
          <div className="md:sticky shadow-lg rounded-lg md:top-20 p-6 h-fit w-full md:max-w-[400px] order-1 md:order-1">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Update Profile Picture</h2>
              <UploadImage
                endpoint="postImage"
                value={image || ""}
                onChange={(url) => {
                  setImage(url);
                }}
              />
              <div className="flex gap-2 justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowImageUpload(false);
                    setImage(null);
                  }}
                  disabled={loadingImage}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => image && ChangeImage(image)}
                  disabled={!image || loadingImage}
                >
                  {loadingImage ? "Updating..." : "Set Image"}
                </Button>
              </div>
            </div>
          </div>
        )
      )}
      <div className="space-y-6 w-full order-2 md:order-2">
        {!Posts || Posts instanceof Error ? (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-300">
              {Posts instanceof Error ? Posts.message : "No posts available"}
            </p>
          </div>
        ) : Posts.length > 0 ? (
          Posts.map((post) => (
            <div
              key={post.id}
              className="transition-all duration-300 hover:transform hover:translate-y-[-2px]"
            >
              <PostCard post={post} UserId={CurrentUserID ?? null} />
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-300">
              No posts yet. Be the first to post!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
