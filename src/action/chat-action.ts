"use server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "./user-actions";


export async function getChatMessages(senderId: string) {
  try {
    // Get the current user (receiver)
    const currentUserResponse = await getCurrentUser();

    if (!currentUserResponse.success || !currentUserResponse.user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const receiverId = currentUserResponse.user.id;
    // Get messages where current user is receiver and senderId is sender
    // OR current user is sender and senderId is receiver (for both sides of conversation)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return {
      success: true,
      messages,
    };
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch messages",
    };
  }
}

export async function sendMessage(receiverId: string, content: string) {
  try {
    // Get the current user (sender)
    const currentUserResponse = await getCurrentUser();

    if (!currentUserResponse.success || !currentUserResponse.user) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const senderId = currentUserResponse.user.id;

    // Create the message
    const message = await prisma.$transaction([
      prisma.message.create({
        data: {
          content,
          senderId,
          receiverId,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      }),
      prisma.notification.create({
        data: {
          type: "MESSAGE",
          userID: receiverId,
          creatorID: senderId,
        },
      }),
    ]);
   
    return {
      success: true,
      message,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
}

export async function getNotification(receiverId: string) {
  try {
    const notification = await prisma.notification.findMany({
      where: {
        userID: receiverId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },        
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notification;
  } catch (error) {
    console.log(error);
  }
}
