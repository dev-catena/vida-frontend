<template>
  <v-container>
    <v-row>
      <!-- COLUNA PRINCIPAL: TABELA -->
      <v-col
        cols="12"
        md="9"
      >
        <v-card>
          <v-card-title class="text-h6">
            Lista de Hóspedes
          </v-card-title>

          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="hospedes"
            :loading="loading"
            class="elevation-1"
            loading-text="Carregando hóspedes..."
            no-data-text="Nenhum hóspede encontrado"
            item-value="id"
            show-select
          >
            <template #item="{ item }">
              <tr>
                <td>{{ item.nome }}</td>
                <td>{{ item.cpf }}</td>
                <td>{{ item.unidade }}</td>
                <td>{{ formatDate(item.data_admissao) }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- COLUNA LATERAL -->
      <v-col
        cols="12"
        md="3"
      >
        <v-card class="pa-4 d-flex flex-column gap-4">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            block
            @click="abrirNovoHospede"
          >
            Novo Hóspede
          </v-btn>

          <v-divider />

          <v-list
            nav
            dense
          >
            <v-list-subheader>Ações</v-list-subheader>

            <v-list-item
              :disabled="!selectedItem"
              prepend-icon="mdi-pencil"
              title="Editar"
              @click="editarHospede"
            />

            <v-list-item
              :disabled="!selectedItem"
              prepend-icon="mdi-account-group"
              title="Ver Responsáveis"
              @click="verResponsaveis"
            />

            <v-list-item
              :disabled="!selectedItem"
              prepend-icon="mdi-file-document"
              title="Ver Prontuário"
              @click="verProntuario"
            />

            <v-list-item
              :disabled="!selectedItem"
              prepend-icon="mdi-login"
              title="Check-in"
              @click="abrirModalMovimentacao('entrada')"
            />

            <v-list-item
              :disabled="!selectedItem"
              prepend-icon="mdi-logout"
              title="Check-out"
              @click="abrirModalMovimentacao('saida')"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- MODAL DE MOVIMENTACAO -->
    <v-dialog
      v-model="modalMovimentacao"
      max-width="600"
    >
      <v-card>
        <v-card-title class="text-h6">
          {{ tipoMovimentacao === "entrada" ? "Registrar Check-in" : "Registrar Check-out" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="movimentacao.responsavel"
            label="Responsável"
            required
          />
          <v-textarea
            v-model="movimentacao.estado"
            label="Estado do Hóspede"
            rows="2"
          />
          <v-textarea
            v-model="movimentacao.motivo_saida"
            label="Motivo"
            :readonly="tipoMovimentacao === 'entrada'"
            rows="2"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="modalMovimentacao = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="registrarMovimentacao"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar de Notificação -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();
const hospedes = ref([]);
const loading = ref(false);
const selected = ref([]);

const snackbar = ref({
  show: false,
  text: "",
  color: "success"
});

const selectedItem = computed(() =>
  selected.value.length === 1 ? hospedes.value.find((h) => h.id === selected.value[0]) : null
);

const headers = [
  { title: "Nome", key: "nome" },
  { title: "CPF", key: "cpf" },
  { title: "Unidade", key: "unidade" },
  { title: "Data de Admissão", key: "data_admissao" },
];

function showNotification(text, color = "success") {
  snackbar.value = {
    show: true,
    text,
    color
  };
}

function abrirNovoHospede() {
  router.push("/adm/hospedes/novo");
}

function editarHospede() {
  if (selectedItem.value) {
    router.push(`/adm/hospedes/${selectedItem.value.id}/editar`);
  }
}

function verResponsaveis() {
  if (selectedItem.value) {
    showNotification(`Visualizando responsáveis de ${selectedItem.value.nome}`);
  }
}

function verProntuario() {
  if (selectedItem.value) {
    router.push(`/adm/hospedes/${selectedItem.value.id}/prontuario`);
  }
}

const tipoMovimentacao = ref(null);
const modalMovimentacao = ref(false);
const movimentacao = ref({
  responsavel: "",
  motivo_saida: "",
  estado: "",
});

function abrirModalMovimentacao(tipo) {
  tipoMovimentacao.value = tipo;
  modalMovimentacao.value = true;
}

async function registrarMovimentacao() {
  if (!selectedItem.value) return;
  try {
    const payload = {
      hospede_id: selectedItem.value.id,
      tipo: tipoMovimentacao.value,
      ...movimentacao.value,
    };
    await api.post("/movimentacoes", payload);
    showNotification("Movimentação registrada com sucesso!");
    modalMovimentacao.value = false;
    movimentacao.value = { responsavel: "", motivo_saida: "", estado: "" };
  } catch (error) {
    if (error.response?.status !== 200) {
      const mensagens = Object.values(error.response.data.errors).flat();
      mensagens.forEach((msg) => showNotification(msg, "error"));
    } else {
      showNotification("Erro ao registrar movimentação", "error");
    }
  }
}

function formatDate(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

async function carregarHospedes() {
  loading.value = true;
  try {
    const { data } = await api.get("/hospedes");
    hospedes.value = data;
  } catch (error) {
    if (error.response?.status !== 200) {
      const mensagens = Object.values(error.response.data.errors).flat();
      mensagens.forEach((msg) => showNotification(msg, "error"));
    } else {
      showNotification("Erro ao buscar hóspedes", "error");
    }
  } finally {
    loading.value = false;
  }
}

onMounted(carregarHospedes);
</script>
