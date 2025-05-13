<template>
  <main class="home">
    <PillarCards />
  </main>
</template>

<script>
import PillarCards from '@/components/PillarCards.vue';

export default {
  name: "HomeView",
  components: {
    PillarCards
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
