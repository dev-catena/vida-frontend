<template>
  <main class="saude">
    <h1>Saúde</h1>
    <div class="content">
      <div class="grid-cards">
        <div class="card" @click="navegarPara()">
          <div class="icone-prontuario"></div>
          <h3>Prontuário Eletrônico</h3>
          <p>Acesse o prontuário eletrônico dos hóspedes com todas as funcionalidades de saúde</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const empresa = ref('');

const navegarPara = () => {
  router.push({
    name: 'SaudeProntuario',
    params: {
      empresa: empresa.value
    }
  });
};

onMounted(() => {
  empresa.value = route.params.empresa;
});
</script>

<style scoped>
.saude {
  padding: var(--margem);
}

.content {
  margin-top: var(--margem);
}

.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--margem);
  padding: var(--margem);
}

.card {
  background: var(--cor-fundo);
  border-radius: var(--raio);
  padding: var(--margem);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin: var(--margem) 0;
  color: var(--cor-fonte);
}

.card p {
  color: var(--cor-fonte-fraca);
  font-size: 14px;
  line-height: 1.4;
}

.card .icone-prontuario {
  width: 48px;
  height: 48px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('@/assets/icons/prontuario.svg');
}
</style> 