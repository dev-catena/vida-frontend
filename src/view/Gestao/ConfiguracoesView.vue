<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Configurações do Sistema</span>
          </v-card-title>
          <v-card-text>
            <v-tabs v-model="tab" color="primary">
              <v-tab value="geral">Geral</v-tab>
              <v-tab value="notificacoes">Notificações</v-tab>
              <v-tab value="seguranca">Segurança</v-tab>
            </v-tabs>

            <v-window v-model="tab">
              <v-window-item value="geral">
                <v-form ref="formGeral" v-model="validGeral" class="mt-4">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="configuracoes.nome_instituicao"
                        label="Nome da Instituição"
                        :rules="[v => !!v || 'Nome é obrigatório']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="configuracoes.cnpj"
                        label="CNPJ"
                        v-mask="'##.###.###/####-##'"
                        :rules="[v => !!v || 'CNPJ é obrigatório']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="configuracoes.telefone"
                        label="Telefone"
                        v-mask="'(##) #####-####'"
                        :rules="[v => !!v || 'Telefone é obrigatório']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="configuracoes.email"
                        label="E-mail"
                        :rules="[v => !!v || 'E-mail é obrigatório', v => /.+@.+\..+/.test(v) || 'E-mail inválido']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="configuracoes.endereco"
                        label="Endereço"
                        :rules="[v => !!v || 'Endereço é obrigatório']"
                        required
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-window-item>

              <v-window-item value="notificacoes">
                <v-form ref="formNotificacoes" v-model="validNotificacoes" class="mt-4">
                  <v-row>
                    <v-col cols="12">
                      <v-switch
                        v-model="configuracoes.notificacoes_email"
                        label="Ativar notificações por e-mail"
                        color="primary"
                      ></v-switch>
                    </v-col>
                    <v-col cols="12">
                      <v-switch
                        v-model="configuracoes.notificacoes_sistema"
                        label="Ativar notificações no sistema"
                        color="primary"
                      ></v-switch>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="configuracoes.email_notificacoes"
                        label="E-mail para notificações"
                        :rules="[v => !v || /.+@.+\..+/.test(v) || 'E-mail inválido']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-window-item>

              <v-window-item value="seguranca">
                <v-form ref="formSeguranca" v-model="validSeguranca" class="mt-4">
                  <v-row>
                    <v-col cols="12">
                      <v-switch
                        v-model="configuracoes.requer_autenticacao_2fatores"
                        label="Requer autenticação em dois fatores"
                        color="primary"
                      ></v-switch>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="configuracoes.tempo_sessao"
                        label="Tempo de sessão (minutos)"
                        type="number"
                        :rules="[v => !!v || 'Tempo de sessão é obrigatório', v => v > 0 || 'Tempo deve ser maior que zero']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-switch
                        v-model="configuracoes.bloqueio_tentativas"
                        label="Bloquear após múltiplas tentativas de login"
                        color="primary"
                      ></v-switch>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="configuracoes.max_tentativas"
                        label="Número máximo de tentativas"
                        type="number"
                        :rules="[v => !v || v > 0 || 'Número deve ser maior que zero']"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="loading"
              @click="salvarConfiguracoes"
            >
              Salvar Configurações
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const tab = ref('geral');
const loading = ref(false);
const validGeral = ref(false);
const validNotificacoes = ref(false);
const validSeguranca = ref(false);
const formGeral = ref(null);
const formNotificacoes = ref(null);
const formSeguranca = ref(null);

const configuracoes = ref({
  nome_instituicao: '',
  cnpj: '',
  telefone: '',
  email: '',
  endereco: '',
  notificacoes_email: false,
  notificacoes_sistema: false,
  email_notificacoes: '',
  requer_autenticacao_2fatores: false,
  tempo_sessao: 30,
  bloqueio_tentativas: false,
  max_tentativas: 3
});

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

function showNotification(text, color = 'success') {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
}

async function carregarConfiguracoes() {
  try {
    const response = await api.get('/configuracoes');
    configuracoes.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    showNotification('Erro ao carregar configurações', 'error');
  }
}

async function salvarConfiguracoes() {
  const form = tab.value === 'geral' ? formGeral.value :
               tab.value === 'notificacoes' ? formNotificacoes.value :
               formSeguranca.value;

  if (!form) return;

  const { valid } = await form.validate();
  if (!valid) return;

  loading.value = true;
  try {
    await api.put('/configuracoes', configuracoes.value);
    showNotification('Configurações salvas com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    showNotification('Erro ao salvar configurações', 'error');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  carregarConfiguracoes();
});
</script> 