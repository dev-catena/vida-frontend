<template>
  <div class="lesao">
    <div class="header">
      <h2>Lesões</h2>
      <button class="btn-novo" @click="abrirNovoRegistro">
        Nova Lesão
      </button>
    </div>

    <div class="content">
      <div class="tabela">
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Local</th>
              <th>Tipo</th>
              <th>Estágio</th>
              <th>Fase</th>
              <th>Dor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in registros" :key="registro.id">
              <td>{{ formatDateTime(registro.data_hora) }}</td>
              <td>{{ getMarcacoesText(registro.local) }}</td>
              <td>{{ registro.tipo || 'Não Consta' }}</td>
              <td>{{ registro.estagio || 'Não Consta' }}</td>
              <td>{{ registro.fase || 'Não Consta' }}</td>
              <td>{{ registro.dor || 'Não Consta' }}</td>
              <td>
                <button class="btn-visualizar" @click="visualizarLesao(registro)">
                  Visualizar
                </button>
              </td>
            </tr>
            <tr v-if="registros.length === 0">
              <td colspan="7" class="no-records">
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
        <h2>Nova Lesão</h2>
        <form @submit.prevent="salvarRegistro" class="form-container">
          <div class="body-picker-container">
            <div class="body-image" @click="handleBodyClick">
              <img 
                :src="frontImage" 
                alt="Corpo humano"
                ref="bodyImage"
              />
              <div 
                v-for="(mark, index) in selectedMarks" 
                :key="index"
                class="mark"
                :style="{
                  left: mark.x + '%',
                  top: mark.y + '%',
                  backgroundColor: mark.color
                }"
                @click.stop="removeMark(index)"
              ></div>
            </div>
            <div class="mark-controls" v-if="selectedMarks.length > 0">
              <button type="button" class="btn-limpar" @click="limparMarcacoes">
                Limpar Marcações
              </button>
            </div>
          </div>

          <div class="form-content">
            <div class="form-row">
              <div class="form-group">
                <label>Local</label>
                <input type="text" v-model="form.local" required />
              </div>

              <div class="form-group">
                <label>Tipo</label>
                <select v-model="form.tipo" required>
                  <option value="">Selecione...</option>
                  <option value="Úlcera por pressão">Úlcera por pressão</option>
                  <option value="Lesão por Umidade">Lesão por Umidade</option>
                  <option value="Lesão por Fricção">Lesão por Fricção</option>
                  <option value="Lesão por Cisalhamento">Lesão por Cisalhamento</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Largura (cm)</label>
                <input type="number" step="0.1" v-model="form.largura" required />
              </div>

              <div class="form-group">
                <label>Comprimento (cm)</label>
                <input type="number" step="0.1" v-model="form.comprimento" required />
              </div>

              <div class="form-group">
                <label>Profundidade (cm)</label>
                <input type="number" step="0.1" v-model="form.profundidade" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Estágio</label>
                <select v-model="form.estagio" required>
                  <option value="">Selecione...</option>
                  <option value="Estágio I">Estágio I</option>
                  <option value="Estágio II">Estágio II</option>
                  <option value="Estágio III">Estágio III</option>
                  <option value="Estágio IV">Estágio IV</option>
                  <option value="Tecido Desvitalizado">Tecido Desvitalizado</option>
                  <option value="Lesão Profunda">Lesão Profunda</option>
                </select>
              </div>

              <div class="form-group">
                <label>Fase</label>
                <select v-model="form.fase" required>
                  <option value="">Selecione...</option>
                  <option value="Inflamatória">Inflamatória</option>
                  <option value="Proliferativa">Proliferativa</option>
                  <option value="Remodelagem">Remodelagem</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Dor</label>
                <select v-model="form.dor" required>
                  <option value="">Selecione...</option>
                  <option value="Ausente">Ausente</option>
                  <option value="Leve">Leve</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Intensa">Intensa</option>
                </select>
              </div>

              <div class="form-group">
                <label>Contaminação</label>
                <select v-model="form.contaminacao" required>
                  <option value="">Selecione...</option>
                  <option value="Colonizada">Colonizada</option>
                  <option value="Infecção Local">Infecção Local</option>
                  <option value="Infecção Sistêmica">Infecção Sistêmica</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Cor da Lesão</label>
                <select v-model="form.cor_lesao" required>
                  <option value="">Selecione...</option>
                  <option value="Vermelha">Vermelha</option>
                  <option value="Amarela">Amarela</option>
                  <option value="Preta">Preta</option>
                  <option value="Mista">Mista</option>
                </select>
              </div>

              <div class="form-group">
                <label>Aparência</label>
                <select v-model="form.aparencia" required>
                  <option value="">Selecione...</option>
                  <option value="Tecido de granulação">Tecido de granulação</option>
                  <option value="Tecido necrótico">Tecido necrótico</option>
                  <option value="Tecido epitelial">Tecido epitelial</option>
                  <option value="Tecido fibrótico">Tecido fibrótico</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Tipo de Exsudato</label>
                <select v-model="form.tipo_exsudato" required>
                  <option value="">Selecione...</option>
                  <option value="Seroso">Seroso</option>
                  <option value="Sanguinolento">Sanguinolento</option>
                  <option value="Purulento">Purulento</option>
                  <option value="Misto">Misto</option>
                </select>
              </div>

              <div class="form-group">
                <label>Quantidade de Exsudato</label>
                <select v-model="form.qtd_exsudato" required>
                  <option value="">Selecione...</option>
                  <option value="Ausente">Ausente</option>
                  <option value="Leve">Leve</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Intensa">Intensa</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Cor da Secreção</label>
              <select v-model="form.cor_secrecao" required>
                <option value="">Selecione...</option>
                <option value="Transparente">Transparente</option>
                <option value="Amarelada">Amarelada</option>
                <option value="Esverdeada">Esverdeada</option>
                <option value="Avermelhada">Avermelhada</option>
              </select>
            </div>

            <div class="form-group">
              <label>Anotações</label>
              <textarea v-model="form.anotacoes" rows="3"></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancelar" @click="fecharModal">Cancelar</button>
              <button type="submit" class="btn-salvar">Salvar</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Visualização -->
    <div v-if="showViewModal" class="modal">
      <div class="modal-content">
        <h2>Detalhes da Lesão</h2>
        <div class="view-container">
          <div class="body-image" v-if="selectedLesao?.imagem_base64">
            <img 
              :src="frontImage" 
              alt="Corpo humano"
              class="lesao-image"
            />
            <div 
              v-for="(mark, index) in selectedMarks" 
              :key="index"
              class="mark"
              :style="{
                left: mark.x + '%',
                top: mark.y + '%',
                backgroundColor: mark.color
              }"
            ></div>
          </div>
          <div class="lesao-details">
            <div class="detail-row">
              <span class="label">Data/Hora:</span>
              <span>{{ formatDateTime(selectedLesao?.data_hora) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Local:</span>
              <span>{{ selectedLesao?.local }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Tipo:</span>
              <span>{{ selectedLesao?.tipo }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Dimensões:</span>
              <span>{{ selectedLesao?.largura }} x {{ selectedLesao?.comprimento }} x {{ selectedLesao?.profundidade }} cm</span>
            </div>
            <div class="detail-row">
              <span class="label">Estágio:</span>
              <span>{{ selectedLesao?.estagio }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Fase:</span>
              <span>{{ selectedLesao?.fase }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Dor:</span>
              <span>{{ selectedLesao?.dor }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Contaminação:</span>
              <span>{{ selectedLesao?.contaminacao }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Cor da Lesão:</span>
              <span>{{ selectedLesao?.cor_lesao }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Aparência:</span>
              <span>{{ selectedLesao?.aparencia }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Tipo de Exsudato:</span>
              <span>{{ selectedLesao?.tipo_exsudato }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Quantidade de Exsudato:</span>
              <span>{{ selectedLesao?.qtd_exsudato }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Cor da Secreção:</span>
              <span>{{ selectedLesao?.cor_secrecao }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Anotações:</span>
              <span>{{ selectedLesao?.anotacoes }}</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-fechar" @click="fecharViewModal">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import frontImage from '@/assets/body-front.svg';

const props = defineProps({
  pessoaId: {
    type: [String, Number],
    required: true
  }
});

const authStore = useAuthStore();
const registros = ref([]);
const showModal = ref(false);
const showViewModal = ref(false);
const selectedLesao = ref(null);
const selectedMarks = ref([]);
const bodyImage = ref(null);

const form = ref({
  local: '',
  tipo: '',
  largura: '',
  comprimento: '',
  profundidade: '',
  estagio: '',
  fase: '',
  dor: '',
  contaminacao: '',
  cor_lesao: '',
  aparencia: '',
  tipo_exsudato: '',
  qtd_exsudato: '',
  cor_secrecao: '',
  anotacoes: '',
  imagem_base64: '',
  responsavel: authStore.user?.nome || ''
});

const formatDateTime = (date) => {
  if (!date) return '';
  const data = new Date(date);
  const hora = String(data.getHours()).padStart(2, '0');
  const minutos = String(data.getMinutes()).padStart(2, '0');
  return `${data.toLocaleDateString('pt-BR')} ${hora}:${minutos}`;
};

const carregarRegistros = async () => {
  try {
    console.log('Iniciando carregamento de lesões para pessoa_id:', props.pessoaId);
    
    // Verificar se pessoaId está definido
    if (!props.pessoaId) {
      console.error('pessoaId não está definido');
      return;
    }

    // Verificar se o token está presente
    if (!authStore.token) {
      console.error('Token de autenticação não está presente');
      return;
    }

    const response = await api.get('/lesao/listar', {
      params: {
        pessoa_id: props.pessoaId
      },
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });

    console.log('Resposta completa da API:', response);
    console.log('Dados recebidos:', response.data);

    if (response.data && Array.isArray(response.data)) {
      registros.value = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      registros.value = response.data.data;
    } else {
      console.warn('Formato de resposta inesperado:', response.data);
      registros.value = [];
    }

    console.log('Registros carregados:', registros.value);
  } catch (error) {
    console.error('Erro ao carregar registros:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    registros.value = [];
  }
};

const handleBodyClick = (event) => {
  const rect = bodyImage.value.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  
  selectedMarks.value.push({
    x,
    y,
    color: getColorForType(form.value.tipo)
  });

  updateLocalField();
};

const removeMark = (index) => {
  selectedMarks.value.splice(index, 1);
  updateLocalField();
};

const getColorForType = (tipo) => {
  const colors = {
    'Úlcera por pressão': '#ff0000',
    'Lesão por Umidade': '#00ff00',
    'Lesão por Fricção': '#0000ff',
    'Lesão por Cisalhamento': '#ffff00',
    'Outro': '#ff00ff'
  };
  return colors[tipo] || '#ff0000';
};

const updateLocalField = () => {
  const marks = selectedMarks.value.map(mark => ({
    x: mark.x,
    y: mark.y
  }));
  form.value.local = marks.length > 0 ? 
    `${marks.length} marcação${marks.length !== 1 ? 'ões' : ''} no corpo` : '';
  form.value.marcas = JSON.stringify(marks);
};

const limparMarcacoes = () => {
  selectedMarks.value = [];
  updateLocalField();
};

const abrirNovoRegistro = () => {
  form.value = {
    local: '',
    tipo: '',
    largura: '',
    comprimento: '',
    profundidade: '',
    estagio: '',
    fase: '',
    dor: '',
    contaminacao: '',
    cor_lesao: '',
    aparencia: '',
    tipo_exsudato: '',
    qtd_exsudato: '',
    cor_secrecao: '',
    anotacoes: '',
    imagem_base64: '',
    responsavel: authStore.user?.nome || ''
  };
  selectedMarks.value = [];
  showModal.value = true;
};

const fecharModal = () => {
  showModal.value = false;
  form.value = {
    local: '',
    tipo: '',
    largura: '',
    comprimento: '',
    profundidade: '',
    estagio: '',
    fase: '',
    dor: '',
    contaminacao: '',
    cor_lesao: '',
    aparencia: '',
    tipo_exsudato: '',
    qtd_exsudato: '',
    cor_secrecao: '',
    anotacoes: '',
    imagem_base64: '',
    responsavel: authStore.user?.nome || ''
  };
  selectedMarks.value = [];
};

const visualizarLesao = (lesao) => {
  selectedLesao.value = lesao;
  selectedMarks.value = []; // Limpar marcações anteriores

  // Tentar carregar as marcações do campo local
  if (lesao.local) {
    try {
      const marcas = typeof lesao.local === 'string' ? JSON.parse(lesao.local) : lesao.local;
      
      if (Array.isArray(marcas)) {
        selectedMarks.value = marcas.map(marca => ({
          x: marca.x,
          y: marca.y,
          color: getColorForType(lesao.tipo)
        }));
        console.log('Marcações carregadas:', selectedMarks.value);
      } else {
        console.warn('Formato de marcações inválido:', marcas);
      }
    } catch (error) {
      console.error('Erro ao carregar marcações:', error);
      selectedMarks.value = [];
    }
  }
  showViewModal.value = true;
};

const fecharViewModal = () => {
  showViewModal.value = false;
  selectedLesao.value = null;
};

const salvarRegistro = async () => {
  try {
    console.log('Iniciando salvamento de lesão');
    
    if (!props.pessoaId) {
      console.error('pessoaId não está definido');
      return;
    }

    // Converter apenas as marcações para base64
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Desenhar apenas as marcações
      selectedMarks.value.forEach(mark => {
        ctx.beginPath();
        ctx.arc(
          (mark.x / 100) * canvas.width,
          (mark.y / 100) * canvas.height,
          6,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = mark.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      const imagem_base64 = canvas.toDataURL('image/png');

      // Preparar as marcações para salvar
      const marcas = selectedMarks.value.map(mark => ({
        x: mark.x,
        y: mark.y
      }));

      const dados = {
        ...form.value,
        pessoa_id: props.pessoaId,
        usuario_id: authStore.user?.id,
        empresa_id: authStore.user?.empresa_id,
        data_hora: new Date().toISOString(),
        imagem_base64,
        local: JSON.stringify(marcas)
      };

      console.log('Dados a serem enviados:', dados);

      const response = await api.post('/lesao/cadastrar', dados, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });

      console.log('Resposta do cadastro:', response.data);

      if (response.data) {
        await carregarRegistros();
        fecharModal();
      } else {
        console.error('Resposta do cadastro não contém dados');
      }
    };

    img.src = frontImage;
  } catch (error) {
    console.error('Erro ao salvar registro:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
};

const getMarcacoesText = (local) => {
  if (!local) return 'Não Consta';
  try {
    const marcas = JSON.parse(local);
    if (Array.isArray(marcas)) {
      return `${marcas.length} marcação${marcas.length !== 1 ? 'ões' : ''} no corpo`;
    }
  } catch (error) {
    console.warn('Erro ao parsear marcações:', error);
  }
  return 'Não Consta';
};

// Observar mudanças no ID da pessoa
watch(() => props.pessoaId, (newId) => {
  console.log('pessoaId alterado:', newId);
  if (newId) {
    carregarRegistros();
  }
});

// Carregar registros quando o componente for montado
onMounted(() => {
  console.log('Componente montado, pessoaId:', props.pessoaId);
  if (props.pessoaId) {
    carregarRegistros();
  }
});
</script>

<style scoped>
.lesao {
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
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-container {
  display: flex;
  gap: var(--margem);
  align-items: flex-start;
}

.body-picker-container {
  flex: 0 0 400px;
  position: sticky;
  top: 0;
  padding: var(--margem);
  background: var(--cor-fundo);
  border-radius: var(--raio);
  margin-right: var(--margem);
}

.form-content {
  flex: 1;
  min-width: 0;
}

.form-row {
  display: flex;
  gap: var(--margem);
  margin-bottom: var(--margem);
}

.form-row .form-group {
  flex: 1;
}

.body-image {
  position: relative;
  width: 100%;
  margin-bottom: var(--margem);
  background: white;
  padding: var(--margem);
  border-radius: var(--raio);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.body-image img {
  width: 100%;
  height: auto;
  display: block;
}

.mark {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.mark:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.mark:hover::after {
  content: '×';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.mark-controls {
  text-align: center;
  margin-top: var(--margem);
  padding: var(--margem);
  background: white;
  border-radius: var(--raio);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-limpar {
  min-width: 180px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
}

.view-container {
  display: flex;
  gap: var(--margem);
  align-items: flex-start;
}

.body-image {
  flex: 0 0 400px;
  background: white;
  padding: var(--margem);
  border-radius: var(--raio);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.lesao-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--raio);
}

.lesao-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: white;
  padding: var(--margem);
  border-radius: var(--raio);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detail-row {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid var(--cor-separador);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-weight: 500;
  min-width: 180px;
  color: var(--cor-fonte-fraca);
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

.btn-fechar {
  background: var(--cor-fonte-fraca);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--raio);
  cursor: pointer;
}

.btn-fechar:hover {
  background: var(--cor-fonte);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--margem);
  margin-top: calc(var(--margem) * 2);
  padding-top: var(--margem);
  border-top: 1px solid var(--cor-separador);
}

.btn-cancelar,
.btn-salvar {
  min-width: 120px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .form-container {
    flex-direction: column;
  }

  .body-picker-container {
    flex: none;
    width: 100%;
    margin-right: 0;
    margin-bottom: var(--margem);
  }

  .form-content {
    width: 100%;
  }

  .view-container {
    flex-direction: column;
  }

  .body-image {
    width: 100%;
    margin-bottom: var(--margem);
  }
}
</style> 