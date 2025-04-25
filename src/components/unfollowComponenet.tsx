import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon,  UserMinus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export default function unfollowComponenet({   
  isUnfollowing,
  handleUnfollow,
  post,
}: { 
  isUnfollowing: boolean;  
  handleUnfollow: any;
  post: any;
}) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground cursor-pointer hover:text-red-500 -mr-2"
        >
          {isUnfollowing ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
             <UserMinus className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ "Unfollow Confirmation"}</AlertDialogTitle>
          <AlertDialogDescription>
            { "Want to Unfollow this User?"}           
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={()=>handleUnfollow(post.author.id)}
            className="bg-red-500 hover:bg-red-600 cursor-pointer"
            disabled={isUnfollowing}
          >{"Unfollow"}            
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
