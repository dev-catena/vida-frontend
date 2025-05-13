<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title class="text-h6">
        {{ isEdicao ? "Editar Hóspede" : "Cadastrar Novo Hóspede" }}
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="salvarHospede">
          <!-- Dados Pessoais -->
          <v-card
            class="mb-6"
            variant="outlined"
          >
            <v-card-title class="text-subtitle-1">
              Dados Pessoais
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.nome"
                    label="Nome Completo"
                    required
                    :rules="[v => !!v || 'Nome é obrigatório']"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.cpf"
                    v-mask="'###.###.###-##'"
                    label="CPF"
                    required
                    :rules="[v => !!v || 'CPF é obrigatório']"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.telefone"
                    v-mask="'(##) #####-####'"
                    label="Telefone"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.email"
                    label="Email"
                    type="email"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="dataNc"
                    v-mask="'##/##/####'"
                    label="Data de Nascimento"
                    required
                    :rules="[v => !!v || 'Data de nascimento é obrigatória']"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-select
                    v-model="novo.genero"
                    label="Gênero"
                    :items="['Masculino', 'Feminino', 'Outro']"
                    required
                    :rules="[v => !!v || 'Gênero é obrigatório']"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Dados Institucionais -->
          <v-card
            class="mb-6"
            variant="outlined"
          >
            <v-card-title class="text-subtitle-1">
              Dados Institucionais
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.unidade"
                    label="Unidade"
                    required
                    :rules="[v => !!v || 'Unidade é obrigatória']"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.modalidade"
                    label="Modalidade"
                    required
                    :rules="[v => !!v || 'Modalidade é obrigatória']"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.profissao"
                    label="Profissão"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="dataBr"
                    v-mask="'##/##/####'"
                    label="Data de Admissão"
                    required
                    :rules="[v => !!v || 'Data de admissão é obrigatória']"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="novo.procedencia"
                    label="Procedência"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Dados de Saúde -->
          <v-card
            class="mb-6"
            variant="outlined"
          >
            <v-card-title class="text-subtitle-1">
              Dados de Saúde
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="novo.quadro_clinico"
                    label="Quadro Clínico"
                    rows="3"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="novo.expectativas_familiares"
                    label="Expectativas da Família"
                    rows="3"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-select
                    v-model="novo.usa_oxigenio"
                    label="Usa Oxigênio?"
                    :items="['Sim', 'Não']"
                    required
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-select
                    v-model="novo.tipo_alimentacao"
                    label="Tipo de Alimentação"
                    :items="['Normal', 'Pastosa', 'Enteral']"
                    required
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Condições Especiais -->
          <v-card
            class="mb-6"
            variant="outlined"
          >
            <v-card-title class="text-subtitle-1">
              Condições Especiais
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-switch
                    v-model="flags.alergia"
                    label="Alergia?"
                    inset
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.alergia"
                    label="Qual Alergia?"
                    :disabled="!flags.alergia"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-switch
                    v-model="flags.plano_saude"
                    label="Possui Plano de Saúde?"
                    inset
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.plano_saude"
                    label="Nome do Plano de Saúde"
                    :disabled="!flags.plano_saude"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-switch
                    v-model="flags.restricao_alimentar"
                    label="Possui Restrição Alimentar?"
                    inset
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.restricao_alimentar"
                    label="Detalhes da Restrição"
                    :disabled="!flags.restricao_alimentar"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-switch
                    v-model="flags.usa_medicamentos"
                    label="Usa Medicamentos?"
                    inset
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.usa_medicamentos"
                    label="Quais Medicamentos?"
                    :disabled="!flags.usa_medicamentos"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-switch
                    v-model="flags.lesoes_pele"
                    label="Possui Lesões de Pele?"
                    inset
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="novo.lesoes_pele"
                    label="Lesões de Pele"
                    :disabled="!flags.lesoes_pele"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Responsáveis -->
          <v-card
            class="mb-6"
            variant="outlined"
          >
            <v-card-title class="text-subtitle-1 d-flex justify-space-between align-center">
              Responsáveis
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                @click="mostrarModalResponsavel = true"
              >
                Adicionar Responsável
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Parentesco</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(resp, index) in novo.responsaveis"
                    :key="index"
                  >
                    <td>{{ resp.nome }}</td>
                    <td>{{ resp.parentesco }}</td>
                    <td>{{ resp.telefone }}</td>
                    <td>
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        color="error"
                        @click="removerResponsavel(index)"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="voltar"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          :loading="salvando"
          @click="salvarHospede"
        >
          {{ isEdicao ? "Atualizar" : "Salvar" }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Modal de Responsável -->
    <v-dialog
      v-model="mostrarModalResponsavel"
      max-width="600"
    >
      <v-card>
        <v-card-title class="text-h6">
          Adicionar Responsável
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="adicionarResponsavel">
            <v-text-field
              v-model="responsavelTemp.nome"
              label="Nome"
              required
              :rules="[v => !!v || 'Nome é obrigatório']"
            />
            <v-text-field
              v-model="responsavelTemp.parentesco"
              label="Parentesco"
              required
              :rules="[v => !!v || 'Parentesco é obrigatório']"
            />
            <v-text-field
              v-model="responsavelTemp.telefone"
              v-mask="'(##) #####-####'"
              label="Telefone"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="mostrarModalResponsavel = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="adicionarResponsavel"
          >
            Salvar
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
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();
const route = useRoute();
const hospedeId = route.params.id;

const isEdicao = computed(() => !!hospedeId);
const salvando = ref(false);
const dataBr = ref("");
const dataNc = ref("");

const snackbar = ref({
  show: false,
  text: "",
  color: "success"
});

const mostrarModalResponsavel = ref(false);
const responsavelTemp = ref({ nome: "", parentesco: "", telefone: "" });

const flags = ref({
  usa_medicamentos: false,
  plano_saude: false,
  restricao_alimentar: false,
  lesoes_pele: false,
  alergia: false,
});

const novo = ref({
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  unidade: "",
  modalidade: "",
  profissao: "",
  genero: "",
  data_nascimento: "",
  data_admissao: "",
  procedencia: "",
  quadro_clinico: "",
  expectativas_familiares: "",
  plano_saude: "",
  tipo_alimentacao: "",
  restricao_alimentar: "",
  usa_medicamentos: "",
  usa_oxigenio: "",
  lesoes_pele: "",
  alergia: "",
  responsaveis: [],
});

function showNotification(text, color = "success") {
  snackbar.value = {
    show: true,
    text,
    color
  };
}

function adicionarResponsavel() {
  if (!responsavelTemp.value.nome || !responsavelTemp.value.parentesco) {
    showNotification("Nome e parentesco são obrigatórios", "error");
    return;
  }
  novo.value.responsaveis.push({ ...responsavelTemp.value });
  responsavelTemp.value = { nome: "", parentesco: "", telefone: "" };
  mostrarModalResponsavel.value = false;
  showNotification("Responsável adicionado com sucesso");
}

function removerResponsavel(index) {
  novo.value.responsaveis.splice(index, 1);
  showNotification("Responsável removido com sucesso");
}

function formatDateToISO(dateBr) {
  const [d, m, y] = dateBr.split("/");
  return `${y}-${m}-${d}`;
}

function formatDateToBr(dateIso) {
  const [y, m, d] = dateIso.split("-");
  return `${d}/${m}/${y}`;
}

function voltar() {
  router.push("/administracao/hospedes");
}

async function salvarHospede() {
  salvando.value = true;
  try {
    novo.value.data_admissao = formatDateToISO(dataBr.value);
    novo.value.data_nascimento = formatDateToISO(dataNc.value);

    if (isEdicao.value) {
      await api.put(`hospedes/${hospedeId}`, novo.value);
    } else {
      await api.post("hospedes", novo.value);
    }

    showNotification(isEdicao.value ? "Hóspede atualizado!" : "Hóspede cadastrado!");
    voltar();
  } catch (error) {
    if (error.response?.status === 422) {
      const mensagens = Object.values(error.response.data.errors).flat();
      mensagens.forEach((msg) => showNotification(msg, "error"));
    } else {
      console.log(error);
      showNotification("Erro ao salvar hóspede", "error");
    }
  } finally {
    salvando.value = false;
  }
}

onMounted(async () => {
  if (isEdicao.value) {
    try {
      const { data } = await api.get(`hospedes/${hospedeId}`);
      Object.assign(novo.value, data);
      dataBr.value = formatDateToBr(data.data_admissao);
      dataNc.value = formatDateToBr(data.data_nascimento);
      flags.value.plano_saude = !!data.plano_saude;
      flags.value.restricao_alimentar = !!data.restricao_alimentar;
      flags.value.usa_medicamentos = !!data.usa_medicamentos;
      flags.value.lesoes_pele = !!data.lesoes_pele;
      flags.value.alergia = !!data.alergia;
    } catch (error) {
      if (error.response?.status === 422) {
        const mensagens = Object.values(error.response.data.errors).flat();
        mensagens.forEach((msg) => showNotification(msg, "error"));
      } else {
        showNotification("Erro ao carregar hóspede", "error");
      }
    }
  }
});
</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
}
</style> 