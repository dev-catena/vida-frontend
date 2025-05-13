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
              <td>{{ item.nome }}</td>
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
      v-if="showDeleteModal"
      style="overflow: auto"
      class="modal-mask"
      @click="fecharModalFora"
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
      v-if="showCadastroModal"
      style="overflow: auto"
      class="modal-mask"
      @click="fecharModalFora"
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
              <label for="nome">Nome da Condição* </label>
              <input
                id="nome"
                v-model="grupo.nome"
                type="text"
                autocomplete="off"
                required
              >
            </div>
            <div class="col-2">
              <label for="descricao">Descrição</label>
              <textarea
                id="descricao"
                v-model="grupo.nome"
                rows="5"
                autocomplete="off"
                required
              />
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
import grupoService from "@/services/funcionalidade/grupoService";
import { createToaster } from "@meforma/vue-toaster";
import funcionalidadeService from "@/services/funcionalidade/funcionalidadeService";

const toaster = createToaster({
  position: "top-right",
  duration: 4000,
});

export default {
  name: "CondicaoSaudeView",
  data() {
    return {
      nomeSingular: "Condição de Saúde",
      nomePlural: "Condições de Saúde",
      permissoes: [],
      grupos: [],
      grupo: { nome: "" },
      filtro: "",
      idToDelete: null,
      nomeParaExcluir: "",
      showDeleteModal: false,
      showCadastroModal: false,
      modoCadastro: true,
    };
  },
  computed: {
    dadosFiltrados() {
      const buscaNome = this.filtro.toLowerCase();
      return this.grupos.filter((item) => {
        return item.nome && item.nome.toLowerCase().includes(buscaNome);
      });
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
      grupoService
        .obterTodos()
        .then((response) => {
          this.grupos = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter grupos:", error);
          this.grupos = [];
        });
    },
    abrirModalCadastro(grupo = null) {
      this.modoCadastro = !grupo;
      this.grupo = grupo
        ? { ...grupo }
        : {
            nome: "",
          };
      this.showCadastroModal = true;
    },
    salvar() {
      if (!this.grupo.nome || this.grupo.nome.trim() === "") {
        toaster.show("O campo 'Grupo' é obrigatório", { type: "error" });
        return;
      }

      this.modoCadastro ? this.cadastrarGrupo() : this.atualizarGrupo();
    },
    cadastrarGrupo() {
      grupoService
        .cadastrar(this.grupo)
        .then(() => {
          toaster.show("Cadastrado com sucesso!", { type: "success" });
          this.getAll();
          this.fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao cadastrar", error);
          toaster.show("Erro ao cadastrar", { type: "error" });
        });
    },
    atualizarGrupo() {
      grupoService
        .atualizar(this.grupo)
        .then(() => {
          toaster.show("Atualizado com sucesso!", { type: "success" });
          this.getAll();
          this.fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao atualizar", error);
          toaster.show("Erro ao atualizar", { type: "error" });
        });
    },
    abrirModalExcluir(grupo) {
      this.idToDelete = grupo.id;
      this.nomeParaExcluir = grupo.nome;
      this.showDeleteModal = true;
    },
    confirmarExclusao() {
      grupoService
        .deletar(this.idToDelete)
        .then(() => {
          toaster.show("Excluído com sucesso", { type: "success" });
          this.getAll();
        })
        .catch((error) => {
          console.error("Erro ao excluir", error);
          toaster.show("Erro ao excluir", { type: "error" });
        })
        .finally(() => {
          this.fecharModal();
        });
    },
    fecharModal() {
      this.showDeleteModal = false;
      this.showCadastroModal = false;
    },
    fecharModalFora(event) {
      if (event.target.classList.contains("modal-mask")) {
        this.fecharModal();
      }
    },
  },
};
</script>
