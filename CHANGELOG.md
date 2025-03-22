# Dreamscape AI - Changelog

## v1.0.0 (2024-03-22)

### ✨ New Features

#### Text Chat Interface (`chat.html`)
- Added multiple AI model options with improved naming conventions:
  - GPT-4o-mini (vision)
  - GPT-4o (vision) 
  - o3-mini - Advanced Reasoning
  - Qwen 2.5 Coder 32B
  - Llama 3.3 70B
  - Mistral Small 3.1 (vision)
  - Evil Mode - Experimental
  - DeepSeek-V3
  - DeepSeek-R1 Distill Qwen 32B
  - DeepSeek R1 - Reasoning
  - DeepSeek R1 - Llama 70B
  - Qwen QWQ 32B - Reasoning
  - Llama 3.1 8B Instruct
  - Phi-4 Instruct
  - Llama 3.2 11B (vision)
  - Pixtral 12B (vision)
  - Gemini 2.0 Flash
  - Gemini 2.0 Flash Thinking
  - Hormoz 8b
  - Hypnosis Tracy - Self-help
- Added personality system for different chat experiences
- Added image upload capability for vision models 
- Improved microphone functionality with the Watson Speech-to-Text API
- Added microphone testing feature with visual indicators
- Fixed and enhanced background animations (twinkling stars, shooting stars)
- Removed debug button and debug text display

#### Voice Chat Interface (`voice.html`)
- Complete remake of the voice chat page using GPT-4o-audio
- Added full voice selection list in dropdown:
  - alloy, echo, fable, onyx, nova, shimmer, coral, verse, ballad, ash, sage, amuch, dan
- Added hands-free voice chat capability
- Implemented ChatGPT-style animation for voice responses
- Fixed background to match other pages
- Updated microphone button to match chat.html style and functionality
- Added microphone testing feature with visual indicators

#### Image Generation and Enhancement
- Added enhance.html for upgrading images with AI enhancement
- Added artistic.html for applying artistic styles to photos
- Continued support for generate.html (original image generation page)

### 🛠️ Bug Fixes

- Fixed issue with microphone button for Watson Speech-to-Text API
- Fixed duplicate message display in chat interface
- Fixed timing issues with Watson API responses
- Improved consistency between send button and voice button handlers
- Optimized response wait times for better user experience

### 🔧 Technical Changes

- Updated styling and UI consistency across all pages
- Improved deployment script for Cloudflare Pages
- Added documentation for local development and deployment

## Planned Features

- Web Search functionality
- Video Generation capabilities
- Music Generation
- Additional AI models and personalities

---

✨ Made with ❤️ by Pink Pixel 