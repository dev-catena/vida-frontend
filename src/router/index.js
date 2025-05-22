import { createRouter, createWebHashHistory } from "vue-router";
import { configuracaoRoutes } from "@/router/configuracao";
import { controleQuedaRoutes } from "@/router/controleQueda";
import prontuarioRoutes from "@/router/prontuario";
import { validarSessao } from "@/router/guards";

import HomeView from "@/view/HomeView.vue";
import LoginView from "@/view/Login/LoginView.vue";
import EsqueceuSenhaView from "@/view/Login/EsqueceuSenhaView.vue";
import ValidarTokenView from "@/view/Login/ValidarTokenView.vue";
import RedirectView from "@/view/RedirectView.vue";

const baseRoutes = [
  {
    path: "/:empresa/",
    name: "Home",
    component: HomeView,
    beforeEnter: validarSessao,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/esqueci-minha-senha",
    name: "EsqueciMinhaSenha",
    component: EsqueceuSenhaView,
  },
  {
    path: "/validar-token",
    name: "ValidarToken",
    component: ValidarTokenView,
  },
  {
    path: "/:catchAll(.*)",
    name: "Fallback",
    component: RedirectView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...baseRoutes,
    ...configuracaoRoutes,
    ...controleQuedaRoutes,
    ...prontuarioRoutes,
    {
      path: '/:empresa/hotelaria',
      name: 'Hotelaria',
      component: () => import('@/view/Hotelaria/HotelariaView.vue'),
      beforeEnter: validarSessao,
    },
    {
      path: '/:empresa/hotelaria/hospedes',
      name: 'HotelariaHospedes',
      component: () => import('@/view/Hotelaria/Hospedes/HospedesView.vue'),
      beforeEnter: validarSessao,
    },
    {
      path: '/:empresa/saude',
      name: 'Saude',
      component: () => import('@/view/Saude/SaudeView.vue'),
      beforeEnter: validarSessao,
    },
    {
      path: '/:empresa/saude/prontuario',
      name: 'SaudeProntuario',
      component: () => import('@/view/Saude/ProntuarioView.vue'),
      beforeEnter: validarSessao,
    },
    {
      path: '/:empresa/administracao',
      name: 'Administracao',
      component: () => import('@/view/Administracao/AdministracaoView.vue'),
      beforeEnter: validarSessao,
    },
    {
      path: '/:empresa/administracao/usuarios',
      name: 'AdministracaoUsuarios',
      component: () => import('@/view/Administracao/UsuariosView.vue'),
      beforeEnter: validarSessao,
    },
    {
      path: '/:empresa/administracao/configuracoes',
      name: 'AdministracaoConfiguracoes',
      component: () => import('@/view/Administracao/ConfiguracoesView.vue'),
      beforeEnter: validarSessao,
    },
    {
      path: '/:empresa/gestao',
      name: 'Gestao',
      component: () => import('@/view/Gestao/GestaoView.vue'),
      beforeEnter: validarSessao,
    },
    {
      path: '/:empresa/gestao/relatorios',
      name: 'GestaoRelatorios',
      component: () => import('@/view/Gestao/RelatoriosView.vue'),
      beforeEnter: validarSessao,
    },
    {
      path: '/:empresa/gestao/indicadores',
      name: 'GestaoIndicadores',
      component: () => import('@/view/Gestao/IndicadoresView.vue'),
      beforeEnter: validarSessao,
    },
    {
      path: '/:empresa/gestao/auditoria',
      name: 'GestaoAuditoria',
      component: () => import('@/view/Gestao/AuditoriaView.vue'),
      beforeEnter: validarSessao,
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const authToken = localStorage.getItem("authToken");
  if (to.name !== "Login" && !authToken) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
