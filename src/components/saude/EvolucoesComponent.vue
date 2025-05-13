<template>
  <v-card class="pa-4">
    <v-card-title class="text-h5 mb-4">Evoluções</v-card-title>
    
    <v-form @submit.prevent="salvarEvolucao" class="mb-6">
      <v-textarea
        v-model="novaEvolucao.descricao"
        label="Descrição da Evolução"
        rows="4"
        required
      />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" type="submit">Registrar Evolução</v-btn>
      </v-card-actions>
    </v-form>

    <v-divider class="mb-4" />

    <v-timeline density="compact" align="start">
      <v-timeline-item
        v-for="evolucao in evolucoes"
        :key="evolucao.id"
        :dot-color="evolucao.cor"
        size="small"
      >
        <div class="d-flex justify-space-between align-center mb-2">
          <div class="text-subtitle-2">{{ formatarData(evolucao.data) }}</div>
          <div class="text-caption">{{ evolucao.profissional }}</div>
        </div>
        <div class="text-body-2">{{ evolucao.descricao }}</div>
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

const evolucoes = ref([])
const novaEvolucao = ref({
  descricao: ''
})

async function carregarEvolucoes() {
  try {
    const { data } = await api.get(`/hospedes/${props.hospedeId}/evolucoes`)
    evolucoes.value = data
  } catch (error) {
    toast.error('Erro ao carregar evoluções')
  }
}

async function salvarEvolucao() {
  try {
    await api.post(`/hospedes/${props.hospedeId}/evolucoes`, novaEvolucao.value)
    novaEvolucao.value.descricao = ''
    await carregarEvolucoes()
    toast.success('Evolução registrada com sucesso')
  } catch (error) {
    if (error.response?.status === 422) {
      const mensagens = Object.values(error.response.data.errors).flat()
      mensagens.forEach((msg) => toast.error(msg))
    } else {
      toast.error('Erro ao registrar evolução')
    }
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

onMounted(carregarEvolucoes)
</script> 