"use server"
import prisma from "@/lib/prisma";

export const getSelectedUserPosts = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorID: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
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
    console.log("Error getting posts");
    return new Error("Error getting posts");
  }
};

export const getUserProfile = async (username: string) => {
  try {
    if (!username) return null;
    const profile = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });
    return profile;
  } catch (error) {
    console.log("Error getting profile");
    throw error;
  }
};
interface UpdateUserData {
  name?: string;
  username?: string;
  bio?: string; 
  location?: string;
  websites?: string;
}

export const UpdateUserProfile = async (userID: string, data: UpdateUserData) => {
  try {
    if (!userID) {
      return { success: false, error: "User ID is required" };
    }
    // Validate if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userID },
    });
    if (!existingUser) {
      return { success: false, error: "User not found" };
    }
    // Check if username is being updated and is unique
    if (data.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (existingUsername && existingUsername.id !== userID) {
        return { success: false, error: "Username already taken" };
      }
    }

    const profile = await prisma.user.update({
      where: { id: userID },
      data: {
        name: data.name,
        username: data.username,
        bio: data.bio,       
        location: data.location,
        websites: data.websites,
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        websites: true,
      },
    });

    return { success: true, profile };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};

export const UpdateImgeProfile = async (userID: string, image: string) => {
  try {
    const profile = await prisma.user.update({
      where: { id: userID },
      data: {
        image: image,
      },
    })
    return {
      success: true,
      profile,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    }
  }
}