<template>
  <main class="administracao">
    <h1>Hotelaria</h1>
    <div class="container grid-2">
      <a class="bloco card" @click="navigateTo('hospedes')">
        <figure>
          <img src="@/assets/img/hospedes.webp" alt="Hospedes" />
          <figcaption class="abs">Hospedes</figcaption>
        </figure>
      </a>
    </div>
  </main>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "HotelariaView",
  setup() {
    const router = useRouter();

    const navigateTo = (section) => {
      const empresa = router.currentRoute.value.params.empresa;
      router.push(`/${empresa}/hotelaria/${section}`);
    };

    return {
      navigateTo,
    };
  },
};
</script>

<style scoped>
figcaption.abs {
  padding: calc(var(--margem) * 1.5);
}
</style>
