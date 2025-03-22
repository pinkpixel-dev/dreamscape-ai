# 🚀 Deploying Dreamscape AI Creative Studio

This guide provides detailed instructions for deploying Dreamscape AI, including all its features (image generation, chat interfaces, and voice assistance) to Cloudflare Pages.

## ✨ Prerequisites

Before starting the deployment process, ensure you have:

1. **Cloudflare Account** - [Sign up](https://dash.cloudflare.com) if you don't have one
2. **Cloudinary Account** - [Register](https://cloudinary.com/users/register/free) (free tier is sufficient)
3. **IBM Watson Speech to Text API Key** - [Create an account](https://cloud.ibm.com/registration) and set up a Speech to Text service

## 🔒 Security: Protecting Your API Keys

⚠️ **IMPORTANT: Never commit API keys to GitHub!** ⚠️

The repository includes a `wrangler.toml.example` file as a template. To set up your environment:

1. Copy the example file to create your own wrangler.toml:
   ```bash
   cp wrangler.toml.example wrangler.toml
   ```

2. Add your actual API keys to the wrangler.toml file
3. Ensure wrangler.toml is listed in your .gitignore file
4. Verify it's not being tracked by git with:
   ```bash
   git status
   ```

This keeps your secrets out of version control while maintaining the configuration structure.

## 🛠️ Correct Wrangler Configuration

Create or update your `wrangler.toml` file based on the example:

```toml
name = "dreamscape-ai"
compatibility_date = "2025-03-21"
pages_build_output_dir = "."

[vars]
WATSON_API_KEY = "your-watson-api-key"
CLOUDINARY_CLOUD_NAME = "your-cloud-name"
CLOUDINARY_API_KEY = "your-api-key"
CLOUDINARY_API_SECRET = "your-api-secret"
```

Replace the placeholder values with your actual API keys. This configuration:
- Sets the correct project name
- Defines a compatibility date
- Specifies the build output directory
- **Important**: Defines all environment variables directly in the wrangler.toml file

## 🔧 Automated Deployment

For a streamlined deployment experience, follow these steps:

```bash
# Install Wrangler if you haven't already
npm install -g wrangler

# Deploy the project
npx wrangler pages deploy . --project-name="dreamscape-ai"
```

This will:
1. Upload your static files to Cloudflare
2. Deploy your Functions (API endpoints)
3. Apply the environment variables from your wrangler.toml
4. Provide you with a deployment URL (e.g., https://random-id.dreamscape-ai-xxxx.pages.dev)

## 🔒 Environment Variables

Unlike older Cloudflare Pages projects, environment variables for this project are managed through the `wrangler.toml` file, not through the dashboard. The dashboard will show a message like:

> "Environment variables for this project are being managed through wrangler.toml. Only Secrets (encrypted variables) can be managed via the Dashboard."

This approach keeps your configuration with your code and simplifies deployment.

## 🛠️ Manual Deployment Steps

If you need to make manual changes:

1. **Update your wrangler.toml file** with any new environment variables or configuration changes
2. **Deploy the updated site**:
   ```bash
   npx wrangler pages deploy . --project-name="dreamscape-ai"
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

1. **500 Errors with Watson API**: Ensure your Watson API key is correctly set in wrangler.toml
2. **CORS Issues**: Check the Functions implementation in functions/api/speech-to-text.js
3. **Deployment Configuration Errors**: Make sure your wrangler.toml doesn't include both "main" and "pages_build_output_dir" fields
4. **Deployment Failures**: Review Cloudflare Pages build logs for specific errors
5. **Functions Not Working**: Check that your functions directory is properly structured

## 🏁 Post-Deployment Steps

After successful deployment:

1. **Set up a custom domain** in the Cloudflare Pages dashboard
2. **Enable automatic GitHub deployments** for continuous integration
3. **Monitor usage limits** for Watson and Cloudinary services

## 📚 Local Development

For local testing, use:

```bash
npx wrangler pages dev . --compatibility-date=2023-03-21 --port=8123 \
--binding WATSON_API_KEY=your-key \
--binding CLOUDINARY_CLOUD_NAME=your-cloud-name \
--binding CLOUDINARY_API_KEY=your-api-key \
--binding CLOUDINARY_API_SECRET=your-api-secret
```

## 📚 Additional Resources

- For detailed API documentation, see the [Cloudinary Docs](https://cloudinary.com/documentation)
- For Watson Speech-to-Text information, see [IBM Watson Docs](https://cloud.ibm.com/docs/speech-to-text)
- For Cloudflare Pages documentation, see [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

---

💜 Made with ❤️ by Pink Pixel 