<template>
  <div class="container grid-2">
    <a class="bloco card" @click="navigateTo('hospedagem')">
      <figure>
        <img src="@/assets/img/hotelaria.jpg" alt="Hotelaria" />
        <figcaption class="abs">Hotelaria</figcaption>
      </figure>
    </a>

    <a class="bloco card" @click="navigateTo('saude')">
      <figure>
        <img src="@/assets/img/saude.jpg" alt="Saúde" />
        <figcaption class="abs">Saúde</figcaption>
      </figure>
    </a>

    <a class="bloco card" @click="navigateTo('administracao')">
      <figure>
        <img src="@/assets/img/administracao.jpg" alt="Administração" />
        <figcaption class="abs">Administração</figcaption>
      </figure>
    </a>

    <a class="bloco card" @click="navigateTo('gestao')">
      <figure>
        <img src="@/assets/img/gestao.jpg" alt="Gestão" />
        <figcaption class="abs">Gestão</figcaption>
      </figure>
    </a>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import '@/assets/css/spec.css';

export default {
  name: "Home",
  setup() {
    const router = useRouter();

    const navigateTo = (pillar) => {
      const empresa = router.currentRoute.value.params.empresa;
      switch (pillar) {
        case "hospedagem":
          router.push(`/${empresa}/hotelaria`);
          break;
        case "saude":
          router.push(`/${empresa}/saude`);
          break;
        case "administracao":
          router.push(`/${empresa}/administracao`);
          break;
        case "gestao":
          router.push(`/${empresa}/gestao`);
          break;
      }
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
