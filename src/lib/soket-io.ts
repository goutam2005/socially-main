import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!(res.socket as any).server?.io) {
    console.log('*First use, starting Socket.IO');
    const httpServer: NetServer = (res.socket as any).server as any;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
    });
    
    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);
      
      socket.on('join-room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });
      
      socket.on('send-message', (message) => {
        console.log('New message:', message);
        io.to(message.receiver).emit('receive-message', message);
      });
      
      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
    
    ((res.socket as any).server as any).io = io;
  }
  
  res.end();
}