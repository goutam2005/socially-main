import { create } from "zustand";
// import { getCurrentUser } from "./user-actions";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  username?: string | null;
  image?: string | null;
  createdAt?: string | null;
}

interface UsersState {
  seletedUser: User | null;
  setSelectedUser: (user: User) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  seletedUser: null,
  setSelectedUser: (user: User) => {
    set({ seletedUser: user });
    // console.log(user)
  },
}));
