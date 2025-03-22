# ✨ Dreamscape AI - Creative Studio

A versatile AI-powered creative studio for generating, enhancing, and transforming images using modern AI models, plus conversational AI capabilities with text and voice interfaces.

## 🌟 Features

### 🎨 Image Generation & Enhancement
- **AI Image Generation**: Create images from text descriptions
- **Image Enhancement**: Upscale and improve image quality
- **Artistic Transformations**: Apply artistic styles to existing images

### 💬 AI Chat Interfaces
- **Text Chat**: Interact with multiple advanced AI models
  - Support for vision-enabled models (upload and analyze images)
  - 20+ model options including GPT-4o, Llama 3.3, DeepSeek and more
  - Personality system to customize AI behavior
  - Voice input with Watson Speech-to-Text API

- **Voice Assistant**: Natural voice conversations with AI
  - Text-to-Speech with multiple voice options
  - Speech recognition with Web Speech API or Watson
  - Hands-free mode for continuous conversation
  - Animated visual feedback during AI responses

## 🌐 Browser Compatibility

For the best experience with voice features, we recommend using:
- **Google Chrome**: Full support for Web Speech API
- **Microsoft Edge**: Good support for speech recognition
- **Safari 14.1+**: Partial support for speech recognition
- **Firefox**: Limited support (might require enabling flags)

The application will automatically fall back to IBM Watson for speech recognition if the Web Speech API is not available or if you manually select it.

## 🛠️ Technology

- **Frontend**: HTML, CSS, JavaScript
- **Image Processing**: Cloudinary API
- **Voice Recognition**: IBM Watson Speech-to-Text API
- **Text-to-Speech**: Web Speech API
- **AI Models**: Pollinations AI API

## 🚀 Getting Started

### Prerequisites
- IBM Watson Speech-to-Text API Key (for voice functionality)
- Cloudinary account (for image processing)

### Local Development
1. Clone this repository
2. Run the development server:
```bash
npx wrangler pages dev . --compatibility-date=2023-03-21 --port=8123 \
--binding WATSON_API_KEY=your_key \
--binding CLOUDINARY_CLOUD_NAME=your_cloud_name \
--binding CLOUDINARY_API_KEY=your_api_key \
--binding CLOUDINARY_API_SECRET=your_api_secret
```

### Using the App
- **Image Generator**: Visit the home page to create images from text descriptions
- **Chat Interface**: Navigate to `/public/chat.html` to use the chat interface
  - Send text messages with the send button
  - Upload images for visual analysis with vision-enabled models
  - Use voice input by clicking the microphone button
- **Voice Assistant**: Access the voice interface at `/public/voice.html`
  - Speak naturally with the AI assistant
  - Try different voice models for varied responses

## 📦 Deployment

Refer to [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions using Cloudflare Pages.

## 🔑 Required API Keys

1. **IBM Watson Speech-to-Text API Key**
   - Sign up at [IBM Cloud](https://cloud.ibm.com)
   - Create a Speech to Text service
   - Get your API key from the service credentials

2. **Cloudinary Account**
   - Sign up at [Cloudinary](https://cloudinary.com)
   - Get your cloud name, API key, and API secret from your dashboard

## 🔮 Planned Features

- Web search capabilities
- Video generation
- Music generation
- More AI models and personalities

## 📝 Recent Updates

We've made several improvements in the latest version:
- Fixed voice recognition issues on deployed environments
- Enhanced chat interface to prevent duplicate messages
- Improved Watson API response times
- Added better feedback during voice processing

See [CHANGELOG.md](CHANGELOG.md) for a complete history of changes.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Pollinations AI](https://pollinations.ai) for their powerful AI API
- [IBM Watson](https://www.ibm.com/watson) for Speech-to-Text capabilities
- [Cloudinary](https://cloudinary.com) for image processing

---

✨ Made with ❤️ by Pink Pixel 