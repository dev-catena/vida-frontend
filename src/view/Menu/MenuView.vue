<template>
  <main class="menu">
    <PillarCards />
  </main>
</template>

<script>
import PillarCards from '@/components/PillarCards.vue';

export default {
  name: 'MenuView',
  components: {
    PillarCards
  }
};
</script>

<style scoped>
.menu {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style> 