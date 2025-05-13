<template>
  <v-container>
    <v-row>
      <!-- COLUNA PRINCIPAL: TABELA -->
      <v-col cols="12" md="9">
        <v-card>
          <v-card-title class="text-h6"> Lista de teste </v-card-title>

          <!-- <v-data-table
            v-model="selected"
            :headers="headers"
            :items="hospedagens"
            :loading="loading"
            class="elevation-1"
            loading-text="Carregando hospedagens..."
            no-data-text="Nenhuma hospedagem encontrada"
            item-value="id"
            show-select
          >
            <template #default>
              {{ formatDate(item.data_admissao) }}
            </template> 
          </v-data-table>
          -->
        </v-card>
      </v-col>

      <!-- COLUNA LATERAL -->
      <v-col cols="12" md="3">
        <v-card class="pa-4 d-flex flex-column gap-4">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            block
            @click="abrirNovaHospedagem"
          >
            Nova Hospedagem
          </v-btn>

          <v-divider />

          <v-list nav dense>
            <v-list-subheader>Ações</v-list-subheader>

            <v-list-item
              :disabled="!selectedItem"
              prepend-icon="mdi-pencil"
              title="Editar"
              @click="editarHospedagem"
            />

            <v-list-item
              :disabled="!selectedItem"
              prepend-icon="mdi-bed"
              title="Ver Quarto"
              @click="verQuarto"
            />

            <v-list-item
              :disabled="!selectedItem"
              prepend-icon="mdi-account-group"
              title="Ver Hóspedes"
              @click="verHospedes"
            />

            <v-list-item
              :disabled="!selectedItem"
              prepend-icon="mdi-cash"
              title="Registrar Pagamento"
              @click="abrirModalPagamento"
            />

            <v-list-item
              :disabled="!selectedItem"
              prepend-icon="mdi-file-document"
              title="Gerar Comprovante"
              @click="gerarComprovante"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- MODAL DE PAGAMENTO -->
    <!-- <v-dialog v-model="modalPagamento" max-width="600">
      <v-card>
        <v-card-title class="text-h6"> Registrar Pagamento </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="pagamento.valor"
            label="Valor"
            type="number"
            prefix="R$"
            required
          />
          <v-select
            v-model="pagamento.forma_pagamento"
            label="Forma de Pagamento"
            :items="formasPagamento"
            required
          />
          <v-text-field
            v-model="pagamento.numero_comprovante"
            label="Número do Comprovante"
          />
          <v-textarea
            v-model="pagamento.observacoes"
            label="Observações"
            rows="2"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="modalPagamento = false"> Cancelar </v-btn>
          <v-btn color="primary" @click="registrarPagamento"> Confirmar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <!-- Snackbar de Notificação -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();
const hospedagens = ref([]);
const loading = ref(false);
const selected = ref([]);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

const selectedItem = computed(() =>
  selected.value.length === 1
    ? hospedagens.value.find((h) => h.id === selected.value[0])
    : null
);

// const headers = [
//   { title: "Número", key: "numero" },
//   { title: "Hóspede", key: "hospede_nome" },
//   { title: "Quarto", key: "quarto_numero" },
//   { title: "Entrada", key: "data_entrada" },
//   { title: "Saída", key: "data_saida" },
//   { title: "Valor Total", key: "valor_total" },
//   { title: "Status", key: "status" },
// ];

// const formasPagamento = [
//   "Dinheiro",
//   "Cartão de Crédito",
//   "Cartão de Débito",
//   "PIX",
//   "Transferência Bancária",
// ];

const modalPagamento = ref(false);
// const pagamento = ref({
//   valor: "",
//   forma_pagamento: "",
//   numero_comprovante: "",
//   observacoes: "",
// });

function showNotification(text, color = "success") {
  snackbar.value = {
    show: true,
    text,
    color,
  };
}

function abrirNovaHospedagem() {
  router.push("/hospedagem/nova");
}

function editarHospedagem() {
  if (selectedItem.value) {
    router.push(`/hospedagem/${selectedItem.value.id}/editar`);
  }
}

function verQuarto() {
  if (selectedItem.value) {
    router.push(`/hospedagem/${selectedItem.value.id}/quarto`);
  }
}

function verHospedes() {
  if (selectedItem.value) {
    router.push(`/hospedagem/${selectedItem.value.id}/hospedes`);
  }
}

function abrirModalPagamento() {
  if (selectedItem.value) {
    modalPagamento.value = true;
  }
}

function gerarComprovante() {
  if (selectedItem.value) {
    showNotification(
      `Gerando comprovante para hospedagem ${selectedItem.value.numero}`
    );
  }
}

// async function registrarPagamento() {
//   if (!selectedItem.value) return;
//   try {
//     const payload = {
//       hospedagem_id: selectedItem.value.id,
//       ...pagamento.value,
//     };
//     await api.post("/pagamentos", payload);
//     showNotification("Pagamento registrado com sucesso!");
//     modalPagamento.value = false;
//     pagamento.value = {
//       valor: "",
//       forma_pagamento: "",
//       numero_comprovante: "",
//       observacoes: "",
//     };
//   } catch (error) {
//     if (error.response?.status !== 200) {
//       const mensagens = Object.values(error.response.data.errors).flat();
//       mensagens.forEach((msg) => showNotification(msg, "error"));
//     } else {
//       showNotification("Erro ao registrar pagamento", "error");
//     }
//   }
// }

// function formatDate(data) {
//   return new Date(data).toLocaleDateString("pt-BR");
// }

// function formatCurrency(valor) {
//   return new Intl.NumberFormat("pt-BR", {
//     style: "currency",
//     currency: "BRL",
//   }).format(valor);
// }

const carregarHospedagens = async () => {
  try {
    loading.value = true;
    const response = await api.get("/hospedagens");
    hospedagens.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Erro ao carregar hospedagens:", error);
    hospedagens.value = [];
    showNotification("Erro ao carregar hospedagens", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(carregarHospedagens);
</script>
