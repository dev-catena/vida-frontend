<template>
  <main class="configuracoes">
    <h1>Configurações do Sistema</h1>
    <div class="content">
      <div class="config-section">
        <h2>Configurações Gerais</h2>
        <form @submit.prevent="salvarConfiguracoes">
          <div class="form-group">
            <label for="nomeHotel">Nome do Hotel</label>
            <input
              id="nomeHotel"
              v-model="configuracoes.nomeHotel"
              type="text"
              required
            >
          </div>

          <div class="form-group">
            <label for="endereco">Endereço</label>
            <input
              id="endereco"
              v-model="configuracoes.endereco"
              type="text"
              required
            >
          </div>

          <div class="form-group">
            <label for="telefone">Telefone</label>
            <input
              id="telefone"
              v-model="configuracoes.telefone"
              type="tel"
              required
            >
          </div>

          <div class="form-group">
            <label for="email">E-mail</label>
            <input
              id="email"
              v-model="configuracoes.email"
              type="email"
              required
            >
          </div>

          <div class="form-group">
            <label for="checkinHora">Horário de Check-in</label>
            <input
              id="checkinHora"
              v-model="configuracoes.checkinHora"
              type="time"
              required
            >
          </div>

          <div class="form-group">
            <label for="checkoutHora">Horário de Check-out</label>
            <input
              id="checkoutHora"
              v-model="configuracoes.checkoutHora"
              type="time"
              required
            >
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn-primary"
            >
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>

      <div class="config-section">
        <h2>Configurações de Notificações</h2>
        <form @submit.prevent="salvarNotificacoes">
          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="notificacoes.emailCheckin"
                type="checkbox"
              >
              Enviar e-mail de confirmação no check-in
            </label>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="notificacoes.emailCheckout"
                type="checkbox"
              >
              Enviar e-mail de confirmação no check-out
            </label>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="notificacoes.notificarReservas"
                type="checkbox"
              >
              Notificar sobre novas reservas
            </label>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn-primary"
            >
              Salvar Notificações
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'ConfiguracoesView',
  data() {
    return {
      configuracoes: {
        nomeHotel: '',
        endereco: '',
        telefone: '',
        email: '',
        checkinHora: '',
        checkoutHora: ''
      },
      notificacoes: {
        emailCheckin: false,
        emailCheckout: false,
        notificarReservas: false
      }
    };
  },
  mounted() {
    this.carregarConfiguracoes();
    this.carregarNotificacoes();
  },
  methods: {
    async carregarConfiguracoes() {
      // TODO: Implementar chamada à API para carregar configurações
      this.configuracoes = {
        nomeHotel: 'Hotel Exemplo',
        endereco: 'Rua Exemplo, 123',
        telefone: '(11) 1234-5678',
        email: 'contato@hotelexemplo.com',
        checkinHora: '14:00',
        checkoutHora: '12:00'
      };
    },
    async carregarNotificacoes() {
      // TODO: Implementar chamada à API para carregar configurações de notificação
      this.notificacoes = {
        emailCheckin: true,
        emailCheckout: true,
        notificarReservas: true
      };
    },
    async salvarConfiguracoes() {
      // TODO: Implementar chamada à API para salvar configurações
      console.log('Configurações a serem salvas:', this.configuracoes);
    },
    async salvarNotificacoes() {
      // TODO: Implementar chamada à API para salvar configurações de notificação
      console.log('Notificações a serem salvas:', this.notificacoes);
    }
  }
};
</script>

<style scoped>
.configuracoes {
  padding: 20px;
}

.content {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.config-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

input[type="text"],
input[type="tel"],
input[type="email"],
input[type="time"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.form-actions {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}
</style> 