function acessarValorPorCaminho(obj, caminho) {
  const partes = caminho.split(".");
  let atual = obj;

  for (let i = 0; i < partes.length; i++) {
    const parte = partes[i];

    if (parte.endsWith("[]")) {
      const chaveArray = parte.replace("[]", "");

      if (!Array.isArray(atual[chaveArray])) return [];

      const restoDoCaminho = partes.slice(i + 1).join(".");

      return atual[chaveArray]
        .map((item) => acessarValorPorCaminho(item, restoDoCaminho))
        .flat()
        .filter(Boolean);
    }

    if (!atual || !(parte in atual)) return null;
    atual = atual[parte];
  }

  return atual;
}

export function filtrarDados(lista, termo, campos) {
  if (!termo) return lista;

  const termoMinusculo = termo.toLowerCase();

  return lista.filter((item) => {
    return campos.some((campo) => {
      const valor = acessarValorPorCaminho(item, campo);

      if (Array.isArray(valor)) {
        return valor.some((v) => String(v).toLowerCase().includes(termoMinusculo));
      }

      return valor && String(valor).toLowerCase().includes(termoMinusculo);
    });
  });
}
