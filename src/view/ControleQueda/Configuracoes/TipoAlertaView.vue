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
              <th>Alerta</th>
              <th>Status</th>
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
              <td>{{ item.nome }}</td>
              <td>{{ item.nome }}</td>
              <td>
                <span :class="['status-badge', item.status === 1 ? 'status-ativo' : 'status-inativo']">
                  {{ item.status === 1 ? "Ativo" : "Inativo" }}
                </span>
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
          <div class="grid-2">
            <div class="col-1">
              <label for="codigo">Código do Alerta* </label>
              <input
                id="codigo"
                v-model="payload.codigo"
                type="text"
                autocomplete="off"
                required
              >
            </div>
            <div class="col-1">
              <label for="nome">Nome do Alerta*</label>
              <input
                id="nome"
                v-model="payload.nome"
                type="text"
                autocomplete="off"
                required
              >
            </div>
          </div>
          <div class="grid-2">
            <div class="col-2">
              <label for="descricao">Descrição do alerta* </label>
              <input
                id="descricao"
                v-model="payload.descricao"
                type="text"
                autocomplete="off"
                required
              >
            </div>
          </div>
          <div class="grid-2">
            <div class="col-1">
              <label for="tipoAlerta">Tipo de alerta</label>
              <select
                id="tipoAlerta"
                v-model="payload.tipoAlerta"
              >
                <option :value="whatsapp">
                  WhatsApp
                </option>
                <option :value="email">
                  E-mail
                </option>
                <option :value="app">
                  App
                </option>
                <option :value="telaMonitoramento">
                  Tela de Monitoramento
                </option>
              </select>
            </div>
            <div class="col-1">
              <label for="classeMobilidade">Classe do Hóspede</label>
              <select
                id="classeMobilidade"
                v-model="payload.classeMobilidade"
              >
                <option :value="alta">
                  Alta
                </option>
                <option :value="media">
                  Média
                </option>
                <option :value="baixa">
                  Baixa
                </option>
              </select>
            </div>
          </div>
          <div class="grid-2">
            <div class="col-1">
              <label for="destinatario"> Destinatário*</label>
              <input
                id="destinatario"
                v-model="payload.destinatario"
                type="text"
                autocomplete="off"
                required
              >
            </div>
            <div class="col-1">
              <label for="status">Status</label>
              <select
                id="status"
                v-model="payload.status"
              >
                <option :value="1">
                  Ativo
                </option>
                <option :value="0">
                  Inativo
                </option>
              </select>
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
import condicaoSaudeService from "@/services/configuracoes/condicaoSaudeService";
import tipoAlertaService from "@/services/configuracoes/tipoAlertaService";

export default {
  name: "TipoAlertaView",
  data() {
    return {
      nomeSingular: "Tipo de Alerta",
      nomePlural: "Tipos de Alerta",
      permissoes: [],
      dadosRecebidos: [],
      payload: { codigo: "", nome: "", descricao: "", prioridade: "", tipoAlerta: "", classeMobilidade: "", destinatario: "", status: "" },
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
    this.getAll();
    this.carregarFuncionalidades();
  },
  methods: {
    async carregarFuncionalidades() {
      this.permissoes = await funcionalidadeService.obterFuncionalidadeUsuario();
    },
    getAll() {
      condicaoSaudeService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidos = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidos = [];
        });
    },
    abrirModalCadastro(dadosRecebidos = null) {
      this.modoCadastro = !dadosRecebidos;

      if (dadosRecebidos && dadosRecebidos.id) {
        tipoAlertaService
          .obterPorId(dadosRecebidos.id)
          .then((response) => {
            const dados = response.data;

            this.payload = {
              id: dados.id,
              codigo: dados.codigo || "",
              nome: dados.nome || "",
              descricao: dados.descricao || "",
              prioridade: dados.prioridade || "",
              tipoAlerta: dados.tipoAlerta || "",
              classeMobilidade: dados.classeMobilidade || "",
              destinatario: dados.destinatario || "",
              status: dados.status === true || dados.status === 1 ? 1 : 0,
            };

            this.mostrarModalCadastro = true;
          })
          .catch((error) => {
            console.error("Erro ao buscar tipo de alerta por ID", error);
            this.$toast.error("Erro ao carregar os dados para edição.");
          });
      } else {
        this.payload = {
          codigo: "",
          nome: "",
          descricao: "",
          prioridade: "",
          tipoAlerta: "",
          classeMobilidade: "",
          destinatario: "",
          status: 1,
        };
        this.mostrarModalCadastro = true;
      }
    },
    salvar() {
      if (!this.payload.codigo || this.payload.codigo.trim() === "") {
        this.$toast.success("Preencha os campos obrigatórios");
        return;
      }

      this.modoCadastro ? this.cadastrar() : this.atualizar();
    },
    cadastrar() {
      condicaoSaudeService
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
      condicaoSaudeService
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
      condicaoSaudeService
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
