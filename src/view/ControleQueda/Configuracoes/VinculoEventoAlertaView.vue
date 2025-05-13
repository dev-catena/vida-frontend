<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <div class="m-icone direita">
          <div class="pesquisa">
            <input
              v-model="filtro"
              type="text"
              placeholder="Pesquisar"
              @input="pesquisaComFiltro"
            >
            <a
              class="icone-pesquisa"
              title="Pesquise"
            />
          </div>
        </div>
        <h2>{{ "Gestão de " + nomePlural }}</h2>
      </div>
    </div>
    <div class="margem container">
      <div class="bloco margem">
        <div
          v-if="permissoes.includes(1)"
          class="direita"
        >
          <button @click="abrirModalCadastro()">
            {{ "Cadastrar " + nomeSingular }}
          </button>
        </div>
        <table class="tabela alinha-centro">
          <thead class="alinha-centro">
            <tr>
              <th>Código</th>
              <th>Classe do Hóspede</th>
              <th>Evento Monitorado</th>
              <th>Tipo de Alerta</th>
              <th
                v-if="permissoes.includes(1)"
                class="direita"
                style="margin-right: 35px"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="alinha-centro">
            <tr
              v-for="item in dadosFiltrados"
              :key="item.id"
            >
              <td>{{ item.codigo }}</td>
              <td>{{ item.mobilidade_classe.nome }}</td>
              <td>
                <span
                  v-for="evento in item.alerta_configuracao_eventos"
                  :key="evento.id"
                  class="chip bg-cinza fonte"
                >
                  {{ evento.evento_tipo.nome }}
                </span>
              </td>
              <td>
                <span
                  v-for="tipo in item.alerta_configuracao_tipos"
                  :key="tipo.id"
                  class="chip bg-cinza fonte"
                > {{ tipo.alerta_tipo.nome }} - {{ tipo.destinatario }} </span>
              </td>

              <td v-if="permissoes.includes(1)">
                <div class="linha direita">
                  <div>
                    <a
                      title="Clique para editar"
                      class="icone-editar"
                      @click="abrirModalCadastro(item)"
                    />
                  </div>
                  <div>
                    <a
                      title="Clique para excluir"
                      class="icone-deletar"
                      @click="abrirModalExcluir(item)"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL EXCLUIR -->
    <div
      v-if="mostrarModalExcluir"
      style="overflow: auto"
      class="modal-mask"
    >
      <div
        class="jm"
        style="height: min-content; width: 25rem; padding: 2rem"
      >
        <div style="text-align: center; width: 100%">
          <div>
            Confirma a exclusão: <strong>{{ nomeParaExcluir }}</strong>?
          </div>

          <div class="margem linha alinha-v alinha-centro">
            <button
              type="button"
              class="acao-secundaria"
              @click="fecharModal"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="confirmarExclusao"
            >
              Confirmar
            </button>&nbsp;&nbsp;
          </div>
        </div>
      </div>
    </div>
    <!-- END MODAL EXCLUIR -->

    <!-- MODAL CADASTRO E EDIÇÃO -->
    <div
      v-if="mostrarModalCadastro"
      style="overflow: auto"
      class="modal-mask"
    >
      <div
        class="jm"
        style="height: min-content; width: 50rem; padding: 2rem"
      >
        <div>
          <h3>{{ modoCadastro ? "Cadastrar" : "Editar" }} {{ nomeSingular }}</h3>
        </div>

        <div class="margem">
          <div class="margem bloco">
            <div class="col-2">
              <label for="classeMobilidade">Classe de Mobilidade*</label>
              <select
                id="classeMobilidade"
                v-model="payload.mobilidade_classe_id"
                required
              >
                <option
                  disabled
                  value=""
                >
                  Selecione
                </option>
                <option
                  v-for="item in dadosRecebidosClasses"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.nome }}
                </option>
              </select>
            </div>
          </div>

          <div class="margem bloco">
            <div class="col-2">
              <label>Eventos Monitorados*</label>
              <div
                v-for="item in dadosRecebidosEventos"
                :key="item.id"
                style="margin-bottom: 0.25rem"
                class="alinha"
              >
                <div class="linha">
                  <input
                    :id="'evento-' + item.id"
                    v-model="payload.eventos_monitorados"
                    class="col-1"
                    type="checkbox"
                    :value="item.id"
                  >
                  <label
                    class="col-2"
                    :for="'evento-' + item.id"
                  >{{ item.nome }}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="margem bloco">
            <div class="grid-2">
              <div class="linha col-2 alinha-v">
                <div>Alertas</div>
                <span
                  type="button"
                  class="chip bg-ok clicavel"
                  @click="adicionarAlerta"
                >Adicionar alerta</span>
              </div>

              <div class="col-2">
                <div
                  v-for="(resp, index) in payload.alerta_destinatario"
                  :key="index"
                  class="linha alinha-centro margem-baixa"
                >
                  <select
                    v-model="resp.alerta_tipo_id"
                    style="width: 45%; margin-right: 1rem"
                  >
                    <option
                      disabled
                      value=""
                    >
                      Selecione
                    </option>
                    <option
                      v-for="alerta in dadosRecebidosAlertas"
                      :key="alerta.id"
                      :value="alerta.id"
                    >
                      {{ alerta.nome }}
                    </option>
                  </select>
                  <input
                    v-model="resp.destinatario"
                    type="text"
                    placeholder="Destinatário"
                    style="width: 45%; margin-right: 1rem"
                  >
                  <button
                    class="acao-secundaria"
                    @click="removerAlerta(index)"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="margem linha alinha-v alinha-centro">
            <button
              type="button"
              class="acao-secundaria"
              @click="fecharModal"
            >
              Cancelar
            </button>
            <button
              type="button"
              @click="salvar"
            >
              {{ modoCadastro ? "Cadastrar" : "Atualizar" }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- END MODAL CADASTRO E EDIÇÃO -->
  </section>
</template>

<script>
import funcionalidadeService from "@/services/funcionalidade/funcionalidadeService";
import alertaAtivacaoService from "@/services/configuracoes/alertaAtivacaoService";
import tipoEventoService from "@/services/configuracoes/tipoEventoService";
import classeMobilidadeService from "@/services/configuracoes/classeMobilidadeService";
import configuracaoAlertaService from "@/services/configuracoes/configuracaoAlertaService";

export default {
  name: "VinculoEventoAlertaView",
  data() {
    return {
      nomeSingular: "Configuração de Evento e Alerta",
      nomePlural: "Configurações de Eventos e Alertas",
      permissoes: [],
      dadosRecebidos: [],
      dadosRecebidosEventos: [],
      dadosRecebidosClasses: [],
      dadosRecebidosAlertas: [],
      payload: { mobilidade_classe_id: "", eventos_monitorados: [], alerta_destinatario: [{ alerta_tipo_id: "", destinatario: "" }] },
      filtro: "",
      idParaExcluir: null,
      nomeParaExcluir: "",
      mostrarModalExcluir: false,
      mostrarModalCadastro: false,
      modoCadastro: true,
      elementoClicado: null,
    };
  },
  computed: {
    dadosFiltrados() {
      return this.$filtrarDados(this.dadosRecebidos, this.filtro, ["codigo", "mobilidade_classe.nome", "alerta_configuracao_eventos[].evento_tipo.nome", "alerta_configuracao_tipos[].alerta_tipo.nome", "alerta_configuracao_tipos[].destinatario"]);
    },
  },
  mounted() {
    this.carregarFuncionalidades();
    this.getAll();
  },
  methods: {
    async carregarFuncionalidades() {
      this.permissoes = await funcionalidadeService.obterFuncionalidadeUsuario();
    },
    getAll() {
      configuracaoAlertaService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidos = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidos = [];
        });
    },
    getAllClasseMobilidade() {
      classeMobilidadeService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidosClasses = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidosClasses = [];
        });
    },
    getAllEvento() {
      tipoEventoService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidosEventos = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidosEventos = [];
        });
    },
    getAllAlerta() {
      alertaAtivacaoService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidosAlertas = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidosAlertas = [];
        });
    },
    abrirModalCadastro(item = null) {
      this.getAllClasseMobilidade();
      this.getAllAlerta();
      this.getAllEvento();

      if (!item) {
        this.modoCadastro = true;
        this.payload = {
          mobilidade_classe_id: "",
          eventos_monitorados: [],
          alerta_destinatario: [{ destinatario: "", alerta_tipo_id: "" }],
        };
        this.mostrarModalCadastro = true;
        return;
      }

      this.modoCadastro = false;

      this.payload = {
        id: item.id,
        mobilidade_classe_id: item.mobilidade_classe_id,
        eventos_monitorados: item.alerta_configuracao_eventos.map((ev) => ev.evento_tipo_id),
        alerta_destinatario: item.alerta_configuracao_tipos.map((alerta) => ({
          destinatario: alerta.destinatario,
          alerta_tipo_id: alerta.alerta_tipo_id,
        })),
      };

      this.mostrarModalCadastro = true;
    },

    adicionarAlerta() {
      this.payload.alerta_destinatario.push({ destinatario: "", alerta_tipo_id: "" });
    },
    removerAlerta(index) {
      this.payload.alerta_destinatario.splice(index, 1);
    },

    validarCamposObrigatorios() {
      const labels = {
        mobilidade_classe_id: "Classe de Mobilidade",
        eventos_monitorados: "Eventos Monitorados",
        alerta_destinatario: "Alertas",
      };

      if (!this.payload.mobilidade_classe_id) {
        this.$toast.error(`Preencha o campo ${labels.mobilidade_classe_id}`);
        return false;
      }

      if (!Array.isArray(this.payload.eventos_monitorados) || this.payload.eventos_monitorados.length === 0) {
        this.$toast.error(`Selecione pelo menos um ${labels.eventos_monitorados}`);
        return false;
      }

      const temAlertaValido = this.payload.alerta_destinatario.some((a) => a.alerta_tipo_id && a.destinatario?.trim());

      if (!temAlertaValido) {
        this.$toast.error(`Informe pelo menos um ${labels.alerta_destinatario} e destinatário.`);
        return false;
      }

      return true;
    },

    salvar() {
      if (!this.validarCamposObrigatorios()) return;
      this.modoCadastro ? this.cadastrar() : this.atualizar();
    },
    cadastrar() {
      configuracaoAlertaService
        .cadastrar(this.payload)
        .then(() => {
          this.$toast.success("Cadastrado com sucesso!");
          this.getAll();
          this.fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao cadastrar", error);
          this.$toast.error("Erro ao cadastrar");
        });
    },
    atualizar() {
      configuracaoAlertaService
        .atualizar(this.payload)
        .then(() => {
          this.$toast.success("Atualizado com sucesso!");
          this.getAll();
          this.fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao atualizar", error);
          this.$toast.error("Erro ao atualizar");
        });
    },
    abrirModalExcluir(grupo) {
      this.idParaExcluir = grupo.id;
      this.nomeParaExcluir = grupo.nome;
      this.mostrarModalExcluir = true;
    },
    confirmarExclusao() {
      configuracaoAlertaService
        .deletar(this.idParaExcluir)
        .then(() => {
          this.$toast.success("Excluído com sucesso");
          this.getAll();
        })
        .catch((error) => {
          console.error("Erro ao excluir", error);
          this.$toast.error("Erro ao excluir");
        })
        .finally(() => {
          this.fecharModal();
        });
    },
  },
};
</script>
