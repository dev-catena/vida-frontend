<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h6">
            Relatórios
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-card class="mb-4">
                  <v-card-title class="text-subtitle-1">
                    Relatório de Hóspedes
                  </v-card-title>
                  <v-card-text>
                    <v-select
                      v-model="filtroHospedes.periodo"
                      :items="periodos"
                      label="Período"
                      outlined
                    />
                    <v-btn
                      color="primary"
                      block
                      @click="gerarRelatorioHospedes"
                      :loading="loadingHospedes"
                    >
                      Gerar Relatório
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card class="mb-4">
                  <v-card-title class="text-subtitle-1">
                    Relatório de Ocupação
                  </v-card-title>
                  <v-card-text>
                    <v-select
                      v-model="filtroOcupacao.periodo"
                      :items="periodos"
                      label="Período"
                      outlined
                    />
                    <v-btn
                      color="primary"
                      block
                      @click="gerarRelatorioOcupacao"
                      :loading="loadingOcupacao"
                    >
                      Gerar Relatório
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card class="mb-4">
                  <v-card-title class="text-subtitle-1">
                    Relatório Financeiro
                  </v-card-title>
                  <v-card-text>
                    <v-select
                      v-model="filtroFinanceiro.periodo"
                      :items="periodos"
                      label="Período"
                      outlined
                    />
                    <v-btn
                      color="primary"
                      block
                      @click="gerarRelatorioFinanceiro"
                      :loading="loadingFinanceiro"
                    >
                      Gerar Relatório
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
import { ref } from "vue";
import api from "@/services/api";

const periodos = [
  { title: "Último mês", value: "last_month" },
  { title: "Últimos 3 meses", value: "last_3_months" },
  { title: "Últimos 6 meses", value: "last_6_months" },
  { title: "Último ano", value: "last_year" }
];

const filtroHospedes = ref({ periodo: "last_month" });
const filtroOcupacao = ref({ periodo: "last_month" });
const filtroFinanceiro = ref({ periodo: "last_month" });

const loadingHospedes = ref(false);
const loadingOcupacao = ref(false);
const loadingFinanceiro = ref(false);

const snackbar = ref({
  show: false,
  text: "",
  color: "success"
});

function showNotification(text, color = "success") {
  snackbar.value = {
    show: true,
    text,
    color
  };
}

async function gerarRelatorioHospedes() {
  loadingHospedes.value = true;
  try {
    await api.get("/relatorios/hospedes", {
      params: filtroHospedes.value
    });
    // Aqui você pode implementar a lógica para baixar o relatório
    showNotification("Relatório de hóspedes gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar relatório de hóspedes:", error);
    showNotification("Erro ao gerar relatório de hóspedes", "error");
  } finally {
    loadingHospedes.value = false;
  }
}

async function gerarRelatorioOcupacao() {
  loadingOcupacao.value = true;
  try {
    await api.get("/relatorios/ocupacao", {
      params: filtroOcupacao.value
    });
    // Aqui você pode implementar a lógica para baixar o relatório
    showNotification("Relatório de ocupação gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar relatório de ocupação:", error);
    showNotification("Erro ao gerar relatório de ocupação", "error");
  } finally {
    loadingOcupacao.value = false;
  }
}

async function gerarRelatorioFinanceiro() {
  loadingFinanceiro.value = true;
  try {
    await api.get("/relatorios/financeiro", {
      params: filtroFinanceiro.value
    });
    // Aqui você pode implementar a lógica para baixar o relatório
    showNotification("Relatório financeiro gerado com sucesso!");
  } catch (error) {
    console.error("Erro ao gerar relatório financeiro:", error);
    showNotification("Erro ao gerar relatório financeiro", "error");
  } finally {
    loadingFinanceiro.value = false;
  }
}
</script> 