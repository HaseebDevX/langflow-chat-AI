<template>
  <div>
    <h1>Chat Widget</h1>
    <ChatWidget class="chat-widget" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import ChatWidget from "~/components/ChatWidget.vue";

const defaultOptions = {
  // Define any default options for the chat widget here
  theme: "light", // Example option
  position: "bottom-right", // Example option
};

let isChatWidgetInitialized = false;

function initChatWidget(options = defaultOptions) {
  if (!isChatWidgetInitialized) {
    if (typeof initializeChatWidget === "function") {
      try {
        initializeChatWidget({ ...defaultOptions, ...options });
        isChatWidgetInitialized = true;
        console.log("Chat widget initialized successfully");
      } catch (error) {
        console.error("Error initializing chat widget:", error);
      }
    } else {
      console.error("initializeChatWidget is not defined or not a function");
    }
  } else {
    console.warn("Chat widget has already been initialized");
  }
}

onMounted(() => {
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/gh/langflow-ai/langflow-embedded-chat@main/dist/build/static/js/bundle.min.js";
  script.async = true;

  script.onload = () => {
    console.log("tesitng..");
    initChatWidget({
      welcomeMessage: "Hello!",
    });
  };

  script.onerror = () => {
    console.error("Failed to load the chat widget script.");
  };

  document.head.appendChild(script);
});
</script>

<style scoped>
/* Add any component-specific styles here */
.chat-widget {
  /* Example style */
  max-width: 400px;
  margin: 0 auto;
}
</style>
