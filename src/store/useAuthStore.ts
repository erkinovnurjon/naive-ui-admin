import { defineStore } from "pinia";

interface User {
  id: number;
  name: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: "" as string | null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    },
    setToken(token: string) {
      this.token = token;
    },
    logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    loadFromStorage() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token) this.token = token;
      if (user) this.user = JSON.parse(user);
    },
  },
});
