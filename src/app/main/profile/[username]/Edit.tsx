"use client";

import { UpdateUserProfile } from "@/action/profile-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader } from "lucide-react";
import { useState } from "react";

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
export function EditUser(UserProfile: User) {
    const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: UserProfile.name || "",
    username: UserProfile.username || "",
    bio: UserProfile.bio || "",
    location: UserProfile.location || "",
    websites: UserProfile.websites || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await UpdateUserProfile(UserProfile.id,formData);
      console.log(res);
      // Handle form submission here
      console.log("Form data:", formData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }finally {
      setLoading(false);
    }
  };
  if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900">
            <Loader/>
          </div>
        </div>
      );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
           <Edit size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Input
              id="bio"
              placeholder="bio"
              value={formData.bio}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              placeholder="location"
              value={formData.location}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="websites" className="text-right">
              Websites
            </Label>
            <Input
              id="websites"
              placeholder="https://example.com"
              value={formData.websites}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
