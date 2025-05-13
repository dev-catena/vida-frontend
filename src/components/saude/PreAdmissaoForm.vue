<template>
  <div class="pre-admissao-form">
    <form @submit.prevent="salvarPreAdmissao">
      <div class="form-section">
        <h3>Dados Pessoais</h3>
        <div class="grid-2">
          <div class="form-group">
            <label for="nome">Nome*</label>
            <input id="nome" v-model="form.nome" type="text" required>
          </div>
          <div class="form-group">
            <label for="cpf">CPF*</label>
            <input id="cpf" v-model="form.CPF" type="text" v-mask="'###.###.###-##'" required>
          </div>
          <div class="form-group">
            <label for="data_nascimento">Data de Nascimento*</label>
            <input id="data_nascimento" v-model="form.data_nascimento" type="date" required>
          </div>
          <div class="form-group">
            <label for="sexo">Gênero*</label>
            <select id="sexo" v-model="form.sexo" required>
              <option value="">Selecione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label for="telefone">Telefone</label>
            <input id="telefone" v-model="form.telefone" type="text" v-mask="'(##) #####-####'">
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input id="email" v-model="form.email" type="email">
          </div>
          <div class="form-group">
            <label for="pessoa_tipo_id">Tipo de Pessoa*</label>
            <select id="pessoa_tipo_id" v-model="form.pessoa_tipo_id" required>
              <option value="">Selecione...</option>
              <option v-for="tipo in pessoaTipos" :key="tipo.id" :value="tipo.id">
                {{ tipo.nome }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="mobilidade_classe_id">Classe de Mobilidade*</label>
            <select id="mobilidade_classe_id" v-model="form.mobilidade_classe_id" required>
              <option value="">Selecione...</option>
              <option v-for="classe in mobilidadeClasses" :key="classe.id" :value="classe.id">
                {{ classe.nome }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Dados de Moradia</h3>
        <div class="grid-2">
          <div class="form-group">
            <label for="modalidade_moradia">Modalidade de Moradia</label>
            <select id="modalidade_moradia" v-model="form.modalidade_moradia">
              <option value="">Selecione...</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div class="form-group">
            <label for="unidade">Unidade</label>
            <input id="unidade" v-model="form.unidade" type="text">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Dados Profissionais</h3>
        <div class="grid-2">
          <div class="form-group">
            <label for="profissao">Profissão</label>
            <input id="profissao" v-model="form.profissao" type="text">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Dados do Responsável</h3>
        <div class="grid-2">
          <div class="form-group">
            <label for="familiar_responsavel">Familiar Responsável</label>
            <input id="familiar_responsavel" v-model="form.familiar_responsavel" type="text">
          </div>
          <div class="form-group">
            <label for="telefone_responsavel">Telefone do Responsável</label>
            <input id="telefone_responsavel" v-model="form.telefone_responsavel" type="text" v-mask="'(##) #####-####'">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Dados de Admissão</h3>
        <div class="grid-2">
          <div class="form-group">
            <label for="procedencia">Procedência</label>
            <input id="procedencia" v-model="form.procedencia" type="text">
          </div>
          <div class="form-group">
            <label for="data_admissao">Data de Admissão</label>
            <input id="data_admissao" v-model="form.data_admissao" type="date">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Dados de Saúde</h3>
        <div class="grid-2">
          <div class="form-group full-width">
            <label for="quadro_clinico">Quadro Clínico</label>
            <textarea id="quadro_clinico" v-model="form.quadro_clinico" rows="3"></textarea>
          </div>
          <div class="form-group full-width">
            <label for="alergias">Alergias</label>
            <textarea id="alergias" v-model="form.alergias" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="medico_assistente">Médico Assistente</label>
            <input id="medico_assistente" v-model="form.medico_assistente" type="text">
          </div>
          <div class="form-group">
            <label for="plano_saude">Plano de Saúde</label>
            <input id="plano_saude" v-model="form.plano_saude" type="text">
          </div>
          <div class="form-group">
            <label for="uso_oxigenio">Usa Oxigênio?</label>
            <select id="uso_oxigenio" v-model="form.uso_oxigenio">
              <option value="0">Não</option>
              <option value="1">Sim</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Condições de Saúde</h3>
        <div class="grid-2">
          <div class="form-group full-width">
            <label>Selecione as Condições de Saúde</label>
            <div class="checkbox-group">
              <div v-for="condicao in condicoesSaude" :key="condicao.id" class="checkbox-item">
                <input
                  type="checkbox"
                  :id="'condicao_' + condicao.id"
                  :value="condicao.id"
                  v-model="form.condicoes_saude"
                >
                <label :for="'condicao_' + condicao.id">{{ condicao.nome }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Tecnologias de Monitoramento</h3>
        <div class="grid-2">
          <div class="form-group full-width">
            <label>Selecione as Tecnologias</label>
            <div class="checkbox-group">
              <div v-for="tecnologia in tecnologiasMonitoramento" :key="tecnologia.id" class="checkbox-item">
                <input
                  type="checkbox"
                  :id="'tecnologia_' + tecnologia.id"
                  :value="tecnologia.id"
                  v-model="form.tecnologias_monitoramento"
                >
                <label :for="'tecnologia_' + tecnologia.id">{{ tecnologia.nome }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Dados de Alimentação</h3>
        <div class="grid-2">
          <div class="form-group">
            <label for="tipo_alimentacao">Tipo de Alimentação</label>
            <select id="tipo_alimentacao" v-model="form.tipo_alimentacao">
              <option value="">Selecione...</option>
              <option value="Normal">Normal</option>
              <option value="Pastosa">Pastosa</option>
              <option value="Líquida">Líquida</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div class="form-group full-width">
            <label for="restricoes_alimentares">Restrições Alimentares</label>
            <textarea id="restricoes_alimentares" v-model="form.restricoes_alimentares" rows="3"></textarea>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Outros Dados</h3>
        <div class="grid-2">
          <div class="form-group full-width">
            <label for="lesoes_pele">Lesões de Pele</label>
            <textarea id="lesoes_pele" v-model="form.lesoes_pele" rows="3"></textarea>
          </div>
          <div class="form-group full-width">
            <label for="uso_medicamentos">Uso de Medicamentos</label>
            <textarea id="uso_medicamentos" v-model="form.uso_medicamentos" rows="3"></textarea>
          </div>
          <div class="form-group full-width">
            <label for="expectativas_familiares">Expectativas da Família</label>
            <textarea id="expectativas_familiares" v-model="form.expectativas_familiares" rows="3"></textarea>
          </div>
          <div class="form-group full-width">
            <label for="observacao">Observações</label>
            <textarea id="observacao" v-model="form.observacao" rows="3"></textarea>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancelar" @click="$emit('cancel')">Cancelar</button>
        <button type="submit" class="btn-salvar">Salvar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['cancel', 'saved']);
const authStore = useAuthStore();

const pessoaTipos = ref([]);
const mobilidadeClasses = ref([]);
const condicoesSaude = ref([]);
const tecnologiasMonitoramento = ref([]);

const form = ref({
  nome: '',
  CPF: '',
  data_nascimento: '',
  sexo: '',
  telefone: '',
  email: '',
  modalidade_moradia: '',
  unidade: '',
  profissao: '',
  familiar_responsavel: '',
  telefone_responsavel: '',
  procedencia: '',
  data_admissao: '',
  quadro_clinico: '',
  alergias: '',
  medico_assistente: '',
  expectativas_familiares: '',
  plano_saude: '',
  uso_oxigenio: false,
  tipo_alimentacao: '',
  restricoes_alimentares: '',
  lesoes_pele: '',
  uso_medicamentos: '',
  observacao: '',
  pessoa_tipo_id: null,
  mobilidade_classe_id: null,
  condicoes_saude: [],
  tecnologias_monitoramento: [],
  status: true,
  admitido: false
});

const carregarDadosIniciais = async () => {
  try {
    const [tiposResponse, classesResponse, condicoesResponse, tecnologiasResponse] = await Promise.all([
      api.get('/pessoa-tipos'),
      api.get('/mobilidade-classes'),
      api.get('/condicao-saude'),
      api.get('/tecnologia-monitoramento')
    ]);

    pessoaTipos.value = tiposResponse.data;
    mobilidadeClasses.value = classesResponse.data;
    condicoesSaude.value = condicoesResponse.data;
    tecnologiasMonitoramento.value = tecnologiasResponse.data;
  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error);
  }
};

const salvarPreAdmissao = async () => {
  try {
    const response = await api.post('/pessoas', form.value, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
    emit('saved', response.data);
  } catch (error) {
    console.error('Erro ao salvar pré-admissão:', error);
  }
};

onMounted(() => {
  carregarDadosIniciais();
});
</script>

<style scoped>
.pre-admissao-form {
  padding: 20px;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.form-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-item input[type="checkbox"] {
  width: auto;
}

.checkbox-item label {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancelar,
.btn-salvar {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-cancelar {
  background: #6c757d;
  color: white;
}

.btn-salvar {
  background: #28a745;
  color: white;
}

.btn-cancelar:hover {
  background: #5a6268;
}

.btn-salvar:hover {
  background: #218838;
}
</style> 