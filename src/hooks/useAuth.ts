import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  authenticate: () => void;
  logout: () => void;
}

const PASSWORD = 'pirateking'; // 密码已更新

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
