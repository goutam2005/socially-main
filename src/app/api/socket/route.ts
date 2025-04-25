
import { NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';

// Initialize with null to indicate it hasn't been set up yet
let io: SocketIOServer | null = null;

export async function GET() {
  // Check if io is null rather than undefined
  if (io === null) {
    console.warn('Socket.IO should be initialized with a custom server in production');
    
    // Note: In App Router, you should use a custom server setup
    // This endpoint is just for health checking
  }
  
  return NextResponse.json({ success: true });
}

