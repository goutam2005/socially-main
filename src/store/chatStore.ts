import { getChatMessages } from '@/action/chat-action';
import toast from "react-hot-toast";
import { create } from "zustand";
import { io, Socket } from "socket.io-client";

// import useUsersStore  from "./user-store";
// Define the Message type to match what comes from your API
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
  read: boolean;
  sender: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  receiver: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}

interface ChatStore {
  messages: Message[];
  loading: boolean;
  sendLoading: boolean;
  socket: Socket | null; 
  currentChatPartnerId: string | null; // Add this to track current chat
  sendMessageFe: (selectedUserId: string, content: string, currentUserId: string) => Promise<void>;
  setSocket: (socket: Socket) => void;
  getMessages: (receiverId: string) => Promise<void>;
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  loading: false,
  selectedUser: null,
  socket: null,
  sendLoading: false,
  currentChatPartnerId: null, // Initialize

  getMessages: async (receiverId: string) => {
    set({ loading: true, currentChatPartnerId: receiverId }); // Set current chat partner
    try {
      const result = await getChatMessages(receiverId);
      if (result.success) {
        set({ messages: result.messages });
      } else {
        toast.error(result.error || "Failed to fetch messages");
      }
    } catch (err) {
      toast.error("Failed to fetch messages");
    } finally {
      set({ loading: false });
    }
  },
  setSocket (socket: Socket) {
    set({ socket });
  },
  sendMessageFe: async (selectedUserId: string, content: string, currentUserId: string) => {
    if (!selectedUserId || !content.trim()) {
      toast.error("Invalid message or recipient");
      return;
    }

    set({ sendLoading: true });
    try {
      const socket = get().socket;
      if (!socket) {
        toast.error("Socket is not connected");
        return;
      }      

      // Create temporary local message with a special ID format
      const tempMessage: Message = {
        id: `temp-${Date.now()}`, // temporary ID with prefix
        content: content.trim(),
        senderId: currentUserId,
        receiverId: selectedUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
        read: false,
        sender: {
          id: currentUserId,
          name: null,
          username: null,
          image: null
        },
        receiver: {
          id: selectedUserId,
          name: null,
          username: null,
          image: null
        }
      };
      
      // Add temporary message for immediate display
      get().addMessage(tempMessage);
    
      socket.emit('send-message', {
        message: {
          content: content.trim(),
          senderId: currentUserId,
          receiverId: selectedUserId,
        }
      });
    } catch (err) {
      console.error('Message sending error:', err);
      toast.error("Failed to send message");
    } finally {
      set({ sendLoading: false });
    }
  },
  
  // Update addMessage to prevent duplicates
  addMessage: (message: Message) =>
    set((state) => {
      // If message has a temp ID and we receive the real one, replace it
      if (!message.id.startsWith('temp-')) {
        // Filter out any temporary messages with the same content
        const filteredMessages = state.messages.filter(
          m => !(m.id.startsWith('temp-') && 
                m.content === message.content && 
                m.senderId === message.senderId && 
                m.receiverId === message.receiverId)
        );
        return { messages: [...filteredMessages, message] };
      }
      return { messages: [...state.messages, message] };
    }),
}));
