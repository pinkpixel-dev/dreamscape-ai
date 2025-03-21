# Dreamscape AI

A powerful AI-powered creative tool for generating stunning artwork and imagery with simple text prompts.

## Features

- **AI Image Generation**: Transform your text descriptions into beautiful images with various artistic styles
- **Style Selection**: Choose from a wide variety of artistic styles including photorealistic, fantasy, anime, watercolor, and many more
- **Enhanced Prompts**: Utilize powerful AI language models to improve your prompts for better results
- **Image Customization**: Control image parameters like dimensions, seed values, and more
- **Image Enhancement via Cloudinary**: Apply professional-level enhancements to your generated images
- **Voice-to-Text**: Speak your prompts using either browser's Web Speech API or IBM Watson Speech to Text

## Technology

Dreamscape AI leverages cutting-edge AI technologies:

- Frontend built with modern HTML, CSS, and JavaScript
- Integrates with the Pollinations AI API for image generation
- Utilizes advanced language models for prompt enhancement
- Cloudinary API for professional image transformations and enhancements
- IBM Watson Speech to Text API for accurate voice recognition
- Cloudflare Pages Functions for secure backend API handling
- Responsive design for both desktop and mobile use

## Getting Started

### Local Development

1. Clone this repository:
   ```
   git clone https://github.com/your-username/dreamscape-ai.git
   cd dreamscape-ai
   ```

2. Run the test script to verify your API keys and setup:
   ```
   ./test-locally.sh
   ```
   This will prompt you for any missing API keys and test the connections.

3. Start a local server:
   ```
   wrangler pages dev .
   ```
   Or use a simple Python server:
   ```
   python -m http.server 8000
   ```

4. Navigate to `http://localhost:8000` in your browser.

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick deployment:
```
./deploy-to-cloudflare.sh
```

## API Keys Required

This application requires the following API keys:
- **Cloudinary**: For image enhancement features
- **IBM Watson**: For advanced speech-to-text capabilities

You can set these up using the provided scripts or manually as described in the deployment guide.

## Planned Features

- Text generation capabilities
- Audio generation and music creation
- Video and animation generation
- Custom fine-tuning options
- User galleries and sharing
- Advanced image editing tools

## License

MIT License - See LICENSE file for details

## Acknowledgements

- Powered by [Pollinations AI](https://pollinations.ai)
- Image enhancements by [Cloudinary](https://cloudinary.com)
- Voice recognition by [IBM Watson](https://www.ibm.com/watson/services/speech-to-text/)
- Uses various open source libraries and frameworks 

✨ Made with ❤️ by Pink Pixel 