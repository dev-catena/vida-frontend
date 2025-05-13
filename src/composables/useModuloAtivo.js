import { watch, ref } from "vue";
import { useRoute } from "vue-router";

export function useModuloAtivo(menus) {
  const route = useRoute();
  const modulo = ref(null);
  const moduloAtivo = ref("");

  const atualizarModulo = () => {
    const pathModulo = route.path.split("/")[2];
    const encontrado = menus.value.find((modulo) => modulo.URL.replace("/", "") === pathModulo);

    modulo.value = encontrado || null;
    moduloAtivo.value = encontrado ? encontrado.nome : "";
  };

  watch(
    () => route.path,
    () => atualizarModulo(),
    { immediate: true }
  );

  return {
    modulo,
    moduloAtivo,
  };
}
