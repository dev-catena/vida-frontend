<template>
  <main class="relatorios">
    <h1>Relatórios de Hóspedes</h1>
    <div class="content">
      <div class="filtros">
        <div class="form-group">
          <label for="dataInicio">Data Início</label>
          <input
            id="dataInicio"
            v-model="filtros.dataInicio"
            type="date"
          >
        </div>

        <div class="form-group">
          <label for="dataFim">Data Fim</label>
          <input
            id="dataFim"
            v-model="filtros.dataFim"
            type="date"
          >
        </div>

        <div class="form-group">
          <label for="tipoRelatorio">Tipo de Relatório</label>
          <select
            id="tipoRelatorio"
            v-model="filtros.tipoRelatorio"
          >
            <option value="ocupacao">
              Ocupação
            </option>
            <option value="checkin">
              Check-ins
            </option>
            <option value="checkout">
              Check-outs
            </option>
            <option value="faturamento">
              Faturamento
            </option>
          </select>
        </div>

        <button
          class="btn-primary"
          @click="gerarRelatorio"
        >
          Gerar Relatório
        </button>
      </div>

      <div
        v-if="relatorio"
        class="relatorio-container"
      >
        <h2>{{ tituloRelatorio }}</h2>
        <div class="dados-relatorio">
          <div
            v-if="filtros.tipoRelatorio === 'ocupacao'"
            class="metric-card"
          >
            <h3>Taxa de Ocupação</h3>
            <p class="metric-value">
              {{ relatorio.taxaOcupacao }}%
            </p>
            <div class="metric-details">
              <p>Quartos Ocupados: {{ relatorio.quartosOcupados }}</p>
              <p>Total de Quartos: {{ relatorio.totalQuartos }}</p>
            </div>
          </div>

          <div
            v-if="filtros.tipoRelatorio === 'checkin'"
            class="metric-card"
          >
            <h3>Total de Check-ins</h3>
            <p class="metric-value">
              {{ relatorio.totalCheckins }}
            </p>
            <div class="metric-details">
              <p>Média Diária: {{ relatorio.mediaDiaria }}</p>
              <p>Período: {{ relatorio.periodo }}</p>
            </div>
          </div>

          <div
            v-if="filtros.tipoRelatorio === 'checkout'"
            class="metric-card"
          >
            <h3>Total de Check-outs</h3>
            <p class="metric-value">
              {{ relatorio.totalCheckouts }}
            </p>
            <div class="metric-details">
              <p>Média Diária: {{ relatorio.mediaDiaria }}</p>
              <p>Período: {{ relatorio.periodo }}</p>
            </div>
          </div>

          <div
            v-if="filtros.tipoRelatorio === 'faturamento'"
            class="metric-card"
          >
            <h3>Faturamento Total</h3>
            <p class="metric-value">
              R$ {{ relatorio.faturamentoTotal }}
            </p>
            <div class="metric-details">
              <p>Média Diária: R$ {{ relatorio.mediaDiaria }}</p>
              <p>Período: {{ relatorio.periodo }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'RelatoriosView',
  data() {
    return {
      filtros: {
        dataInicio: '',
        dataFim: '',
        tipoRelatorio: 'ocupacao'
      },
      relatorio: null
    };
  },
  computed: {
    tituloRelatorio() {
      const tipos = {
        ocupacao: 'Relatório de Ocupação',
        checkin: 'Relatório de Check-ins',
        checkout: 'Relatório de Check-outs',
        faturamento: 'Relatório de Faturamento'
      };
      return tipos[this.filtros.tipoRelatorio];
    }
  },
  methods: {
    async gerarRelatorio() {
      // TODO: Implementar chamada à API para gerar relatório
      // Simulando dados do relatório
      this.relatorio = {
        taxaOcupacao: 85,
        quartosOcupados: 17,
        totalQuartos: 20,
        totalCheckins: 15,
        totalCheckouts: 12,
        faturamentoTotal: 12500.00,
        mediaDiaria: 1250.00,
        periodo: '01/01/2024 - 31/01/2024'
      };
    }
  }
};
</script>

<style scoped>
.relatorios {
  padding: 20px;
}

.content {
  margin-top: 20px;
}

.filtros {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn-primary {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-end;
}

.relatorio-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dados-relatorio {
  margin-top: 20px;
}

.metric-card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.metric-card h3 {
  color: #666;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: #1976d2;
  margin: 10px 0;
}

.metric-details {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}

.metric-details p {
  margin: 5px 0;
  color: #666;
}
</style> 