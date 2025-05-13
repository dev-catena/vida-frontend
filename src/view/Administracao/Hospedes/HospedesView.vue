<template>
  <main class="hospedes">
    <div class="cards-container" :class="{ 'disabled': !selectedPessoa }">
      <div 
        v-for="card in cards" 
        :key="card.route"
        class="card" 
        :class="{ 'active': activeCard === card.route }"
        @click="selectCard(card.route)"
      >
        <div :class="card.icon"></div>
        <h3>{{ card.title }}</h3>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="header">
        <h1>Pessoas - {{ selectedPessoa?.nome || 'Nenhuma pessoa selecionada' }}</h1>

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
              <div v-if="showResults && filteredPessoas.length > 0" class="search-results">
                <div
                  v-for="pessoa in filteredPessoas"
                  :key="pessoa.id"
                  @click="selectPessoa(pessoa)"
                  class="search-result-item"
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
          <button class="btn-pre-admissao" @click="abrirPreAdmissao">
            Pré-admissão
          </button>
        </div>
      </div>

      <!-- Modal de Pré-admissão -->
      <div v-if="showPreAdmissaoModal" class="modal">
        <div class="modal-content">
          <h2>Pré-admissão</h2>
          <form @submit.prevent="salvarPreAdmissao">
            <!-- Dados Pessoais -->
            <div class="form-section">
              <h3>Dados Pessoais</h3>
              <div class="form-columns">
                <div class="form-group">
                  <label>Nome Completo</label>
                  <input type="text" v-model="preAdmissao.nome" required />
                </div>

                <div class="form-group">
                  <label>Data de Nascimento</label>
                  <input type="date" v-model="preAdmissao.data_nascimento" required />
                </div>

                <div class="form-group">
                  <label>Gênero</label>
                  <select v-model="preAdmissao.genero" required>
                    <option value="">Selecione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>CPF</label>
                  <input type="text" v-model="preAdmissao.cpf" required />
                </div>

                <div class="form-group">
                  <label>Telefone</label>
                  <input type="tel" v-model="preAdmissao.telefone" required />
                </div>

                <div class="form-group">
                  <label>E-mail</label>
                  <input type="email" v-model="preAdmissao.email" required />
                </div>
              </div>
            </div>

            <!-- Dados de Moradia -->
            <div class="form-section">
              <h3>Dados de Moradia</h3>
              <div class="form-columns">
                <div class="form-group">
                  <label>Modalidade de Moradia</label>
                  <select v-model="preAdmissao.modalidade_moradia" required>
                    <option value="">Selecione...</option>
                    <option value="temporaria">Temporária</option>
                    <option value="definitiva">Definitiva</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Unidade</label>
                  <input type="text" v-model="preAdmissao.unidade" required />
                </div>
              </div>
            </div>

            <!-- Dados Profissionais -->
            <div class="form-section">
              <h3>Dados Profissionais</h3>
              <div class="form-columns">
                <div class="form-group">
                  <label>Profissão</label>
                  <input type="text" v-model="preAdmissao.profissao" />
                </div>
              </div>
            </div>

            <!-- Dados do Responsável -->
            <div class="form-section">
              <h3>Dados do Responsável</h3>
              <div class="form-columns">
                <div class="form-group">
                  <label>Nome do Responsável*</label>
                  <input 
                    type="text" 
                    v-model="preAdmissao.responsavel_nome" 
                    required 
                  />
                </div>

                <div class="form-group">
                  <label>Parentesco*</label>
                  <select 
                    v-model="preAdmissao.responsavel_parentesco" 
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
                  <label>Contato do Responsável*</label>
                  <input 
                    type="tel" 
                    v-model="preAdmissao.responsavel_contato" 
                    v-mask="'(##) #####-####'"
                    required 
                  />
                </div>

                <div class="form-group">
                  <label>E-mail do Responsável</label>
                  <input 
                    type="email" 
                    v-model="preAdmissao.responsavel_email" 
                  />
                </div>

                <div class="form-group">
                  <label>Profissão do Responsável</label>
                  <input 
                    type="text" 
                    v-model="preAdmissao.responsavel_profissao" 
                  />
                </div>

                <div class="form-group">
                  <label>Endereço do Responsável</label>
                  <input 
                    type="text" 
                    v-model="preAdmissao.responsavel_endereco" 
                  />
                </div>
              </div>
            </div>

            <!-- Dados de Admissão -->
            <div class="form-section">
              <h3>Dados de Admissão</h3>
              <div class="form-columns">
                <div class="form-group">
                  <label>Procedência</label>
                  <input type="text" v-model="preAdmissao.procedencia" required />
                </div>

                <div class="form-group">
                  <label>Data de Admissão</label>
                  <input type="date" v-model="preAdmissao.data_admissao" required />
                </div>
              </div>
            </div>

            <!-- Dados de Saúde -->
            <div class="form-section">
              <h3>Dados de Saúde</h3>
              <div class="form-columns">
                <div class="form-group full-width">
                  <label>Quadro Clínico</label>
                  <textarea v-model="preAdmissao.quadro_clinico" rows="3"></textarea>
                </div>

                <div class="form-group full-width">
                  <label>Alergias</label>
                  <textarea v-model="preAdmissao.alergias" rows="2"></textarea>
                </div>

                <div class="form-group">
                  <label>Médico Assistente</label>
                  <input type="text" v-model="preAdmissao.medico_assistente" />
                </div>

                <div class="form-group">
                  <label>Plano de Saúde</label>
                  <input type="text" v-model="preAdmissao.plano_saude" />
                </div>

                <div class="form-group">
                  <label>Uso de Oxigênio</label>
                  <select v-model="preAdmissao.uso_oxigenio">
                    <option value="">Selecione...</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Dados de Alimentação -->
            <div class="form-section">
              <h3>Dados de Alimentação</h3>
              <div class="form-columns">
                <div class="form-group">
                  <label>Tipo de Alimentação</label>
                  <select v-model="preAdmissao.tipo_alimentacao">
                    <option value="">Selecione...</option>
                    <option value="normal">Normal</option>
                    <option value="dieta">Dieta</option>
                    <option value="pastosa">Pastosa</option>
                    <option value="liquida">Líquida</option>
                  </select>
                </div>

                <div class="form-group full-width">
                  <label>Restrições Alimentares</label>
                  <textarea v-model="preAdmissao.restricoes_alimentares" rows="2"></textarea>
                </div>
              </div>
            </div>

            <!-- Dados Adicionais -->
            <div class="form-section">
              <h3>Dados Adicionais</h3>
              <div class="form-columns">
                <div class="form-group full-width">
                  <label>Lesões de Pele</label>
                  <textarea v-model="preAdmissao.lesoes_pele" rows="2"></textarea>
                </div>

                <div class="form-group full-width">
                  <label>Uso de Medicamentos</label>
                  <textarea v-model="preAdmissao.uso_medicamentos" rows="3"></textarea>
                </div>

                <div class="form-group full-width">
                  <label>Expectativas da Família</label>
                  <textarea v-model="preAdmissao.expectativas_familiares" rows="3"></textarea>
                </div>

                <div class="form-group full-width">
                  <label>Observações</label>
                  <textarea v-model="preAdmissao.observacoes" rows="3"></textarea>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancelar" @click="fecharPreAdmissaoModal">
                Cancelar
              </button>
              <button type="submit" class="btn-salvar">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de Responsáveis -->
      <div v-if="showResponsaveisModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Responsáveis - {{ selectedPessoa?.nome }}</h2>
            <button class="btn-fechar" @click="fecharResponsaveisModal">&times;</button>
          </div>

          <div class="responsaveis-container">
            <!-- Lista de Responsáveis -->
            <div class="responsaveis-lista">
              <h3>Responsáveis Cadastrados</h3>
              <div v-if="responsaveis.length === 0" class="no-content">
                Nenhum responsável cadastrado
              </div>
              <div v-else class="responsaveis-grid">
                <div v-for="responsavel in responsaveis" :key="responsavel.id" class="responsavel-card">
                  <div class="responsavel-info">
                    <h4>{{ responsavel.nome }}</h4>
                    <p>{{ responsavel.parentesco }}</p>
                    <p>{{ responsavel.telefone }}</p>
                  </div>
                  <div class="responsavel-acoes">
                    <button class="btn-editar" @click="editarResponsavel(responsavel)">
                      <span class="icone-editar"></span>
                    </button>
                    <button class="btn-excluir" @click="excluirResponsavel(responsavel)">
                      <span class="icone-excluir"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulário de Responsável -->
            <div class="responsavel-form">
              <h3>{{ responsavelEditando ? 'Editar' : 'Novo' }} Responsável</h3>
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
                  <button type="button" class="btn-cancelar" @click="cancelarResponsavel">
                    Cancelar
                  </button>
                  <button type="submit" class="btn-salvar">
                    {{ responsavelEditando ? 'Atualizar' : 'Salvar' }}
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
            <button class="btn-fechar" @click="fecharCheckInModal">&times;</button>
          </div>

          <div class="checkin-container">
            <!-- Lista de Check-ins -->
            <div class="checkin-lista">
              <h3>Histórico de Check-ins</h3>
              <div v-if="checkins.length === 0" class="no-content">
                Nenhum check-in registrado
              </div>
              <div v-else class="checkin-grid">
                <div v-for="checkin in checkins" :key="checkin.id" class="checkin-card">
                  <div class="checkin-info">
                    <h4>Check-in #{{ checkin.id }}</h4>
                    <p>Data: {{ formatDate(checkin.data_checkin) }}</p>
                    <p>Motivo: {{ checkin.motivo }}</p>
                    <p>Observações: {{ checkin.observacoes }}</p>
                  </div>
                  <div class="checkin-acoes">
                    <button class="btn-excluir" @click="excluirCheckIn(checkin)">
                      <span class="icone-excluir"></span>
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
                  <select 
                    id="motivo" 
                    v-model="formCheckIn.motivo" 
                    required
                  >
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
                  <button type="button" class="btn-cancelar" @click="cancelarCheckIn">
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
                <tr v-for="pessoa in filteredPessoas" 
                    :key="pessoa.id" 
                    :class="{ 'selected': selectedPessoa?.id === pessoa.id }"
                    @click="selectPessoa(pessoa)">
                  <td>{{ pessoa.nome || '—' }}</td>
                  <td>{{ pessoa.CPF ? pessoa.CPF : '—' }}</td>
                  <td>{{ pessoa.data_nascimento ? formatDate(pessoa.data_nascimento) : '—' }}</td>
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
import { ref, onMounted, watch } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { usePessoasStore } from '@/stores/pessoas';

const authStore = useAuthStore();
const router = useRouter();
const pessoasStore = usePessoasStore();
const searchQuery = ref('');
const showResults = ref(false);
const pessoas = ref([]);
const filteredPessoas = ref([]);
const selectedPessoa = ref(null);
const activeCard = ref(null);
const searchTimeout = ref(null);
const showPreAdmissaoModal = ref(false);
const preAdmissao = ref({
  nome: '',
  data_nascimento: '',
  genero: '',
  cpf: '',
  telefone: '',
  email: '',
  observacoes: '',
  modalidade_moradia: '',
  unidade: '',
  profissao: '',
  responsavel_nome: '',
  responsavel_parentesco: '',
  responsavel_contato: '',
  responsavel_email: '',
  responsavel_profissao: '',
  responsavel_endereco: '',
  procedencia: '',
  data_admissao: '',
  quadro_clinico: '',
  alergias: '',
  medico_assistente: '',
  expectativas_familiares: '',
  plano_saude: '',
  uso_oxigenio: '',
  tipo_alimentacao: '',
  restricoes_alimentares: '',
  lesoes_pele: '',
  uso_medicamentos: ''
});

const showResponsaveisModal = ref(false);
const responsaveis = ref([]);
const responsavelEditando = ref(null);
const formResponsavel = ref({
  nome: '',
  parentesco: '',
  contato: '',
  email: '',
  endereco: '',
  profissao: '',
  status: true
});

const showOnlyAdmitted = ref(false);

const showCheckInModal = ref(false);
const checkins = ref([]);
const formCheckIn = ref({
  data_checkin: '',
  motivo: '',
  observacoes: '',
  status: true
});

const cards = [
  {
    title: 'Informações',
    route: 'informacoes',
    icon: 'icone-info'
  },
  {
    title: 'Responsáveis',
    route: 'responsaveis',
    icon: 'icone-responsaveis'
  },
  {
    title: 'Check-in',
    route: 'checkin',
    icon: 'icone-app'
  },
  {
    title: 'Check-out',
    route: 'checkout',
    icon: 'icone-deletar'
  },
  {
    title: 'Prontuário',
    route: 'prontuario',
    icon: 'icone-prontuario'
  }
];

const formatCPF = (CPF) => {
  if (!CPF) return '';
  return CPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('pt-BR');
};

const getStatusClass = (status) => {
  if (!status) return '';
  
  // Converte para string e remove espaços extras
  const statusStr = String(status).trim().toLowerCase();
  
  switch (statusStr) {
    case 'ativo':
    case '1':
      return 'status-ativo';
    case 'inativo':
    case '0':
      return 'status-inativo';
    case 'check-in':
    case 'checkin':
      return 'status-checkin';
    case 'check-out':
    case 'checkout':
      return 'status-checkout';
    default:
      return '';
  }
};

const formatStatus = (status) => {
  if (!status) return '—';
  
  const statusStr = String(status).trim().toLowerCase();
  
  switch (statusStr) {
    case 'ativo':
    case '1':
      return 'Ativo';
    case 'inativo':
    case '0':
      return 'Inativo';
    case 'check-in':
    case 'checkin':
      return 'Check-in';
    case 'check-out':
    case 'checkout':
      return 'Check-out';
    default:
      return status;
  }
};

const handleFilterChange = () => {
  if (showOnlyAdmitted.value) {
    filteredPessoas.value = pessoas.value.filter(pessoa => pessoa.admitido);
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
    const filtered = pessoas.value.filter(pessoa => 
      pessoa.nome.toLowerCase().includes(searchTerm) ||
      (pessoa.CPF && pessoa.CPF.includes(searchTerm))
    );
    
    if (showOnlyAdmitted.value) {
      filteredPessoas.value = filtered.filter(pessoa => pessoa.admitido);
    } else {
      filteredPessoas.value = filtered;
    }
    
    showResults.value = true;
  }, 300);
};

const abrirPreAdmissao = () => {
  showPreAdmissaoModal.value = true;
};

const fecharPreAdmissaoModal = () => {
  showPreAdmissaoModal.value = false;
  preAdmissao.value = {
    nome: '',
    data_nascimento: '',
    genero: '',
    cpf: '',
    telefone: '',
    email: '',
    observacoes: '',
    modalidade_moradia: '',
    unidade: '',
    profissao: '',
    responsavel_nome: '',
    responsavel_parentesco: '',
    responsavel_contato: '',
    responsavel_email: '',
    responsavel_profissao: '',
    responsavel_endereco: '',
    procedencia: '',
    data_admissao: '',
    quadro_clinico: '',
    alergias: '',
    medico_assistente: '',
    expectativas_familiares: '',
    plano_saude: '',
    uso_oxigenio: '',
    tipo_alimentacao: '',
    restricoes_alimentares: '',
    lesoes_pele: '',
    uso_medicamentos: ''
  };
};

const salvarPreAdmissao = async () => {
  try {
    // Formata os dados antes de enviar
    const dadosFormatados = {
      codigo: 'h0001',
      mobilidade_classe_id: 1,
      pessoa_tipo_id: 1,
      nome: preAdmissao.value.nome,
      CPF: preAdmissao.value.cpf,
      data_nascimento: preAdmissao.value.data_nascimento,
      sexo: preAdmissao.value.genero,
      telefone: preAdmissao.value.telefone,
      email: preAdmissao.value.email,
      modalidade_moradia: preAdmissao.value.modalidade_moradia,
      unidade: preAdmissao.value.unidade,
      profissao: preAdmissao.value.profissao,
      status: true,
      admitido: false,
      // Dados do responsável
      responsavel: {
        nome: preAdmissao.value.responsavel_nome,
        parentesco: preAdmissao.value.responsavel_parentesco,
        contato: preAdmissao.value.responsavel_contato,
        email: preAdmissao.value.responsavel_email,
        profissao: preAdmissao.value.responsavel_profissao,
        endereco: preAdmissao.value.responsavel_endereco,
        status: true
      },
      // Dados de saúde
      quadro_clinico: preAdmissao.value.quadro_clinico,
      alergias: preAdmissao.value.alergias,
      medico_assistente: preAdmissao.value.medico_assistente,
      plano_saude: preAdmissao.value.plano_saude,
      uso_oxigenio: preAdmissao.value.uso_oxigenio === 'sim',
      tipo_alimentacao: preAdmissao.value.tipo_alimentacao,
      restricoes_alimentares: preAdmissao.value.restricoes_alimentares,
      lesoes_pele: preAdmissao.value.lesoes_pele,
      uso_medicamentos: preAdmissao.value.uso_medicamentos,
      expectativas_familiares: preAdmissao.value.expectativas_familiares,
      observacoes: preAdmissao.value.observacoes,
      procedencia: preAdmissao.value.procedencia,
      data_admissao: preAdmissao.value.data_admissao
    };

    console.log('Dados formatados para envio:', dadosFormatados);

    const response = await api.post('/pessoa/cadastrar', dadosFormatados, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    
    if (response.data) {
      // Fecha o modal e recarrega a lista de pessoas
      fecharPreAdmissaoModal();
      await carregarPessoas();
      
      // Exibe mensagem de sucesso
      alert('Pessoa cadastrada com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao cadastrar pessoa:', error);
    // Exibe mensagem de erro mais detalhada
    alert(`Erro ao cadastrar pessoa: ${error.response?.data?.message || error.message}`);
  }
};

const carregarPessoas = async () => {
  try {
    console.log('Iniciando carregamento de pessoas...');
    const response = await api.get('/pessoa/listar', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    console.log('Resposta da API:', response.data);
    
    // Verifica se a resposta tem a estrutura esperada
    if (response.data && Array.isArray(response.data)) {
      pessoas.value = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      pessoas.value = response.data.data;
    } else {
      console.warn('Estrutura de dados inesperada:', response.data);
      pessoas.value = [];
    }
    
    console.log('Pessoas carregadas:', pessoas.value);
    filteredPessoas.value = pessoas.value;
  } catch (error) {
    console.error('Erro ao carregar pessoas:', error);
    pessoas.value = [];
    filteredPessoas.value = [];
  }
};

const selectPessoa = (pessoa) => {
  selectedPessoa.value = pessoa;
  searchQuery.value = `${pessoa.nome} - ${formatCPF(pessoa.CPF)}`;
  showResults.value = false;
  activeCard.value = 'informacoes';
};

const selectCard = (route) => {
  if (!selectedPessoa.value) {
    alert('Por favor, selecione uma pessoa primeiro.');
    return;
  }
  if (route === 'responsaveis') {
    abrirResponsaveisModal();
  } else if (route === 'prontuario') {
    abrirProntuario(selectedPessoa.value);
  } else if (route === 'checkin') {
    abrirCheckInModal();
  } else {
    activeCard.value = route;
  }
};

const abrirProntuario = (pessoa) => {
  const empresa = router.currentRoute.value.params.empresa;
  pessoasStore.selecionarPessoa(pessoa);
  router.push({
    name: 'SaudeProntuario',
    params: { 
      empresa: empresa
    }
  });
};

const abrirResponsaveisModal = async () => {
  if (!selectedPessoa.value) {
    alert('Por favor, selecione uma pessoa primeiro.');
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
    console.log('Carregando responsáveis para pessoa:', selectedPessoa.value);
    
    // Verifica se a pessoa selecionada tem responsáveis
    if (selectedPessoa.value && selectedPessoa.value.responsaveis) {
      responsaveis.value = selectedPessoa.value.responsaveis;
      console.log('Responsáveis carregados:', responsaveis.value);
    } else {
      console.log('Nenhum responsável encontrado para esta pessoa');
      responsaveis.value = [];
    }
  } catch (error) {
    console.error('Erro ao carregar responsáveis:', error);
    responsaveis.value = [];
  }
};

const limparFormResponsavel = () => {
  formResponsavel.value = {
    nome: '',
    parentesco: '',
    contato: '',
    email: '',
    endereco: '',
    profissao: '',
    status: true
  };
  responsavelEditando.value = null;
};

const editarResponsavel = (responsavel) => {
  responsavelEditando.value = responsavel;
  formResponsavel.value = { ...responsavel };
};

const excluirResponsavel = async (responsavel) => {
  if (!confirm('Tem certeza que deseja excluir este responsável?')) return;

  try {
    // Prepara os dados da pessoa com os responsáveis atualizados
    const data = {
      nome: selectedPessoa.value.nome,
      CPF: selectedPessoa.value.CPF,
      sexo: selectedPessoa.value.sexo,
      data_nascimento: selectedPessoa.value.data_nascimento,
      mobilidade_classe_id: selectedPessoa.value.mobilidade_classe_id,
      pessoa_tipo_id: selectedPessoa.value.pessoa_tipo_id,
      responsaveis: selectedPessoa.value.responsaveis.filter(r => r.id !== responsavel.id)
    };

    // Envia para a rota de atualização
    await api.patch(`/pessoa/atualizar/${selectedPessoa.value.id}`, data, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });

    // Atualiza a pessoa selecionada com os novos dados
    const response = await api.get(`/pessoa/${selectedPessoa.value.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    selectedPessoa.value = response.data;

    await carregarResponsaveis();
    alert('Responsável excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir responsável:', error);
    alert(`Erro ao excluir responsável: ${error.response?.data?.message || error.message}`);
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
          status: true
        }
      ]
    };

    console.log('Dados formatados para envio:', data);

    // Envia para a rota de atualização
    await api.patch(`/pessoa/atualizar/${selectedPessoa.value.id}`, data, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });

    // Atualiza a pessoa selecionada com os novos dados
    const response = await api.get(`/pessoa/${selectedPessoa.value.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    selectedPessoa.value = response.data;

    await carregarResponsaveis();
    limparFormResponsavel();
    alert('Responsável cadastrado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar responsável:', error);
    alert(`Erro ao salvar responsável: ${error.response?.data?.message || error.message}`);
  }
};

const cancelarResponsavel = () => {
  limparFormResponsavel();
};

const abrirCheckInModal = async () => {
  if (!selectedPessoa.value) {
    alert('Por favor, selecione uma pessoa primeiro.');
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
    console.log('Carregando check-ins para pessoa:', selectedPessoa.value);
    
    // Verifica se a pessoa selecionada tem check-ins
    if (selectedPessoa.value && selectedPessoa.value.checkins) {
      checkins.value = selectedPessoa.value.checkins;
      console.log('Check-ins carregados:', checkins.value);
    } else {
      console.log('Nenhum check-in encontrado para esta pessoa');
      checkins.value = [];
    }
  } catch (error) {
    console.error('Erro ao carregar check-ins:', error);
    checkins.value = [];
  }
};

const limparFormCheckIn = () => {
  formCheckIn.value = {
    data_checkin: '',
    motivo: '',
    observacoes: '',
    status: true
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
          status: true
        }
      ]
    };

    console.log('Dados formatados para envio:', data);

    // Envia para a rota de atualização
    await api.patch(`/pessoa/atualizar/${selectedPessoa.value.id}`, data, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });

    // Atualiza a pessoa selecionada com os novos dados
    const response = await api.get(`/pessoa/${selectedPessoa.value.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    selectedPessoa.value = response.data;

    await carregarCheckIns();
    limparFormCheckIn();
    alert('Check-in registrado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar check-in:', error);
    alert(`Erro ao salvar check-in: ${error.response?.data?.message || error.message}`);
  }
};

const excluirCheckIn = async (checkin) => {
  if (!confirm('Tem certeza que deseja excluir este check-in?')) return;

  try {
    // Prepara os dados da pessoa com os check-ins atualizados
    const data = {
      nome: selectedPessoa.value.nome,
      CPF: selectedPessoa.value.CPF,
      sexo: selectedPessoa.value.sexo,
      data_nascimento: selectedPessoa.value.data_nascimento,
      mobilidade_classe_id: selectedPessoa.value.mobilidade_classe_id,
      pessoa_tipo_id: selectedPessoa.value.pessoa_tipo_id,
      checkins: selectedPessoa.value.checkins.filter(c => c.id !== checkin.id)
    };

    // Envia para a rota de atualização
    await api.patch(`/pessoa/atualizar/${selectedPessoa.value.id}`, data, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });

    // Atualiza a pessoa selecionada com os novos dados
    const response = await api.get(`/pessoa/${selectedPessoa.value.id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    selectedPessoa.value = response.data;

    await carregarCheckIns();
    alert('Check-in excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir check-in:', error);
    alert(`Erro ao excluir check-in: ${error.response?.data?.message || error.message}`);
  }
};

const cancelarCheckIn = () => {
  limparFormCheckIn();
};

onMounted(() => {
  carregarPessoas();
});

// Adicionar watch para debug
watch(pessoas, (newValue) => {
  console.log('Lista de pessoas atualizada:', newValue);
}, { deep: true });

watch(filteredPessoas, (newValue) => {
  console.log('Lista filtrada atualizada:', newValue);
}, { deep: true });
</script>

<style scoped>
.hospedes {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--cor-fundo);
}

.cards-container {
  display: flex;
  gap: 12px;
  padding: var(--margem);
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--cor-separador) transparent;
  background: white;
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

.card {
  background: white;
  border-radius: var(--raio);
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  border: 1px solid var(--cor-separador);
  min-width: fit-content;
}

.card:hover {
  background: var(--cor-hover);
  border-color: var(--cor-primaria);
}

.card.active {
  background: var(--cor-primaria);
  color: white;
  border-color: var(--cor-primaria);
}

.card.active [class^="icone-"] {
  filter: brightness(0) invert(1);
}

.card h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.card [class^="icone-"] {
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: filter 0.2s;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  padding: var(--margem);
  background: white;
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
  flex: 1;
  padding: 12px 20px;
  font-size: 16px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  outline: none;
  transition: all 0.3s;
  background: white;
}

.search-input:focus {
  border-color: var(--cor-primaria);
  box-shadow: 0 0 0 2px rgba(var(--cor-primaria-rgb), 0.1);
}

.btn-pre-admissao {
  background: var(--cor-primaria);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: var(--raio);
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  white-space: nowrap;
}

.btn-pre-admissao:hover {
  background: var(--cor-primaria-escura);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-result-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--cor-fonte);
}

.search-result-item:hover {
  background-color: var(--cor-hover);
}

.content-area {
  flex: 1;
  background: white;
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

th, td {
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

.icone-info {
  background-image: url('@/assets/icons/info.svg');
}

.icone-responsaveis {
  background-image: url('@/assets/icons/responsaveis.svg');
}

.icone-app {
  background-image: url('@/assets/icons/app.svg');
}

.icone-deletar {
  background-image: url('@/assets/icons/deletar.svg');
}

.icone-prontuario {
  background-image: url('@/assets/icons/prontuario.svg');
}

.acoes {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
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

.acoes button img {
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(40%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(90%) contrast(90%);
}

.btn-info:hover img {
  filter: brightness(0) saturate(100%) invert(40%) sepia(100%) saturate(1000%) hue-rotate(190deg) brightness(90%) contrast(90%);
}

.btn-gestao:hover img {
  filter: brightness(0) saturate(100%) invert(40%) sepia(100%) saturate(1000%) hue-rotate(190deg) brightness(90%) contrast(90%);
}

.btn-app:hover img {
  filter: brightness(0) saturate(100%) invert(40%) sepia(100%) saturate(1000%) hue-rotate(190deg) brightness(90%) contrast(90%);
}

.btn-deletar:hover img {
  filter: brightness(0) saturate(100%) invert(20%) sepia(100%) saturate(1000%) hue-rotate(0deg) brightness(90%) contrast(90%);
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
  background: white;
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
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--raio);
  cursor: pointer;
}

.btn-salvar {
  background: var(--cor-sucesso);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--raio);
  cursor: pointer;
}

tr.selected {
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

.btn-editar,
.btn-excluir {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: var(--raio);
  transition: background-color 0.2s;
}

.btn-editar:hover {
  background: var(--cor-hover);
}

.btn-excluir:hover {
  background: var(--cor-erro-clara);
}

.icone-editar,
.icone-excluir {
  width: 20px;
  height: 20px;
  display: block;
}

.icone-editar {
  background-image: url('@/assets/icons/editar.svg');
}

.icone-excluir {
  background-image: url('@/assets/icons/excluir.svg');
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
  font-size: 24px;
  cursor: pointer;
  color: var(--cor-fonte-fraca);
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
</style> 