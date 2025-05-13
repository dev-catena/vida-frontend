<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 mb-4">Ocorrências</v-card-title>

    <v-form @submit.prevent="salvarOcorrencia" class="mb-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="novaOcorrencia.dataOcorrencia"
            label="Data da Ocorrência"
            type="datetime-local"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="novaOcorrencia.tipo"
            :items="tiposOcorrencia"
            label="Tipo de Ocorrência"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="novaOcorrencia.descricao"
            label="Descrição"
            rows="3"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="novaOcorrencia.conduta"
            label="Conduta Adotada"
            rows="3"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="novaOcorrencia.profissional"
            label="Profissional Responsável"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-file-input
            v-model="novaOcorrencia.anexos"
            label="Anexos"
            accept=".pdf,.jpg,.jpeg,.png"
            prepend-icon="mdi-file-upload"
            show-size
            multiple
            chips
          />
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" type="submit">Registrar Ocorrência</v-btn>
      </v-card-actions>
    </v-form>

    <v-divider class="mb-4" />

    <v-timeline density="compact" align="start">
      <v-timeline-item
        v-for="ocorrencia in ocorrencias"
        :key="ocorrencia.id"
        :dot-color="getCorOcorrencia(ocorrencia.tipo)"
        size="small"
      >
        <template v-slot:opposite>
          {{ formatarData(ocorrencia.dataOcorrencia) }}
        </template>
        <v-card class="mb-2">
          <v-card-title class="text-subtitle-1">
            {{ ocorrencia.tipo }}
          </v-card-title>
          <v-card-text>
            <div class="mb-2">
              <strong>Descrição:</strong>
              <div>{{ ocorrencia.descricao }}</div>
            </div>
            <div class="mb-2">
              <strong>Conduta:</strong>
              <div>{{ ocorrencia.conduta }}</div>
            </div>
            <div class="mb-2">
              <strong>Profissional:</strong>
              <div>{{ ocorrencia.profissional }}</div>
            </div>
            <div v-if="ocorrencia.anexos?.length" class="mt-2">
              <strong>Anexos:</strong>
              <div class="d-flex flex-wrap gap-2 mt-1">
                <v-btn
                  v-for="(anexo, index) in ocorrencia.anexos"
                  :key="index"
                  :href="anexo.url"
                  target="_blank"
                  size="small"
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-file"
                >
                  Anexo {{ index + 1 }}
                </v-btn>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              variant="text"
              @click="excluirOcorrencia(ocorrencia.id)"
            >
              Excluir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { toast } from 'vue3-toastify'

const props = defineProps({
  hospedeId: {
    type: [Number, String],
    required: true
  }
})

const ocorrencias = ref([])
const novaOcorrencia = ref({
  dataOcorrencia: '',
  tipo: '',
  descricao: '',
  conduta: '',
  profissional: '',
  anexos: []
})

const tiposOcorrencia = [
  'Queda',
  'Medicação',
  'Alimentação',
  'Higiene',
  'Comportamento',
  'Outro'
]

function getCorOcorrencia(tipo) {
  const cores = {
    'Queda': 'red',
    'Medicação': 'orange',
    'Alimentação': 'green',
    'Higiene': 'blue',
    'Comportamento': 'purple',
    'Outro': 'grey'
  }
  return cores[tipo] || 'grey'
}

async function carregarOcorrencias() {
  try {
    const { data } = await api.get(`/hospedes/${props.hospedeId}/ocorrencias`)
    ocorrencias.value = data
  } catch (error) {
    toast.error('Erro ao carregar ocorrências')
  }
}

async function salvarOcorrencia() {
  try {
    const formData = new FormData()
    Object.keys(novaOcorrencia.value).forEach(key => {
      if (key === 'anexos') {
        novaOcorrencia.value[key].forEach(anexo => {
          formData.append('anexos[]', anexo)
        })
      } else {
        formData.append(key, novaOcorrencia.value[key])
      }
    })

    await api.post(`/hospedes/${props.hospedeId}/ocorrencias`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    Object.keys(novaOcorrencia.value).forEach(key => {
      novaOcorrencia.value[key] = key === 'anexos' ? [] : ''
    })

    await carregarOcorrencias()
    toast.success('Ocorrência registrada com sucesso')
  } catch (error) {
    if (error.response?.status === 422) {
      const mensagens = Object.values(error.response.data.errors).flat()
      mensagens.forEach((msg) => toast.error(msg))
    } else {
      toast.error('Erro ao registrar ocorrência')
    }
  }
}

async function excluirOcorrencia(id) {
  try {
    await api.delete(`/hospedes/${props.hospedeId}/ocorrencias/${id}`)
    await carregarOcorrencias()
    toast.success('Ocorrência excluída com sucesso')
  } catch (error) {
    toast.error('Erro ao excluir ocorrência')
  }
}

function formatarData(data) {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(carregarOcorrencias)
</script> 