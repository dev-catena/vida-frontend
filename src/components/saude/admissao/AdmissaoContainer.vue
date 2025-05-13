<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 mb-4">Admissão</v-card-title>

    <v-form @submit.prevent="salvarAdmissao" class="mb-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="admissao.dataAdmissao"
            label="Data de Admissão"
            type="date"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="admissao.procedencia"
            label="Procedência"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="admissao.acompanhante"
            label="Acompanhante"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="admissao.telefoneAcompanhante"
            label="Telefone do Acompanhante"
            v-mask="'(##) #####-####'"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="admissao.motivoAdmissao"
            label="Motivo da Admissão"
            rows="3"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="admissao.observacoes"
            label="Observações"
            rows="3"
          />
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="admissao.medicamentos"
            :items="medicamentos"
            label="Medicamentos em Uso"
            multiple
            chips
            closable-chips
          />
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="admissao.alergias"
            :items="alergias"
            label="Alergias"
            multiple
            chips
            closable-chips
          />
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="admissao.doencas"
            :items="doencas"
            label="Doenças Crônicas"
            multiple
            chips
            closable-chips
          />
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" type="submit">Salvar Admissão</v-btn>
      </v-card-actions>
    </v-form>

    <v-divider class="mb-4" />

    <v-card v-if="dadosAdmissao" class="mt-4">
      <v-card-title class="text-h6">Dados da Admissão</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <div class="text-subtitle-2">Data de Admissão:</div>
            <div>{{ formatarData(dadosAdmissao.dataAdmissao) }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-subtitle-2">Procedência:</div>
            <div>{{ dadosAdmissao.procedencia }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-subtitle-2">Acompanhante:</div>
            <div>{{ dadosAdmissao.acompanhante || '-' }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-subtitle-2">Telefone do Acompanhante:</div>
            <div>{{ dadosAdmissao.telefoneAcompanhante || '-' }}</div>
          </v-col>
          <v-col cols="12">
            <div class="text-subtitle-2">Motivo da Admissão:</div>
            <div>{{ dadosAdmissao.motivoAdmissao }}</div>
          </v-col>
          <v-col cols="12">
            <div class="text-subtitle-2">Observações:</div>
            <div>{{ dadosAdmissao.observacoes || '-' }}</div>
          </v-col>
          <v-col cols="12">
            <div class="text-subtitle-2">Medicamentos em Uso:</div>
            <v-chip
              v-for="medicamento in dadosAdmissao.medicamentos"
              :key="medicamento"
              class="ma-1"
              color="primary"
              variant="outlined"
            >
              {{ medicamento }}
            </v-chip>
          </v-col>
          <v-col cols="12">
            <div class="text-subtitle-2">Alergias:</div>
            <v-chip
              v-for="alergia in dadosAdmissao.alergias"
              :key="alergia"
              class="ma-1"
              color="error"
              variant="outlined"
            >
              {{ alergia }}
            </v-chip>
          </v-col>
          <v-col cols="12">
            <div class="text-subtitle-2">Doenças Crônicas:</div>
            <v-chip
              v-for="doenca in dadosAdmissao.doencas"
              :key="doenca"
              class="ma-1"
              color="warning"
              variant="outlined"
            >
              {{ doenca }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
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

const dadosAdmissao = ref(null)
const admissao = ref({
  dataAdmissao: '',
  procedencia: '',
  acompanhante: '',
  telefoneAcompanhante: '',
  motivoAdmissao: '',
  observacoes: '',
  medicamentos: [],
  alergias: [],
  doencas: []
})

const medicamentos = [
  'Anticoagulante',
  'Anti-hipertensivo',
  'Antidiabético',
  'Antidepressivo',
  'Ansiolítico',
  'Outro'
]

const alergias = [
  'Penicilina',
  'Sulfa',
  'Dipirona',
  'Iodo',
  'Outro'
]

const doencas = [
  'Hipertensão',
  'Diabetes',
  'Cardiopatia',
  'Doença Pulmonar',
  'Doença Renal',
  'Outro'
]

async function carregarAdmissao() {
  try {
    const { data } = await api.get(`/hospedes/${props.hospedeId}/admissao`)
    dadosAdmissao.value = data
    if (data) {
      Object.keys(admissao.value).forEach(key => {
        admissao.value[key] = data[key]
      })
    }
  } catch (error) {
    toast.error('Erro ao carregar dados de admissão')
  }
}

async function salvarAdmissao() {
  try {
    await api.post(`/hospedes/${props.hospedeId}/admissao`, admissao.value)
    await carregarAdmissao()
    toast.success('Dados de admissão salvos com sucesso')
  } catch (error) {
    if (error.response?.status === 422) {
      const mensagens = Object.values(error.response.data.errors).flat()
      mensagens.forEach((msg) => toast.error(msg))
    } else {
      toast.error('Erro ao salvar dados de admissão')
    }
  }
}

function formatarData(data) {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(carregarAdmissao)
</script> 