export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      'DM Serif Display': [400],
      'DM Mono': [400, 500],
      'Nunito': [400, 600, 700],
    },
    display: 'swap',
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:5046',
    },
  },
  app: {
    head: {
      title: 'TodoMVC — Nuxt',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})


