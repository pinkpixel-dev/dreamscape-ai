Image Generation (GET Endpoint)
Endpoint:
GET https://image.pollinations.ai/prompt/{prompt}

Parameters:

prompt*
(Required) A text description of the image. Make sure it’s URL-encoded.

model
The image model to use (default is often "flux").
(See available models at https://image.pollinations.ai/models)

seed
A numerical seed for reproducible results.

width
The desired width of the generated image.
(Default: 1024; must be between 16 and 2048)

height
The desired height of the generated image.
(Default: 1024; must be between 16 and 2048)

nologo
A boolean flag. Set to true to disable rendering the Pollinations logo on the image.

private
A boolean flag. When true, the image won’t appear on the public feed.
(Default: false)

enhance
A boolean flag. Set to true to pass your prompt through an LLM for additional detail.
(Default: false)

safe
A boolean flag. Set to true to enable strict NSFW content filtering (will error if NSFW content is detected).
(Default: false)

Text Generation (GET Endpoint)
Endpoint:
GET https://text.pollinations.ai/{prompt}

Parameters:

prompt*
(Required) The text prompt for the AI. Must be URL-encoded.

model
The text model to use (e.g., "openai", "mistral", etc.).
(See available models at https://text.pollinations.ai/models)

seed
A numeric seed for reproducible results.

json
A boolean flag. Set to true to receive the response in JSON format.

system
A system prompt to guide the AI’s behavior. Must be URL-encoded.

private
A boolean flag. When set to true, the response will not appear on the public feed.
(Default: false)

reasoning_effort
Applicable for the openai-reasoning (o3-mini) model. Accepts "low", "medium", or "high".
(Default: not specified)

Text Generation (POST Endpoint)
Endpoint:
POST https://text.pollinations.ai/

Request Body (JSON):

json
Copy
{
  "messages": [
    {"role": "system", "content": "Your system prompt here."},
    {"role": "user", "content": "Your query or prompt here."}
  ],
  "model": "openai",
  "seed": 42,
  "jsonMode": true,         // Optional: forces valid JSON response
  "private": true,          // Optional: prevents response from appearing on the public feed
  "reasoning_effort": "high"  // Optional: applicable for the openai-reasoning model
}
Notes:

Instead of a standalone prompt and system parameter, you include your conversation history (system prompt and user messages) within the messages array.

Other parameters such as model, seed, private, and reasoning_effort work similarly to the GET endpoint.

There is also an OpenAI-compatible POST endpoint at https://text.pollinations.ai/openai that follows the OpenAI ChatGPT API format.

All of the text models listed - both the official ones like "openai" and "mistral", and the extended ones - are supported on the POST endpoint as well.

When you use the POST endpoint (either the standard one at https://text.pollinations.ai/ or the OpenAI-compatible one at https://text.pollinations.ai/openai), you can specify any of these models in your request payload.


Text and voice models:

[
{
"name": "openai",
"type": "chat",
"censored": true,
"description": "OpenAI GPT-4o-mini",
"baseModel": true,
"vision": true
},
{
"name": "openai-large",
"type": "chat",
"censored": true,
"description": "OpenAI GPT-4o",
"baseModel": true,
"vision": true
},
{
"name": "openai-reasoning",
"type": "chat",
"censored": true,
"description": "OpenAI o3-mini",
"baseModel": true,
"reasoning": true
},
{
"name": "qwen-coder",
"type": "chat",
"censored": true,
"description": "Qwen 2.5 Coder 32B",
"baseModel": true
},
{
"name": "llama",
"type": "chat",
"censored": false,
"description": "Llama 3.3 70B",
"baseModel": true
},
{
"name": "mistral",
"type": "chat",
"censored": false,
"description": "Mistral Small 3.1 2503",
"baseModel": true,
"vision": true
},
{
"name": "mistral-roblox",
"type": "chat",
"censored": false,
"description": "Mistral Roblox on Scaleway",
"baseModel": true
},
{
"name": "unity",
"type": "chat",
"censored": false,
"description": "Unity with Mistral Large by Unity AI Lab",
"baseModel": false
},
{
"name": "midijourney",
"type": "chat",
"censored": true,
"description": "Midijourney musical transformer",
"baseModel": false
},
{
"name": "rtist",
"type": "chat",
"censored": true,
"description": "Rtist image generator by @bqrio",
"baseModel": false
},
{
"name": "searchgpt",
"type": "chat",
"censored": true,
"description": "SearchGPT with realtime news and web search",
"baseModel": false
},
{
"name": "evil",
"type": "chat",
"censored": false,
"description": "Evil Mode - Experimental",
"baseModel": false
},
{
"name": "deepseek",
"type": "chat",
"censored": true,
"description": "DeepSeek-V3",
"baseModel": true
},
{
"name": "deepseek-r1",
"type": "chat",
"censored": true,
"description": "DeepSeek-R1 Distill Qwen 32B",
"baseModel": true,
"reasoning": true,
"provider": "cloudflare"
},
{
"name": "deepseek-reasoner",
"type": "chat",
"censored": true,
"description": "DeepSeek R1 - Full",
"baseModel": true,
"reasoning": true,
"provider": "deepseek"
},
{
"name": "deepseek-r1-llama",
"type": "chat",
"censored": true,
"description": "DeepSeek R1 - Llama 70B",
"baseModel": true,
"reasoning": true,
"provider": "scaleway"
},
{
"name": "qwen-reasoning",
"type": "chat",
"censored": true,
"description": "Qwen QWQ 32B - Advanced Reasoning",
"baseModel": true,
"reasoning": true,
"provider": "groq"
},
{
"name": "llamalight",
"type": "chat",
"censored": false,
"description": "Llama 3.1 8B Instruct",
"baseModel": true,
"maxTokens": 7168
},
{
"name": "llamaguard",
"type": "safety",
"censored": false,
"description": "Llamaguard 7B AWQ",
"baseModel": false,
"provider": "cloudflare",
"maxTokens": 4000
},
{
"name": "phi",
"type": "chat",
"censored": true,
"description": "Phi-4 Instruct",
"baseModel": true,
"provider": "cloudflare"
},
{
"name": "phi-mini",
"type": "chat",
"censored": true,
"description": "Phi-4 Mini Instruct",
"baseModel": true,
"provider": "azure"
},
{
"name": "llama-vision",
"type": "chat",
"censored": false,
"description": "Llama 3.2 11B Vision",
"baseModel": true,
"provider": "cloudflare",
"vision": true
},
{
"name": "pixtral",
"type": "chat",
"censored": false,
"description": "Pixtral 12B",
"baseModel": true,
"provider": "scaleway",
"vision": true
},
{
"name": "gemini",
"type": "chat",
"censored": true,
"description": "Gemini 2.0 Flash",
"baseModel": true,
"provider": "google"
},
{
"name": "gemini-thinking",
"type": "chat",
"censored": true,
"description": "Gemini 2.0 Flash Thinking",
"baseModel": true,
"provider": "google"
},
{
"name": "hormoz",
"type": "chat",
"description": "Hormoz 8b by Muhammadreza Haghiri",
"baseModel": true,
"provider": "modal"
},
{
"name": "hypnosis-tracy",
"type": "chat",
"description": "Hypnosis Tracy 7B - Self-help AI assistant",
"baseModel": false,
"provider": "openai"
},
{
"name": "sur",
"type": "chat",
"censored": true,
"description": "Sur AI Assistant",
"baseModel": false
},
{
"name": "sur-mistral",
"type": "chat",
"censored": true,
"description": "Sur AI Assistant (Mistral)",
"baseModel": false
},
{
"name": "llama-scaleway",
"type": "chat",
"censored": false,
"description": "Llama (Scaleway)",
"baseModel": true
},
{
"name": "openai-audio",
"type": "chat",
"censored": true,
"description": "OpenAI GPT-4o-audio-preview",
"baseModel": true,
"audio": true,
"voices": [
"alloy",
"echo",
"fable",
"onyx",
"nova",
"shimmer",
"coral",
"verse",
"ballad",
"ash",
"sage",
"amuch",
"dan"
]
}
]

Image models:

[
"flux",
"turbo" (sdxl)
]