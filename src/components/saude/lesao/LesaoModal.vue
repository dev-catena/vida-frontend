<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 mb-4">Lesões</v-card-title>

    <v-form @submit.prevent="salvarLesao" class="mb-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="novaLesao.local"
            label="Local da Lesão"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="novaLesao.tipo"
            :items="tiposLesao"
            label="Tipo de Lesão"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="novaLesao.dataOcorrencia"
            label="Data da Ocorrência"
            type="date"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="novaLesao.grau"
            label="Grau da Lesão"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="novaLesao.descricao"
            label="Descrição"
            rows="3"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="novaLesao.conduta"
            label="Conduta"
            rows="3"
            required
          />
        </v-col>
        <v-col cols="12">
          <v-file-input
            v-model="novaLesao.fotos"
            label="Fotos da Lesão"
            accept="image/*"
            prepend-icon="mdi-camera"
            show-size
            multiple
            chips
          />
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" type="submit">Registrar Lesão</v-btn>
      </v-card-actions>
    </v-form>

    <v-divider class="mb-4" />

    <v-expansion-panels>
      <v-expansion-panel
        v-for="lesao in lesoes"
        :key="lesao.id"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-icon
              :color="getCorLesao(lesao.grau)"
              class="mr-2"
            >
              mdi-alert-circle
            </v-icon>
            {{ lesao.local }} - {{ formatarData(lesao.dataOcorrencia) }}
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2">Tipo:</div>
              <div>{{ lesao.tipo }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2">Grau:</div>
              <div>{{ lesao.grau }}</div>
            </v-col>
            <v-col cols="12">
              <div class="text-subtitle-2">Descrição:</div>
              <div>{{ lesao.descricao }}</div>
            </v-col>
            <v-col cols="12">
              <div class="text-subtitle-2">Conduta:</div>
              <div>{{ lesao.conduta }}</div>
            </v-col>
            <v-col cols="12" v-if="lesao.fotos?.length">
              <div class="text-subtitle-2 mb-2">Fotos:</div>
              <v-img
                v-for="(foto, index) in lesao.fotos"
                :key="index"
                :src="foto.url"
                :alt="`Foto ${index + 1} da lesão`"
                max-width="200"
                class="mb-2"
              />
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              variant="text"
              @click="excluirLesao(lesao.id)"
            >
              Excluir
            </v-btn>
          </v-card-actions>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
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

const lesoes = ref([])
const novaLesao = ref({
  local: '',
  tipo: '',
  dataOcorrencia: '',
  grau: '',
  descricao: '',
  conduta: '',
  fotos: []
})

const tiposLesao = [
  'Úlcera por Pressão',
  'Lesão por Umidade',
  'Lesão por Fricção',
  'Lesão por Cisalhamento',
  'Outro'
]

function getCorLesao(grau) {
  const cores = {
    '1': 'green',
    '2': 'yellow',
    '3': 'orange',
    '4': 'red'
  }
  return cores[grau] || 'grey'
}

async function carregarLesoes() {
  try {
    const { data } = await api.get(`/hospedes/${props.hospedeId}/lesoes`)
    lesoes.value = data
  } catch (error) {
    toast.error('Erro ao carregar lesões')
  }
}

async function salvarLesao() {
  try {
    const formData = new FormData()
    Object.keys(novaLesao.value).forEach(key => {
      if (key === 'fotos') {
        novaLesao.value[key].forEach(foto => {
          formData.append('fotos[]', foto)
        })
      } else {
        formData.append(key, novaLesao.value[key])
      }
    })

    await api.post(`/hospedes/${props.hospedeId}/lesoes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    Object.keys(novaLesao.value).forEach(key => {
      novaLesao.value[key] = key === 'fotos' ? [] : ''
    })

    await carregarLesoes()
    toast.success('Lesão registrada com sucesso')
  } catch (error) {
    if (error.response?.status === 422) {
      const mensagens = Object.values(error.response.data.errors).flat()
      mensagens.forEach((msg) => toast.error(msg))
    } else {
      toast.error('Erro ao registrar lesão')
    }
  }
}

async function excluirLesao(id) {
  try {
    await api.delete(`/hospedes/${props.hospedeId}/lesoes/${id}`)
    await carregarLesoes()
    toast.success('Lesão excluída com sucesso')
  } catch (error) {
    toast.error('Erro ao excluir lesão')
  }
}

function formatarData(data) {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(carregarLesoes)
</script> 