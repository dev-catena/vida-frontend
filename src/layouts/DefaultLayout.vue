<template>
  <div class="layout">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <img src="@/assets/logo.svg" alt="Logo" />
      </div>
      <nav class="nav">
        <a href="#" class="nav-item">Início</a>
        <a href="#" class="nav-item">Hóspedes</a>
        <a href="#" class="nav-item">Saúde</a>
        <a href="#" class="nav-item">Configurações</a>
      </nav>
      <div class="user-menu">
        <span class="user-name">Usuário</span>
        <button class="btn-logout">Sair</button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2024 SGILPI. Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
// Component logic here
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--cor-fundo);
  padding: var(--margem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  height: 40px;
}

.logo img {
  height: 100%;
  width: auto;
}

.nav {
  display: flex;
  gap: var(--margem);
}

.nav-item {
  color: var(--cor-fonte);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: var(--raio);
  transition: background-color 0.2s;
}

.nav-item:hover {
  background: var(--cor-hover);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--margem);
}

.user-name {
  color: var(--cor-fonte);
}

.btn-logout {
  background: none;
  border: none;
  color: var(--cor-fonte);
  cursor: pointer;
  padding: 8px 16px;
  border-radius: var(--raio);
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background: var(--cor-hover);
}

.main {
  flex: 1;
  padding: var(--margem);
  background: var(--cor-fundo-secundario);
}

.footer {
  background: var(--cor-fundo);
  padding: var(--margem);
  text-align: center;
  color: var(--cor-fonte-fraca);
}
</style> 