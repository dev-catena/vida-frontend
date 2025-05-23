<template>
  <main class="hospedes">
    <div class="cards-container" :class="{ disabled: !selectedPessoa }">
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

    <div class="content-wrapper">
      <div class="header">
        <h1>
          Pessoas - {{ selectedPessoa?.nome || "Nenhuma pessoa selecionada" }}
        </h1>

        <div class="header-actions">
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
          <div class="filters">
            <label class="filter-label">
              <input
                type="checkbox"
                v-model="showOnlyAdmitted"
                @change="handleFilterChange"
              />
              Mostrar apenas admitidos
            </label>
          </div>
        </div>
      </div>

      <div class="action-bar">
        <button class="btn-novo" @click="abrirNovoHospede">Novo Hóspede</button>
      </div>

      <HospedeFormularioModal
        :show="showNovoHospedeModal"
        :hospede="novoHospede"
        :isEdit="!!selectedPessoa"
        @salvar="salvarNovoHospede"
        @fechar="fecharNovoHospedeModal"
      />

      <!-- Modal de Responsáveis -->
      <div v-if="showResponsaveisModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Responsáveis - {{ selectedPessoa?.nome }}</h2>
            <button class="btn-fechar" @click="fecharResponsaveisModal">
              &times;
            </button>
          </div>

          <div class="responsaveis-container">
            <!-- Lista de Responsáveis -->
            <div class="responsaveis-lista">
              <h3>Responsáveis Cadastrados</h3>
              <div v-if="responsaveis.length === 0" class="no-content">
                Nenhum responsável cadastrado
              </div>
              <div v-else class="grid-2">
                <div
                  v-for="responsavel in responsaveis"
                  :key="responsavel.id"
                  class="bloco"
                >
                  <div class="responsavel-info">
                    <h4>{{ responsavel.nome }}</h4>
                    <p class="fonte-fraca">{{ responsavel.parentesco }}</p>
                    <p class="fonte-fraca">{{ responsavel.telefone }}</p>
                  </div>
                  <div class="acoes">
                    <button
                      class="btn-editar"
                      @click="editarResponsavel(responsavel)"
                    >
                      <span class="icone-editar"></span>
                    </button>
                    <button
                      class="btn-deletar"
                      @click="excluirResponsavel(responsavel)"
                    >
                      <span class="icone-deletar"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulário de Responsável -->
            <div class="responsavel-form">
              <h3>{{ responsavelEditando ? "Editar" : "Novo" }} Responsável</h3>
              <form @submit.prevent="salvarResponsavel">
                <div class="form-group">
                  <label for="nome">Nome Completo*</label>
                  <input
                    id="nome"
                    v-model="formResponsavel.nome"
                    type="text"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="parentesco">Parentesco*</label>
                  <select
                    id="parentesco"
                    v-model="formResponsavel.parentesco"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Filho(a)">Filho(a)</option>
                    <option value="Cônjuge">Cônjuge</option>
                    <option value="Irmão(ã)">Irmão(ã)</option>
                    <option value="Sobrinho(a)">Sobrinho(a)</option>
                    <option value="Neto(a)">Neto(a)</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="contato">Contato*</label>
                  <input
                    id="contato"
                    v-model="formResponsavel.contato"
                    type="tel"
                    v-mask="'(##) #####-####'"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="email">E-mail</label>
                  <input
                    id="email"
                    v-model="formResponsavel.email"
                    type="email"
                  />
                </div>

                <div class="form-group">
                  <label for="profissao">Profissão</label>
                  <input
                    id="profissao"
                    v-model="formResponsavel.profissao"
                    type="text"
                  />
                </div>

                <div class="form-group">
                  <label for="endereco">Endereço</label>
                  <input
                    id="endereco"
                    v-model="formResponsavel.endereco"
                    type="text"
                  />
                </div>

                <div class="form-actions">
                  <button
                    type="button"
                    class="btn-cancelar"
                    @click="cancelarResponsavel"
                  >
                    Cancelar
                  </button>
                  <button type="submit" class="btn-salvar">
                    {{ responsavelEditando ? "Atualizar" : "Salvar" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Check-in -->
      <div v-if="showCheckInModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Check-in - {{ selectedPessoa?.nome }}</h2>
            <button class="btn-fechar" @click="fecharCheckInModal">
              &times;
            </button>
          </div>

          <div class="checkin-container">
            <!-- Lista de Check-ins -->
            <div class="checkin-lista">
              <h3>Histórico de Check-ins</h3>
              <div v-if="checkins.length === 0" class="no-content">
                Nenhum check-in registrado
              </div>
              <div v-else class="grid-2">
                <div
                  v-for="checkin in checkins"
                  :key="checkin.id"
                  class="bloco"
                >
                  <div class="checkin-info">
                    <h4>Check-in #{{ checkin.id }}</h4>
                    <p class="fonte-fraca">
                      Data: {{ formatDate(checkin.data_checkin) }}
                    </p>
                    <p class="fonte-fraca">Motivo: {{ checkin.motivo }}</p>
                    <p class="fonte-fraca">
                      Observações: {{ checkin.observacoes }}
                    </p>
                  </div>
                  <div class="acoes">
                    <button
                      class="btn-deletar"
                      @click="excluirCheckIn(checkin)"
                    >
                      <span class="icone-deletar"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulário de Check-in -->
            <div class="checkin-form">
              <h3>Novo Check-in</h3>
              <form @submit.prevent="salvarCheckIn">
                <div class="form-group">
                  <label for="data_checkin">Data do Check-in*</label>
                  <input
                    id="data_checkin"
                    v-model="formCheckIn.data_checkin"
                    type="datetime-local"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="motivo">Motivo*</label>
                  <select id="motivo" v-model="formCheckIn.motivo" required>
                    <option value="">Selecione...</option>
                    <option value="Internação">Internação</option>
                    <option value="Tratamento">Tratamento</option>
                    <option value="Recuperação">Recuperação</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="observacoes">Observações</label>
                  <textarea
                    id="observacoes"
                    v-model="formCheckIn.observacoes"
                    rows="3"
                  ></textarea>
                </div>

                <div class="form-actions">
                  <button
                    type="button"
                    class="btn-cancelar"
                    @click="cancelarCheckIn"
                  >
                    Cancelar
                  </button>
                  <button type="submit" class="btn-salvar">
                    Registrar Check-in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="content-area">
        <div class="tabela">
          <div v-if="!pessoas.length" class="no-content">
            Carregando pessoas...
          </div>
          <div v-else-if="filteredPessoas.length === 0" class="no-content">
            Nenhuma pessoa encontrada
          </div>
          <div v-else>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Data de Nascimento</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="pessoa in filteredPessoas"
                  :key="pessoa.id"
                  :class="{ sel: selectedPessoa?.id === pessoa.id }"
                  @click="selectPessoa(pessoa)"
                >
                  <td>{{ pessoa.nome || "—" }}</td>
                  <td>{{ pessoa.CPF ? pessoa.CPF : "—" }}</td>
                  <td>
                    {{
                      pessoa.data_nascimento
                        ? formatDate(pessoa.data_nascimento)
                        : "—"
                    }}
                  </td>
                  <td>
                    <span class="chip" :class="getStatusClass(pessoa.status)">
                      {{ formatStatus(pessoa.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { usePessoasStore } from "@/stores/pessoas";
import HospedeFormularioModal from './component/HospedeFormularioModal.vue';

const authStore = useAuthStore();
const router = useRouter();
const pessoasStore = usePessoasStore();
const searchQuery = ref("");
const showResults = ref(false);
const pessoas = ref([]);
const filteredPessoas = ref([]);
const selectedPessoa = ref(null);
const activeCard = ref(null);
const searchTimeout = ref(null);
const showNovoHospedeModal = ref(false);
const novoHospede = ref({});

const showResponsaveisModal = ref(false);
const responsaveis = ref([]);
const responsavelEditando = ref(null);
const formResponsavel = ref({
  nome: "",
  parentesco: "",
  contato: "",
  email: "",
  endereco: "",
  profissao: "",
  status: true,
});

const showOnlyAdmitted = ref(false);

const showCheckInModal = ref(false);
const checkins = ref([]);
const formCheckIn = ref({
  data_checkin: "",
  motivo: "",
  observacoes: "",
  status: true,
});

const cards = [
  {
    title: "Informações",
    route: "informacoes",
    icon: "icone-info",
  },
  {
    title: "Responsáveis",
    route: "responsaveis",
    icon: "icone-responsaveis",
  },
  {
    title: "Check-in",
    route: "checkin",
    icon: "icone-app",
  },
  {
    title: "Check-out",
    route: "checkout",
    icon: "icone-deletar",
  },
  {
    title: "Prontuário",
    route: "prontuario",
    icon: "icone-prontuario",
  },
];

const formatCPF = (CPF) => {
  if (!CPF) return "";
  // Remove tudo que não for número
  const cpfLimpo = CPF.replace(/\D/g, '');
  // Aplica a máscara
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatDate = (date) => {
  if (!date) return "—";
  const data = new Date(date);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getStatusClass = (status) => {
  if (!status) return "";

  // Converte para string e remove espaços extras
  const statusStr = String(status).trim().toLowerCase();

  switch (statusStr) {
    case "ativo":
    case "1":
      return "status-ativo";
    case "inativo":
    case "0":
      return "status-inativo";
    case "check-in":
    case "checkin":
      return "status-checkin";
    case "check-out":
    case "checkout":
      return "status-checkout";
    default:
      return "";
  }
};

const formatStatus = (status) => {
  if (!status) return "—";

  const statusStr = String(status).trim().toLowerCase();

  switch (statusStr) {
    case "ativo":
    case "1":
      return "Ativo";
    case "inativo":
    case "0":
      return "Inativo";
    case "check-in":
    case "checkin":
      return "Check-in";
    case "check-out":
    case "checkout":
      return "Check-out";
    default:
      return status;
  }
};

const handleFilterChange = () => {
  if (showOnlyAdmitted.value) {
    filteredPessoas.value = pessoas.value.filter((pessoa) => pessoa.admitido);
  } else {
    filteredPessoas.value = pessoas.value;
  }
};

const handleSearch = () => {
  if (searchQuery.value.length < 3) {
    handleFilterChange();
    showResults.value = false;
    return;
  }

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    const searchTerm = searchQuery.value.toLowerCase();
    const filtered = pessoas.value.filter(
      (pessoa) =>
        pessoa.nome.toLowerCase().includes(searchTerm) ||
        (pessoa.CPF && pessoa.CPF.includes(searchTerm))
    );

    if (showOnlyAdmitted.value) {
      filteredPessoas.value = filtered.filter((pessoa) => pessoa.admitido);
    } else {
      filteredPessoas.value = filtered;
    }

    showResults.value = true;
  }, 300);
};

const abrirNovoHospede = () => {
  selectedPessoa.value = null;
  showNovoHospedeModal.value = true;
  novoHospede.value = {
    nome: '',
    data_nascimento: '',
    sexo: '',
    nacionalidade: '',
    cpf: '',
    identificacao: '',
    planodesaude: '',
    carteiradoplano: '',
    endereco: '',
    estado_civil: '',
    telefone: '',
    email: '',
    profissao: '',
    quadro_clinico: '',
    uso_medicamentos: '',
    alergias: '',
    dependencia: '',
    mobilidade: '',
    tipo_alimentacao: '',
    restricoes_alimentares: '',
    medico_assistente: '',
    contato_medico_assistente: '',
    dispositivos: '',
    responsavel_nome: '',
    responsavel_parentesco: '',
    responsavel_contato: '',
    responsavel_email: '',
    responsavel_profissao: '',
    responsavel_endereco: '',
    estilo_vida: '',
    expectativas_familiares: '',
    observacoes: '',
    procedencia: '',
    data_admissao: '',
    modalidade_moradia: '',
    unidade: 'Matriz'
  };
};

const fecharNovoHospedeModal = () => {
  showNovoHospedeModal.value = false;
};

const salvarNovoHospede = async (dados) => {
  try {
    // Formata os dados antes de enviar
    const dadosFormatados = {
      nome: dados.nome,
      CPF: dados.cpf,
      data_nascimento: dados.data_nascimento,
      data_admissao: dados.data_admissao,
      email: dados.email,
      telefone: dados.telefone,
      sexo: dados.sexo,
      nacionalidade: dados.nacionalidade,
      identificacao: dados.identificacao,
      planodesaude: dados.planodesaude,
      carteiradoplano: dados.carteiradoplano,
      endereco: dados.endereco,
      estado_civil: dados.estado_civil,
      mobilidade_classe_id: selectedPessoa.value?.mobilidade_classe_id || 1,
      pessoa_tipo_id: selectedPessoa.value?.pessoa_tipo_id || 1,
      responsaveis: [
        {
          nome: dados.responsavel_nome,
          contato: dados.responsavel_contato,
          email: dados.responsavel_email,
          parentesco: dados.responsavel_parentesco,
          endereco: dados.responsavel_endereco,
          profissao: dados.responsavel_profissao,
          status: true,
        },
      ],
      quadro_clinico: dados.quadro_clinico,
      alergias: dados.alergias,
      medico_assistente: dados.medico_assistente,
      contato_medico_assistente: dados.contato_medico_assistente,
      dependencia: dados.dependencia,
      mobilidade: dados.mobilidade,
      tipo_alimentacao: dados.tipo_alimentacao,
      restricoes_alimentares: dados.restricoes_alimentares,
      dispositivos: dados.dispositivos,
      uso_medicamentos: dados.uso_medicamentos,
      expectativas_familiares: dados.expectativas_familiares,
      observacoes: dados.observacoes,
      procedencia: dados.procedencia,
      modalidade_moradia: dados.modalidade_moradia,
      unidade: dados.unidade,
      profissao: dados.profissao,
      estilo_vida: dados.estilo_vida,
      status: true,
      admitido: selectedPessoa.value?.admitido || false,
    };

    if (selectedPessoa.value) {
      // Se estiver editando, usa PATCH
      await api.patch(
        `/pessoa/atualizar/${selectedPessoa.value.id}`,
        dadosFormatados,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
    } else {
      // Se for novo hóspede, usa POST
      await api.post("/pessoa/cadastrar", dadosFormatados, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
    }

    alert(
      selectedPessoa.value
        ? "Hóspede atualizado com sucesso!"
        : "Hóspede cadastrado com sucesso!"
    );
    fecharNovoHospedeModal();
    await carregarPessoas();
  } catch (erro) {
    if (erro.response?.status === 422) {
      const mensagens = Object.values(erro.response.data.errors).flat();
      alert(mensagens.join("\n"));
    } else {
      alert(
        `Erro ao salvar hóspede: ${
          erro.response?.data?.message || erro.message
        }`
      );
    }
  }
};

const carregarPessoas = async () => {
  try {
    console.log("Iniciando carregamento de pessoas...");
    const response = await api.get("/pessoa/listar", {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    console.log("Resposta da API:", response.data);

    // Verifica se a resposta tem a estrutura esperada
    if (response.data && Array.isArray(response.data)) {
      pessoas.value = response.data;
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      pessoas.value = response.data.data;
    } else {
      console.warn("Estrutura de dados inesperada:", response.data);
      pessoas.value = [];
    }

    console.log("Pessoas carregadas:", pessoas.value);
    filteredPessoas.value = pessoas.value;
  } catch (error) {
    console.error("Erro ao carregar pessoas:", error);
    pessoas.value = [];
    filteredPessoas.value = [];
  }
};

const selectPessoa = (pessoa) => {
  selectedPessoa.value = pessoa;
  searchQuery.value = `${pessoa.nome} - ${formatCPF(pessoa.CPF)}`;
  showResults.value = false;
  activeCard.value = "informacoes";
};

const selectCard = (route) => {
  if (!selectedPessoa.value) {
    alert("Por favor, selecione uma pessoa primeiro.");
    return;
  }
  if (route === "responsaveis") {
    abrirResponsaveisModal();
  } else if (route === "prontuario") {
    abrirProntuario(selectedPessoa.value);
  } else if (route === "checkin") {
    abrirCheckInModal();
  } else if (route === "informacoes") {
    abrirEdicaoHospede();
  } else {
    activeCard.value = route;
  }
};

const abrirProntuario = (pessoa) => {
  const empresa = router.currentRoute.value.params.empresa;
  pessoasStore.selecionarPessoa(pessoa);
  router.push({
    name: "SaudeProntuario",
    params: {
      empresa: empresa,
    },
  });
};

const abrirResponsaveisModal = async () => {
  if (!selectedPessoa.value) {
    alert("Por favor, selecione uma pessoa primeiro.");
    return;
  }
  showResponsaveisModal.value = true;
  await carregarResponsaveis();
};

const fecharResponsaveisModal = () => {
  showResponsaveisModal.value = false;
  responsavelEditando.value = null;
  limparFormResponsavel();
};

const carregarResponsaveis = async () => {
  try {
    console.log("Carregando responsáveis para pessoa:", selectedPessoa.value);

    // Busca os dados atualizados da pessoa incluindo responsáveis
    const response = await api.get(
      `/pessoa/buscar/${selectedPessoa.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    // Atualiza a pessoa selecionada com os dados mais recentes
    selectedPessoa.value = response.data;

    // Atualiza a lista de responsáveis
    if (selectedPessoa.value && selectedPessoa.value.responsaveis) {
      responsaveis.value = selectedPessoa.value.responsaveis;
      console.log("Responsáveis carregados:", responsaveis.value);
    } else {
      console.log("Nenhum responsável encontrado para esta pessoa");
      responsaveis.value = [];
    }
  } catch (erro) {
    console.error("Erro ao carregar responsáveis:", erro);
    responsaveis.value = [];
  }
};

const limparFormResponsavel = () => {
  formResponsavel.value = {
    nome: "",
    parentesco: "",
    contato: "",
    email: "",
    endereco: "",
    profissao: "",
    status: true,
  };
  responsavelEditando.value = null;
};

const editarResponsavel = (responsavel) => {
  responsavelEditando.value = responsavel;
  formResponsavel.value = { ...responsavel };
};

const excluirResponsavel = async (responsavel) => {
  if (!confirm("Tem certeza que deseja excluir este responsável?")) return;

  try {
    // Filtra os responsáveis, removendo o que será excluído
    const responsaveisAtualizados = selectedPessoa.value.responsaveis.filter(
      (r) => r.id !== responsavel.id
    );

    // Prepara os dados da pessoa com os responsáveis atualizados
    const dadosAtualizados = {
      nome: selectedPessoa.value.nome,
      CPF: selectedPessoa.value.CPF,
      sexo: selectedPessoa.value.sexo,
      data_nascimento: selectedPessoa.value.data_nascimento,
      mobilidade_classe_id: selectedPessoa.value.mobilidade_classe_id,
      pessoa_tipo_id: selectedPessoa.value.pessoa_tipo_id,
      responsaveis: responsaveisAtualizados, // Array vazio se era o único responsável, ou array sem o responsável removido
    };

    console.log("Dados para atualização:", dadosAtualizados);

    // Envia para a rota de atualização
    const response = await api.patch(
      `/pessoa/atualizar/${selectedPessoa.value.id}`,
      dadosAtualizados,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    console.log("Resposta da atualização:", response.data);

    // Atualiza a pessoa selecionada com os novos dados
    const pessoaAtualizada = await api.get(
      `/pessoa/buscar/${selectedPessoa.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    console.log("Dados atualizados da pessoa:", pessoaAtualizada.data);

    // Atualiza o estado local
    selectedPessoa.value = pessoaAtualizada.data;

    // Atualiza a lista de responsáveis
    await carregarResponsaveis();

    // Atualiza a lista de pessoas
    await carregarPessoas();

    alert("Responsável excluído com sucesso!");
  } catch (erro) {
    console.error("Erro ao excluir responsável:", erro);
    alert(
      `Erro ao excluir responsável: ${
        erro.response?.data?.message || erro.message
      }`
    );
  }
};

const salvarResponsavel = async () => {
  try {
    // Prepara os dados da pessoa com os responsáveis
    const data = {
      nome: selectedPessoa.value.nome,
      CPF: selectedPessoa.value.CPF,
      sexo: selectedPessoa.value.sexo,
      data_nascimento: selectedPessoa.value.data_nascimento,
      mobilidade_classe_id: selectedPessoa.value.mobilidade_classe_id,
      pessoa_tipo_id: selectedPessoa.value.pessoa_tipo_id,
      responsaveis: [
        // Mantém os responsáveis existentes
        ...(selectedPessoa.value.responsaveis || []),
        // Adiciona o novo responsável
        {
          nome: formResponsavel.value.nome,
          contato: formResponsavel.value.contato,
          email: formResponsavel.value.email,
          parentesco: formResponsavel.value.parentesco,
          endereco: formResponsavel.value.endereco,
          profissao: formResponsavel.value.profissao,
          status: true,
        },
      ],
    };

    console.log("Dados formatados para envio:", data);

    // Envia para a rota de atualização
    await api.patch(`/pessoa/atualizar/${selectedPessoa.value.id}`, data, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    // Atualiza a pessoa selecionada com os novos dados
    const response = await api.get(
      `/pessoa/buscar/${selectedPessoa.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );
    selectedPessoa.value = response.data;

    await carregarResponsaveis();
    limparFormResponsavel();
    alert("Responsável cadastrado com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar responsável:", error);
    alert(
      `Erro ao salvar responsável: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

const cancelarResponsavel = () => {
  limparFormResponsavel();
};

const abrirCheckInModal = async () => {
  if (!selectedPessoa.value) {
    alert("Por favor, selecione uma pessoa primeiro.");
    return;
  }
  showCheckInModal.value = true;
  await carregarCheckIns();
};

const fecharCheckInModal = () => {
  showCheckInModal.value = false;
  limparFormCheckIn();
};

const carregarCheckIns = async () => {
  try {
    console.log("Carregando check-ins para pessoa:", selectedPessoa.value);

    // Verifica se a pessoa selecionada tem check-ins
    if (selectedPessoa.value && selectedPessoa.value.checkins) {
      checkins.value = selectedPessoa.value.checkins;
      console.log("Check-ins carregados:", checkins.value);
    } else {
      console.log("Nenhum check-in encontrado para esta pessoa");
      checkins.value = [];
    }
  } catch (error) {
    console.error("Erro ao carregar check-ins:", error);
    checkins.value = [];
  }
};

const limparFormCheckIn = () => {
  formCheckIn.value = {
    data_checkin: "",
    motivo: "",
    observacoes: "",
    status: true,
  };
};

const salvarCheckIn = async () => {
  try {
    // Prepara os dados da pessoa com os check-ins
    const data = {
      nome: selectedPessoa.value.nome,
      CPF: selectedPessoa.value.CPF,
      sexo: selectedPessoa.value.sexo,
      data_nascimento: selectedPessoa.value.data_nascimento,
      mobilidade_classe_id: selectedPessoa.value.mobilidade_classe_id,
      pessoa_tipo_id: selectedPessoa.value.pessoa_tipo_id,
      checkins: [
        // Mantém os check-ins existentes
        ...(selectedPessoa.value.checkins || []),
        // Adiciona o novo check-in
        {
          data_checkin: formCheckIn.value.data_checkin,
          motivo: formCheckIn.value.motivo,
          observacoes: formCheckIn.value.observacoes,
          status: true,
        },
      ],
    };

    console.log("Dados formatados para envio:", data);

    // Envia para a rota de atualização
    await api.patch(`/pessoa/atualizar/${selectedPessoa.value.id}`, data, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    // Atualiza a pessoa selecionada com os novos dados
    const response = await api.get(
      `/pessoa/buscar/${selectedPessoa.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );
    selectedPessoa.value = response.data;

    await carregarCheckIns();
    limparFormCheckIn();
    alert("Check-in registrado com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar check-in:", error);
    alert(
      `Erro ao salvar check-in: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

const excluirCheckIn = async (checkin) => {
  if (!confirm("Tem certeza que deseja excluir este check-in?")) return;

  try {
    // Prepara os dados da pessoa com os check-ins atualizados
    const data = {
      nome: selectedPessoa.value.nome,
      CPF: selectedPessoa.value.CPF,
      sexo: selectedPessoa.value.sexo,
      data_nascimento: selectedPessoa.value.data_nascimento,
      mobilidade_classe_id: selectedPessoa.value.mobilidade_classe_id,
      pessoa_tipo_id: selectedPessoa.value.pessoa_tipo_id,
      checkins: selectedPessoa.value.checkins.filter(
        (c) => c.id !== checkin.id
      ),
    };

    // Envia para a rota de atualização
    await api.patch(`/pessoa/atualizar/${selectedPessoa.value.id}`, data, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    // Atualiza a pessoa selecionada com os novos dados
    const response = await api.get(
      `/pessoa/buscar/${selectedPessoa.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );
    selectedPessoa.value = response.data;

    await carregarCheckIns();
    alert("Check-in excluído com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir check-in:", error);
    alert(
      `Erro ao excluir check-in: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

const cancelarCheckIn = () => {
  limparFormCheckIn();
};

const abrirEdicaoHospede = () => {
  if (!selectedPessoa.value) return;

  showNovoHospedeModal.value = true;
  // Preenche o formulário com os dados do hóspede selecionado
  novoHospede.value = {
    nome: selectedPessoa.value.nome || '',
    data_nascimento: selectedPessoa.value.data_nascimento || '',
    sexo: selectedPessoa.value.sexo || '',
    nacionalidade: selectedPessoa.value.nacionalidade || '',
    cpf: selectedPessoa.value.CPF || '',
    identificacao: selectedPessoa.value.identificacao || '',
    planodesaude: selectedPessoa.value.planodesaude || '',
    carteiradoplano: selectedPessoa.value.carteiradoplano || '',
    endereco: selectedPessoa.value.endereco || '',
    estado_civil: selectedPessoa.value.estado_civil || '',
    telefone: selectedPessoa.value.telefone || '',
    email: selectedPessoa.value.email || '',
    profissao: selectedPessoa.value.profissao || '',
    quadro_clinico: selectedPessoa.value.quadro_clinico || '',
    uso_medicamentos: selectedPessoa.value.uso_medicamentos || '',
    alergias: selectedPessoa.value.alergias || '',
    dependencia: selectedPessoa.value.dependencia || '',
    mobilidade: selectedPessoa.value.mobilidade || '',
    tipo_alimentacao: selectedPessoa.value.tipo_alimentacao || '',
    restricoes_alimentares: selectedPessoa.value.restricoes_alimentares || '',
    medico_assistente: selectedPessoa.value.medico_assistente || '',
    contato_medico_assistente: selectedPessoa.value.contato_medico_assistente || '',
    dispositivos: selectedPessoa.value.dispositivos || '',
    responsavel_nome: selectedPessoa.value.responsaveis?.[0]?.nome || '',
    responsavel_parentesco: selectedPessoa.value.responsaveis?.[0]?.parentesco || '',
    responsavel_contato: selectedPessoa.value.responsaveis?.[0]?.contato || '',
    responsavel_email: selectedPessoa.value.responsaveis?.[0]?.email || '',
    responsavel_profissao: selectedPessoa.value.responsaveis?.[0]?.profissao || '',
    responsavel_endereco: selectedPessoa.value.responsaveis?.[0]?.endereco || '',
    estilo_vida: selectedPessoa.value.estilo_vida || '',
    expectativas_familiares: selectedPessoa.value.expectativas_familiares || '',
    observacoes: selectedPessoa.value.observacoes || '',
    procedencia: selectedPessoa.value.procedencia || '',
    data_admissao: selectedPessoa.value.data_admissao || '',
    modalidade_moradia: selectedPessoa.value.modalidade_moradia || '',
    unidade: selectedPessoa.value.unidade || 'Matriz'
  };
};

onMounted(() => {
  carregarPessoas();
});

// Adicionar watch para debug
watch(
  pessoas,
  (newValue) => {
    console.log("Lista de pessoas atualizada:", newValue);
  },
  { deep: true }
);

watch(
  filteredPessoas,
  (newValue) => {
    console.log("Lista filtrada atualizada:", newValue);
  },
  { deep: true }
);
</script>

<style scoped>
.hospedes {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--cor-bg);
}

.cards-container {
  display: flex;
  gap: var(--margem);
  padding: var(--margem);
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--cor-separador) transparent;
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

.cards-container.disabled {
  opacity: 0.6;
  pointer-events: none;
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

.bloco .alinha-v {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
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
  flex-shrink: 0;
}

.bloco h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--margem);
}

.search-container {
  flex: 1;
  max-width: 600px;
}

.search-box {
  position: relative;
  width: 100%;
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

.btn-novo {
  background: var(--cor-primaria);
  color: var(--cor-bg);
  border: none;
  border-radius: 24px;
  padding: 12px calc(var(--margem) * 1.5);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-novo:hover {
  background: var(--cor-primaria-escura);
}

.content-area {
  flex: 1;
  background: var(--cor-bg);
  padding: var(--margem);
  overflow-y: auto;
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

.tabela {
  background: white;
  border-radius: var(--raio);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--cor-separador);
}

th {
  background: var(--cor-fundo);
  font-weight: 600;
}

.chip {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-ativo {
  background: var(--cor-sucesso);
  color: white;
}

.status-inativo {
  background: var(--cor-fonte-fraca);
  color: white;
}

.status-checkin {
  background: var(--cor-primaria);
  color: white;
}

.status-checkout {
  background: var(--cor-alerta);
  color: white;
}

.btn-visualizar {
  background: var(--cor-secundaria);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: var(--raio);
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-visualizar:hover {
  background: var(--cor-secundaria-escura);
}

.icone-info:before {
  background-image: url("@/assets/icons/info.svg");
}

.icone-responsaveis:before {
  background-image: url("@/assets/icons/responsaveis.svg");
}

.icone-app:before {
  background-image: url("@/assets/icons/apps-add.svg");
}

.icone-deletar:before {
  background-image: url("@/assets/icons/deletar.svg");
}

.icone-prontuario:before {
  background-image: url("@/assets/icons/prontuario.svg");
}

.icone-editar:before {
  background-image: url("@/assets/icons/editar.svg");
}

.icone-excluir:before {
  background-image: url("@/assets/icons/excluir.svg");
}

.btn-info:hover img,
.btn-gestao:hover img,
.btn-app:hover img,
.btn-deletar:hover img {
  filter: none;
}

.acoes button img {
  display: none;
}

.acoes button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.acoes button:hover {
  background-color: var(--cor-hover);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--cor-bg);
  padding: var(--margem);
  border-radius: var(--raio);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: var(--margem);
  color: var(--cor-fonte);
}

.form-section {
  margin-bottom: var(--margem);
  padding-bottom: var(--margem);
  border-bottom: 1px solid var(--cor-separador);
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  color: var(--cor-fonte);
  font-size: 16px;
  margin-bottom: var(--margem);
  font-weight: 500;
}

.form-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--margem);
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group {
  margin-bottom: var(--margem);
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: var(--cor-fonte);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--cor-primaria);
  outline: none;
  box-shadow: 0 0 0 2px rgba(var(--cor-primaria-rgb), 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--margem);
  margin-top: var(--margem);
}

.btn-cancelar {
  background: var(--cor-fonte-fraca);
  color: var(--cor-bg);
  border: none;
  border-radius: 24px;
  padding: 12px calc(var(--margem) * 1.5);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancelar:hover {
  background: var(--cor-erro);
}

.btn-salvar {
  background: var(--cor-sucesso);
  color: var(--cor-bg);
  border: none;
  border-radius: 24px;
  padding: 12px calc(var(--margem) * 1.5);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-salvar:hover {
  background: var(--cor-sucesso-escura);
}

tr.sel {
  background-color: var(--cor-hover);
}

tr:hover {
  background-color: var(--cor-hover);
  cursor: pointer;
}

.responsaveis-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--margem);
  padding: var(--margem);
}

.responsaveis-lista {
  border-right: 1px solid var(--cor-separador);
  padding-right: var(--margem);
}

.responsaveis-grid {
  display: grid;
  gap: var(--margem);
  margin-top: var(--margem);
}

.responsavel-card {
  background: var(--cor-fundo);
  border-radius: var(--raio);
  padding: var(--margem);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.responsavel-info h4 {
  margin: 0 0 8px 0;
  color: var(--cor-fonte);
}

.responsavel-info p {
  margin: 4px 0;
  color: var(--cor-fonte-fraca);
  font-size: 14px;
}

.responsavel-acoes {
  display: flex;
  gap: 8px;
}

.btn-editar {
  background: var(--cor-secundaria);
  color: var(--cor-bg);
  border: none;
  border-radius: 24px;
  padding: 12px calc(var(--margem) * 1.5);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-editar:hover {
  background: var(--cor-secundaria-escura);
}

.btn-excluir {
  background: var(--cor-erro);
  color: var(--cor-bg);
  border: none;
  border-radius: 24px;
  padding: 12px calc(var(--margem) * 1.5);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-excluir:hover {
  background: var(--cor-erro-escura);
}

.icone-editar,
.icone-excluir {
  width: 20px;
  height: 20px;
  display: block;
}

.icone-editar {
  background-image: url("@/assets/icons/editar.svg");
}

.icone-excluir {
  background-image: url("@/assets/icons/excluir.svg");
}

.responsavel-form {
  padding-left: var(--margem);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--margem);
  border-bottom: 1px solid var(--cor-separador);
}

.btn-fechar {
  background: none;
  border: none;
  color: var(--cor-fonte-fraca);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.btn-fechar:hover {
  color: var(--cor-fonte);
}

.filters {
  display: flex;
  align-items: center;
  gap: var(--margem);
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  color: var(--cor-fonte);
}

.filter-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkin-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--margem);
  padding: var(--margem);
}

.checkin-lista {
  border-right: 1px solid var(--cor-separador);
  padding-right: var(--margem);
}

.checkin-grid {
  display: grid;
  gap: var(--margem);
  margin-top: var(--margem);
}

.checkin-card {
  background: var(--cor-fundo);
  border-radius: var(--raio);
  padding: var(--margem);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.checkin-info h4 {
  margin: 0 0 8px 0;
  color: var(--cor-fonte);
}

.checkin-info p {
  margin: 4px 0;
  color: var(--cor-fonte-fraca);
  font-size: 14px;
}

.checkin-form {
  padding-left: var(--margem);
}

.action-bar {
  padding: var(--margem);
  background: var(--cor-bg);
  border-bottom: 1px solid var(--cor-separador);
  display: flex;
  justify-content: flex-end;
}
</style>

