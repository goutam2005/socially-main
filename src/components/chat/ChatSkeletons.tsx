import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function ChatSidebarSkeleton() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <Skeleton className="h-8 w-40 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-4 w-full mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatHeaderSkeleton() {
  return (
    <div className="border-b p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20 mt-1" />
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function ChatMessagesSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Left aligned messages (other user) */}
      <div className="flex justify-start">
        <div className="flex gap-2 max-w-[80%]">
          <Skeleton className="h-8 w-8 rounded-full mt-1" />
          <div>
            <Skeleton className="h-20 w-64 rounded-lg" />
            <Skeleton className="h-3 w-16 mt-1 ml-auto" />
          </div>
        </div>
      </div>
      
      {/* Right aligned messages (current user) */}
      <div className="flex justify-end">
        <div className="flex flex-row-reverse gap-2 max-w-[80%]">
          <div>
            <Skeleton className="h-12 w-48 rounded-lg" />
            <Skeleton className="h-3 w-16 mt-1" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-start">
        <div className="flex gap-2 max-w-[80%]">
          <Skeleton className="h-8 w-8 rounded-full mt-1" />
          <div>
            <Skeleton className="h-28 w-72 rounded-lg" />
            <Skeleton className="h-3 w-16 mt-1 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}