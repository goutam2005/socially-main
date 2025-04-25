import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
// import mongoose, { Schema, Document } from 'mongoose';

const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;



const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();



app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-room', (userId) => {
      if (!userId) {
        console.error('Invalid userId for join-room');
        return;
      }
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('send-message', async (message) => {
      const messageData = message.message;
      
      try {        
        const newMessage = await prisma.$transaction([
          prisma.message.create({
            data: {
              content: messageData.content.trim(),
              senderId: messageData.senderId,
              receiverId: messageData.receiverId,
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
              receiver: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                },
              },
            },
          }),
          prisma.notification.create({
            data: {
              type: "MESSAGE",
              userID: messageData.receiverId,
              creatorID: messageData.senderId,
            },
          }),
        ]);

        // Send to specific rooms only
        // Send to receiver's room for display
        io.to(messageData.receiverId).emit('receive-message', newMessage[0]);
        
        // Send to sender's room for display (only if not the same socket)
        if (socket.id !== messageData.senderId) {
          io.to(messageData.senderId).emit('receive-message', newMessage[0]);
        }
        
        // Send confirmation to the sender socket (don't use for display)
        socket.emit('message-sent', newMessage[0]);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('message-error', { error: 'Failed to save message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
