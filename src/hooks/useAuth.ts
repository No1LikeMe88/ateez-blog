import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  authenticate: () => void;
  logout: () => void;
}

const PASSWORD = 'ateez123'; // 默认密码，你可以修改

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      authenticate: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'ateez-blog-auth',
    }
  )
);

export function checkPassword(input: string): boolean {
  return input === PASSWORD;
}
