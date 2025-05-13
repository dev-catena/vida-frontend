import ProntuarioView from '@/view/Saude/ProntuarioView.vue';
import { validarSessao } from '@/router/guards';

export default [
  {
    path: '/:empresa/saude/prontuario',
    name: 'Prontuario',
    component: ProntuarioView,
    beforeEnter: validarSessao
  }
]; 