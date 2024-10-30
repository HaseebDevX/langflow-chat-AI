// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    langflowApiKey: process.env.NUXT_LANGFLOW_API_KEY, // Not exposed to client-side
    public: {
      langflowFlowId: process.env.NUXT_PUBLIC_LANGFLOW_FLOW_ID || 'your-default-flow-id', // Default value if not set
      langflowHostUrl: process.env.NUXT_PUBLIC_LANGFLOW_HOST_URL || 'https://your.default.host.url', // Default value if not set
    },
  },
  nitro: {
    preset: 'node-server'
  },
  modules: [
    '@nuxt/devtools'
  ]
});
