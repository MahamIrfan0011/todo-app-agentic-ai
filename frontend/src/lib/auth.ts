// frontend/src/lib/auth.ts
import { api } from "./api";

const TOKEN_KEY = "access_token";

export const auth = {
  login: async (username: string, password: string) => {
    const response = await api.postForm("/auth/login", { username, password });
    if (response && response.access_token) {
      localStorage.setItem(TOKEN_KEY, response.access_token);
      return true;
    }
    return false;
  },

  register: async (username: string, password: string) => {
    const response = await api.post("/auth/register", { username, password });
    return response; // Expecting { message: "User registered successfully", user_id: ... }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken: (): string | null => {
    return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },
};
