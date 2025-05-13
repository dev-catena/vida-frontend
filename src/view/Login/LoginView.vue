<template>
  <main class="login">
    <section class="tam-2 cover" />
    <section class="alinha-v rel">
      <div class="margem">
        <form @submit.prevent="login">
          <p class="logo-fixo">
            THALAMUS
          </p>
          <fieldset>
            <div class="linha">
              <label class="icone-conta pos-input" />
              <input
                v-model="email"
                type="text"
                placeholder="E-mail"
                autocomplete="email"
              >
            </div>
            <div class="linha">
              <label class="icone-senha pos-input" />
              <input
                v-model="password"
                type="password"
                placeholder="Senha"
                autocomplete="current-password"
              >
              <a
                href=""
                class="icone-olho"
                onclick="var inp=this.previousElementSibling;inp.type==='password'?inp.type='text':inp.type='password';return false"
              />
            </div>
          </fieldset>
          <div class="submit">
            <button><span class="icone-avancar direita" />Entrar</button>
            <RouterLink
              to="/esqueci-minha-senha"
              class="botao"
            >
              Esqueci minha senha
            </RouterLink>
          </div>
          <div>
            <LoadingComponent v-show="isLoading" />
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createToaster } from "@meforma/vue-toaster";
import realizarLogin from "@/services/loginService";
import LoadingComponent from "@/components/loadingComponent.vue";
import { useAuthStore } from '@/stores/auth';

const toaster = createToaster({
  position: "top-right",
  duration: 4000,
});

export default {
  components: {
    LoadingComponent,
  },

  setup() {
    const email = ref("");
    const password = ref("");
    const isLoading = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();

    const login = async () => {
      if (!email.value || !password.value) {
        toaster.show(`Preencha e-mail e senha`, { type: "error" });
        return;
      }

      isLoading.value = true;

      try {
        const response = await realizarLogin(email.value, password.value);

        console.log("Resposta da API:", response);
        console.log("Empresa recebida:", response.user.empresa);

        if (!response.user || !response.user.empresa) {
          throw new Error("Empresa não definida na resposta do backend");
        }

        localStorage.setItem("authToken", response.token);
        authStore.setToken(response.token);
        authStore.setUser(response.user);
        
        console.log("Token armazenado:", localStorage.getItem("authToken"));
        console.log("Usuário armazenado:", authStore.user);

        isLoading.value = false;

        const empresaURL = response.user.empresa;
        router.replace(`/${empresaURL}/`);
      } catch (error) {
        isLoading.value = false;
        email.value = "";
        password.value = "";
        toaster.show(`E-mail e/ou senha estão incorretos!`, { type: "error" });
      }
    };

    return {
      login,
      email,
      password,
      isLoading,
    };
  },
};
</script>
