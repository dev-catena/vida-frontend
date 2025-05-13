import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
});

api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");
    console.log("Token de autenticação:", authToken ? "Presente" : "Ausente");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      globalLogout();
    }
    return Promise.reject(error);
  }
);

function globalLogout() {
  localStorage.removeItem("authToken");
  router.push({ name: "Login" });
}

export default api;
