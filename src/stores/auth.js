import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userNome: (state) => state.user?.nome || '',
    userEmpresaId: (state) => state.user?.empresa_id || null
  },

  actions: {
    setUser(user) {
      this.user = user;
    },
    setToken(token) {
      this.token = token;
    },
    clearAuth() {
      this.user = null;
      this.token = null;
    }
  }
}); 