# Dreamscape AI - Changelog

## v1.1.6 - May 2, 2025

### 🐛 Bug Fixes
- Fixed research tool chat interaction issues
  - Completely rewrote conversation handling with a simpler state-based approach
  - Fixed issue where the page would reset when answering the first question
  - Fixed duplicate message display when responding to AI prompts
  - Fixed "[object Object]" display in sources section with proper type checking
  - Improved source URL handling in document generation
  - Added better error handling and recovery throughout the conversation flow
  - Enhanced console logging for easier debugging
  - Simplified event handling to be more reliable

### 🔄 Improvements
- Enhanced research tool conversation experience
  - Added more natural conversational flow with the AI assistant
  - Implemented query optimization based on user follow-up responses
  - Added variety to AI responses with randomized message templates
  - Improved source attribution in generated documents
  - Better handling of different source formats in the sidebar and document

## v1.1.5 - May 2, 2025

### 🐛 Bug Fixes
- Fixed Cloudinary upload widget in both enhance.html and artistic.html
  - Implemented server-side signature generation for secure uploads
  - Created a dedicated endpoint (functions/cloudinary-signature.js) for signing upload requests
  - Added comprehensive error handling with user-friendly messages
- Fixed non-functional buttons in enhance.html and artistic.html
  - Implemented "Apply Enhancements" button functionality in enhance.html
  - Implemented "Apply Effect" button functionality in artistic.html
  - Added download functionality to save transformed images
  - Added reset functionality to start over with new images
- Improved user experience with better feedback
  - Added loading states for buttons during processing
  - Added proper error handling with user-friendly messages
  - Implemented dynamic UI updates based on user selections

## v1.1.4 - May 1, 2025

### 🐛 Bug Fixes
- Fixed Cloudinary upload widget in enhance page
  - Added proper widget initialization
  - Restored image upload functionality
  - Fixed upload area click handling
- Fixed script.js errors on enhance page
  - Added null checks for DOM elements
  - Improved cross-page compatibility
  - Prevented TypeError from missing elements
- Fixed TypeError in research tool when handling URLs
  - Added proper type checking for URL objects
  - Improved URL string handling in source categorization
  - Better fallback handling for invalid URL formats

### 📚 Documentation
- Added comprehensive technical overview in OVERVIEW.md
  - Detailed architecture documentation
  - Component relationships
  - Technical stack information
  - Security and performance considerations
- Added CONTRIBUTING.md with detailed guidelines
  - Development setup instructions
  - Code standards and conventions
  - Pull request process
  - Testing requirements

## v1.1.3 - July 12, 2024

### 🔄 Improvements
- **Enhanced UI Experience**:
  - Added fullscreen lightbox for better image viewing
  - Added direct download button for generated images
  - Improved button alignment and styling consistency
  - Simplified settings by hardcoding optimal values for nologo and private options

### 🐛 Bug Fixes
- Fixed image title persistence issue when toggling enhancement
- Fixed inconsistent button styling and alignment
- Fixed emoji rendering consistency across buttons
- Added default titles for non-enhanced images

## v1.1.2 - July 1, 2024

### ✨ New Features
- **Image Lightbox**: Added a fullscreen lightbox view for generated images
  - Click on generated images to view in a distraction-free fullscreen mode
  - Added "View Larger" button for easier access to the lightbox
  - Added ESC key and click-outside support to close the lightbox

### 🔄 Improvements
- **Download Functionality**: Enhanced image download capabilities
  - Added direct download button for generated images
  - Fixed download functionality to save directly to the user's device
  - Added download button in the lightbox view
  - Implemented consistent naming scheme using image titles

- **UI Refinements**:
  - Simplified UI by removing unnecessary settings (nologo and private)
  - Hardcoded optimal settings for image generation (watermark removal and privacy)
  - Improved button alignment and consistent styling
  - Added automatic title generation for non-enhanced images

### 🐛 Bug Fixes
- Fixed issue with image titles persisting when enhancement is turned off
- Fixed button alignment inconsistencies
- Fixed emoji rendering differences between buttons

## v1.1.1 - June 26, 2024

### ✨ Improvements
- **Research Tool UI**: Simplified the research interface
  - Streamlined the UI by hiding redundant input elements
  - Fixed HTML/CSS issues for better user experience
  - Improved ID matching between HTML elements and JavaScript functions
  - Enhanced research document display with proper sidebar toggle
  - Fixed document viewer controls (copy and download)

### 🐛 Bug Fixes
- Fixed inconsistencies between HTML element IDs and JavaScript references
- Resolved UI event handler connections for form submissions
- Corrected document sidebar display and toggle functionality
- Fixed sources display in the sidebar
- Added missing event listeners for research form submission

### 🔧 Technical Improvements
- Restructured the research module system
  - Created modular components for different functionalities
  - Implemented document-generation.js for document formatting
  - Added query-variation.js for search term enhancement
  - Created research-core.js for main research functionality
  - Added ui-handlers.js for user interface interactions
- Fixed JavaScript module import/export structure
- Enhanced code organization by properly separating concerns

## v1.1.0 - June 25, 2024

### ✨ New Features
- **Research Tool**: Added a new AI-powered research tool capable of generating comprehensive documents on any topic
  - Multi-service web scraping with PhantomJS Cloud, ScraperAPI, ScrapingAnt, and FireCrawl
  - Tiered research options (Quick, Extended, Deep) for different research depths
  - Specialized content extraction for documentation sites and GitHub repositories
  - Conversational research interface with clarifying questions
  - Document generation with proper formatting and source citations
  - Synthetic content generation for failed scraping attempts
  - Progress indicators and visual feedback during research process

### 🐛 Bug Fixes
- Fixed PhantomJS Cloud API integration with proper v2 API request structure
- Improved error handling in multi-scrape API to prevent null URL errors
- Enhanced web scraping functionality with specialized extractors for different site types
- Fixed research.js syntax errors around try-catch blocks

### 🔧 Technical Improvements
- Implemented a cascading fallback mechanism for web scraping to ensure reliability
- Added intelligent fallback content generation based on URL patterns
- Enhanced conversation handling with limited clarification rounds
- Improved UI feedback with progress bars and status updates
- Implemented specialized pattern-recognition for documentation sites like OpenWebUI

## v1.0.3 - June 19, 2024

### 🐛 Bug Fixes
- Fixed 400 error in conversation summarization by updating to the correct API message format
- Fixed response handling to properly parse text responses from the POST endpoint

### 🔧 Technical Improvements
- Updated conversation summarization in chat.html and voice.html to use POST endpoint instead of GET URL
- Fixed issue with long conversations exceeding URL length limits when generating summaries
- Added better error handling and response parsing for summarization API calls
- Implemented standardized request structure with temperature and token limit controls
- Converted summarization prompts to use the messages array format for better compatibility

## v1.0.2 - June 5, 2024

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

## v1.1.0 - March 22, 2024

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

## v1.0.1 - May 21, 2023

### 🐛 Bug Fixes
- Fixed issue with speech recognition in the voice.html page where transcripts were detected but not sent to Pollinations API
- Fixed double message display issue in chat.html by ensuring messages are only added once
- Improved timing for Watson API responses by increasing wait times from 3000ms to 5000ms
- Ensured consistency between send button and voice button handlers

### ✨ Improvements
- Added proper AI response handling in voice.html with fetch to Pollinations API
- Updated voice interface to provide better feedback during processing

## v1.0.0 - April 15, 2023

### 🚀 Initial Release
- AI image generation with Pollinations API
- Image gallery with Cloudinary integration
- Voice-to-text using IBM Watson Speech to Text API
- Responsive design with dark mode support
- Multiple voice options for text-to-speech
- Animated background with shooting stars effect
- Support for image uploads and AI transformations

## Planned Features
- Web Search functionality
- Video Generation capabilities
- Music Generation
- Additional AI models and personalities

---

✨ Made with ❤️ by Pink Pixel