<template>
  <div :class="className">
    <!-- <langflow-chat
      :chat_inputs="chatInputs"
      :chat_input_field="chatInputField"
      :flow_id="flowId"
      :host_url="hostUrl"
    ></langflow-chat> -->
    <langflow-chat
      window_title="My chat "
      flow_id="sk-dYm7zWHOJD4QZHuKJ6wgga6_vQSf2olwVbSoTNeC0yY"
      chat_inputs='{"text":""}'
      chat_input_field="text"
      host_url="https://langflow-9ls9.onrender.com"
    ></langflow-chat>
    <!-- host_url="http://localhost:3000/" -->
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRuntimeConfig } from "#app";

const props = defineProps(["className"]);

// Access runtime config to get environment variables
const config = useRuntimeConfig();
const langflowApiKey = config.langflowApiKey;
const flowId = config.public.langflowFlowId;
const hostUrl = config.public.langflowHostUrl;

// Define chat inputs and fields
const chatInputs = JSON.stringify({ your_key: "value" });
const chatInputField = "your_chat_key";

// Define the API call function
async function callLangflowAPI() {
  const apiUrl = `${hostUrl}/api/v1/run/${flowId}`;

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
    // Handle the response (e.g., display in chat or update state)
  } catch (error) {
    console.error('Error calling Langflow API:', error);
  }
}

// Initialize Langflow widget after script is loaded
onMounted(() => {
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/gh/langflow-ai/langflow-embedded-chat@main/dist/build/static/js/bundle.min.js";
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    if (window.Langflow) {
      window.Langflow.init({
        apiKey: langflowApiKey,
        flowId: flowId,
        hostUrl: hostUrl,
        onResponse: (response) => {
          console.log('Widget Response:', response);
          // Call the API for further processing
          callLangflowAPI();
        },
      });
    } else {
      console.error('Langflow widget failed to initialize.');
    }
  };
});
</script>

<style scoped>
/* Add any necessary styling here */
</style>
