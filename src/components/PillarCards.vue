<template>
  <div class="pillar-cards">
    <div class="card-container">
      <div
        class="pillar-card"
        @click="navigateTo('hospedagem')"
      >
        <div class="card-icon">
          <i class="mdi mdi-bed" />
        </div>
        <div class="card-content">
          <h3>Hotelaria</h3>
          <p>Gestão de hospedagem, check-in/out e acomodações</p>
        </div>
      </div>

      <div
        class="pillar-card"
        @click="navigateTo('saude')"
      >
        <div class="card-icon">
          <i class="mdi mdi-medical-bag" />
        </div>
        <div class="card-content">
          <h3>Saúde</h3>
          <p>Prontuário eletrônico e gestão de saúde</p>
        </div>
      </div>

      <div
        class="pillar-card"
        @click="navigateTo('administracao')"
      >
        <div class="card-icon">
          <i class="mdi mdi-cog" />
        </div>
        <div class="card-content">
          <h3>Administração</h3>
          <p>Gestão de usuários e configurações do sistema</p>
        </div>
      </div>

      <div
        class="pillar-card"
        @click="navigateTo('gestao')"
      >
        <div class="card-icon">
          <i class="mdi mdi-chart-bar" />
        </div>
        <div class="card-content">
          <h3>Gestão</h3>
          <p>Indicadores e relatórios gerenciais</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'PillarCards',
  setup() {
    const router = useRouter();

    const navigateTo = (pillar) => {
      const empresa = router.currentRoute.value.params.empresa;
      switch(pillar) {
        case 'hospedagem':
          router.push(`/${empresa}/hospedagem`);
          break;
        case 'saude':
          router.push(`/${empresa}/saude`);
          break;
        case 'administracao':
          router.push(`/${empresa}/administracao`);
          break;
        case 'gestao':
          router.push(`/${empresa}/gestao`);
          break;
      }
    };

    return {
      navigateTo
    };
  }
};
</script>

<style scoped>
.pillar-cards {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.pillar-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.pillar-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #1976d2;
}

.card-content h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.5rem;
}

.card-content p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr;
  }
}
</style> 