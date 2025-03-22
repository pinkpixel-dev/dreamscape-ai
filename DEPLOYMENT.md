# 🚀 Deploying Dreamscape AI Creative Studio

This guide provides detailed instructions for deploying Dreamscape AI, including all its features (image generation, chat interfaces, and voice assistance) to Cloudflare Pages.

## ✨ Prerequisites

Before starting the deployment process, ensure you have:

1. **Cloudflare Account** - [Sign up](https://dash.cloudflare.com) if you don't have one
2. **Cloudinary Account** - [Register](https://cloudinary.com/users/register/free) (free tier is sufficient)
3. **IBM Watson Speech to Text API Key** - [Create an account](https://cloud.ibm.com/registration) and set up a Speech to Text service

## 🔧 Automated Deployment

For a streamlined deployment experience, use our automated script:

```bash
# Navigate to the dev directory
cd dev

# Make the script executable
chmod +x deploy-to-cloudflare.sh

# Run the deployment script
./deploy-to-cloudflare.sh
```

### What the script does:
1. Sets up proper ASCII art banner and colored text interface
2. Checks for and installs Wrangler CLI if needed
3. Guides you through Cloudflare Pages project setup
4. Collects and securely stores your API keys
5. Configures environment variables in both preview and production environments
6. Deploys the site to Cloudflare Pages

## 🔒 Required Environment Variables

For the application to function properly, set these environment variables in Cloudflare Pages:

| Variable | Description |
|----------|-------------|
| `WATSON_API_KEY` | Your IBM Watson Speech to Text API key |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

## 🛠️ Manual Deployment Steps

If you prefer manual deployment:

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Create a new Cloudflare Pages project**:
   ```bash
   wrangler pages project create dreamscape-ai
   ```

3. **Set environment variables for both preview and production**:
   ```bash
   # For preview environment
   wrangler pages env set WATSON_API_KEY "your-key" --project-name="dreamscape-ai"
   wrangler pages env set CLOUDINARY_CLOUD_NAME "your-cloud-name" --project-name="dreamscape-ai"
   wrangler pages env set CLOUDINARY_API_KEY "your-api-key" --project-name="dreamscape-ai"
   wrangler pages env set CLOUDINARY_API_SECRET "your-api-secret" --project-name="dreamscape-ai"
   
   # For production environment (repeat with --production flag)
   wrangler pages env set WATSON_API_KEY "your-key" --project-name="dreamscape-ai" --production
   # ...repeat for other variables
   ```

4. **Deploy your site**:
   ```bash
   wrangler pages deploy --project-name="dreamscape-ai"
   ```

## 📱 Testing Your Deployment

After deployment completes:

1. Visit your Cloudflare Pages URL (displayed after deployment completes)
2. Test each feature to verify functionality:
   - **Image Generation**: Create images from text prompts
   - **Image Enhancement**: Upload and enhance images
   - **Artistic Transformations**: Apply artistic styles to images
   - **Text Chat**: Test different AI models and personalities
   - **Image Analysis**: If using vision models, test image upload feature
   - **Voice Chat**: Test voice input and output features

## 🔍 Troubleshooting Common Issues

If you encounter problems:

1. **CORS Errors**: Ensure Cloudflare Pages functions are properly configured
2. **API Key Issues**: Verify all environment variables are correctly set in the Cloudflare dashboard
3. **Speech Recognition Problems**: Ensure WATSON_API_KEY is valid and correctly formatted
4. **Image Processing Errors**: Check Cloudinary credentials and quota limits
5. **Deployment Failures**: Review Cloudflare Pages build logs for specific errors

## 🏁 Post-Deployment Steps

After successful deployment:

1. **Set up a custom domain** in the Cloudflare Pages dashboard
2. **Enable automatic GitHub deployments** for continuous integration
3. **Monitor usage limits** for Watson and Cloudinary services
4. **Consider additional security settings** like access restrictions if needed

## 📚 Additional Resources

- For detailed API documentation, see the [Cloudinary Docs](https://cloudinary.com/documentation)
- For Watson Speech-to-Text information, see [IBM Watson Docs](https://cloud.ibm.com/docs/speech-to-text)
- For Cloudflare Pages documentation, see [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

---

💜 Made with ❤️ by Pink Pixel 