<template>
  <main class="administracao">
    <h1>Administração</h1>
    <div class="content">
      <div class="card-container">
        <div
          class="admin-card"
          @click="navigateTo('hospedes')"
        >
          <div class="card-icon">
            <i class="mdi mdi-account-multiple-outline" />
          </div>
          <div class="card-content">
            <h3>Hóspedes</h3>
            <p>Gestão de hóspedes e suas informações</p>
          </div>
        </div>

        <div
          class="admin-card"
          @click="navigateTo('usuarios')"
        >
          <div class="card-icon">
            <i class="mdi mdi-account-group-outline" />
          </div>
          <div class="card-content">
            <h3>Usuários</h3>
            <p>Gestão de usuários do sistema</p>
          </div>
        </div>

        <div
          class="admin-card"
          @click="navigateTo('configuracoes')"
        >
          <div class="card-icon">
            <i class="mdi mdi-cog-outline" />
          </div>
          <div class="card-content">
            <h3>Configurações</h3>
            <p>Configurações gerais do sistema</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'AdministracaoView',
  setup() {
    const router = useRouter();

    const navigateTo = (section) => {
      const empresa = router.currentRoute.value.params.empresa;
      router.push(`/${empresa}/administracao/${section}`);
    };

    return {
      navigateTo
    };
  }
};
</script>

<style scoped>
.administracao {
  padding: 20px;
}

.content {
  margin-top: 20px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.admin-card {
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

.admin-card:hover {
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