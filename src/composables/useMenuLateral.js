import { computed } from "vue";
import { useRoute } from "vue-router";

export function useMenuLateral() {
  const route = useRoute();

  const menuLateralAtual = computed(() => {
    const modulo = route.params?.empresa && route.path.split("/")[2];

    if (modulo === "configuracao") return "configuracaoComponent";
    if (modulo === "controle-queda") return "controleQuedaComponent";

    return null;
  });

  return {
    menuLateralAtual,
  };
}
