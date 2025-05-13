<template>
  <section>
    <div class="margem container">
      <h2>{{ empresa.nome }}</h2>
      <form @submit.prevent="saveSettings">
        <div class="bloco margem grid-4">
          <div class="col-4">
            <h3>Informações</h3>
          </div>
          <div class="col-3">
            <label>Nome da empresa:</label>
            <input
              v-model="empresa.nome"
              type="text"
            >
          </div>
          <div class="col-1">
            <label>CNPJ:</label>
            <input
              v-model="empresa.cnpj"
              type="text"
            >
          </div>
        </div>

        <div class="bloco margem grid-4">
          <div class="col-4">
            <h3>Personalização</h3>
          </div>

          <div class="col-2">
            <div class="linha">
              <label>Logo :</label>
              <input
                type="file"
                @change="onLogoChange"
              >
            </div>
            <div v-if="empresa.logo">
              <label>Logo atual:</label>
              <img
                :src="`${baseStorage.replace(/\/$/, '')}/${empresa.logo}`"
                alt="Logo da empresa"
              >
            </div>
          </div>

          <div class="linha col-2">
            <div>
              <label>Selecione a cor primária:</label>
              <input
                v-model="primaryColor"
                style="height: 214px"
                type="color"
              >
              <div :style="{ width: '200px', height: '200px', backgroundColor: primaryColor, border: '1px solid #ccc', display: 'inline-block', marginLeft: '10px' }" />
            </div>

            <div>
              <div>
                <label>Tonalidade(H):</label>
                <input
                  v-model="empresa.h"
                  type="number"
                  min="0"
                  max="360"
                >
              </div>
              <div>
                <label>Saturação(S):</label>
                <input
                  v-model="empresa.s"
                  type="text"
                >
              </div>
              <div>
                <label>Luminosidade(L):</label>
                <input
                  v-model="empresa.l"
                  type="text"
                >
              </div>
            </div>
          </div>
          <div class="col-4">
            <button
              class="direita"
              type="submit"
            >
              Saslvar
            </button>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import empresaService from "@/services/empresa/empresaService";

export default {
  data() {
    return {
      empresa: {
        nome: "",
        cnpj: "",
        logo: "",
        h: 25,
        s: "100%",
        l: "65%",
        c: 0,
      },
      baseStorage: process.env.VUE_APP_ROOT_STORAGE,
      logoFile: null,
    };
  },
  computed: {
    primaryColor: {
      get() {
        return this.hslToHex(this.empresa.h, this.empresa.s, this.empresa.l);
      },
      set(newColor) {
        const hsl = this.hexToHsl(newColor);
        this.empresa.h = hsl.h;
        this.empresa.s = hsl.s;
        this.empresa.l = hsl.l;
      },
    },
  },
  async created() {
    try {
      const response = await empresaService.obterDadosEmpresa();
      const data = response.data.data;

      this.empresa.nome = data.nome;
      this.empresa.cnpj = data.CNPJ;

      if (data.customizacao) {
        this.empresa.h = data.customizacao.css_tonalidade || 25;
        this.empresa.s = data.customizacao.css_saturacao || "100%";
        this.empresa.l = data.customizacao.css_luminosidade || "65%";
        this.empresa.logo = data.customizacao.logo || "";

        //this.setCustomizacaoCss(this.empresa.h, this.empresa.s, this.empresa.l);
      }
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    onLogoChange(e) {
      this.logoFile = e.target.files[0];
    },
    hexToHsl(hex) {
      let hexVal = hex.replace(/^#/, "");
      if (hexVal.length === 3) {
        hexVal = hexVal
          .split("")
          .map((x) => x + x)
          .join("");
      }
      let r = parseInt(hexVal.substring(0, 2), 16) / 255;
      let g = parseInt(hexVal.substring(2, 4), 16) / 255;
      let b = parseInt(hexVal.substring(4, 6), 16) / 255;
      let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h = h * 60;
      }
      return {
        h: Math.round(h),
        s: Math.round(s * 100) + "%",
        l: Math.round(l * 100) + "%",
      };
    },
    hslToHex(h, s, l) {
      s = parseInt(s) / 100;
      l = parseInt(l) / 100;
      h = parseInt(h);
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h / 360 + 1 / 3);
        g = hue2rgb(p, q, h / 360);
        b = hue2rgb(p, q, h / 360 - 1 / 3);
      }
      let toHex = (x) => {
        let hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      return "#" + toHex(r) + toHex(g) + toHex(b);
    },
    async saveSettings() {
      const formData = new FormData();

      formData.append("css_tonalidade", this.empresa.h);
      formData.append("css_saturacao", this.empresa.s);
      formData.append("css_luminosidade", this.empresa.l);

      if (this.logoFile) {
        formData.append("logo", this.logoFile);
      }

      try {
        await empresaService.atualizarDadosEmpresa(formData);
        const root = document.documentElement;
        root.style.setProperty("--h", this.empresa.h);
        root.style.setProperty("--s", this.empresa.s);
        root.style.setProperty("--l", this.empresa.l);

        alert("Configurações salvas com sucesso!");
      } catch (error) {
        console.error(error);
        alert("Erro ao salvar configurações.");
      }
    },
  },
};
</script>
