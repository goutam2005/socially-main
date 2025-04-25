import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";

export default function NotificationSkeleton() {
  const SkeletonList = Array.from({ length: 5 }, (_, index) => index);
  return (
    <div className="space-x-4 space-y-4 max-w-6xl w-full mx-auto shadow-lg rounded-lg p-4 ">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Skeleton className="w-20 h-4" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {SkeletonList.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border-b">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="w-40 h-4" />
                  </div>
                  <div className="pl-6 space-y-2">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
