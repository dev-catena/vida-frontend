<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h2>{{ isEdit ? "Editar Hóspede" : "Novo Hóspede" }}</h2>
      <form @submit.prevent="$emit('salvar', localHospede)">
        <!-- Dados Pessoais -->
        <div class="form-section">
          <h2>Dados Pessoais</h2>
          <div class="form-columns">
            <div class="form-group">
              <label>Nome Completo*</label>
              <input type="text" v-model="localHospede.nome" required />
            </div>

            <div class="form-group">
              <label>Data de Nascimento*</label>
              <input
                type="date"
                v-model="localHospede.data_nascimento"
                required
              />
            </div>
            
            <div class="form-group">
              <label>Sexo de Nascimento*</label>
              <select v-model="localHospede.sexo" required>
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nacionalidade*</label>
              <input
                type="text"
                v-model="localHospede.nacionalidade"
                required
              />
            </div>
            <div class="form-group">
              <label>CPF</label>
              <input 
                type="text" 
                v-model="cpfFormatado" 
                maxlength="14"
                placeholder="000.000.000-00"
              />
            </div>
            <div class="form-group">
              <label>Documento de Identificação</label>
              <input type="text" v-model="localHospede.identificacao" />
            </div>
            <div class="form-group">
              <label>Plano de Saúde*</label>
              <input type="text" v-model="localHospede.planodesaude" required />
            </div>
            <div class="form-group">
              <label>Número da Carteira do Plano*</label>
              <input
                type="text"
                v-model="localHospede.carteiradoplano"
                required
              />
            </div>
            <div class="form-group">
              <label>Endereço*</label>
              <input type="text" v-model="localHospede.endereco" required />
            </div>
            <div class="form-group">
              <label>Estado Civil*</label>
              <select v-model="localHospede.estado_civil" required>
                <option value="">Selecione...</option>
                <option value="casado">Casado</option>
                <option value="solteiro">Solteiro</option>
                <option value="divorciado">Divorciado</option>
                <option value="viuvo">Viúvo</option>
              </select>
            </div>
            <div class="form-group">
              <label>Telefone*</label>
              <input type="tel" v-model="localHospede.telefone" required />
            </div>
            <div class="form-group">
              <label>E-mail*</label>
              <input type="email" v-model="localHospede.email" required />
            </div>
          </div>
        </div>
        <!-- Dados Profissionais -->
        <div class="form-section">
          <h2>Dados Profissionais</h2>
          <div class="form-columns">
            <div class="form-group">
              <label>Profissão</label>
              <input type="text" v-model="localHospede.profissao" />
            </div>
          </div>
        </div>
        <!-- Dados de Saúde -->
        <div class="form-section">
          <h2>Dados de Saúde</h2>
          <div class="form-columns">
            <div class="form-group full-width">
              <label>Quadro Clínico</label>
              <textarea v-model="localHospede.quadro_clinico" rows="3" />
            </div>
            <div class="form-group full-width">
              <label>Uso de Medicamentos</label>
              <textarea v-model="localHospede.uso_medicamentos" rows="3" />
            </div>
            <div class="form-group full-width">
              <label>Alergias</label>
              <textarea v-model="localHospede.alergias" rows="2" />
            </div>
            <div class="form-group">
              <label>Grau de Dependência*</label>
              <select v-model="localHospede.dependencia" required>
                <option value="">Selecione...</option>
                <option value="Autônomo">Autônomo</option>
                <option value="Semi-Dependente">Semi-Dependente</option>
                <option value="Dependente">Dependente</option>
              </select>
            </div>
            <div class="form-group">
              <label>Mobilidade*</label>
              <select v-model="localHospede.mobilidade" required>
                <option value="">Selecione...</option>
                <option value="Caminha sem Apoio">Caminha sem Apoio</option>
                <option value="Bengala">Bengala</option>
                <option value="Cadeira de Rodas">Cadeira de Rodas</option>
                <option value="Andador">Andador</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>Tipo de Alimentação</label>
              <select v-model="localHospede.tipo_alimentacao">
                <option value="">Selecione...</option>
                <option value="normal">Normal</option>
                <option value="dieta">Dieta</option>
                <option value="pastosa">Pastosa</option>
                <option value="liquida">Líquida</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label>Restrições Alimentares</label>
              <textarea v-model="localHospede.restricoes_alimentares" rows="2" />
            </div>
            <div class="form-group">
              <label>Nome do Médico Assistente</label>
              <input type="text" v-model="localHospede.medico_assistente" />
            </div>
            <div class="form-group">
              <label>Contato do Médico Assistente</label>
              <input type="text" v-model="localHospede.contato_medico_assistente" />
            </div>
            <div class="form-group">
              <label>Usa algum tipo de dispositivo?</label>
              <div class="combobox-container">
                <div class="input-container">
                  <div class="chips">
                    <span v-for="(item, index) in dispositivosSelecionados" :key="index" class="chip">
                      {{ item }}
                      <button @click="removerDispositivo(index)">×</button>
                    </span>
                  </div>
                  <input
                    v-model="dispositivoInput"
                    @input="dispositivoHighlighted = -1"
                    @keydown.enter.prevent="adicionarDispositivo"
                    @keydown.down.prevent="proximoDispositivo"
                    @keydown.up.prevent="dispositivoAnterior"
                    @keydown.tab="adicionarDispositivo"
                    @blur="fecharLista"
                    @focus="mostrarOpcoes = true"
                    placeholder="Selecione ou adicione..."
                  />
                </div>
                <ul v-if="mostrarOpcoes && dispositivosFiltrados.length" class="options-list">
                  <li 
                    v-for="(option, index) in dispositivosFiltrados" 
                    :key="option" 
                    :class="{ highlighted: index === dispositivoHighlighted }"
                    @mousedown.prevent="selecionarDispositivo(option)"
                  >
                    {{ option }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- Dados do Responsável -->
        <div class="form-section">
          <h2>Dados do Responsável Financeiro</h2>
          <div class="form-columns">
            <div class="form-group">
              <label>Nome do Responsável*</label>
              <input type="text" v-model="localHospede.responsavel_nome" required />
            </div>
            <div class="form-group">
              <label>Parentesco*</label>
              <select v-model="localHospede.responsavel_parentesco" required>
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
              <input type="tel" v-model="localHospede.responsavel_contato" required />
            </div>
            <div class="form-group">
              <label>E-mail do Responsável</label>
              <input type="email" v-model="localHospede.responsavel_email" />
            </div>
            <div class="form-group">
              <label>Profissão do Responsável</label>
              <input type="text" v-model="localHospede.responsavel_profissao" />
            </div>
            <div class="form-group">
              <label>Endereço do Responsável</label>
              <input type="text" v-model="localHospede.responsavel_endereco" />
            </div>
          </div>
        </div>
        <!-- Dados Adicionais -->
        <div class="form-section">
          <h2>Dados Adicionais</h2>

          <div class="form-columns">
            <div class="form-group full-width">
              <label>Estilo de vida</label>
              <textarea v-model="localHospede.estilo_vida" rows="2" />
            </div>
            <div class="form-group full-width">
              <label>Expectativas da Família</label>
              <textarea v-model="localHospede.expectativas_familiares" rows="3" />
            </div>
            <div class="form-group full-width">
              <label>Observações</label>
              <textarea v-model="localHospede.observacoes" rows="3" />
            </div>
          </div>
        </div>
        <!-- Dados de Admissão -->
        <div class="form-section">
          <h2>Dados de Admissão</h2>
          <div class="form-columns">
            <div class="form-group">
              <label>Procedência</label>
              <select v-model="localHospede.procedencia" required>
                <option value="">Selecione...</option>
                <option value="Casa">Casa</option>
                <option value="outra ilpi">Outra ILPI</option>
              </select>
            </div>
            <div class="form-group">
              <label>Data de Admissão</label>
              <input
                type="date"
                v-model="localHospede.data_admissao"
                required
              />
            </div>
          </div>
        </div>
        <!-- Dados de Moradia -->
        <div class="form-section">
          <h2>Dados de Moradia</h2>
          <div class="form-columns">
            <div class="form-group">
              <label>Modalidade de Moradia</label>
              <select v-model="localHospede.modalidade_moradia" required>
                <option value="">Selecione...</option>
                <option value="temporaria">Temporária</option>
                <option value="daycare">Day Care</option>
                <option value="definitiva">Definitiva</option>
              </select>
            </div>
            <div class="form-group">
              <label>Unidade</label>
              <input type="text" v-model="localHospede.unidade" required />
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="button" :style="{ backgroundColor: 'var(--cor-erro)' }" @click="$emit('fechar')">
            Cancelar
          </button>
          <button type="submit" class="button" :style="{ backgroundColor: 'var(--cor-sucesso)' }">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, computed } from "vue";

defineOptions({
  name: 'HospedeFormularioModal'
});

const props = defineProps({
  show: Boolean,
  hospede: Object,
  isEdit: Boolean,
});

defineEmits(["salvar", "fechar"]);

const localHospede = reactive({
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
});

// Dispositivos médicos
const dispositivos = ref(['Oxigênio', 'Sonda', 'GTT', 'Outro']);
const dispositivoInput = ref('');
const dispositivosSelecionados = ref([]);
const dispositivoHighlighted = ref(-1);
const mostrarOpcoes = ref(false);

const dispositivosFiltrados = computed(() => {
  const itensDisponiveis = dispositivos.value.filter(item => !dispositivosSelecionados.value.includes(item));
  
  if (!dispositivoInput.value) {
    return itensDisponiveis;
  }
  
  return itensDisponiveis.filter(item =>
    item.toLowerCase().includes(dispositivoInput.value.toLowerCase())
  );
});

function adicionarDispositivo() {
  const value = dispositivoInput.value.trim();
  if (value && !dispositivosSelecionados.value.includes(value)) {
    dispositivosSelecionados.value.push(value);
    localHospede.dispositivos = dispositivosSelecionados.value.join(', ');
  }
  dispositivoInput.value = '';
  dispositivoHighlighted.value = -1;
}

function selecionarDispositivo(item) {
  if (!dispositivosSelecionados.value.includes(item)) {
    dispositivosSelecionados.value.push(item);
    localHospede.dispositivos = dispositivosSelecionados.value.join(', ');
  }
  dispositivoInput.value = '';
  dispositivoHighlighted.value = -1;
}

function removerDispositivo(index) {
  dispositivosSelecionados.value.splice(index, 1);
  localHospede.dispositivos = dispositivosSelecionados.value.join(', ');
}

function proximoDispositivo() {
  if (dispositivoHighlighted.value < dispositivosFiltrados.value.length - 1) {
    dispositivoHighlighted.value++;
  }
}

function dispositivoAnterior() {
  if (dispositivoHighlighted.value > 0) {
    dispositivoHighlighted.value--;
  }
}

function fecharLista() {
  setTimeout(() => {
    mostrarOpcoes.value = false;
  }, 200);
}

watch(
  () => props.hospede,
  (novo) => {
    if (novo) {
      Object.assign(localHospede, novo);
      // Formata a data de nascimento
      if (novo.data_nascimento) {
        const data = new Date(novo.data_nascimento);
        localHospede.data_nascimento = data.toISOString().split('T')[0];
      }
      // Formata a data de admissão
      if (novo.data_admissao) {
        const data = new Date(novo.data_admissao);
        localHospede.data_admissao = data.toISOString().split('T')[0];
      }
      if (novo.dispositivos) {
        dispositivosSelecionados.value = novo.dispositivos.split(', ').filter(Boolean);
      }
    } else {
      // Limpa o formulário se não houver dados
      Object.keys(localHospede).forEach(key => {
        localHospede[key] = '';
      });
      localHospede.unidade = 'Matriz';
      dispositivosSelecionados.value = [];
    }
  },
  { immediate: true }
);

// Watch para o campo sexo
watch(
  () => localHospede.sexo,
  (novoValor) => {
    console.log('Valor do sexo atualizado:', novoValor);
  }
);
</script>

<style scoped>
/* Estilos específicos do modal que não estão no spec.css */
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

/* Ajustes específicos para o formulário */
.form-section h3 {
  color: var(--cor-fonte);
  font-size: 16px;
  margin-bottom: var(--margem);
  font-weight: 500;
}

/* Ajustes específicos para os botões */
.btn-cancelar:hover {
  background: var(--cor-erro);
}

.btn-salvar:hover {
  background: var(--cor-sucesso-escura);
}

/* Ajuste para campos que ocupam duas colunas */
.form-group.full-width {
  grid-column: 1 / -1;
}

/* Ajustes para o layout em duas colunas */
.form-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--margem);
}

.form-group {
  margin-bottom: var(--margem);
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
}

/* Ajuste para os botões de ação */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--margem);
  margin-top: var(--margem);
  padding-top: var(--margem);
  border-top: 1px solid var(--cor-separador);
}

/* Estilos do combobox */
.combobox-container {
  width: 100%;
  position: relative;
}

.input-container {
  position: relative;
  border: 1px solid var(--cor-separador);
  border-radius: 6px;
  background: var(--cor-bg);
  min-height: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 4px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 0 4px;
}

.chip {
  background: var(--cor-primaria-fraca);
  border-radius: 12px;
  padding: 2px 8px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--cor-fonte);
}

.chip button {
  background: none;
  border: none;
  margin-left: 4px;
  cursor: pointer;
  padding: 0 4px;
  color: var(--cor-fonte);
  font-size: 16px;
  line-height: 1;
}

.chip button:hover {
  color: var(--cor-erro);
}

.combobox-container input {
  flex: 1;
  min-width: 120px;
  border: none;
  padding: 4px;
  background: transparent;
  outline: none;
}

.combobox-container input::placeholder {
  color: var(--cor-fonte-fraca);
}

.options-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid var(--cor-separador);
  max-height: 120px;
  overflow-y: auto;
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  background: var(--cor-bg);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1;
}

.options-list li {
  padding: 8px 12px;
  cursor: pointer;
}

.options-list li:hover,
.options-list li.highlighted {
  background-color: var(--cor-primaria-fraca);
}
</style>
