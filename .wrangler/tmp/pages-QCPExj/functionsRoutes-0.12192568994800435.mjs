import { onRequestPost as __api_enhance_js_onRequestPost } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/enhance.js"
import { onRequestOptions as __api_speech_to_text_js_onRequestOptions } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/speech-to-text.js"
import { onRequestPost as __api_speech_to_text_js_onRequestPost } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/speech-to-text.js"
import { onRequest as ___middleware_js_onRequest } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/_middleware.js"

export const routes = [
    {
      routePath: "/api/enhance",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_enhance_js_onRequestPost],
    },
  {
      routePath: "/api/speech-to-text",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_speech_to_text_js_onRequestOptions],
    },
  {
      routePath: "/api/speech-to-text",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_speech_to_text_js_onRequestPost],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]