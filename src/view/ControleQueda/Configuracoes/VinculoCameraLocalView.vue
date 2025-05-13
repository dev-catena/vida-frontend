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
              <th>Camera</th>
              <th>Local</th>
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
              <td>{{ item.camera.nome }}</td>
              <td>{{ item.local.nome }}</td>
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
        style="height: min-content; width: 25rem; padding: 2rem"
      >
        <div>
          <h3>{{ modoCadastro ? "Cadastrar" : "Editar" }} {{ nomeSingular }}</h3>
        </div>

        <div class="margem">
          <div class="grid-1">
            <div class="col-1">
              <label for="camera_id">Câmera*</label>
              <select
                id="camera_id"
                v-model="payload.camera_id"
              >
                <option
                  disabled
                  value=""
                >
                  Selecione
                </option>
                <option
                  v-for="item in dadosRecebidosCameras"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.nome }}
                </option>
              </select>
            </div>
            <div class="col-1">
              <label for="local_id">Local*</label>
              <select
                id="local_id"
                v-model="payload.local_id"
              >
                <option
                  disabled
                  value=""
                >
                  Selecione
                </option>
                <option
                  v-for="item in dadosRecebidosLocais"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.nome }}
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
import cameraLocalService from "@/services/configuracoes/cameraLocalService";
import cameraService from "@/services/configuracoes/cameraService";
import localService from "@/services/configuracoes/localService";

export default {
  name: "VinculoCameraLocalView",
  data() {
    return {
      nomeSingular: "Câmera e Local",
      nomePlural: "Câmeras e Locais",
      permissoes: [],
      dadosRecebidos: [],
      dadosRecebidosCaemras: [],
      dadosRecebidosLocais: [],
      payload: {
        camera_id: "",
        local_id: "",
        status: 1,
      },
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
      return this.$filtrarDados(this.dadosRecebidos, this.filtro, ["camera.nome", "local.nome", "status"]);
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
      cameraLocalService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidos = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidos = [];
        });
    },
    async abrirModalCadastro(item = null) {
      this.modoCadastro = !item;

      const [cameras, locais] = await Promise.all([cameraService.obterTodos(), localService.obterTodos()]);

      this.dadosRecebidosCameras = Array.isArray(cameras.data) ? cameras.data : [];
      this.dadosRecebidosLocais = Array.isArray(locais.data) ? locais.data : [];

      if (item && item.id) {
        cameraLocalService
          .obterPorId(item.id)
          .then((response) => {
            this.payload = {
              id: response.data.id,
              camera_id: response.data.camera_id || "",
              local_id: response.data.local_id || "",
              status: response.data.status === true || response.data.status === 1 ? 1 : 0,
            };
            this.mostrarModalCadastro = true;
          })
          .catch((error) => {
            console.error("Erro ao carregar dados", error);
            this.$toast.error("Erro ao carregar os dados para edição.");
          });
      } else {
        this.payload = {
          camera_id: "",
          local_id: "",
          status: 1,
        };
        this.mostrarModalCadastro = true;
      }
    },
    salvar() {
      if (!this.payload.camera_id || !this.payload.local_id) {
        this.$toast.error("Preencha os campos obrigatórios");
        return;
      }

      const payload = { ...this.payload };
      this.modoCadastro ? this.cadastrar(payload) : this.atualizar(payload);
    },
    cadastrar(payload) {
      cameraLocalService
        .cadastrar(payload)
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
    atualizar(payload) {
      cameraLocalService
        .atualizar(payload)
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
      cameraLocalService
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
