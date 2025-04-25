"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user-actions";

export const getPost = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          select: {
            userID: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.log("Error on getting posts", error);
    throw new Error("Error on getting posts");
  }
};
export const createPost = async (
  content: string,
  userID: string | null,
  image: string
) => {
  try {
    if (!userID) return null;
    const post = await prisma.post.create({
      data: {
        content,
        authorID: userID,
        image,
      },
    });
    if (!post) return null;
    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.log("Error on creating post", error);
    throw new Error("Error on creating post");
  }
};
export const deletePost = async (postId: string, userId: string | null) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorID: true },
    });
    if (!post) throw new Error("Post not found");
    if (post.authorID !== userId)
      throw new Error("You are not authorized to delete this post");
    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath(`/`);
    return { success: true };
  } catch (error) {}
};

export const toggleLike = async (postId: string) => {
  const user = await getCurrentUser();
  if (user.error) return { success: false, error: "User not authenticated" };
  const userId = user.user?.id;
  try {
    if (!userId) return { success: false, error: "User not authenticated" };
    // Find the post to get the author ID
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorID: true },
    });
    if (!post) return { success: false, error: "Post not found" };
    // Check if the user has already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userID_postID: {
          postID: postId,
          userID: userId,
        },
      },
    });

    // If like exists, remove it
    if (existingLike) {
      await prisma.like.delete({
        where: {
          userID_postID: {
            postID: postId,
            userID: userId,
          },
        },
      });
      await prisma.notification.deleteMany({
        where: {
          type: "LIKE",
          userID: post.authorID, // Send notification to post author
          creatorID: userId, // User who liked the post
          postID: postId,
        },
      });
      revalidatePath("/");
      return { success: true, liked: false };
    }
    // If like doesn't exist, create it
    else {
      await prisma.like.create({
        data: {
          postID: postId,
          userID: userId,
        },
      });

      // Create notification only if the user is not liking their own post
      if (post.authorID !== userId) {
        await prisma.notification.create({
          data: {
            type: "LIKE",
            userID: post.authorID, // Send notification to post author
            creatorID: userId, // User who liked the post
            postID: postId,
          },
        });
      }

      revalidatePath("/");
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle like",
    };
  }
};

export const commentOnPost = async (
  content: string,
  postId: string,
  userId: string
) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorID: true },
    });
    if (!post) {
      return { success: false, error: "Post not found" };
    }
    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postID: postId,
        authorID: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });

    // Create notification only if commenting on someone else's post
    if (post.authorID !== userId) {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          userID: post.authorID, // Send notification to post author
          creatorID: userId, // User who commented
          postID: postId,
        },
      });
    }
    revalidatePath("/");
    return { success: true, comment };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create comment",
    };
  }
};

export const toggleFollow = async (userTargetId: string, userId: string) => {
  try {
    if (userId === userTargetId) {
      throw new Error("You can't follow yourself");
    }
    const exitsFollow = await prisma.follower.findUnique({
      where: {
        followerID_followingID: {
          followerID: userId,
          followingID: userTargetId,
        },
      },
    });

    if (exitsFollow) {
      await prisma.follower.delete({
        where: {
          followerID_followingID: {
            followerID: userId,
            followingID: userTargetId,
          },
        },
      });
      await prisma.notification.deleteMany({
        where: {
          type: "FOLLOW",
          userID: userTargetId,
          creatorID: userId,
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follower.create({
          data: {
            followerID: userId,
            followingID: userTargetId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userID: userTargetId,
            creatorID: userId,
          },
        }),
      ]);
    }
    revalidatePath("/");
    return {
      success: true,
    };
  } catch (error) {
    console.log("Error following user:", error);
    return {
      success: false,
      error: error,
    };
  }
};

export const checkfollow = async (userTargetId: string, userId: string) => {
  try {
    // Return a consistent response format when checking self-follow
    if (userId === userTargetId) {
      return {
        success: true,
        isFollow: false,
      };
    }
    
    const existsFollow = await prisma.follower.findUnique({
      where: {
        followerID_followingID: {
          followerID: userId,
          followingID: userTargetId,
        },
      },
    });
    
    return {
      success: true,
      isFollow: !!existsFollow,
    };
  } catch (error) {
    console.error("Error checking follow:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error checking follow",
      isFollow: false
    };
  }
};
