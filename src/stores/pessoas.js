import { defineStore } from 'pinia';
import api from '@/services/api';

export const usePessoasStore = defineStore('pessoas', {
  state: () => ({
    pessoaSelecionada: null,
    loading: false,
    error: null
  }),

  getters: {
    pessoaId: (state) => state.pessoaSelecionada?.id || null,
    pessoaNome: (state) => state.pessoaSelecionada?.nome || ''
  },

  actions: {
    async selecionarPessoa(pessoa) {
      this.pessoaSelecionada = pessoa;
    },

    async buscarPessoa(id) {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.get(`/pessoas/${id}`);
        this.pessoaSelecionada = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    limparPessoaSelecionada() {
      this.pessoaSelecionada = null;
      this.error = null;
    }
  }
}); 