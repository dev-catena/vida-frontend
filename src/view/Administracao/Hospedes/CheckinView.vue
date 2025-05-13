<template>
  <main class="checkin">
    <h1>Check-in de Hóspedes</h1>
    <div class="content">
      <form
        class="form-container"
        @submit.prevent="realizarCheckin"
      >
        <div class="form-group">
          <label for="hospede">Selecione o Hóspede</label>
          <select
            id="hospede"
            v-model="checkin.hospedeId"
            required
          >
            <option value="">
              Selecione um hóspede
            </option>
            <option
              v-for="hospede in hospedes"
              :key="hospede.id"
              :value="hospede.id"
            >
              {{ hospede.nome }} - {{ hospede.cpf }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="quarto">Selecione o Quarto</label>
          <select
            id="quarto"
            v-model="checkin.quartoId"
            required
          >
            <option value="">
              Selecione um quarto
            </option>
            <option
              v-for="quarto in quartos"
              :key="quarto.id"
              :value="quarto.id"
            >
              Quarto {{ quarto.numero }} - {{ quarto.tipo }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="dataEntrada">Data de Entrada</label>
          <input
            id="dataEntrada"
            v-model="checkin.dataEntrada"
            type="datetime-local"
            required
          >
        </div>

        <div class="form-group">
          <label for="observacoes">Observações</label>
          <textarea
            id="observacoes"
            v-model="checkin.observacoes"
            rows="3"
          />
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn-primary"
          >
            Confirmar Check-in
          </button>
          <button
            type="button"
            class="btn-secondary"
            @click="limparFormulario"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
export default {
  name: 'CheckinView',
  data() {
    return {
      hospedes: [],
      quartos: [],
      checkin: {
        hospedeId: '',
        quartoId: '',
        dataEntrada: '',
        observacoes: ''
      }
    };
  },
  mounted() {
    this.carregarHospedes();
    this.carregarQuartos();
  },
  methods: {
    async carregarHospedes() {
      // TODO: Implementar chamada à API para carregar hóspedes
      this.hospedes = [
        { id: 1, nome: 'João Silva', cpf: '123.456.789-00' },
        { id: 2, nome: 'Maria Santos', cpf: '987.654.321-00' }
      ];
    },
    async carregarQuartos() {
      // TODO: Implementar chamada à API para carregar quartos disponíveis
      this.quartos = [
        { id: 1, numero: '101', tipo: 'Standard' },
        { id: 2, numero: '102', tipo: 'Luxo' }
      ];
    },
    async realizarCheckin() {
      // TODO: Implementar chamada à API para realizar check-in
      console.log('Check-in a ser realizado:', this.checkin);
    },
    limparFormulario() {
      this.checkin = {
        hospedeId: '',
        quartoId: '',
        dataEntrada: '',
        observacoes: ''
      };
    }
  }
};
</script>

<style scoped>
.checkin {
  padding: 20px;
}

.content {
  margin-top: 20px;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

select, input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
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

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}
</style> 