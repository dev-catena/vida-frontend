<template>
  <div class="header-actions">
    <div class="search-container">
      <div class="search-box">
        <input
          type="text"
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value); $emit('search')"
          placeholder="Buscar pessoa..."
          class="search-input"
        >
        <div v-if="showResults && filteredPessoas.length > 0" class="jm">
          <div
            v-for="pessoa in filteredPessoas"
            :key="pessoa.id"
            @click="$emit('selectPessoa', pessoa)"
            class="item"
          >
            {{ pessoa.nome }}
          </div>
        </div>
      </div>
    </div>
    <div class="filters">
      <label class="filter-label">
        <input
          type="checkbox"
          :checked="showOnlyAdmitted"
          @change="$emit('toggleAdmitted', $event.target.checked)"
        >
        Mostrar apenas admitidos
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: String,
  showResults: Boolean,
  filteredPessoas: Array,
  showOnlyAdmitted: Boolean
});
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.search-container {
  flex: 1;
}
.filters {
  margin-left: 24px;
}
</style> 