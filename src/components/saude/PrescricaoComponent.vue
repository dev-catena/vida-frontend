<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 mb-4">Prescrições</v-card-title>

    <v-form @submit.prevent="salvarPrescricao" class="mb-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="novaPrescricao.medicamento"
            label="Medicamento"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="novaPrescricao.dosagem"
            label="Dosagem"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="novaPrescricao.frequencia"
            label="Frequência"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="novaPrescricao.duracao"
            label="Duração"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="novaPrescricao.observacoes"
            label="Observações"
            rows="2"
          />
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" type="submit">Registrar Prescrição</v-btn>
      </v-card-actions>
    </v-form>

    <v-divider class="mb-4" />

    <v-data-table
      :headers="headers"
      :items="prescricoes"
      :items-per-page="5"
      class="elevation-1"
    >
      <template #[`item.data`]="{ item }">
        {{ formatarData(item.data) }}
      </template>
      <template #[`item.acoes`]="{ item }">
        <v-btn
          icon="mdi-delete"
          variant="text"
          color="error"
          size="small"
          @click="excluirPrescricao(item.id)"
        />
      </template>
    </v-data-table>
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

const prescricoes = ref([])
const novaPrescricao = ref({
  medicamento: '',
  dosagem: '',
  frequencia: '',
  duracao: '',
  observacoes: ''
})

const headers = [
  { title: 'Data', key: 'data' },
  { title: 'Medicamento', key: 'medicamento' },
  { title: 'Dosagem', key: 'dosagem' },
  { title: 'Frequência', key: 'frequencia' },
  { title: 'Duração', key: 'duracao' },
  { title: 'Observações', key: 'observacoes' },
  { title: 'Ações', key: 'acoes', sortable: false }
]

async function carregarPrescricoes() {
  try {
    const { data } = await api.get(`/hospedes/${props.hospedeId}/prescricoes`)
    prescricoes.value = data
  } catch (error) {
    toast.error('Erro ao carregar prescrições')
  }
}

async function salvarPrescricao() {
  try {
    await api.post(`/hospedes/${props.hospedeId}/prescricoes`, novaPrescricao.value)
    Object.keys(novaPrescricao.value).forEach(key => {
      novaPrescricao.value[key] = ''
    })
    await carregarPrescricoes()
    toast.success('Prescrição registrada com sucesso')
  } catch (error) {
    if (error.response?.status === 422) {
      const mensagens = Object.values(error.response.data.errors).flat()
      mensagens.forEach((msg) => toast.error(msg))
    } else {
      toast.error('Erro ao registrar prescrição')
    }
  }
}

async function excluirPrescricao(id) {
  try {
    await api.delete(`/hospedes/${props.hospedeId}/prescricoes/${id}`)
    await carregarPrescricoes()
    toast.success('Prescrição excluída com sucesso')
  } catch (error) {
    toast.error('Erro ao excluir prescrição')
  }
}

function formatarData(data) {
  if (!data) return '';
  const dataObj = new Date(data);
  const hora = String(dataObj.getHours()).padStart(2, '0');
  const minutos = String(dataObj.getMinutes()).padStart(2, '0');
  return `${dataObj.toLocaleDateString('pt-BR')} ${hora}:${minutos}`;
}

onMounted(carregarPrescricoes)
</script> 