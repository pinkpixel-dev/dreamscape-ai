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

## 📦 Deployment

Refer to [dev/DEPLOYMENT.md](dev/DEPLOYMENT.md) for detailed deployment instructions using Cloudflare Pages.

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

See [CHANGELOG.md](CHANGELOG.md) for recent updates and changes.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Pollinations AI](https://pollinations.ai) for their powerful AI API
- [IBM Watson](https://www.ibm.com/watson) for Speech-to-Text capabilities
- [Cloudinary](https://cloudinary.com) for image processing

---

✨ Made with ❤️ by Pink Pixel 