import usuarioService from "@/services/usuarioService";
import funcionalidadeService from "@/services/funcionalidade/funcionalidadeService";

/**
 * Verifica se o usuário está autenticado e se a empresa da rota é a mesma do usuário.
 */
export async function validarSessao(to, from, next) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return next({ name: "Login" });
  }

  try {
    const response = await usuarioService.obterInfoUsuario();
    const empresaUsuario = response.data.user.empresa;
    const empresaUrl = to.params.empresa;

    if (empresaUrl === empresaUsuario) {
      return next();
    }

    // Redireciona para a empresa correta se houver divergência
    if (to.path !== `/${empresaUsuario}/`) {
      return next({ path: `/${empresaUsuario}/` });
    }

    return next();
  } catch (error) {
    localStorage.removeItem("authToken");
    return next({ name: "Login" });
  }
}

/**
 * Verifica se o usuário possui permissão para acessar a funcionalidade.
 */
export async function validarPermissao(to, from, next) {
  const funcionalidades = await funcionalidadeService.obterFuncionalidadeUsuario();
  const funcionalidadeNecessaria = to.meta.funcionalidadeId;

  if (funcionalidadeNecessaria && !funcionalidades.includes(funcionalidadeNecessaria)) {
    localStorage.removeItem("authToken");
    return next({ name: "Login" });
  }

  return next();
}
