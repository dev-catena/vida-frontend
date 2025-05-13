<template>
  <main class="login">
    <section class="alinha-v">
      <div class="margem">
        <p class="logo">
          Dunna
        </p>
        <p v-if="!codigoValido">
          Insira o código token que você recebeu por E-mail.
        </p>
        <p v-if="codigoValido">
          Digite sua nova senha.
        </p>
        <fieldset v-if="!codigoValido">
          <div class="linha">
            <label class="icone-conta pos-input" /><input
              v-model="codigo"
              type="number"
              :disabled="codigoValido"
              placeholder="Digite o código do e-mail"
              @keyup.enter="validarCodigo"
            >
          </div>
        </fieldset>
        <div class="submit">
          <button
            v-if="!codigoValido"
            class="button"
            @click="validarCodigo"
          >
            <i
              v-if="!loading"
              class="fa-solid fa-key"
              aria-hidden="true"
            /> &nbsp;
            <i
              v-if="loading"
              class="fas fa-spinner fa-spin"
            />
            <span v-if="!loading">Verificar </span>
            <span v-if="loading"> &nbsp; Verificando...</span>
          </button>
        </div>
        <div v-if="codigoValido">
          <fieldset>
            <div class="linha">
              <label class="icone-senha pos-input" /><input
                ref="newPasswordInput"
                v-model="new_password"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Nova Senha"
              >
            </div>
            <div class="linha">
              <label class="icone-senha pos-input" /><input
                ref="newPasswordConfInput"
                v-model="new_password_confirmation"
                :type="showPasswordConf ? 'text' : 'password'"
                placeholder="Repita a Nova Senha"
              >
            </div>
          </fieldset>
          <div class="submit">
            <button
              v-if="passwordsFilled && !notSamePasswords && passwordValidation.valid"
              class="button"
              @click="resetarSenha"
            >
              <i
                v-if="!loading"
                class="fa-solid fa-circle-check"
                aria-hidden="true"
              />
              <i
                v-if="loading"
                class="fas fa-spinner fa-spin"
              /> &nbsp;
              <span v-if="!loading">Resetar Senha</span>
              <span v-if="loading">Resetando...</span>
            </button>
          </div>
          <div
            v-if="notSamePasswords"
            class="matches"
            style="color: red; text-align: center"
          >
            <p>A senhas não conferem!</p>
          </div>
          <transition
            name="hint"
            appear
            style="position: fixed"
          >
            <div
              v-if="passwordValidation.errors.length > 0 && !submitted"
              class="hints"
            >
              <hr>
              <p
                v-for="error in passwordValidation.errors"
                :key="error.id"
                style="color: red"
              >
                {{ error }}
              </p>
            </div>
          </transition>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { createToaster } from "@meforma/vue-toaster";
import api from "@/services/api";

const toaster = createToaster({
  position: "top-right",
  duration: "4000",
});

export default {
  name: "ValidarTokenComponent",

  components: {},
  data() {
    return {
      codigo: "",
      new_password: "",
      new_password_confirmation: "",
      erroCodigo: false,
      codigoValido: false,
      loading: false,
      submitted: false,
      showNewPassword: false,
      showPasswordConf: false,
      rules: [
        { message: "- Minimo de 1 Letra Maiúscula", regex: /[A-Z]+/ },
        { message: "- Mínimo de 6 caracteres", regex: /.{6,}/ },
        { message: "- Minímo de 1 número", regex: /[0-9]+/ },
        { message: "- Mínimo de 1 caracter especial (ex: @ ! , . * -)", regex: /[^a-zA-Z 0-9]+/g },
      ],
    };
  },

  computed: {
    notSamePasswords() {
      if (this.passwordsFilled) {
        return this.new_password !== this.new_password_confirmation;
      } else {
        return false;
      }
    },
    passwordsFilled() {
      return this.new_password !== "" && this.new_password_confirmation !== "";
    },
    passwordValidation() {
      let errors = [];
      for (let condition of this.rules) {
        if (!condition.regex.test(this.new_password)) {
          errors.push(condition.message);
        }
      }
      if (errors.length === 0) {
        return { valid: true, errors };
      } else {
        return { valid: false, errors };
      }
    },
  },

  watch: {},

  methods: {
    toggleShowPassword(field) {
      if (field === "new") {
        this.showNewPassword = !this.showNewPassword;
      } else if (field === "confirmation") {
        this.showPasswordConf = !this.showPasswordConf;
      }
      this.showNewPassword = !this.showNewPassword;
      this.showPasswordConf = !this.showPasswordConf;
    },

    validarCodigo() {
      this.loading = true;

      if (!this.codigo) {
        this.loading = false;
        toaster.show(`Por favor, preencha o código do e-mail`, { type: "error" });
      }

      api
        .post("validar-codigo", { codigo: this.codigo })
        .then((response) => {
          if (response.data === 0) {
            this.erroCodigo = true;
            this.codigo = "";
            this.loading = false;
            toaster.show(`Código incorreto ou inválido!`, { type: "error" });
          } else if (response.data === 1) {
            this.erroCodigo = false;
            this.codigoValido = true;
            this.loading = false;
            toaster.show(`Código validado com sucesso!`, { type: "success" });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    resetarSenha() {
      this.loading = true;

      if (!this.new_password) {
        this.loading = false;
        toaster.show(`Por favor, preencha a senha`, { type: "error" });
        return;
      }

      if (!this.new_password_confirmation) {
        this.loading = false;
        toaster.show(`Por favor, preencha a senha`, { type: "error" });
        return;
      }

      if (this.new_password === this.new_password_confirmation) {
        this.validationState = true;

        api
          .post("redefinir-senha", {
            codigo: this.codigo,
            new_password: this.new_password,
            new_password_confirmation: this.new_password_confirmation,
          })
          .then((response) => {
            this.codigo = "";
            this.new_password = "";
            this.new_password_confirmation = "";
            this.loading = false;
            toaster.show(`Senha resetada com sucesso!`, { type: "success" });
            this.$router.push({ name: "Login" });

            console.log(response);
          })
          .catch((error) => {
            this.loading = false;
            this.validationState = false;
            toaster.show(`Erro ao refenir senha!`, { type: "error" });
            console.error("Erro ao redefinir a senha:", error);
          });
      } else {
        this.loading = false;
        this.new_password = "";
        this.new_password_confirmation = "";
      }
    },
  },
};
</script>
