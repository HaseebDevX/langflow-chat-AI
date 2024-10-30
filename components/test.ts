<template>
  <div :class="className">
    <langflow-chat
      :chat_inputs="chatInputs"
      :chat_input_field="chatInputField"
      :flow_id="flowId"
      :host_url="hostUrl"
    ></langflow-chat>
    <div v-if="messages.length">
      <h3>Chat Messages:</h3>
      <div v-for="(message, index) in messages" :key="index">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRuntimeConfig } from '#app';

const props = defineProps(['className']);
const messages = ref([]);
const config = useRuntimeConfig();
const langflowApiKey = config.langflowApiKey;
const flowId = config.public.langflowFlowId;
const hostUrl = config.public.langflowHostUrl;

// Define chat inputs and fields
const chatInputs = JSON.stringify({ your_key: "value" });
const chatInputField = "your_chat_key";

// Langflow Client Class
class LangflowClient {
  constructor(baseURL, applicationToken) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }

  async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
      }
      return responseMessage;
    } catch (error) {
      console.error('Request Error:', error.message);
      throw error;
    }
  }

  async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
  }

  handleStream(streamUrl, onUpdate, onClose, onError) {
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    eventSource.onerror = (event) => {
      console.error('Stream Error:', event);
      onError(event);
      eventSource.close();
    };

    eventSource.addEventListener("close", () => {
      onClose('Stream closed');
      eventSource.close();
    });

    return eventSource;
  }

  async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
    try {
      const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
      if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
        const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
        this.handleStream(streamUrl, onUpdate, onClose, onError);
      }
      return initResponse;
    } catch (error) {
      console.error('Error running flow:', error);
      onError('Error initiating session');
    }
  }
}

// Initialize Langflow Client
const langflowClient = new LangflowClient(hostUrl, langflowApiKey);

// Langflow API Call with Streaming Updates
async function callLangflowAPI() {
  const tweaks = {
    "ChatInput-ivyVt": {},
    "Prompt-lpeoJ": {},
    "ChatOutput-eV0ob": {},
    "OpenAIModel-SzTnW": {}
  };

  langflowClient.runFlow(
    flowId,
    flowId,  // Assuming langflowId and flowId are the same
    chatInputField,
    "chat",
    "chat",
    tweaks,
    true,
    (data) => messages.value.push(data.chunk), // onUpdate
    (message) => console.log("Stream Closed:", message), // onClose
    (error) => console.log("Stream Error:", error) // onError
  );
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

<style scoped>
div {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>
