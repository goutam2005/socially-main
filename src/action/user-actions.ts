"use server";
import prisma from "@/lib/prisma";
import {
  deleteTokenFromCookies,
  getTokenFromCookies,
  refreshToken,
  saveTokenToCookies,
  token,
  verifyRefreshToken,
  verifyToken,
} from "@/lib/token";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
type UserData = {
  name: string;
  email: string;
  password: string;
};

// JWT secret key - should be in environment variables in production

export const createUser = async (userData: UserData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        username: userData.email.split("@")[0],
        password: hashedPassword,
      },
    });
    const authtoken = await token(user.id);
    const refresshtoken = await refreshToken(user.id);
    await saveTokenToCookies(authtoken, refresshtoken);
    revalidatePath("/");
    return { success: true, user };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, error: "Invalid password" };
    }

    // Generate JWT token
    const authtoken = await token(user.id);
    const refresshtoken = await refreshToken(user.id);
    await saveTokenToCookies(authtoken, refresshtoken);
    revalidatePath("/");
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
};

export const logoutUser = async () => {
  try {
    await deleteTokenFromCookies(); // Changed from "auth_token" to "token" to match your token.ts implementation
    revalidatePath("/auth/login");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Logout failed",
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const tokens = await getTokenFromCookies();
    if (!tokens) return { success: false, error: "No tokens found" };
    const { authToken } = tokens;
    const decoded = authToken ? await verifyToken(authToken) : null;
    if (!decoded || typeof decoded === "string" || !decoded.userID) {
      return { success: false, error: "Invalid token" };
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userID },
      select: {
        image: true,
        createdAt: true,
        id: true,
        name: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
};
export const addNewToken = async () => {
  try {  
    const authtoken = await getTokenFromCookies();
    if (!authtoken) return { success: false, error: "No token found" };     
    const { refreshToken } = authtoken;  
    const verify = await verifyRefreshToken(refreshToken as string);
    if (!verify) return { success: false, error: "Invalid token" };
   
    if (typeof verify === "object" && "userID" in verify) {
      await token(verify.userID);
    } else {
      throw new Error("Invalid token payload");
    }
  } catch (error) {
    console.error("Error Refress users:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed toRefres token users",
    };
  }
};

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        image: true,
        createdAt: true,
        id: true,
        name: true,
        email: true,
        username: true,
      },
    });
    return {
      success: true,
      users,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
};

export const getSelectedUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        image: true,
        createdAt: true,
        id: true,
        name: true,
        email: true,
        username: true,
      },
    });
    return {
      success: true,
      user,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
