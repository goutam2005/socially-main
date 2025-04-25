import { create } from 'zustand';

// Define the User interface
interface User {
  id: string;
  name: string | null;
  email: string | null;
  username?: string | null;
  image?: string | null;
  createdAt?: string | null;
}

// Define the store state interface
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;

}

// Create the store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,  
  setUser: (user) => set({ user }),
  
}));