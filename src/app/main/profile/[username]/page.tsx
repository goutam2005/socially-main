import { checkfollow, getPost } from "@/action/post-action";
import { getSelectedUserPosts, getUserProfile } from "@/action/profile-action";
import { getCurrentUser } from "@/action/user-actions";
import { LoaderIcon } from "lucide-react";
import { use } from "react";
import ProfileComponent from "./profile";

// Define the return type for checkfollow function
interface FollowStatus {
  success: boolean;
  isFollow: boolean;
  error?: string;
}
interface User {
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
interface ProfilePageProps {
  params: {
    username: string;
  };
  username: string;
}

export default function Profile({
  params,
}: {
  params: Promise<ProfilePageProps>;
}) {
  // 1. Unwrap the route params Promise
  const { username } = use(params);
  // 2. Fetch user data (as a Promise)
  const userProfilePromise = getUserProfile(username);
  // 3. Unwrap the data Promise
  const UserProfile = use(userProfilePromise);
  if (!UserProfile) {
    return <LoaderIcon size={30} />;
  }
  const user = getCurrentUser();
  const CurrentUser = use(user);
  const CurrentUserID = CurrentUser?.user?.id;
  const currentUserPromise = getCurrentUser();
  const currentUser = use(currentUserPromise);

  const Post = getSelectedUserPosts(UserProfile.id);
  const Posts = use(Post);
  
  // Handle the case where CurrentUserID might be undefined
  const isFollowUserPromise = CurrentUserID 
    ? checkfollow(UserProfile.id, CurrentUserID)
    : Promise.resolve({ success: false, isFollow: false });
    
  const isFollowUser = use(isFollowUserPromise) as FollowStatus;

  return (
    <ProfileComponent
      username={username}
      CurrentUserID={CurrentUserID as string}
      UserProfile={UserProfile as User}
      Posts={Posts as Post[]}
      currentUser={currentUser as unknown as { user: User }}
      isFollowUser={isFollowUser}
    />
  );
}
