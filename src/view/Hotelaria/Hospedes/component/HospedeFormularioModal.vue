<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <h2>{{ isEdit ? "Editar Hóspede" : "Novo Hóspede" }}</h2>
      <form @submit.prevent="handleSubmit">
        <!-- Dados Pessoais -->
        <div class="form-section" :class="{ 'expanded': secoesExpandidas.dadosPessoais }">
          <div class="section-header" @click="toggleSecao('dadosPessoais')">
            <h2>Dados Pessoais</h2>
            <div class="icone-expandir" :class="{ 'expanded': secoesExpandidas.dadosPessoais }"></div>
          </div>
          <div class="section-content">
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
                  v-model="localHospede.cpf" 
                  v-mask="'###.###.###-##'"
                  maxlength="14"
                  placeholder="000.000.000-00"
                />
              </div>
              <div class="form-group">
                <label>Documento de Identificação</label>
                <input type="text" v-model="localHospede.identificacao" />
              </div>

              <div class="form-group full-width">
                <label>Possui Plano de Saúde?*</label>
                <select v-model="possuiPlano" required>
                  <option value="">Selecione...</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>

              <template v-if="possuiPlano === 'true'">
                <div class="form-group">
                  <label>Plano de Saúde*</label>
                  <input 
                    type="text" 
                    v-model="localHospede.planodesaude"
                    required
                    placeholder="Nome do plano de saúde"
                  />
                </div>
                <div class="form-group">
                  <label>Número da Carteira do Plano*</label>
                  <input
                    type="text"
                    v-model="localHospede.carteiradoplano"
                    required
                    placeholder="Número da carteira"
                  />
                </div>
              </template>
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
        </div>
        <!-- Dados Profissionais -->
        <div class="form-section" :class="{ 'expanded': secoesExpandidas.dadosProfissionais }">
          <div class="section-header" @click="toggleSecao('dadosProfissionais')">
            <h2>Dados Profissionais</h2>
            <div class="icone-expandir" :class="{ 'expanded': secoesExpandidas.dadosProfissionais }"></div>
          </div>
          <div class="section-content">
            <div class="form-columns">
              <div class="form-group">
                <label>Profissão</label>
                <input type="text" v-model="localHospede.profissao" />
              </div>
            </div>
          </div>
        </div>
        <!-- Dados de Saúde -->
        <div class="form-section" :class="{ 'expanded': secoesExpandidas.dadosSaude }">
          <div class="section-header" @click="toggleSecao('dadosSaude')">
            <h2>Dados de Saúde</h2>
            <div class="icone-expandir" :class="{ 'expanded': secoesExpandidas.dadosSaude }"></div>
          </div>
          <div class="section-content">
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
              <div class="form-group full-width">
                <label>Possui Lesão?*</label>
                <select v-model="possuiLesao" required>
                  <option value="">Selecione...</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>

              <template v-if="possuiLesao === 'true'">
                <div class="form-group full-width">
                  <Lesao 
                    :pessoa-id="localHospede.id" 
                    :is-temp="true"
                    :lesoes-temp="lesoesTemp"
                    @lesao-cadastrada="handleLesaoCadastrada"
                  />
                </div>
              </template>

              <div class="form-group full-width">
                <label>Usa algum tipo de dispositivo?</label>
                <div class="dispositivos-checkbox">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="localHospede.dispositivo_oxigenio" />
                    Oxigênio
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="localHospede.dispositivo_sonda" />
                    Sonda
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="localHospede.dispositivo_gtt" />
                    GTT
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="localHospede.usa_fralda" />
                    Fralda
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label>Nome do Médico Assistente</label>
                <input type="text" v-model="localHospede.medico_assistente" />
              </div>
              <div class="form-group">
                <label>Contato do Médico Assistente</label>
                <input type="text" v-model="localHospede.contato_medico_assistente" />
              </div>
            </div>
          </div>
        </div>
        <!-- Dados do Responsável -->
        <div class="form-section" :class="{ 'expanded': secoesExpandidas.dadosResponsavel }">
          <div class="section-header" @click="toggleSecao('dadosResponsavel')">
            <h2>Dados do Responsável Financeiro</h2>
            <div class="icone-expandir" :class="{ 'expanded': secoesExpandidas.dadosResponsavel }"></div>
          </div>
          <div class="section-content">
            <input type="hidden" v-model="localHospede.responsavel_financeiro" value="true" />
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
        </div>
        <!-- Dados do Coresponsável -->
        <div class="form-section" :class="{ 'expanded': secoesExpandidas.dadosCoresponsavel }">
          <div class="section-header" @click="toggleSecao('dadosCoresponsavel')">
            <h2>Dados do Coresponsável</h2>
            <div class="icone-expandir" :class="{ 'expanded': secoesExpandidas.dadosCoresponsavel }"></div>
          </div>
          <div class="section-content">
            <input type="hidden" v-model="localHospede.coresponsavel_financeiro" value="false" />
            <div class="form-columns">
              <div class="form-group">
                <label>Nome do Coresponsável</label>
                <input type="text" v-model="localHospede.coresponsavel_nome" />
              </div>
              <div class="form-group">
                <label>Parentesco</label>
                <select v-model="localHospede.coresponsavel_parentesco">
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
                <label>Contato do Coresponsável</label>
                <input type="tel" v-model="localHospede.coresponsavel_contato" />
              </div>
              <div class="form-group">
                <label>E-mail do Coresponsável</label>
                <input type="email" v-model="localHospede.coresponsavel_email" />
              </div>
              <div class="form-group">
                <label>Profissão do Coresponsável</label>
                <input type="text" v-model="localHospede.coresponsavel_profissao" />
              </div>
              <div class="form-group">
                <label>Endereço do Coresponsável</label>
                <input type="text" v-model="localHospede.coresponsavel_endereco" />
              </div>
            </div>
          </div>
        </div>
        <!-- Dados Adicionais -->
        <div class="form-section" :class="{ 'expanded': secoesExpandidas.dadosAdicionais }">
          <div class="section-header" @click="toggleSecao('dadosAdicionais')">
            <h2>Dados Adicionais</h2>
            <div class="icone-expandir" :class="{ 'expanded': secoesExpandidas.dadosAdicionais }"></div>
          </div>
          <div class="section-content">
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
        </div>
        <!-- Dados de Admissão -->
        <div class="form-section" :class="{ 'expanded': secoesExpandidas.dadosAdmissao }">
          <div class="section-header" @click="toggleSecao('dadosAdmissao')">
            <h2>Dados de Admissão</h2>
            <div class="icone-expandir" :class="{ 'expanded': secoesExpandidas.dadosAdmissao }"></div>
          </div>
          <div class="section-content">
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
        </div>
        <!-- Dados de Moradia -->
        <div class="form-section" :class="{ 'expanded': secoesExpandidas.dadosMoradia }">
          <div class="section-header" @click="toggleSecao('dadosMoradia')">
            <h2>Dados de Moradia</h2>
            <div class="icone-expandir" :class="{ 'expanded': secoesExpandidas.dadosMoradia }"></div>
          </div>
          <div class="section-content">
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
import { reactive, watch, ref } from "vue";
import Lesao from "@/components/saude/Lesao.vue";
import api from "@/services/api";

defineOptions({
  name: 'HospedeFormularioModal'
});

const props = defineProps({
  show: Boolean,
  hospede: Object,
  isEdit: Boolean,
});

defineEmits(["salvar", "fechar"]);

const possuiPlano = ref('');
const possuiLesao = ref('');

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
  responsavel_financeiro: true,
  coresponsavel_nome: '',
  coresponsavel_parentesco: '',
  coresponsavel_contato: '',
  coresponsavel_email: '',
  coresponsavel_profissao: '',
  coresponsavel_endereco: '',
  coresponsavel_financeiro: false,
  estilo_vida: '',
  expectativas_familiares: '',
  observacoes: '',
  procedencia: '',
  data_admissao: '',
  modalidade_moradia: '',
  unidade: 'Matriz',
  dispositivo_oxigenio: false,
  dispositivo_sonda: false,
  dispositivo_gtt: false,
  usa_fralda: false,
  lesao: ''
});

const secoesExpandidas = reactive({
  dadosPessoais: true,
  dadosProfissionais: false,
  dadosSaude: false,
  dadosResponsavel: false,
  dadosAdicionais: false,
  dadosAdmissao: false,
  dadosMoradia: false
});

const lesoesTemp = ref([]);

function toggleSecao(secao) {
  secoesExpandidas[secao] = !secoesExpandidas[secao];
}

const handleLesaoCadastrada = (lesao) => {
  lesoesTemp.value.push(lesao);
};

watch(
  () => props.hospede,
  (novo) => {
    if (novo) {
      Object.assign(localHospede, novo);
      // Define o valor inicial do possuiPlano baseado nos dados existentes
      possuiPlano.value = novo.planodesaude ? 'true' : 'false';
      // Define o valor inicial do possuiLesao baseado nos dados existentes
      possuiLesao.value = novo.lesao ? 'true' : 'false';
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
        localHospede.dispositivos = novo.dispositivos;
      }
    } else {
      // Limpa o formulário
      Object.keys(localHospede).forEach(key => {
        localHospede[key] = '';
      });
      localHospede.unidade = 'Matriz';
      localHospede.dispositivos = '';
      possuiPlano.value = '';
      possuiLesao.value = '';
      lesoesTemp.value = [];
    }
  },
  { immediate: true }
);

// Watch para limpar os campos de plano de saúde quando a resposta for "Não"
watch(possuiPlano, (novoValor) => {
  if (novoValor === 'false') {
    localHospede.planodesaude = '';
    localHospede.carteiradoplano = '';
  }
});

// Watch para limpar o campo de lesão quando a resposta for "Não"
watch(possuiLesao, (novoValor) => {
  if (novoValor === 'false') {
    localHospede.lesao = '';
  }
});

// Watch para o campo sexo
watch(
  () => localHospede.sexo,
  (novoValor) => {
    console.log('Valor do sexo atualizado:', novoValor);
  }
);

const handleSubmit = async () => {
  try {
    // Se for um novo hóspede, primeiro salvamos para obter o ID
    if (!props.isEdit) {
      const response = await api.post('/hospede/criar', localHospede);
      localHospede.id = response.data.id;
      
      // Após salvar o hóspede, cadastramos as lesões temporárias
      if (lesoesTemp.value.length > 0) {
        for (const lesao of lesoesTemp.value) {
          await api.post('/lesao/criar', {
            ...lesao,
            pessoa_id: localHospede.id
          });
        }
      }
    } else {
      await api.put(`/hospede/atualizar/${localHospede.id}`, localHospede);
      
      // Se for edição, também cadastramos as lesões temporárias
      if (lesoesTemp.value.length > 0) {
        for (const lesao of lesoesTemp.value) {
          await api.post('/lesao/criar', {
            ...lesao,
            pessoa_id: localHospede.id
          });
        }
      }
    }
    
    // Limpa as lesões temporárias
    lesoesTemp.value = [];
    
    // Emite o evento de salvar com os dados atualizados
    emit('salvar', localHospede);
  } catch (error) {
    console.error('Erro ao salvar hóspede:', error);
    // Aqui você pode adicionar uma lógica para mostrar mensagem de erro
  }
};

// Watch para limpar as lesões temporárias quando o modal for fechado
watch(() => props.show, (novoValor) => {
  if (!novoValor) {
    lesoesTemp.value = [];
  }
});
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

.form-section {
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  margin-bottom: var(--margem);
  overflow: hidden;
}

.section-header {
  padding: var(--margem);
  background: var(--cor-bg);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--cor-separador);
}

.form-section.expanded .section-header {
  border-bottom: none;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--cor-fonte);
}

.icone-expandir {
  width: 24px;
  height: 24px;
  position: relative;
  transition: transform 0.3s ease;
}

.icone-expandir:before,
.icone-expandir:after {
  content: '';
  position: absolute;
  background-color: var(--cor-fonte);
  transition: transform 0.3s ease;
}

.icone-expandir:before {
  width: 2px;
  height: 12px;
  top: 6px;
  left: 11px;
}

.icone-expandir:after {
  width: 12px;
  height: 2px;
  top: 11px;
  left: 6px;
}

.icone-expandir.expanded:before {
  transform: rotate(90deg);
}

.section-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  padding: 0 var(--margem);
}

.form-section.expanded .section-content {
  max-height: 2000px;
  transition: max-height 0.5s ease-in;
  padding: var(--margem);
}

.form-section {
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  margin-bottom: var(--margem);
  overflow: hidden;
}

.section-header {
  padding: var(--margem);
  background: var(--cor-bg);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--cor-separador);
}

.form-section.expanded .section-header {
  border-bottom: none;
}

.form-columns {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--margem);
  padding: 0;
}

.form-group {
  margin-bottom: var(--margem);
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-section.expanded {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background: var(--cor-bg);
}

.responsaveis-list {
  display: flex;
  flex-direction: column;
  gap: var(--margem);
}

.responsavel-item {
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  padding: var(--margem);
  background: var(--cor-bg);
}

.responsavel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--margem);
}

.responsavel-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--cor-fonte);
}

.btn-remover {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--cor-erro);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.btn-remover:hover {
  background: var(--cor-erro-fraca);
}

.btn-adicionar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: var(--cor-primaria-fraca);
  border: 1px dashed var(--cor-primaria);
  border-radius: var(--raio);
  color: var(--cor-primaria);
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.btn-adicionar:hover {
  background: var(--cor-primaria);
  color: white;
}

.btn-adicionar .icone-novo {
  width: 20px;
  height: 20px;
  background-size: contain;
}

.dispositivos-checkbox {
  display: flex;
  gap: var(--margem);
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border: 1px solid var(--cor-separador);
  border-radius: var(--raio);
  transition: all 0.2s;
}

.checkbox-label:hover {
  background: var(--cor-primaria-fraca);
  border-color: var(--cor-primaria);
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}
</style>
