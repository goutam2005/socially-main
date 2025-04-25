import { getUserProfile } from '@/action/profile-action';
import React from 'react'

export default async function ProfileInfo({username}: {username: string}) {
  const UserProfile = await getUserProfile(username);
  console.log("UserProfile ", UserProfile);
  return (
    <div className="md:sticky md:top-20 h-fit w-full md:max-w-[400px] order-1 md:order-1 ">
        <div className="flex items-start gap-8">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            <img
              src="https://placehold.co/400"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-light">{username}</h1>
              <button className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}
