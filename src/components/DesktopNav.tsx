"use client";
import {
  BellIcon,
  LogOutIcon,
  LogInIcon,
  UserPlusIcon,
  MessageSquare,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addNewToken, getCurrentUser, logoutUser } from "@/action/user-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Define a proper user type
type User = {
  id: string;
  name: string | null;
  email: string | null;
  username?: string | null;
  image?: string | null;
};
function DesktopNavbar() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await getCurrentUser();
        console.log("Response", response);
        if (response.error === "Invalid token"){
          console.log("Invalid token");
         const token = await addNewToken()
         console.log("Token", token);
        }
          if (response.success && response.user) {
            setUser(response.user as User);
          }
      } catch (error) {
        toast.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.success) {
        setUser(null);
        router.push("/auth/login");
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/main/chat">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden lg:inline">Chat</span>
              </Link>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/main/notifications">
                <BellIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Notifications</span>
              </Link>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link
                href={`/main/profile/${
                  user.username ?? user.email?.split("@")[0]
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Profile</span>
              </Link>
            </Button>
          </>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-10 w-10 rounded-full" />
      ) : user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    user.image ||
                    "https://img.icons8.com/?size=100&id=15265&format=png&color=000000"
                  }
                  alt={user.name || "User"}
                />
                <AvatarFallback>
                  {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name || "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {user.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/main/profile/${
                  user.username ?? user.email?.split("@")[0]
                }`}
                className="w-full"
              >
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/main/settings" className="w-full">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/auth/login" className="flex items-center gap-2">
              <LogInIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Login</span>
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/auth/signup" className="flex items-center gap-2">
              <UserPlusIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Sign Up</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default DesktopNavbar;
