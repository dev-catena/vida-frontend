<template>
  <nav class="breadcrumbs">
    <ol>
      <li v-for="(item, index) in items" :key="index">
        <router-link 
          v-if="item.to && index !== items.length - 1" 
          :to="item.to"
        >
          {{ item.text }}
        </router-link>
        <span v-else>{{ item.text }}</span>
        <span v-if="index !== items.length - 1" class="separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>

<style scoped>
.breadcrumbs {
  padding: 12px 0;
  margin-bottom: var(--margem);
}

.breadcrumbs ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.breadcrumbs li {
  display: flex;
  align-items: center;
}

.breadcrumbs a {
  color: var(--cor-primaria);
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumbs a:hover {
  color: var(--cor-primaria-escura);
}

.breadcrumbs span {
  color: var(--cor-fonte-fraca);
}

.separator {
  margin: 0 8px;
}
</style> 