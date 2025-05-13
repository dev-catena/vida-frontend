import HomeConfiguracoesView from "@/view/HomeConfiguracoesView.vue";
import EmpresaView from "@/view/Empresa/EmpresaView.vue";
import GrupoView from "@/view/Empresa/GrupoView.vue";
import VinculoGrupoFuncionalidadeView from "@/view/Empresa/VinculoGrupoFuncionalidadeView.vue";
import VinculoGrupoUsuarioView from "@/view/Empresa/VinculoGrupoUsuarioView.vue";
import { validarSessao, validarPermissao } from "@/router/guards";

export const configuracaoRoutes = [
  {
    path: "/:empresa/configuracao",
    name: "Configuracao",
    component: HomeConfiguracoesView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 1 },
  },
  {
    path: "/:empresa/configuracao/personalizacao",
    name: "Empresa",
    component: EmpresaView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 1 },
  },
  {
    path: "/:empresa/configuracao/grupo",
    name: "CadastrarGrupo",
    component: GrupoView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 1 },
  },
  {
    path: "/:empresa/configuracao/grupo-funcionalidade",
    name: "GrupoFuncionalidade",
    component: VinculoGrupoFuncionalidadeView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 1 },
  },
  {
    path: "/:empresa/configuracao/grupo-usuario",
    name: "GrupoUsuario",
    component: VinculoGrupoUsuarioView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 1 },
  },
];
