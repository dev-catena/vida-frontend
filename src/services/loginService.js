import api from "../services/api.js";

const realizarLogin = async (email, password) => {
  try {
    const resp = await api.post("/login", {
      email: email,
      password: password,
    });

    console.log("Dados retornados do login:", resp.data);

    if (!resp.data.user || !resp.data.user.empresa) {
      throw new Error("Erro: empresa não definida na resposta");
    }

    return resp.data;
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    throw new Error("Erro ao realizar o login");
  }
};

export default realizarLogin;
