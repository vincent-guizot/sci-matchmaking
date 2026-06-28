import { create } from "zustand";
import { persist } from "zustand/middleware";

const USERS = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Administrator",
  },
  { username: "dina", password: "123", role: "member", name: "Dina Memberina" },
  { username: "dino", password: "123", role: "member", name: "Dino Memberino" },
];

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (username, password) => {
        const found = USERS.find(
          (u) => u.username === username && u.password === password,
        );
        if (found) {
          const { password: _, ...safeUser } = found;
          set({ user: safeUser, isAuthenticated: true });
          return { success: true };
        }
        return { success: false };
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "sci_auth", // key di localStorage
    },
  ),
);
