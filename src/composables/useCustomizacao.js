import { ref } from "vue";

const tonalidade = ref(25);
const saturacao = ref("100%");
const luminosidade = ref("65%");
const logo = ref("");

export function useCustomizacao() {
  const aplicarCustomizacao = (h, s, l, logoPath = "") => {
    tonalidade.value = h;
    saturacao.value = s;
    luminosidade.value = l;
    logo.value = logoPath;

    const root = document.documentElement;
    root.style.setProperty("--h", h);
    root.style.setProperty("--s", s);
    root.style.setProperty("--l", l);
  };

  return {
    tonalidade,
    saturacao,
    luminosidade,
    logo,
    aplicarCustomizacao,
  };
}
