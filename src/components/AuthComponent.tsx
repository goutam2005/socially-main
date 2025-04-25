"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function AuthComponent() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Join the Conversation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          Sign in or create an account to share your thoughts and connect with others
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/login">
            <Button className="w-full sm:w-auto gap-2 cursor-pointer" variant="default">
              <LogIn className="h-4 w-4 " />
              LogIn
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="w-full sm:w-auto gap-2 cursor-pointer" variant="outline">
              <UserPlus className="h-4 w-4 "  />
              Create Account
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
