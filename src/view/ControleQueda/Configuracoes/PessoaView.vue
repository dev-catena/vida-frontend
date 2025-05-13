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
              <th>Sexo</th>
              <th>Data de Nascimento</th>
              <th>Classe Mobilidade</th>
              <th>Condições de Saúde</th>
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
              <td>{{ item.sexo }}</td>
              <td>{{ formatarData(item.data_nascimento) }}</td>
              <td>{{ item.mobilidade_classe.nome }}</td>
              <td>
                <span
                  v-for="cond in item.condicoes_saude"
                  :key="cond.id"
                  class="chip bg-cinza fonte"
                >
                  {{ cond.nome }}
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
        style="overflow-y: auto; height: 50rem; width: 50rem; padding: 2rem"
      >
        <div>
          <h3>{{ modoCadastro ? "Cadastrar" : "Editar" }} {{ nomeSingular }}</h3>
        </div>

        <div class="margem">
          <div class="margem bloco">
            <div class="grid-2">
              <div class="col-1">
                <label for="nome">Nome*</label>
                <input
                  id="nome"
                  v-model="payload.nome"
                  type="text"
                  required
                >
              </div>
              <div class="col-1">
                <label for="CPF">CPF*</label>
                <input
                  id="CPF"
                  v-model="payload.CPF"
                  v-mask="'###.###.###-##'"
                  type="text"
                  required
                >
              </div>

              <div class="col-1">
                <label for="sexo">Sexo*</label>
                <select
                  id="sexo"
                  v-model="payload.sexo"
                  required
                >
                  <option value="Masculino">
                    Masculino
                  </option>
                  <option value="Feminino">
                    Feminino
                  </option>
                  <option value="Outro">
                    Outro
                  </option>
                </select>
              </div>
              <div class="col-1">
                <label for="data_nascimento">Data de Nascimento*</label>
                <input
                  id="data_nascimento"
                  v-model="payload.data_nascimento"
                  type="date"
                  required
                >
              </div>

              <div class="col-1">
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
                    v-for="classe in dadosRecebidosClasseMobilidade"
                    :key="classe.id"
                    :value="classe.id"
                  >
                    {{ classe.nome }}
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

              <div class="col-2">
                <label for="observacao">Observação</label>
                <textarea
                  id="observacao"
                  v-model="payload.observacao"
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div class="margem bloco">
            <div class="grid-2">
              <div class="col-2">
                <label>Tecnologias de Monitoramento</label>
                <div class="linha-checkbox">
                  <label
                    v-for="tec in dadosRecebidosTecnologiaMonitoramento"
                    :key="tec.id"
                    class="checkbox-item"
                  >
                    <input
                      v-model="payload.tecnologias_monitoramento"
                      type="checkbox"
                      :value="tec.id"
                    >
                    {{ tec.nome }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="margem bloco">
            <div class="grid-2">
              <div class="col-2">
                <label>Condições de Saúde</label>
                <div class="linha-checkbox">
                  <label
                    v-for="cond in dadosRecebidosCondicoesSaude"
                    :key="cond.id"
                    class="checkbox-item"
                  >
                    <input
                      v-model="payload.condicoes_saude"
                      type="checkbox"
                      :value="cond.id"
                    >
                    {{ cond.nome }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="margem bloco">
            <div class="grid-2">
              <div class="linha col-2 alinha-v">
                <div>Responsáveis</div>
                <span
                  type="button"
                  class="chip bg-ok clicavel"
                  @click="adicionarResponsavel"
                >Adicionar responsável</span>
              </div>
              <div class="col-2">
                <div
                  v-for="(resp, index) in payload.responsaveis"
                  :key="index"
                  class="linha alinha-centro margem-baixa"
                >
                  <input
                    v-model="resp.nome"
                    type="text"
                    placeholder="Nome do responsável"
                    style="width: 45%; margin-right: 1rem"
                  >
                  <input
                    v-model="resp.contato"
                    v-mask="'(##) #####-####'"
                    type="text"
                    placeholder="Contato"
                    style="width: 45%; margin-right: 1rem"
                  >
                  <button
                    class="acao-secundaria"
                    @click="removerResponsavel(index)"
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
import pessoaService from "@/services/configuracoes/pessoaService";
import tecnologiaMonitoramentoService from "@/services/configuracoes/tecnologiaMonitoramentoService";
import classeMobilidadeService from "@/services/configuracoes/classeMobilidadeService";
import condicaoSaudeService from "@/services/configuracoes/condicaoSaudeService";

export default {
  name: "HospedeView",
  data() {
    return {
      nomeSingular: "Hóspede",
      nomePlural: "Hóspedes",
      permissoes: [],
      dadosRecebidos: [],
      dadosRecebidosTecnologiaMonitoramento: [],
      dadosRecebidosClasseMobilidade: [],
      dadosRecebidosCondicoesSaude: [],
      payload: {
        nome: "",
        CPF: "",
        codigo: "",
        sexo: "",
        data_nascimento: "",
        pessoa_tipo_id: 1,
        mobilidade_classe_id: null,
        observacao: "",
        status: 1,
        tecnologias_monitoramento: [],
        condicoes_saude: [],
        responsaveis: [{ nome: "", contato: "" }],
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
      return this.$filtrarDados(this.dadosRecebidos, this.filtro, ["codigo", "sexo", "data_nascimento", "nome", "mobilidade_classe.nome", "condicoes_saude[].nome"]);
    },
  },
  mounted() {
    this.getAll();

    this.carregarFuncionalidades();
  },
  methods: {
    getAllCondicoesSaude() {
      condicaoSaudeService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidosCondicoesSaude = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dados", error);
          this.dadosRecebidosCondicoesSaude = [];
        });
    },

    async carregarFuncionalidades() {
      this.permissoes = await funcionalidadeService.obterFuncionalidadeUsuario();
    },
    getAll() {
      pessoaService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidos = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidos = [];
        });
    },
    getAllTecnologiaMonitoramento() {
      tecnologiaMonitoramentoService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidosTecnologiaMonitoramento = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidosTecnologiaMonitoramento = [];
        });
    },
    getAllClasseMobilidade() {
      classeMobilidadeService
        .obterTodos()
        .then((response) => {
          this.dadosRecebidosClasseMobilidade = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.error("Erro ao obter dadosRecebidos", error);
          this.dadosRecebidosClasseMobilidade = [];
        });
    },
    adicionarResponsavel() {
      this.payload.responsaveis.push({ nome: "", contato: "" });
    },
    removerResponsavel(index) {
      this.payload.responsaveis.splice(index, 1);
    },
    abrirModalCadastro(item = null) {
      this.modoCadastro = !item;
      this.getAllTecnologiaMonitoramento();
      this.getAllClasseMobilidade();
      this.getAllCondicoesSaude();

      if (!item) {
        this.payload = {
          CPF: "",
          nome: "",
          codigo: "",
          sexo: "",
          data_nascimento: "",
          pessoa_tipo_id: 1,
          mobilidade_classe_id: null,
          observacao: "",
          status: 1,
          tecnologias_monitoramento: [],
          condicoes_saude: [],
          responsaveis: [{ nome: "", contato: "" }],
        };
        this.mostrarModalCadastro = true;
        return;
      }

      pessoaService
        .obterPorId(item.id)
        .then((response) => {
          const data = response.data;

          this.payload = {
            ...data,
            status: data.status === true || data.status === 1 ? 1 : 0,
            tecnologias_monitoramento: data.tecnologias_monitoramento?.map((t) => t.id) || [],
            condicoes_saude: data.condicoes_saude?.map((c) => c.id) || [],
            responsaveis: data.responsaveis || [{ nome: "", contato: "" }],
          };

          this.mostrarModalCadastro = true;
        })
        .catch((error) => {
          console.error("Erro ao carregar pessoa por ID:", error);
          this.$toast.error("Erro ao carregar dados para edição");
        });
    },

    validarCamposObrigatorios() {
      const obrigatorios = ["nome", "CPF", "sexo", "data_nascimento", "mobilidade_classe_id"];

      const labels = {
        nome: "Nome",
        CPF: "CPF",
        sexo: "Sexo",
        data_nascimento: "Data de Nascimento",
        mobilidade_classe_id: "Classe de Mobilidade",
      };

      for (const campo of obrigatorios) {
        if (!this.payload[campo] || this.payload[campo].toString().trim() === "") {
          const campoFormatado = labels[campo] || campo;
          this.$toast.error(`Preencha o campo ${campoFormatado}`);
          return false;
        }
      }

      // especifico responsavel
      const temResponsavelValido = this.payload.responsaveis.some((r) => {
        return r.nome?.trim() && r.contato?.trim();
      });

      if (!temResponsavelValido) {
        this.$toast.error("Informe pelo menos um responsável com nome e contato.");
        return false;
      }
      // fim

      return true;
    },

    salvar() {
      if (!this.validarCamposObrigatorios()) return;
      this.modoCadastro ? this.cadastrar() : this.atualizar();
    },

    cadastrar() {
      pessoaService
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
      pessoaService
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
      pessoaService
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
