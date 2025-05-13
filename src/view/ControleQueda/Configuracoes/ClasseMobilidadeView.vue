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
              <th>Nome da Classe</th>
              <th>Grau de Mobilidade</th>
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
              <td>{{ item.grau_mobilidade }}</td>
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
          <div class="grid-2">
            <div class="col-2">
              <label for="nome">Nome da Classe*</label>
              <input
                id="nome"
                v-model="payload.nome"
                type="text"
                autocomplete="off"
                required
              >
            </div>

            <div class="col-1">
              <label for="grauMobilidade">Grau de Dependência* </label>
              <select
                id="grauMobilidade"
                v-model="payload.grau_mobilidade"
                required
              >
                <option value="Alta">
                  Alta
                </option>
                <option value="Média">
                  Média
                </option>
                <option value="Baixa">
                  Baixa
                </option>
                <option value="Nenhuma">
                  Nenhuma
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
import classeMobilidadeService from "@/services/configuracoes/classeMobilidadeService";

export default {
  name: "ClasseMobilidadeView",
  data() {
    return {
      nomeSingular: "Classe Mobilidade",
      nomePlural: "Classes de Mobilidade",
      permissoes: [],
      dadosRecebidos: [],
      payload: { nome: "", grau_mobilidade: "", status: 1 },
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
      return this.$filtrarDados(this.dadosRecebidos, this.filtro, ["codigo", "nome", "grau_mobilidade"]);
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
      classeMobilidadeService
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
        classeMobilidadeService
          .obterPorId(dadosRecebidos.id)
          .then((response) => {
            const dados = response.data;

            this.payload = {
              id: dados.id,
              nome: dados.nome || "",
              grau_mobilidade: dados.grau_mobilidade || "",
              status: dados.status === true || dados.status === 1 ? 1 : 0,
            };

            this.mostrarModalCadastro = true;
          })
          .catch((error) => {
            console.error("Erro ao buscar por ID", error);
            this.$toast.error("Erro ao carregar os dados para edição.");
          });
      } else {
        this.payload = {
          nome: "",
          grau_mobilidade: "",
          status: 1,
        };
        this.mostrarModalCadastro = true;
      }
    },
    salvar() {
      const camposObrigatorios = {
        nome: "Nome da Classe",
        grau_mobilidade: "Grau de Dependência",
      };

      const camposFaltando = [];

      for (const campo in camposObrigatorios) {
        const valor = this.payload[campo];
        if (!valor || (typeof valor === "string" && valor.trim() === "")) {
          camposFaltando.push(camposObrigatorios[campo]);
        }
      }

      if (camposFaltando.length > 0) {
        this.$toast.error(`Preencha os campos obrigatórios: ${camposFaltando.join(", ")}`);
        return;
      }

      this.payload.status = Number(this.payload.status);

      this.modoCadastro ? this.cadastrar() : this.atualizar();
    },
    cadastrar() {
      classeMobilidadeService
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
      classeMobilidadeService
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
      classeMobilidadeService
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
