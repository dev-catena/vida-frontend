<template>
  <section>
    <div class="titulo">
      <div class="margem container">
        <div class="m-icone direita">
          <div class="pesquisa">
            <input
              v-model="filtro"
              type="text"
              placeholder="Pesquisar grupo por nome"
              @input="pesquisaComFiltro"
            >
            <a
              class="icone-pesquisa"
              title="Pesquise"
            />
          </div>
        </div>
        <h2>Grupo</h2>
      </div>
    </div>
    <div class="margem container">
      <div class="bloco margem">
        <div
          v-if="permissoes.includes(1)"
          class="direita"
        >
          <button @click="abrirModalCadastro()">
            Cadastrar Grupo
          </button>
        </div>
        <table class="tabela alinha-centro">
          <thead class="alinha-centro">
            <tr>
              <th>Grupo</th>
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
              v-for="item in gruposFiltrados"
              :key="item.id"
            >
              <td>{{ item.nome }}</td>
              <td v-if="permissoes.includes(1)">
                <div class="linha direita">
                  <div>
                    <a
                      title="Clique para editar o grupo"
                      class="icone-editar"
                      @click="abrirModalCadastro(item)"
                    />
                  </div>
                  <div>
                    <a
                      title="Clique para excluir grupo"
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
            Confirma a exclusão do grupo: <strong>{{ nomeToDelete }}</strong>?
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
        style="height: min-content; width: 25rem; padding: 2rem"
      >
        <div>
          <h3>{{ modoCadastro ? "Cadastrar" : "Editar" }} Grupo</h3>
        </div>

        <div style="text-align: center; width: 100%">
          <div class="margem">
            <div>
              <label for="nome">Grupo</label>
              <input
                id="nome"
                v-model="grupo.nome"
                type="text"
                autocomplete="off"
                required
              >
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
              @click="salvarGrupo"
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
  name: "GrupoView",
  data() {
    return {
      permissoes: [],
      grupos: [],
      grupo: { nome: "" },
      filtro: "",
      idToDelete: null,
      nomeToDelete: "",
      showDeleteModal: false,
      showCadastroModal: false,
      modoCadastro: true,
    };
  },
  computed: {
    gruposFiltrados() {
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
    salvarGrupo() {
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
          toaster.show("Grupo cadastrado com sucesso!", { type: "success" });
          this.getAll();
          this.fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao cadastrar grupo:", error);
          toaster.show("Erro ao cadastrar grupo", { type: "error" });
        });
    },
    atualizarGrupo() {
      grupoService
        .atualizar(this.grupo)
        .then(() => {
          toaster.show("Grupo atualizado com sucesso!", { type: "success" });
          this.getAll();
          this.fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao atualizar grupo:", error);
          toaster.show("Erro ao atualizar grupo", { type: "error" });
        });
    },
    abrirModalExcluir(grupo) {
      this.idToDelete = grupo.id;
      this.nomeToDelete = grupo.nome;
      this.showDeleteModal = true;
    },
    confirmarExclusao() {
      grupoService
        .deletar(this.idToDelete)
        .then(() => {
          toaster.show("Grupo excluído com sucesso", { type: "success" });
          this.getAll();
        })
        .catch((error) => {
          console.error("Erro ao excluir grupo:", error);
          toaster.show("Erro ao excluir grupo", { type: "error" });
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
