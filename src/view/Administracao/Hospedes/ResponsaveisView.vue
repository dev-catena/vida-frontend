<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h6">
            Responsáveis do Hóspede: {{ hospede.nome }}
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="responsaveis"
            :loading="loading"
            class="elevation-1"
            loading-text="Carregando responsáveis..."
            no-data-text="Nenhum responsável encontrado"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.nome }}</td>
                <td>{{ formatCPF(item.cpf) }}</td>
                <td>{{ item.parentesco }}</td>
                <td>{{ item.telefone }}</td>
                <td>{{ item.email }}</td>
                <td>
                  <v-btn
                    icon
                    variant="text"
                    color="error"
                    @click="removerResponsavel(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Adicionar Responsável -->
    <v-dialog v-model="modalResponsavel" max-width="600">
      <v-card>
        <v-card-title class="text-h6">
          {{ responsavelEditando ? 'Editar' : 'Adicionar' }} Responsável
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="novoResponsavel.nome"
            label="Nome"
            required
          />
          <v-text-field
            v-model="novoResponsavel.cpf"
            label="CPF"
            v-mask="'###.###.###-##'"
            required
          />
          <v-text-field
            v-model="novoResponsavel.parentesco"
            label="Parentesco"
            required
          />
          <v-text-field
            v-model="novoResponsavel.telefone"
            label="Telefone"
            v-mask="'(##) #####-####'"
            required
          />
          <v-text-field
            v-model="novoResponsavel.email"
            label="E-mail"
            type="email"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="modalResponsavel = false">Cancelar</v-btn>
          <v-btn color="primary" @click="salvarResponsavel">Salvar</v-btn>
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";

const route = useRoute();
const hospede = ref({});
const responsaveis = ref([]);
const loading = ref(false);
const modalResponsavel = ref(false);
const responsavelEditando = ref(null);

const snackbar = ref({
  show: false,
  text: "",
  color: "success"
});

const headers = [
  { title: "Nome", key: "nome" },
  { title: "CPF", key: "cpf" },
  { title: "Parentesco", key: "parentesco" },
  { title: "Telefone", key: "telefone" },
  { title: "E-mail", key: "email" },
  { title: "Ações", key: "actions", sortable: false }
];

const novoResponsavel = ref({
  nome: "",
  cpf: "",
  parentesco: "",
  telefone: "",
  email: ""
});

function showNotification(text, color = "success") {
  snackbar.value = {
    show: true,
    text,
    color
  };
}

function formatCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

async function carregarHospede() {
  try {
    const response = await api.get(`/hospedes/${route.params.id}`);
    hospede.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar hóspede:", error);
    showNotification("Erro ao carregar dados do hóspede", "error");
  }
}

async function carregarResponsaveis() {
  loading.value = true;
  try {
    const response = await api.get(`/hospedes/${route.params.id}/responsaveis`);
    responsaveis.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar responsáveis:", error);
    showNotification("Erro ao carregar responsáveis", "error");
  } finally {
    loading.value = false;
  }
}

async function salvarResponsavel() {
  try {
    const payload = {
      ...novoResponsavel.value,
      hospede_id: route.params.id
    };

    if (responsavelEditando.value) {
      await api.put(`/responsaveis/${responsavelEditando.value.id}`, payload);
      showNotification("Responsável atualizado com sucesso!");
    } else {
      await api.post("/responsaveis", payload);
      showNotification("Responsável adicionado com sucesso!");
    }

    modalResponsavel.value = false;
    carregarResponsaveis();
    resetForm();
  } catch (error) {
    console.error("Erro ao salvar responsável:", error);
    showNotification("Erro ao salvar responsável", "error");
  }
}

async function removerResponsavel(responsavel) {
  if (confirm(`Deseja realmente remover o responsável ${responsavel.nome}?`)) {
    try {
      await api.delete(`/responsaveis/${responsavel.id}`);
      showNotification("Responsável removido com sucesso!");
      carregarResponsaveis();
    } catch (error) {
      console.error("Erro ao remover responsável:", error);
      showNotification("Erro ao remover responsável", "error");
    }
  }
}

function resetForm() {
  novoResponsavel.value = {
    nome: "",
    cpf: "",
    parentesco: "",
    telefone: "",
    email: ""
  };
  responsavelEditando.value = null;
}

onMounted(async () => {
  await carregarHospede();
  await carregarResponsaveis();
});
</script> 