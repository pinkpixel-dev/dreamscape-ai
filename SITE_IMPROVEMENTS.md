# Planned changes for Dreamscape AI

## Change the list of fetched models in text chat - chat.html
- Remove the ones that are not text chat specific
- Change the names of the models to improve site appearance

#### New list should look like this:
GPT-4o-mini
GPT-4o
o3-mini - Advanced Reasoning
Qwen 2.5 Coder 32B
Llama 3.3 70B
Mistral Small 3.1
Evil Mode - Experimental
DeepSeek-V3
DeepSeek-R1 Distill Qwen 32B
DeepSeek R1 - Reasoning
DeepSeek R1 - Llama 70B
Qwen QWQ 32B - Reasoning
Llama 3.1 8B Instruct
Phi-4 Instruct
Llama 3.2 11B Vision
Pixtral 12B
Gemini 2.0 Flash
Gemini 2.0 Flash Thinking
Hormoz 8b
Hypnosis Tracy - Self-help

#### Change display names as follows:
Change display name from openai to GPT-4o-mini
Change display name fro openai-large to GPT-4o
Change display name from openai-reasoning to o3-mini - Advanced Reasoning
Change display name from qwen-coder to Qwen 2.5 Coder 32B
Change display name from llama to Llama 3.3 70B
Change display name from Mistral to Mistral Small 3.1
Change display name from evil to Evil Mode - Experimental
Change display name from deepseek to Deepseek V3
Change display name from deepseek-r1 to Deepseek Distill Qwen 32B
Change display name from deepseek-reasoning to Deepseek R1 - Reasoning
Change display name from deepseek-r1-llama to Deepseek R1 - Llama 70B
Change display name from qwen-reasoning to Qwen QWQ 32B - Reasoning
Change display name from phi to Phi-4 Instruct
Change display name from llama-vision to LLama 3.2 11B Vision
Change display name from pixtral to Pixtral 12B
Chnage display name from gemini to Gemini 2.0 Flash
Change display name from gemini-thinking to Gemini 2.0 Flash Thinking
Change display name from hormoz to Hormoz 8b
Change display name from hypnosis-tracy to Hypnosis Tracy - Self-Help

#### Remove from displaying in list:
unity
midijourney
rtist
searchgpt
llamalight
llamaguard
sur
sur-mistral
llama-scaleway
openai-audio

#### Add personality choices
- Dropdown menu with personalities to choose from
- Use system prompts from PROMPTS.md attached to text input prompt sent to Pollinations

#### Implement a method to upload a picture to chat for vision model to describe an image
Vision models:
- GPT-4o-mini
- GPT-4o
- Mistral Small 3.1
- Llama 3.2 11B Vision
- Pixtral 12B

#### Fix the background for chat.html
- twinkling stars missing
- shooting stars missing

(After all changes are done and tested for chat.html, move on to voice.html)

## Remake the voice chat page
(uses GPT-4o-audio for chat)

#### Display full voice list in dropdown:
alloy
echo
fable
onyx
nova
shimmer
coral
verse
ballad
ash
sage
amuch
dan

#### Setup microphone with speech to text api exactly like chat.html

#### Implement ChatGPT style animation for the voice
![alt text](image.png)

#### Possibly expermiment with system prompt personalities for voice chat to see how it works

## Later Improvements

#### Music Generation page
#### Web Search page
