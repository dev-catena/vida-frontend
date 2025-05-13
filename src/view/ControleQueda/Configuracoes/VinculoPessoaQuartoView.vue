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
              <th>Prédio</th>
              <th>Quarto</th>
              <th>Hóspede</th>

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
              <td>{{ item.local.predio.nome }}</td>
              <td>{{ item.local.nome }}</td>
              <td>{{ item.pessoa.nome }}</td>

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
            <div class="col-2">
              <label for="pessoa_id">Hóspede*</label>
              <select
                id="pessoa_id"
                v-model="payload.pessoa_id"
                required
              >
                <option
                  disabled
                  value=""
                >
                  Selecione
                </option>
                <option
                  v-for="p in dadosRecebidosPessoa"
                  :key="p.id"
                  :value="p.id"
                >
                  {{ p.nome }}
                </option>
              </select>
            </div>

            <div class="col-1">
              <label for="predio_id">Prédio*</label>
              <select
                id="predio_id"
                v-model="payload.predio_id"
                required
                @change="carregarLocaisPorPredio"
              >
                <option
                  disabled
                  value=""
                >
                  Selecione
                </option>
                <option
                  v-for="p in dadosRecebidosPredio"
                  :key="p.id"
                  :value="p.id"
                >
                  {{ p.nome }}
                </option>
              </select>
            </div>

            <div class="col-1">
              <label for="local_id">Quarto*</label>
              <select
                id="local_id"
                v-model="payload.local_id"
                :disabled="!dadosRecebidosLocal.length"
                required
              >
                <option
                  disabled
                  value=""
                >
                  Selecione
                </option>
                <option
                  v-for="l in dadosRecebidosLocal"
                  :key="l.id"
                  :value="l.id"
                >
                  {{ l.nome }}
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
import pessoaQuartoService from "@/services/configuracoes/pessoaQuartoService";
import pessoaService from "@/services/configuracoes/pessoaService";
import predioService from "@/services/configuracoes/predioService";

export default {
  name: "VinculoPessoaQuartoView",
  data() {
    return {
      nomeSingular: "Configuração de Hóspede e Quarto",
      nomePlural: "Configurações de Hóspedes e Quartos",
      permissoes: [],
      dadosRecebidos: [],
      dadosRecebidosPessoa: [],
      dadosRecebidosLocal: [],
      dadosRecebidosPredio: [],
      payload: { pessoa_id: "", predio_id: "", local_id: "" },
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
      return this.$filtrarDados(this.dadosRecebidos, this.filtro, ["local.predio.nome", "local.nome", "pessoa.nome"]);
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
      pessoaQuartoService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidos = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter grupos:", error);
          this.dadosRecebidos = [];
        });
    },
    getAllPessoaSemQuarto() {
      pessoaService
        .obterTodosSemQuarto()
        .then((response) => {
          this.dadosRecebidosPessoa = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidosPessoa = [];
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

    async carregarLocaisPorPredio() {
      if (!this.payload.predio_id) {
        this.dadosRecebidosLocal = [];
        this.payload.local_id = "";
        return;
      }

      try {
        const response = await predioService.obterTodosQuartos(this.payload.predio_id);
        const locais = Array.isArray(response.data) ? response.data : [];

        this.dadosRecebidosLocal = locais;

        if (locais.length === 0) {
          this.payload.local_id = "";
        } else {
          const existe = locais.some((l) => l.id === this.payload.local_id);
          if (!existe) {
            this.payload.local_id = "";
          }
        }
      } catch (error) {
        console.error("Erro ao carregar os locais (quartos):", error);
        this.dadosRecebidosLocal = [];
        this.payload.local_id = "";
        this.$toast.error("Erro ao carregar os quartos");
      }
    },
    abrirModalCadastro(item = null) {
      this.modoCadastro = !item;

      this.getAllPessoaSemQuarto();
      this.getAllPredio();

      if (!item) {
        this.payload = {
          pessoa_id: "",
          predio_id: "",
          local_id: "",
        };
        this.dadosRecebidosLocal = [];
        this.mostrarModalCadastro = true;
        return;
      }

      pessoaQuartoService
        .obterPorId(item.id)
        .then(async (response) => {
          const data = response.data;

          this.payload = {
            id: data.id,
            pessoa_id: data.pessoa_id,
            predio_id: data.local?.predio_id || "",
            local_id: data.local_id,
            status: data.status ? 1 : 0,
          };

          if (data.pessoa && !this.dadosRecebidosPessoa.find((p) => p.id === data.pessoa.id)) {
            this.dadosRecebidosPessoa.push(data.pessoa);
          }

          if (this.payload.predio_id) {
            await this.carregarLocaisPorPredio();
          }

          this.mostrarModalCadastro = true;
        })
        .catch((error) => {
          console.error("Erro ao carregar dados para edição", error);
          this.$toast.error("Erro ao carregar dados para edição");
        });
    },

    salvar() {
      if (!this.payload.pessoa_id || !this.payload.local_id) {
        this.$toast.error("Preencha os campos obrigatórios");
        return;
      }

      this.modoCadastro ? this.cadastrar() : this.atualizar();
    },
    cadastrar() {
      pessoaQuartoService
        .cadastrar(this.payload)
        .then(() => {
          this.$toast.success("Cadastrado com sucesso!");
          this.getAll();
          this.fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao cadastrar", error);
          const mensagemErro = error?.response?.data?.error || error?.response?.data?.message || "Erro ao cadastrar";
          this.$toast.error(mensagemErro);
        });
    },
    atualizar() {
      pessoaQuartoService
        .atualizar(this.payload)
        .then(() => {
          this.$toast.success("Atualizado com sucesso!");
          this.getAll();
          this.fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao atualizar", error);
          const mensagemErro = error?.response?.data?.error || error?.response?.data?.message || "Erro ao atualizar";
          this.$toast.error(mensagemErro);
        });
    },
    abrirModalExcluir(grupo) {
      this.idParaExcluir = grupo.id;
      this.nomeParaExcluir = grupo.nome;
      this.mostrarModalExcluir = true;
    },
    confirmarExclusao() {
      pessoaQuartoService
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
