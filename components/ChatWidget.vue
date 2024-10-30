<template>
  <div :class="className">
    <langflow-chat
      :chat_inputs="chatInputs"
      :chat_input_field="chatInputField"
      :flow_id="flowId"
      :host_url="hostUrl"
    ></langflow-chat>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRuntimeConfig } from '#app';

const props = defineProps(['className']);

// Access runtime config to get the environment variables securely
const config = useRuntimeConfig();
const langflowApiKey = config.langflowApiKey;
const flowId = config.public.langflowFlowId;
const hostUrl = config.public.langflowHostUrl;

// Define chat inputs and fields
const chatInputs = JSON.stringify({ your_key: "value" });
const chatInputField = "your_chat_key";

async function callLangflowAPI() {
  const apiUrl = `/${hostUrl}/api/v1/run/${flowId}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': langflowApiKey
      },
      body: JSON.stringify({
        chat_inputs: chatInputs,
        chat_input_field: chatInputField,
      }),
    });
    
    const data = await response.json();
    console.log('API Response:', data);
  } catch (error) {
    console.error('Error calling Langflow API:', error);
  }
}

onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/langflow-ai/langflow-embedded-chat@main/dist/build/static/js/bundle.min.js";
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.Langflow.init({
      apiKey: langflowApiKey,
      flowId: flowId,
      hostUrl: hostUrl,
      onResponse: (response) => {
        console.log('Widget Response:', response);
        callLangflowAPI();
      },
    });
  };
});
</script>

 

<!-- hghjhjhjghj -->

