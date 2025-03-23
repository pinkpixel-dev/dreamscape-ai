# Dreamscape AI - Changelog

## v1.0.3 - 2024-06-19

### 🔧 Technical Improvements
- Updated conversation summarization in chat.html and voice.html to use POST endpoint instead of GET URL
- Fixed issue with long conversations exceeding URL length limits when generating summaries
- Added better error handling and response parsing for summarization API calls
- Implemented standardized request structure with temperature and token limit controls
- Added fallback handling for different response formats (text or completion fields)

## v1.0.1 - 2023-05-21

### 🐛 Bug Fixes
- Fixed issue with speech recognition in the voice.html page where transcripts were detected but not sent to Pollinations API
- Fixed double message display issue in chat.html by ensuring messages are only added once
- Improved timing for Watson API responses by increasing wait times from 3000ms to 5000ms
- Ensured consistency between send button and voice button handlers

### ✨ Improvements
- Added proper AI response handling in voice.html with fetch to Pollinations API
- Updated voice interface to provide better feedback during processing

## v1.0.0 - 2023-04-15

### 🚀 Initial Release
- AI image generation with Pollinations API
- Image gallery with Cloudinary integration
- Voice-to-text using IBM Watson Speech to Text API
- Responsive design with dark mode support
- Multiple voice options for text-to-speech
- Animated background with shooting stars effect
- Support for image uploads and AI transformations

✨ Made with ❤️ by Pink Pixel

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

## v1.0.2 - 2024-06-05

### 🐛 Bug Fixes
- Fixed Web Speech API functionality in both chat.html and voice.html
- Fixed issue with chat.html sending duplicate messages to Pollinations API
- Fixed bug in chat.html where Web Speech API wasn't automatically sending transcripts to Pollinations
- Added improved error handling and browser compatibility detection for speech recognition
- Enhanced user feedback with notification system for microphone permission issues
- Implemented better recovery from speech recognition timeouts and errors
- Added visual indicators for speech recognition status

### ✨ Improvements
- Moved the AI Personality selector to its own dedicated section above Voice Settings in the sidebar
- Detailed browser compatibility messages for speech recognition failures
- Cleanup of speech recognition resources to prevent memory leaks
- Automatic recovery from unexpected speech recognition stops
- Enhanced logging for debugging speech recognition issues
- Added momentary display of transcribed text in input field for better visual feedback