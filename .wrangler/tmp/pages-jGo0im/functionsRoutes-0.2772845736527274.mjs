import { onRequestPost as __api_enhance_js_onRequestPost } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/enhance.js"
import { onRequestPost as __api_pollinations_text_js_onRequestPost } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/pollinations-text.js"
import { onRequestPost as __api_scrape_url_js_onRequestPost } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/scrape-url.js"
import { onRequestOptions as __api_speech_to_text_js_onRequestOptions } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/speech-to-text.js"
import { onRequestPost as __api_speech_to_text_js_onRequestPost } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/speech-to-text.js"
import { onRequest as __api_firecrawl_js_onRequest } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/firecrawl.js"
import { onRequest as __api_multi_scrape_js_onRequest } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/multi-scrape.js"
import { onRequest as __api_phantom_scrape_js_onRequest } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/phantom-scrape.js"
import { onRequest as __api_pollinations_search_js_onRequest } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/pollinations-search.js"
import { onRequest as __api_scraperapi_js_onRequest } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/scraperapi.js"
import { onRequest as __api_scrapingant_js_onRequest } from "/home/sizzlebop/Desktop/projects/dreamscape-ai/functions/api/scrapingant.js"
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
      routePath: "/api/pollinations-text",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_pollinations_text_js_onRequestPost],
    },
  {
      routePath: "/api/scrape-url",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_scrape_url_js_onRequestPost],
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
      routePath: "/api/firecrawl",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_firecrawl_js_onRequest],
    },
  {
      routePath: "/api/multi-scrape",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_multi_scrape_js_onRequest],
    },
  {
      routePath: "/api/phantom-scrape",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_phantom_scrape_js_onRequest],
    },
  {
      routePath: "/api/pollinations-search",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_pollinations_search_js_onRequest],
    },
  {
      routePath: "/api/scraperapi",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_scraperapi_js_onRequest],
    },
  {
      routePath: "/api/scrapingant",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_scrapingant_js_onRequest],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]