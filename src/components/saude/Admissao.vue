<template>
  <div class="admissao">
    <div class="header">
      <h2>Admissão</h2>
      <div class="header-actions">
        <div class="filtros">
          <button 
            v-for="tipo in tiposAdmissao" 
            :key="tipo.value"
            type="button"
            class="btn-filtro"
            :class="{ 'active': filtroAtivo === tipo.value }"
            @click="aplicarFiltro(tipo.value)"
          >
            {{ tipo.label }}
            <span class="contador" v-if="registros.filter(r => r.motivo === tipo.value).length > 0">
              ({{ registros.filter(r => r.motivo === tipo.value).length }})
            </span>
          </button>
          <button 
            type="button"
            class="btn-filtro"
            :class="{ 'active': filtroAtivo === 'todos' }"
            @click="aplicarFiltro('todos')"
          >
            Todos
            <span class="contador" v-if="registros.length > 0">
              ({{ registros.length }})
            </span>
          </button>
        </div>
        <button class="btn-novo" @click="abrirNovoRegistro">
          Nova Admissão
        </button>
      </div>
    </div>

    <div class="content">
      <div class="tabela">
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Motivo</th>
              <th>Procedência</th>
              <th>Responsável</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in registrosFiltrados" :key="registro.id">
              <td>{{ formatDateTime(registro.data_hora) }}</td>
              <td>{{ registro.motivo }}</td>
              <td>{{ registro.procedencia }}</td>
              <td>{{ registro.responsavel }}</td>
              <td>
                <button class="btn-editar" @click="editarRegistro(registro)">
                  Editar
                </button>
              </td>
            </tr>
            <tr v-if="registrosFiltrados.length === 0">
              <td colspan="5" class="no-records">
                Nenhum registro encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Registro -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ registroAtual ? 'Editar' : 'Nova' }} Admissão</h2>
        <form @submit.prevent="salvarRegistro">
          <div class="form-group">
            <label>Motivo da Admissão</label>
            <select v-model="form.motivo" required>
              <option value="">Selecione...</option>
              <option value="Clínica">Clínica</option>
              <option value="Enfermagem">Enfermagem</option>
              <option value="Fisioterapia">Fisioterapia</option>
              <option value="Nutrição">Nutrição</option>
              <option value="Psicologia">Psicologia</option>
              <option value="Médico">Médico</option>
            </select>
          </div>

          <div class="form-group">
            <label>Procedência</label>
            <select v-model="form.procedencia" required>
              <option value="">Selecione...</option>
              <option value="Hospital">Hospital</option>
              <option value="Clínica">Clínica</option>
              <option value="Domicílio">Domicílio</option>
              <option value="Outro Estabelecimento">Outro Estabelecimento</option>
            </select>
          </div>

          <div class="form-group">
            <label>Observações</label>
            <textarea
              v-model="form.observacoes"
              rows="4"
              placeholder="Descreva informações relevantes sobre a admissão..."
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancelar" @click="fecharModal">Cancelar</button>
            <button type="submit" class="btn-salvar">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  pessoaId: {
    type: [String, Number],
    required: true
  }
});

const authStore = useAuthStore();
const registros = ref([]);
const registrosFiltrados = ref([]);
const showModal = ref(false);
const registroAtual = ref(null);
const filtroAtivo = ref('todos');
const form = ref({
  motivo: '',
  procedencia: '',
  observacoes: '',
  responsavel: authStore.userNome
});

const tiposAdmissao = [
  { value: 'Clínica', label: 'Clínica' },
  { value: 'Enfermagem', label: 'Enfermagem' },
  { value: 'Fisioterapia', label: 'Fisioterapia' },
  { value: 'Nutrição', label: 'Nutrição' },
  { value: 'Psicologia', label: 'Psicologia' },
  { value: 'Médico', label: 'Médico' }
];

const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('pt-BR');
};

const aplicarFiltro = (tipo) => {
  filtroAtivo.value = tipo;
  if (tipo === 'todos') {
    registrosFiltrados.value = registros.value;
  } else {
    registrosFiltrados.value = registros.value.filter(registro => registro.motivo === tipo);
  }
};

const carregarRegistros = async () => {
  try {
    const response = await api.get(`/admissao/listar/`);
    registros.value = response.data;
    registrosFiltrados.value = registros.value;
  } catch (error) {
    console.error('Erro ao carregar registros:', error);
    registros.value = [];
    registrosFiltrados.value = [];
  }
};

const abrirNovoRegistro = () => {
  registroAtual.value = null;
  form.value = {
    motivo: '',
    procedencia: '',
    observacoes: '',
    responsavel: authStore.userNome
  };
  showModal.value = true;
};

const editarRegistro = (registro) => {
  registroAtual.value = registro;
  form.value = { ...registro };
  showModal.value = true;
};

const fecharModal = () => {
  showModal.value = false;
  registroAtual.value = null;
  form.value = {
    motivo: '',
    procedencia: '',
    observacoes: '',
    responsavel: authStore.userNome
  };
};

const salvarRegistro = async () => {
  try {
    const dados = {
      ...form.value,
      pessoaId: props.pessoaId,
      usuarioId: authStore.user.id,
      empresaId: authStore.user.empresaId,
      data_hora: new Date().toISOString()
    };

    if (registroAtual.value?.id) {
      await api.put(`/admissoes/${registroAtual.value.id}`, dados);
    } else {
      await api.post('/admissoes', dados);
    }

    await carregarRegistros();
    fecharModal();
  } catch (error) {
    console.error('Erro ao salvar registro:', error);
  }
};

// Observar mudanças no ID da pessoa
watch(() => props.pessoaId, (newId) => {
  if (newId) {
    carregarRegistros();
  }
});

// Carregar registros quando o componente for montado
onMounted(() => {
  if (props.pessoaId) {
    carregarRegistros();
  }
});
</script>

<style scoped>
.admissao {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--margem);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--margem);
}

.filtros {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-filtro {
  padding: 8px 16px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: var(--cor-fonte);
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-filtro:hover {
  background: var(--cor-hover);
  border-color: var(--cor-primaria);
}

.btn-filtro.active {
  background: var(--cor-primaria);
  color: white;
  border-color: var(--cor-primaria);
}

.contador {
  font-size: 12px;
  color: var(--cor-fonte-fraca);
  background: var(--cor-fundo);
  padding: 2px 6px;
  border-radius: 12px;
}

.btn-filtro.active .contador {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-novo {
  background: var(--cor-primaria);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--raio);
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-novo:hover {
  background: var(--cor-primaria-escura);
}

.content {
  flex: 1;
  overflow: auto;
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

.btn-editar {
  background: var(--cor-secundaria);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: var(--raio);
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-editar:hover {
  background: var(--cor-secundaria-escura);
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
  max-width: 500px;
}

.form-group {
  margin-bottom: var(--margem);
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
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
</style> 