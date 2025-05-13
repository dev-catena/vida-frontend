import PessoaView from "@/view/ControleQueda/Configuracoes/PessoaView.vue";
import CondicaoSaudeView from "@/view/ControleQueda/Configuracoes/CondicaoSaudeView.vue";
import classeMobilidadeView from "@/view/ControleQueda/Configuracoes/ClasseMobilidadeView.vue";
import TipoEventoView from "@/view/ControleQueda/Configuracoes/TipoEventoView.vue";
import TipoAlertaView from "@/view/ControleQueda/Configuracoes/TipoAlertaView.vue";
import VinculoEventoAlertaView from "@/view/ControleQueda/Configuracoes/VinculoEventoAlertaView.vue";
import LocalView from "@/view/ControleQueda/Configuracoes/LocalView.vue";
import PredioView from "@/view/ControleQueda/Configuracoes/PredioView.vue";
import VinculoPessoaQuartoView from "@/view/ControleQueda/Configuracoes/VinculoPessoaQuartoView.vue";
import VinculoCameraLocalView from "@/view/ControleQueda/Configuracoes/VinculoCameraLocalView.vue";
import CameraView from "@/view/ControleQueda/Configuracoes/CameraView.vue";
import { validarSessao, validarPermissao } from "@/router/guards";
import HomeControleQuedaView from "@/view/HomeControleQuedaView.vue";
import PainelView from "@/view/ControleQueda/Painel/PainelView.vue";

export const controleQuedaRoutes = [
  {
    path: "/:empresa/controle-queda",
    name: "ControleQueda",
    component: HomeControleQuedaView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/hospede",
    name: "Pessoa",
    component: PessoaView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/condicao-saude",
    name: "CondicaoSaude",
    component: CondicaoSaudeView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/classe-pessoa",
    name: "classeMobilidade",
    component: classeMobilidadeView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/tipo-evento",
    name: "TipoEvento",
    component: TipoEventoView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/tipo-alerta",
    name: "TipoAlerta",
    component: TipoAlertaView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/evento-alerta",
    name: "VinculoEventoAlerta",
    component: VinculoEventoAlertaView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/local",
    name: "Local",
    component: LocalView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/predio",
    name: "Predio",
    component: PredioView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/hospede-quarto",
    name: "VinculoPessoaQuarto",
    component: VinculoPessoaQuartoView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/camera-local",
    name: "VinculoCameraLocal",
    component: VinculoCameraLocalView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/camera",
    name: "Camera",
    component: CameraView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
  {
    path: "/:empresa/controle-queda/painel",
    name: "Painel",
    component: PainelView,
    beforeEnter: [validarSessao, validarPermissao],
    meta: { funcionalidadeId: 2 },
  },
];
