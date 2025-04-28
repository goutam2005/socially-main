import JWT from "jsonwebtoken";
import { cookies } from "next/headers"; // ✅ Correct way to set cookies in Next.js

export const token = async (userID: string) => {
  const authToken = JWT.sign({ userID }, process.env.JWT_SECRET || "", {
    expiresIn: "1d",
  });

  return authToken; // ✅ Return token for API response
};

export const refreshToken = async (userID: string) => {
  const RefressToken = JWT.sign(
    { userID },
    process.env.JWT_RefressSECRET || "",
    {
      expiresIn: "7d",
    }
  );
  return RefressToken; // ✅ Return token for API response
};
// Common cookie options to maintain consistency
const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge,
  // Adding domain for production
  ...(process.env.NODE_ENV === "production" && {
    domain: process.env.NEXT_PUBLIC_DOMAIN,
  }),
});

export const saveTokenToCookies = async (
  authToken: string,
  refreshToken: string
): Promise<boolean> => {
  try {
    const cookie = await cookies();
    // Set auth token
    cookie.set("authtoken", authToken, getCookieOptions(24 * 60 * 60)); // 1 day
    // Set refresh token
    cookie.set(
      "refreshtoken",
      refreshToken,
      getCookieOptions(7 * 24 * 60 * 60)
    ); // 7 days
    return true;
  } catch (error) {
    console.error("Error saving tokens to cookies:", error);
    return false;
  }
};
export const saveNewToken = async(newtoken:string)=>{
  try {
    const cookie = await cookies();
    cookie.set("authtoken", newtoken, getCookieOptions(24 * 60 * 60)); // 1 day
    return true;
  } catch (error) {
    console.error("Error saving tokens to cookies:", error);
  }
}
export const deleteTokenFromCookies = async () => {
  try {
    const cookie = await cookies();
    cookie.delete("authtoken");
    cookie.delete("refreshtoken");
  } catch (error) {
    console.error("Error deleting tokens from cookies:", error);
  }
};

export const getTokenFromCookies = async () => {
  try {
    const cookie = await cookies();
    const authToken = cookie.get("authtoken")?.value;
    const refreshToken = cookie.get("refreshtoken")?.value;
    return { authToken, refreshToken };
  } catch (error) {
    console.error("Error getting tokens from cookies:", error);
  }
};
export const verifyToken = async (token: string) => {
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET || "");
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};
export const verifyRefreshToken = async (token: string) => {
  try {
    const decoded = JWT.verify(token, process.env.JWT_RefressSECRET || "");
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};
