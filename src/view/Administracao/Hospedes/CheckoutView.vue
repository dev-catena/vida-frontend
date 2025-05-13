<template>
  <main class="checkout">
    <h1>Check-out de Hóspedes</h1>
    <div class="content">
      <form
        class="form-container"
        @submit.prevent="realizarCheckout"
      >
        <div class="form-group">
          <label for="hospede">Selecione o Hóspede</label>
          <select
            id="hospede"
            v-model="checkout.hospedeId"
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
              {{ hospede.nome }} - Quarto {{ hospede.quarto }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="dataSaida">Data de Saída</label>
          <input
            id="dataSaida"
            v-model="checkout.dataSaida"
            type="datetime-local"
            required
          >
        </div>

        <div class="form-group">
          <label for="formaPagamento">Forma de Pagamento</label>
          <select
            id="formaPagamento"
            v-model="checkout.formaPagamento"
            required
          >
            <option value="">
              Selecione a forma de pagamento
            </option>
            <option value="dinheiro">
              Dinheiro
            </option>
            <option value="cartao">
              Cartão de Crédito
            </option>
            <option value="pix">
              PIX
            </option>
            <option value="transferencia">
              Transferência Bancária
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="valorTotal">Valor Total</label>
          <input
            id="valorTotal"
            v-model="checkout.valorTotal"
            type="number"
            required
          >
        </div>

        <div class="form-group">
          <label for="observacoes">Observações</label>
          <textarea
            id="observacoes"
            v-model="checkout.observacoes"
            rows="3"
          />
        </div>

        <div class="form-actions">
          <button
            type="submit"
            class="btn-primary"
          >
            Confirmar Check-out
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
  name: 'CheckoutView',
  data() {
    return {
      hospedes: [],
      checkout: {
        hospedeId: '',
        dataSaida: '',
        formaPagamento: '',
        valorTotal: '',
        observacoes: ''
      }
    };
  },
  mounted() {
    this.carregarHospedes();
  },
  methods: {
    async carregarHospedes() {
      // TODO: Implementar chamada à API para carregar hóspedes ativos
      this.hospedes = [
        { id: 1, nome: 'João Silva', quarto: '101' },
        { id: 2, nome: 'Maria Santos', quarto: '102' }
      ];
    },
    async realizarCheckout() {
      // TODO: Implementar chamada à API para realizar check-out
      console.log('Check-out a ser realizado:', this.checkout);
    },
    limparFormulario() {
      this.checkout = {
        hospedeId: '',
        dataSaida: '',
        formaPagamento: '',
        valorTotal: '',
        observacoes: ''
      };
    }
  }
};
</script>

<style scoped>
.checkout {
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