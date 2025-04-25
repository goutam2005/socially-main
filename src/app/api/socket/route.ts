
import { NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export async function GET() {
  // Connect to MongoDB
  
  
  // This is a workaround for App Router
  // In production, you'd use a different approach with a custom server
  if (typeof io === 'undefined') {
    // This is simplified for demonstration
    // In a real app, you'd need to set up a custom server
    console.warn('Socket.IO should be initialized with a custom server in production');
  }
  
  return NextResponse.json({ success: true });
}

// export async function POST(request: Request) {
 
  
//   const data = await request.json();
//   console.log("data in socket api: ", data)
//   const message = await prisma.$transaction([
//     prisma.message.create({
//       data: {
//         content : data.content,
//         senderId : data.sender,
//         receiverId : data.receiver,
//       },
//       include: {
//         sender: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//             image: true,
//           },
//         },
//         receiver: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//             image: true,
//           },
//         },
//       },
//     }),
//     prisma.notification.create({
//       data: {
//         type: "MESSAGE",
//         userID: data.receiver,
//         creatorID: data.sender,
//       },
//     }),
//   ])
  
  
//   return NextResponse.json({ success: true, message });
// }