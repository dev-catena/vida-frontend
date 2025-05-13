<template>
  <div class="titulo">
    <div class="margem container">
      <h2>Adicionar funcionalidades a um grupo</h2>
    </div>
  </div>

  <div class="container margem">
    <div class="bloco margem">
      <label>Selecione um grupo: </label>
      <div>
        <select
          v-model="grupoSelecionado"
          @change="handleGrupoSelecionadoChange"
        >
          <option
            value=""
            disabled
          >
            Selecione
          </option>
          <option
            v-for="item in grupos"
            :key="item.id"
            :value="item.id"
          >
            {{ item.nome }}
          </option>
        </select>
      </div>
    </div>
  </div>

  <div
    v-if="grupoSelecionado"
    class="container margem"
  >
    <div class="bloco margem">
      <label>Funcionalidades para adicionar:</label>

      <input
        v-model="pesquisaFuncionalidade"
        type="text"
        placeholder="Digite o nome da funcionalidade"
        class="input-autocomplete"
        @focus="mostrarListaFuncionalidades"
        @input="filtrarFuncionalidades"
        @blur="fecharListaFuncionalidades"
      >

      <ul
        v-if="exibirLista && funcionalidadesFiltradas.length > 0"
        class="lista-autocomplete"
      >
        <li
          v-for="func in funcionalidadesFiltradas"
          :key="func.id"
          :class="{ 'item-desativado': isFuncInGroup(func) }"
          @click="selecionarFuncionalidade(func)"
        >
          {{ func.nome + " - " + func.descricao }}
        </li>
      </ul>

      <div style="margin-top: 10px">
        <ul>
          <li
            v-for="func in funcionalidadesNoGrupo"
            :key="func.id"
            style="margin-bottom: 10px"
          >
            {{ func.nome + " - " + func.descricao }}
            <i
              class="icone-deletar icone-menor direita"
              style="cursor: pointer; scale: 1.3; margin-bottom: 0px"
              button
              @click="desassociarFunc(func)"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import grupoService from "@/services/funcionalidade/grupoService";
import grupoFuncionalidadeService from "@/services/funcionalidade/grupoFuncionalidadeService";
import funcionalidadeService from "@/services/funcionalidade/funcionalidadeService";
import { createToaster } from "@meforma/vue-toaster";

const toaster = createToaster({
  position: "top-right",
  duration: 3000,
});

export default {
  name: "VinculoGrupoFuncionalidadeView",
  data() {
    return {
      grupos: [],
      grupoSelecionado: null,
      funcionalidades: [],
      funcionalidadesNoGrupo: [],
      funcionalidadeSelecionada: null,
      pesquisaFuncionalidade: "",
      funcionalidadesFiltradas: [],
      exibirLista: false,
    };
  },
  mounted() {
    this.getAllGrupos();
    this.getAllFuncionalidades();
  },
  methods: {
    handleGrupoSelecionadoChange() {
      if (this.grupoSelecionado) {
        this.obterFuncionalidadesGrupo(this.grupoSelecionado);
      }
    },

    isFuncInGroup(func) {
      return this.funcionalidadesNoGrupo.some((f) => f.id === func.id);
    },

    associarFuncionalidade() {
      if (!this.funcionalidadeSelecionada) return;
      grupoFuncionalidadeService
        .cadastrar(this.funcionalidadeSelecionada, this.grupoSelecionado)
        .then(() => {
          const funcionalidade = this.funcionalidades.find((f) => f.id === this.funcionalidadeSelecionada);
          this.funcionalidadesNoGrupo.push(funcionalidade);
          this.funcionalidadeSelecionada = null;
          this.pesquisaFuncionalidade = "";
          //this.filtrarFuncionalidades();
          toaster.show("Funcionalidade adicionada", { type: "success" });
        })
        .catch((error) => {
          console.error("Erro ao associar funcionalidade:", error);
        });
    },

    desassociarFunc(func) {
      grupoFuncionalidadeService
        .deletar(func.id, this.grupoSelecionado)
        .then(() => {
          this.funcionalidadesNoGrupo = this.funcionalidadesNoGrupo.filter((f) => f.id !== func.id);
          toaster.show("Funcionalidade removida", { type: "info" });
        })
        .catch((error) => {
          console.error("Erro ao desassociar funcionalidade:", error);
        });
    },
    obterFuncionalidadesGrupo(id) {
      grupoFuncionalidadeService
        .obterFuncionalidade(id)
        .then((response) => {
          this.funcionalidadesNoGrupo = Array.isArray(response.data) ? response.data : [];
        })
        .catch((error) => {
          console.log("Erro ao carregar funcionalidades do grupo:", error);
        });
    },

    getAllFuncionalidades() {
      funcionalidadeService
        .obterTodos()
        .then((response) => {
          this.funcionalidades = response.data;
          this.funcionalidadesFiltradas = this.funcionalidades;
        })
        .catch((error) => {
          console.log("Erro ao carregar funcionalidades:", error);
        });
    },

    getAllGrupos() {
      grupoService
        .obterTodos()
        .then((response) => {
          this.grupos = response.data;
        })
        .catch((error) => {
          console.log("Erro ao carregar grupos:", error);
        });
    },
    filtrarFuncionalidades() {
      const pesquisa = this.pesquisaFuncionalidade.toLowerCase();
      this.funcionalidadesFiltradas = this.funcionalidades.filter((func) => {
        return func.nome.toLowerCase().includes(pesquisa) || func.descricao.toLowerCase().includes(pesquisa);
      });
      this.exibirLista = true;
    },

    selecionarFuncionalidade(func) {
      if (this.isFuncInGroup(func)) {
        toaster.show("Funcionalidade já foi adicionada", { type: "error" });
        return;
      }
      this.funcionalidadeSelecionada = func.id;
      this.associarFuncionalidade();
      this.filtrarFuncionalidades();
    },

    mostrarListaFuncionalidades() {
      this.exibirLista = true;
      this.funcionalidadesFiltradas = this.funcionalidades;
    },

    fecharListaFuncionalidades() {
      setTimeout(() => {
        this.exibirLista = false;
      }, 200);
    },
  },
};
</script>

<style scoped>
.input-autocomplete {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
}

.lista-autocomplete {
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: white;
}

.lista-autocomplete li {
  padding: 8px;
  cursor: pointer;
}

li:hover {
  background-color: lightblue;
  cursor: pointer;
}

.item-desativado {
  color: #888;
  pointer-events: none;
}
</style>
