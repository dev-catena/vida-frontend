<template>
  <div class="cards-container" :class="{ disabled: !selectedPessoa }">
    <div
      v-for="card in cards"
      :key="card.route"
      class="bloco clicavel"
      :class="{ ativo: activeCard === card.route }"
      @click="$emit('select-card', card.route)"
    >
      <div class="alinha-v alinha-centro">
        <div :class="card.icon" />
        <h3>{{ card.title }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cards: Array,
  activeCard: String,
  selectedPessoa: Object
});
</script>

<style scoped>
.cards-container {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style> 