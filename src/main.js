import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { mask } from "vue-the-mask";
import axios from "axios";
import { createPinia } from 'pinia';

// utilidades
import modalUtils from "@/utils/modalUtils.js";
import toastUtils from "./utils/toastUtils";
import formatUtils from "@/utils/formatUtils";
//import filtrarDados from "@/utils/filtroUtils";
import { filtrarDados } from "@/utils/filtroUtils";

import configuracaoComponent from "./components/menu/configuracaoComponent.vue";
import controleQuedaComponent from "./components/menu/controleQuedaComponent.vue";

import "./assets/css/spec.css";

axios.defaults.baseURL = process.env.VUE_APP_ROOT_API;

const app = createApp(App);
const pinia = createPinia();

app.component("ConfiguracaoComponent", configuracaoComponent);
app.component("ControleQuedaComponent", controleQuedaComponent);

app.directive("mask", mask);
app.mixin(formatUtils);
app.use(router);
app.use(pinia);
app.mixin(modalUtils);
//app.use(filtrarDados);
app.config.globalProperties.$filtrarDados = filtrarDados;
app.config.globalProperties.$toast = toastUtils;

app.mount("#app");
