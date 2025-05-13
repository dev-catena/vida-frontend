<template>
  <div class="titulo">
    <div class="margem container">
      <div class="m-icone direita">
        <div class="pesquisa">
          <input
            v-model="filtro"
            type="text"
            placeholder="Pesquisar"
            @input="pesquisaComFiltro"
          >
          <a
            class="icone-pesquisa"
            title="Pesquise"
          />
        </div>
      </div>
      <h2>{{ "Painel de " + nomeSingular }}</h2>
    </div>
  </div>
  <div
    v-if="quartos && hospedes"
    class="margem"
  >
    <div class="margem bloco">
      <div class="linha">
        <!-- Grupo: Quartos -->

        <div class="alerta-normal card-indicador">
          <span class="valor verde">{{ quartos.Normal }}</span>
          <span class="subtitulo">Quartos Normais</span>
        </div>
        <div class="alerta-baixo card-indicador">
          <span class="valor verde">{{ quartos.Baixa }}</span>
          <span class="subtitulo">Atenção Baixa</span>
        </div>
        <div class="alerta-medio card-indicador">
          <span class="valor amarelo">{{ quartos.Média }}</span>
          <span class="subtitulo">Atenção Média</span>
        </div>
        <div class="alerta-alto card-indicador">
          <span class="valor vermelho">{{ quartos.Alta }}</span>
          <span class="subtitulo">Atenção Alta</span>
        </div>

        <!-- Grupo: Hóspedes -->

        <div class="card-indicador">
          <span class="valor">{{ hospedes.quantidade }}</span>
          <span class="subtitulo">Hóspedes Monitorados</span>
        </div>
        <div class="card-indicador">
          <span class="valor">{{ hospedes.porcentagem_ocupacao }}%</span>
          <span class="subtitulo">Ocupação total</span>
        </div>
      </div>
      <div class="linha">
        <div>
          <label for="status">Status</label>
          <select
            id="status"
            v-model="statusSelecionado"
          >
            <option
              :value="null"
              selected
            >
              Todos
            </option>
            <option :value="0">
              Normal
            </option>
            <option :value="1">
              Atenção Baixa
            </option>
            <option :value="2">
              Atenção Média
            </option>
            <option :value="3">
              Atenção Alta
            </option>
          </select>
        </div>
        <div>
          <label for="predio">Prédio</label>
          <select
            id="predio"
            v-model="predioSelecionadoId"
          >
            <option value="null">
              Todos
            </option>
            <option
              v-for="predio in dadosRecebidos"
              :key="predio.id"
              :value="predio.id"
            >
              {{ predio.nome }}
            </option>
          </select>
        </div>
        <div>
          <label for="capacidade">Tipo</label>
          <select
            id="capacidade"
            v-model="capacidadeSelecionada"
          >
            <option
              :value="null"
              selected
            >
              Todos
            </option>
            <option :value="1">
              Individual
            </option>
            <option :value="2">
              Duplo
            </option>
            <option :value="3">
              Triplo
            </option>
            <option :value="4">
              Quádruplo
            </option>
            <option :value="999">
              Acima de Quatro
            </option>
          </select>
        </div>
        <div>
          <label for="ocupados">Apenas Ocupados</label>
          <select
            id="ocupados"
            v-model="apenasOcupados"
          >
            <option
              :value="null"
              selected
            >
              Todos
            </option>
            <option :value="1">
              Ocupados
            </option>
            <option :value="0">
              Não ocupados
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div class="margem">
    <div class="bloco margem">
      <div class="quartos-container">
        <div
          v-for="(quarto, index) in painel"
          :key="index"
          class="quarto-card"
        >
          <div class="quarto-header">
            <div>
              <span class="quarto-numero">{{ quarto.quarto }}</span>
            </div>
            <div
              style="margin-right: 0.5rem"
              class="alinha-direita"
            >
              <span class="direita pacientes-contador">{{ quarto.ocupacao }}</span>
              <span
                style="margin-right: 0.5rem"
                class="direita chip bg-cinza fonte"
              >{{ quarto.capacidade }} pessoas</span>
            </div>
          </div>

          <div class="quarto-body">
            <ul
              class="pacientes-lista"
              :class="{ 'scroll-limit': quarto.hospedes.length > 2 }"
            >
              <li
                v-for="(hospede, i) in quarto.hospedes"
                :key="i"
                class="paciente-item"
              >
                <div class="paciente-avatar">
                  {{ hospede.nome.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div>{{ hospede.nome }}</div>
                  <div class="paciente-detalhes">
                    {{ hospede.idade }} anos
                    <span class="paciente-classe"> <i class="fas fa-user classe-icon" /> {{ hospede.mobilidade.nome }} </span>
                  </div>
                </div>
              </li>
            </ul>

            <div class="ocupacao-indicador">
              <div
                class="ocupacao-preenchido"
                :style="{ width: calcularPorcentagem(quarto.ocupacao) + '%' }"
              />
            </div>

            <div
              v-if="quarto.hospedes.some((h) => h.ultimo_log)"
              class="alerta-container"
              :class="{ 'scroll-limit': quarto.hospedes.filter((h) => h.ultimo_log).length > 2 }"
            >
              <div
                v-for="(hospede, i) in quarto.hospedes.filter((h) => h.ultimo_log)"
                :key="i"
                class="alerta-item"
                :class="classeAlerta(hospede.ultimo_log.prioridade)"
              >
                <i class="fas fa-exclamation-circle alerta-icone" />
                <div class="alerta-texto">
                  {{ hospede.nome }} <br>{{ hospede.ultimo_log.evento }}
                </div>

                <div class="alerta-tempo">
                  {{ formatarData(hospede.ultimo_log.data) }}
                </div>
              </div>
            </div>
          </div>

          <div class="quarto-footer">
            <div class="quarto-ultima-atualizacao">
              Atualizado: {{ formatarData(new Date()) }}
            </div>
            <div class="quarto-acoes">
              <a
                href="#"
                @click.prevent="abrirModalDetalhes(quarto)"
              >Detalhes</a><br>
              <a
                href="#"
                @click.prevent="abrirModalHistorico(quarto)"
              >Histórico</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL DETALHES -->
  <div
    v-if="modalDetalhesAberto"
    class="modal-mask"
  >
    <div
      class="jm"
      style="width: 40rem; padding: 2rem"
    >
      <h3>Detalhes do Quarto</h3>
      <p><strong>Nome:</strong> {{ quartoSelecionado?.local?.nome }}</p>
      <p><strong>Capacidade:</strong> {{ quartoSelecionado?.local?.capacidade }}</p>
      <p><strong>Prédio:</strong> {{ quartoSelecionado?.local?.predio?.nome }}</p>
      <p><strong>Ocupação:</strong> {{ quartoSelecionado?.vinculos.length }}/{{ quartoSelecionado?.local?.capacidade }}</p>

      <h4>Pacientes:</h4>
      <ul>
        <li
          v-for="v in quartoSelecionado?.vinculos"
          :key="v.id"
        >
          {{ v.pessoa.nome }} ({{ v.pessoa.idade }} anos)
        </li>
      </ul>

      <div class="margem-topo direita">
        <button
          class="acao-secundaria"
          @click="fecharModal"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL HISTÓRICO -->
  <div
    v-if="modalHistoricoAberto"
    class="modal-mask"
  >
    <div
      class="jm"
      style="width: 50rem; padding: 2rem"
    >
      <h3>Histórico do Quarto</h3>
      <ul>
        <li
          v-for="v in quartoSelecionado?.vinculos"
          :key="v.id"
        >
          {{ v.pessoa.nome }} ocupou este quarto em {{ formatarData(v.updated_at) }}
        </li>
      </ul>
      <div class="margem-topo direita">
        <button
          class="acao-secundaria"
          @click="fecharModal"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import funcionalidadeService from "@/services/funcionalidade/funcionalidadeService";
import painelService from "@/services/painel/painelService";
import predioService from "@/services/configuracoes/predioService";

export default {
  name: "PainelView",
  data() {
    return {
      nomeSingular: "Visualização de Quartos",
      permissoes: [],
      painel: [],
      quartos: null,
      hospedes: null,
      filtro: "",
      modalDetalhesAberto: false,
      modalHistoricoAberto: false,
      quartoSelecionado: null,
      dadosRecebidos: [],

      statusSelecionado: null,
      predioSelecionadoId: null,
      capacidadeSelecionada: null,
      apenasOcupados: null,
    };
  },

  watch: {
    statusSelecionado: "atualizarDashboard",
    predioSelecionadoId: "atualizarDashboard",
    capacidadeSelecionada: "atualizarDashboard",
    apenasOcupados: "atualizarDashboard",
  },

  mounted() {
    this.getDashboard();
    this.carregarFuncionalidades();
    this.getPredios();
  },

  methods: {
    montarPayload() {
      const payload = {};

      if (this.statusSelecionado !== null) payload.status = this.statusSelecionado;
      if (this.predioSelecionadoId !== null) payload.predio_id = this.predioSelecionadoId;
      if (this.capacidadeSelecionada !== null) payload.capacidade = this.capacidadeSelecionada;
      if (this.apenasOcupados !== null) payload.ocupado = this.apenasOcupados;

      return payload;
    },
    async carregarFuncionalidades() {
      this.permissoes = await funcionalidadeService.obterFuncionalidadeUsuario();
    },
    getDashboard(payload = {}) {
      painelService
        .dashboard(payload)
        .then((response) => {
          const data = response.data;
          this.painel = Array.isArray(data.painel) ? data.painel : [];
          this.quartos = data.quartos || { Alta: 0, Média: 0, Baixa: 0, Normal: 0 };
          this.hospedes = data.hospedes || { quantidade: 0, porcentagem_ocupacao: 0 };
        })
        .catch((error) => {
          console.error("Erro ao obter painel:", error);
          this.painel = [];
        });
    },
    atualizarDashboard() {
      const payload = this.montarPayload();
      this.getDashboard(payload);
    },

    getPredios() {
      predioService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidos = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidos = [];
        });
    },
    calcularPorcentagem(ocupacao) {
      const [atual, total] = ocupacao.split("/").map(Number);
      return total ? (atual / total) * 100 : 0;
    },

    classeAlerta(prioridade) {
      switch (prioridade) {
        case "Alta":
          return "alerta-alto";
        case "Média":
          return "alerta-medio";
        case "Baixa":
          return "alerta-baixo";
        default:
          return "alerta-normal";
      }
    },
    formatarData(data) {
      if (!data) return "";
      return new Date(data).toLocaleString("pt-BR");
    },
    abrirModalDetalhes(quarto) {
      this.quartoSelecionado = quarto;
      this.modalDetalhesAberto = true;
    },
    abrirModalHistorico(quarto) {
      this.quartoSelecionado = quarto;
      this.modalHistoricoAberto = true;
    },
    fecharModal() {
      this.modalDetalhesAberto = false;
      this.modalHistoricoAberto = false;
      this.quartoSelecionado = null;
    },
  },
};
</script>

<style scoped>
.quartos-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.quarto-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.quarto-header {
  background-color: lightgray;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #ddd;
}

.quarto-numero {
  font-weight: bold;
  font-size: 1.1rem;
  display: block;
}

.quarto-tipo {
  font-size: 0.9rem;
  color: #555;
  display: block;
}

.pacientes-contador {
  font-size: 0.85rem;
  color: #888;
  display: block;
}

.btn-camera {
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
}

.quarto-body {
  padding: 0.5rem;
}

.quarto-status {
  height: 6px;
  border-radius: 3px;
  margin-bottom: 1rem;
}

.pacientes-lista {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.paciente-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.paciente-avatar {
  background-color: #1976d2;
  color: #fff;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  font-size: 1rem;
  margin-right: 1rem;
}

.paciente-detalhes {
  font-size: 0.85rem;
  color: #555;
}

.paciente-classe {
  display: inline-block;
  margin-left: 0.5rem;
}

.ocupacao-indicador {
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.ocupacao-preenchido {
  height: 100%;
  background-color: #1976d2;
  border-radius: 4px;
}

/* Estilos para alertas */
.alerta-container {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}

.alerta-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.alerta-normal {
  background-color: rgba(104, 117, 105, 0.1);
  border-left: 3px solid #4caf50;
}

.alerta-baixo {
  background-color: rgba(76, 175, 80, 0.1);
  border-left: 3px solid #4caf50;
}

.alerta-medio {
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
}

.alerta-alto {
  background-color: rgba(244, 67, 54, 0.1);
  border-left: 3px solid #f44336;
}

.alerta-icone {
  margin-right: 8px;
  font-size: 1rem;
}

.alerta-texto {
  flex: 1;
}

.alerta-tempo {
  font-size: 0.75rem;
  color: #777;
}

.quarto-footer {
  border-top: 1px solid #ddd;
  padding: 0.75rem 1rem;
  background-color: lightgray;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.quarto-acoes a {
  margin-left: 1rem;
  color: #1976d2;
  font-weight: 500;
  cursor: pointer;
}

.scroll-limit {
  max-height: calc(2 * 60px);
  overflow-y: auto;
}

.grupo-indicador {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.titulo-grupo {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #444;
  float: left;
}

.card-indicador {
  background-color: #fafafa;
  padding: 0.5rem 0.5rem;
  border-radius: 8px;
  width: 20%;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.valor {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: #333;
}

.subtitulo {
  font-size: 0.9rem;
  color: #444;
}

/* Cores */
.verde {
  color: #4caf50;
}

.amarelo {
  color: #ffc107;
}

.vermelho {
  color: #f44336;
}
</style>
