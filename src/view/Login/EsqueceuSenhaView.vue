<template>
  <body>
    <main class="login">
      <section class="alinha-v">
        <div class="margem">
          <p class="logo">
            Dunna
          </p>
          <p>Digite seu e-mail para redefinir sua senha.</p>
          <fieldset>
            <div class="linha">
              <label class="icone-conta pos-input" /><input
                v-model="email"
                type="text"
                placeholder="E-mail"
                @keyup.enter="resetarSenha()"
              >
            </div>
          </fieldset>
          <div class="submit">
            <button
              class="button"
              @click="resetarSenha"
            >
              <span class="icone-avancar direita" /> <i
                v-if="loading"
                class="fas fa-spinner fa-spin"
              /> &nbsp;
              <span v-if="!loading">Enviar código de recuperação</span>
              <span v-if="loading">Enviando...</span>
            </button>
          </div>

          <div
            id="mensagem"
            class="msg none"
          >
            <b>E-mail para redefinição de senha enviado</b><br><span class="fonte-menor">Por favor consulte sua caixa de e-mails</span>
          </div>
        </div>
      </section>
    </main>
  </body>
</template>

<script>
import { createToaster } from "@meforma/vue-toaster";
import api from "@/services/api";

const toaster = createToaster({
  position: "top-right",
  duration: "4000",
});

export default {
  name: "EsqueceuSenhaComponent",

  components: {},

  data() {
    return {
      email: "",
      loading: false,
    };
  },

  methods: {
    resetarSenha() {
      this.loading = true;

      if (!this.email) {
        toaster.show(`Por favor, preencha o e-mail`, { type: "error" });
      }

      api
        .post("enviar-codigo", {
          email: this.email,
        })
        .then((res) => {
          toaster.show(`E-mail enviado com sucesso!`, { type: "success" });

          this.$router.push({ name: "ValidarToken" });
          this.loading = false;
          this.email = "";
          console.log(res);
        })
        .catch((err) => {
          this.loading = false;
          this.email = "";
          console.log(err);
          toaster.show(`E-mail não cadastrado ou incorreto`, { type: "error" });
        });
    },
  },
};
</script>
