import { getPost } from "@/action/post-action";
import { getCurrentUser } from "@/action/user-actions";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import React from "react";

export default async function page() {
  const Posts = await getPost();
  const userResponse = await getCurrentUser(); 
  const UserId = userResponse.success ? userResponse.user?.id : null;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto px-4 py-8 gap-6 md:gap-10">
        {/* Create Post Section */}
        <div className="md:sticky md:top-20 h-fit w-full md:max-w-[400px] order-1 md:order-1">
          <CreatePost />
        </div>

        {/* Posts Feed */}
        <div className="space-y-6 w-full order-2 md:order-2">
          {Posts && Posts.length > 0 ? (
            Posts.map((post) => (
              <div
                key={post.id}
                className="transition-all duration-300 hover:transform hover:translate-y-[-2px]"
              >
                <PostCard post={post} UserId={UserId ?? null} />
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
    </div>
  );
}
