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
              <th>Status</th>
              <th>Última verficação</th>
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
              <td>
                <span :class="['status-badge', item.status === true ? 'status-ativo' : 'status-inativo']">
                  {{ item.status === true ? "Ativo" : "Inativo" }}
                </span>
              </td>
              <td>{{ formatarDataHora(item.updated_at) }}</td>
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
              <label for="nome">Nome*</label>
              <input
                id="nome"
                v-model="payload.nome"
                type="text"
                required
              >
            </div>
            <div class="col-1">
              <label for="ip">Endereço IP*</label>
              <input
                id="ip"
                v-model="payload.camera_ip"
                type="text"
                placeholder="192.168.1.100"
                required
              >
            </div>
            <div class="col-1">
              <label for="porta">Porta*</label>
              <input
                id="porta"
                v-model="payload.camera_porta"
                type="number"
                placeholder="8080"
                required
              >
            </div>
            <div class="col-2">
              <label for="usuario">Usuário*</label>
              <input
                id="usuario"
                v-model="payload.camera_usuario"
                type="text"
                required
              >
            </div>
            <div class="col-1">
              <label for="senha">Senha*</label>
              <input
                id="senha"
                v-model="payload.camera_senha"
                type="password"
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
            <div class="col-4">
              <label for="observacoes">Observações</label>
              <textarea
                id="observacoes"
                v-model="payload.observacao"
                rows="4"
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
import funcionalidadeService from "@/services/funcionalidade/funcionalidadeService";
import cameraService from "@/services/configuracoes/cameraService";

export default {
  name: "CameraView",
  data() {
    return {
      nomeSingular: "Câmera",
      nomePlural: "Câmeras",
      permissoes: [],
      dadosRecebidos: [],
      payload: {
        nome: "",
        camera_ip: "",
        camera_porta: 8080,
        camera_usuario: "",
        camera_senha: "",
        observacao: "",
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
      return this.$filtrarDados(this.dadosRecebidos, this.filtro, ["codigo", "nome", "status", "updated_at"]);
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
      cameraService
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
        cameraService
          .obterPorId(dadosRecebidos.id)
          .then((response) => {
            this.payload = {
              id: response.data.id,
              nome: response.data.nome || "",
              camera_ip: response.data.camera_ip || "",
              camera_porta: response.data.camera_porta || 8080,
              camera_usuario: response.data.camera_usuario || "",
              camera_senha: "", // não retorna por segurança
              observacao: response.data.observacao || "",
              status: response.data.status === true || response.data.status === 1 ? 1 : 0,
            };
            this.mostrarModalCadastro = true;
          })
          .catch((error) => {
            console.error("Erro ao carregar dados da câmera", error);
            this.$toast.error("Erro ao carregar os dados para edição.");
          });
      } else {
        this.payload = {
          id: null,
          nome: "",
          camera_ip: "",
          camera_porta: 8080,
          camera_usuario: "",
          camera_senha: "",
          observacao: "",
          status: 1,
        };
        this.mostrarModalCadastro = true;
      }
    },
    salvar() {
      const camposObrigatorios = {
        nome: "Nome",
        camera_ip: "Endereço IP",
        camera_porta: "Porta",
        camera_usuario: "Usuário",
        camera_senha: "Senha",
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

      const payload = { ...this.payload };
      if (!payload.camera_senha) delete payload.camera_senha;

      this.modoCadastro ? this.cadastrar(payload) : this.atualizar(payload);
    },
    cadastrar(payload) {
      cameraService
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
      cameraService
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
      cameraService
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
