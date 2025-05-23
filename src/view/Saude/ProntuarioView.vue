<template>
  <main class="prontuario">
    <div class="content-wrapper">
      <div class="header">
        <h1>
          Prontuário -
          {{ selectedPessoa?.nome || "Nenhuma pessoa selecionada" }}
        </h1>

        <div class="search-container">
          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="Buscar pessoa..."
              class="search-input"
            />
            <div v-if="showResults && filteredPessoas.length > 0" class="jm">
              <div
                v-for="pessoa in filteredPessoas"
                :key="pessoa.id"
                @click="selectPessoa(pessoa)"
                class="item"
              >
                {{ pessoa.nome }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cards-container">
        <div
          v-for="card in cards"
          :key="card.route"
          class="bloco clicavel"
          :class="{ ativo: activeCard === card.route }"
          @click="selectCard(card.route)"
        >
          <div class="alinha-v alinha-centro">
            <div :class="card.icon"></div>
            <h3>{{ card.title }}</h3>
          </div>
        </div>
      </div>

      <div>
        <component
          v-if="selectedPessoa && activeCard && activeComponent"
          :is="activeComponent"
          :pessoa-id="selectedPessoa.id"
          :key="selectedPessoa.id + activeCard"
        />
        <div v-else-if="selectedPessoa" class="no-content">
          Selecione uma opção acima para visualizar o conteúdo
        </div>
        <div v-else class="no-content">
          Selecione uma pessoa para visualizar o prontuário
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "@/services/api";
import SinaisVitais from "@/components/saude/SinaisVitais.vue";
import Ocorrencias from "@/components/saude/Ocorrencias.vue";
import PrescricoesCuidados from "@/components/saude/PrescricoesCuidados.vue";
import Prescricoes from "@/components/saude/Prescricoes.vue";
import Lesao from "@/components/saude/Lesao.vue";
import Evolucao from "@/components/saude/Evolucao.vue";
import Admissao from "@/components/saude/Admissao.vue";
import { usePessoasStore } from "@/stores/pessoas";

console.log(
  "ProntuarioView - Componente SinaisVitais importado:",
  SinaisVitais
);

const pessoasStore = usePessoasStore();
const searchQuery = ref("");
const showResults = ref(false);
const pessoas = ref([]);
const filteredPessoas = ref([]);
const selectedPessoa = ref(null);
const activeCard = ref(null);
const searchTimeout = ref(null);

const cards = [
  {
    title: "Sinais Vitais",
    route: "sinais-vitais",
    component: SinaisVitais,
    icon: "icone-sinais-vitais",
  },
  {
    title: "Ocorrências",
    route: "ocorrencias",
    component: Ocorrencias,
    icon: "icone-ocorrencias",
  },
  {
    title: "Prescrições de Cuidados",
    route: "prescricoes-cuidados",
    component: PrescricoesCuidados,
    icon: "icone-cuidados",
  },
  {
    title: "Prescrições",
    route: "prescricoes",
    component: Prescricoes,
    icon: "icone-prescricoes",
  },
  {
    title: "Lesão",
    route: "lesao",
    component: Lesao,
    icon: "icone-lesao",
  },
  {
    title: "Evolução",
    route: "evolucao",
    component: Evolucao,
    icon: "icone-evolucao",
  },
  {
    title: "Admissão",
    route: "admissao",
    component: Admissao,
    icon: "icone-admissao",
  },
];

console.log("ProntuarioView - Cards definidos:", cards);

const activeComponent = computed(() => {
  console.log("ProntuarioView - Buscando card para rota:", activeCard.value);
  const card = cards.find((c) => c.route === activeCard.value);
  console.log("ProntuarioView - Card encontrado:", card);
  if (!card) {
    console.warn(
      "ProntuarioView - Nenhum card encontrado para a rota:",
      activeCard.value
    );
    return null;
  }
  console.log("ProntuarioView - Componente do card:", card.component);
  return card.component;
});

const formatCPF = (cpf) => {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const handleSearch = () => {
  if (searchQuery.value.length < 3) {
    filteredPessoas.value = [];
    showResults.value = false;
    return;
  }

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    const searchTerm = searchQuery.value.toLowerCase();
    filteredPessoas.value = pessoas.value.filter(
      (pessoa) =>
        pessoa.nome.toLowerCase().includes(searchTerm) ||
        (pessoa.cpf && pessoa.cpf.includes(searchTerm))
    );
    showResults.value = true;
  }, 300);
};

const carregarPessoas = async () => {
  try {
    const response = await api.get("/pessoa/listar");
    pessoas.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar pessoas:", error);
  }
};

const selectPessoa = (pessoa) => {
  console.log("ProntuarioView - Pessoa selecionada:", pessoa);
  selectedPessoa.value = pessoa;
  pessoasStore.selecionarPessoa(pessoa);
  searchQuery.value = `${pessoa.nome} - ${formatCPF(pessoa.cpf)}`;
  showResults.value = false;
  activeCard.value = "sinais-vitais";
  console.log("ProntuarioView - Card ativo definido como:", activeCard.value);
};

const selectCard = (route) => {
  if (!selectedPessoa.value) return;
  console.log("ProntuarioView - Selecionando card:", route);
  activeCard.value = route;
};

onMounted(() => {
  carregarPessoas();
});

watch(
  () => pessoasStore.pessoaId,
  (newId) => {
    if (newId) {
      const pessoa = pessoas.value.find((p) => p.id === newId);
      if (pessoa) {
        selectPessoa(pessoa);
      }
    }
  }
);
</script>

<style scoped>
.prontuario {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--cor-bg);
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: var(--margem);
  background: var(--cor-bg);
  border-bottom: 1px solid var(--cor-separador);
}

h1 {
  color: var(--cor-fonte);
  font-size: 24px;
  margin-bottom: var(--margem);
}

.search-container {
  max-width: 600px;
}

.search-box {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  outline: none;
  transition: all 0.3s;
  background: var(--cor-bg);
}

.search-input:focus {
  border-color: var(--cor-primaria);
  box-shadow: 0 0 0 2px var(--cor-primaria-fraca);
}

.cards-container {
  display: flex;
  gap: var(--margem);
  padding: var(--margem);
  overflow-x: auto;
  align-items: stretch;
  background: var(--cor-bg);
  border-bottom: 1px solid var(--cor-separador);
}

.cards-container::-webkit-scrollbar {
  height: 6px;
}

.cards-container::-webkit-scrollbar-track {
  background: transparent;
}

.cards-container::-webkit-scrollbar-thumb {
  background-color: var(--cor-separador);
  border-radius: 3px;
}

.bloco {
  width: 200px;
  min-width: 200px;
  max-width: 200px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: white;
  border-radius: var(--raio);
  padding: 0 20px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--cor-separador);
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  box-sizing: border-box;
  margin-top: 15px;
}

.bloco:hover {
  background: var(--cor-hover);
  border-color: var(--cor-primaria);
}

.bloco.ativo {
  background: var(--cor-primaria);
  color: white;
  border-color: var(--cor-primaria);
}

.bloco.ativo [class^="icone-"] {
  filter: brightness(0) invert(1);
}

.bloco h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 1;
  display: flex;
  align-items: center;
}

.bloco [class^="icone-"] {
  width: 22px;
  height: 22px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: filter 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  vertical-align: middle;
}

.no-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--cor-fonte-fraca);
  font-size: 16px;
  text-align: center;
  padding: var(--margem);
}

[class^="icone-"],
[class*=" icone-"] {
  border-radius: 12px;
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  position: relative;
  line-height: 48px;
  min-width: 48px;
}

[class^="icone-"]:before,
[class*=" icone-"]:before {
  content: "";
  height: 48px;
  width: 48px;
  background: center center/20px auto no-repeat;
  float: left;
}

.icone-sinais-vitais:before {
  background-image: url("@/assets/icons/sinais-vitais.svg");
}

.icone-ocorrencias:before {
  background-image: url("@/assets/icons/ocorrencias.svg");
}

.icone-cuidados:before {
  background-image: url("@/assets/icons/cuidados.svg");
}

.icone-prescricoes:before {
  background-image: url("@/assets/icons/prescricoes.svg");
}

.icone-lesao:before {
  background-image: url("@/assets/icons/lesao.svg");
}

.icone-evolucao:before {
  background-image: url("@/assets/icons/evolucao.svg");
}

.icone-admissao:before {
  background-image: url("@/assets/icons/admissao.svg");
}

.icone-novo:before {
  background-image: url("@/assets/icons/add.svg");
}

.icone-editar:before {
  background-image: url("@/assets/icons/editar.svg");
}

.icone-salvar:before {
  background-image: url("@/assets/icons/apps-add.svg");
}

.icone-cancelar:before {
  background-image: url("@/assets/icons/angle-small-right.svg");
}

.icone-deletar:before {
  background-image: url("@/assets/icons/deletar.svg");
}

.icone-fechar:before {
  background-image: url("@/assets/icons/menu.svg");
}

.btn-novo,
.btn-editar,
.btn-salvar,
.btn-cancelar,
.btn-deletar,
.btn-fechar {
  border-radius: 12px;
  padding: 0;
  min-width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transicao-normal);
  background: var(--cor-bg);
  border: 1px solid var(--cor-separador);
}

.btn-novo:hover,
.btn-editar:hover,
.btn-salvar:hover,
.btn-cancelar:hover,
.btn-deletar:hover,
.btn-fechar:hover {
  box-shadow: 0 0 0 1px var(--cor-separador) inset;
}

.btn-novo:active,
.btn-editar:active,
.btn-salvar:active,
.btn-cancelar:active,
.btn-deletar:active,
.btn-fechar:active {
  background-color: var(--cor-cinza);
}

.btn-novo.ativo,
.btn-editar.ativo,
.btn-salvar.ativo,
.btn-cancelar.ativo,
.btn-deletar.ativo,
.btn-fechar.ativo {
  background-color: var(--cor-primaria-fraca);
  box-shadow: 0 0 0 1px var(--cor-primaria-media) inset;
  color: var(--cor-primaria-forte);
}

.actions-bar {
  display: flex;
  gap: 8px;
  margin-bottom: var(--margem);
  padding: 8px;
  background: var(--cor-bg);
  border-radius: var(--raio);
  box-shadow: var(--sombra-card);
}
</style>
