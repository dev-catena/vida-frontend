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
              <th>Nome</th>
              <th>Descrição</th>
              <th>Prédio</th>
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
              <td>{{ item.codigo }}</td>
              <td>{{ item.nome }}</td>
              <td>{{ item.descricao }}</td>
              <td>{{ obterNomePredio(item.predio_id) }}</td>
              <td>
                <span :class="['status-badge', item.status === true ? 'status-ativo' : 'status-inativo']">
                  {{ item.status === true ? "Ativo" : "Inativo" }}
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
          <div class="grid-4">
            <div class="col-2">
              <label for="nome">Nome* </label>
              <input
                id="nome"
                v-model="payload.nome"
                type="text"
                autocomplete="off"
                required
              >
            </div>
            <div class="col-1">
              <label for="quarto"> Quarto ?</label>
              <select
                id="quarto"
                v-model="payload.quarto"
              >
                <option :value="1">
                  Sim
                </option>
                <option :value="0">
                  Não
                </option>
              </select>
            </div>

            <div>
              <label for="capacidade">Capacidade Máxima</label>
              <input
                id="capacidade"
                v-model="payload.capacidade"
                :disabled="payload.quarto !== 1"
                type="number"
                autocomplete="off"
                required
              >
            </div>

            <div class="col-4">
              <label for="descricao">Descrição</label>
              <textarea
                id="descricao"
                v-model="payload.descricao"
                rows="5"
                autocomplete="off"
              />
            </div>

            <div class="col-3">
              <label for="predio">Prédio*</label>
              <select
                id="predio"
                v-model="payload.predio_id"
                required
              >
                <option
                  disabled
                  value=""
                >
                  Selecione um prédio
                </option>
                <option
                  v-for="predio in dadosRecebidosPredio"
                  :key="predio.id"
                  :value="predio.id"
                >
                  {{ predio.nome }}
                </option>
              </select>
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
import localService from "@/services/configuracoes/localService";
import predioService from "@/services/configuracoes/predioService";

export default {
  name: "LocalView",
  data() {
    return {
      nomeSingular: "Local/Instalação",
      nomePlural: "Locais/Instalações",
      permissoes: [],
      dadosRecebidos: [],
      dadosRecebidosPredio: [],
      payload: { nome: "", descricao: "", status: 1, predio_id: "", quarto: 0, capacidade: "" },
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
      return this.$filtrarDados(this.dadosRecebidos, this.filtro, ["codigo", "nome", "descricao", "predio.nome"]);
    },
  },
  mounted() {
    this.getAll();
    this.getAllPredio();
    this.carregarFuncionalidades();
  },
  methods: {
    async carregarFuncionalidades() {
      this.permissoes = await funcionalidadeService.obterFuncionalidadeUsuario();
    },
    getAll() {
      localService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidos = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidos = [];
        });
    },
    getAllPredio() {
      predioService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidosPredio = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidosPredio = [];
        });
    },
    obterNomePredio(id) {
      const predio = this.dadosRecebidosPredio.find((p) => p.id === id);
      return predio ? predio.nome : "—";
    },
    abrirModalCadastro(dadosRecebidos = null) {
      this.modoCadastro = !dadosRecebidos;

      if (dadosRecebidos && dadosRecebidos.id) {
        localService
          .obterPorId(dadosRecebidos.id)
          .then((response) => {
            const local = response.data;

            this.payload = {
              id: local.id,
              nome: local.nome || "",
              descricao: local.descricao || "",
              status: local.status === true || local.status === 1 ? 1 : 0,
              predio_id: local.predio_id || "",
              quarto: local.quarto === true || local.quarto === 1 ? 1 : 0,
              capacidade: local.capacidade,
            };

            this.mostrarModalCadastro = true;
          })
          .catch((error) => {
            console.error("Erro ao obter ", error);
            this.$toast.error("Erro ao carregar dados");
          });
      } else {
        this.payload = {
          nome: "",
          descricao: "",
          status: 1,
          predio_id: "",
          quarto: 0,
          capacidade: "",
        };
        this.mostrarModalCadastro = true;
      }
    },
    salvar() {
      if (!this.payload.nome || this.payload.nome.trim() === "") {
        this.$toast.error("Preencha o campo Nome");
        return;
      }

      if (!this.payload.predio_id) {
        this.$toast.error("Preencha o campo Prédio");
        return;
      }

      if (this.payload.quarto === 1 && (!this.payload.capacidade || this.payload.capacidade <= 0)) {
        this.$toast.error("Informe a capacidade máxima do quarto");
        return;
      }

      this.modoCadastro ? this.cadastrar() : this.atualizar();
    },
    cadastrar() {
      localService
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
      localService
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
      localService
        .deletar(this.idParaExcluir)
        .then(() => {
          this.$toast.success("Excluído com sucesso");
          this.getAll();
        })
        .catch((error) => {
          console.error("Erro ao excluir", error);

          const mensagemErro = error?.response?.data?.error || error?.response?.data?.message || "Erro ao excluir";

          this.$toast.error(mensagemErro);
        })
        .finally(() => {
          this.fecharModal();
        });
    },
  },
};
</script>
