<template>
  <table class="tabela">
    <thead>
      <tr>
        <th>Nome</th>
        <th>CPF</th>
        <th>Data de Nascimento</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!pessoas.length">
        <td colspan="4" class="no-content">Carregando pessoas...</td>
      </tr>
      <tr v-else-if="filteredPessoas.length === 0">
        <td colspan="4" class="no-content">Nenhuma pessoa encontrada</td>
      </tr>
      <tr
        v-for="pessoa in filteredPessoas"
        :key="pessoa.id"
        :class="{ sel: selectedPessoa?.id === pessoa.id, clicavel: true }"
        @click="$emit('selectPessoa', pessoa)"
      >
        <td>{{ pessoa.nome || "—" }}</td>
        <td>{{ pessoa.CPF ? pessoa.CPF : "—" }}</td>
        <td>{{ pessoa.data_nascimento ? formatDate(pessoa.data_nascimento) : "—" }}</td>
        <td>{{ pessoa.status ? 'Ativo' : 'Inativo' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { formatDate } from '@/utils/formatters';

defineProps({
  pessoas: Array,
  filteredPessoas: Array,
  selectedPessoa: Object
});
</script>

<style scoped>
.no-content {
  text-align: center;
  padding: 24px;
  color: var(--cor-fonte-fraca);
}
</style> 