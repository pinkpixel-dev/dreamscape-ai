# 🚀 Deploying Dreamscape AI to Cloudflare Pages

This guide will help you deploy Dreamscape AI to Cloudflare Pages with both Cloudinary image processing and Watson Speech to Text functionality.

## ✨ Prerequisites

Before deploying, you'll need:

1. **Cloudflare Account** - Sign up at [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Cloudinary Account** - Sign up at [cloudinary.com](https://cloudinary.com/users/register/free) (free tier is sufficient)
3. **IBM Watson Speech to Text API Key** - Sign up at [cloud.ibm.com](https://cloud.ibm.com/registration) and create a Speech to Text service

## 🔧 Automated Deployment

We've created a script that automates the deployment process:

```bash
# Make the script executable
chmod +x deploy-to-cloudflare.sh

# Run the deployment script
./deploy-to-cloudflare.sh
```

The script will:
- Install Wrangler CLI if needed
- Guide you through setting up your Cloudflare Pages project
- Collect your API keys and store them securely
- Configure environment variables in Cloudflare
- Deploy your site to Cloudflare Pages

## 🔒 Environment Variables

The following environment variables need to be set in your Cloudflare Pages project:

| Variable | Description |
|----------|-------------|
| `WATSON_API_KEY` | Your IBM Watson Speech to Text API key |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

## 🛠️ Manual Deployment

If you prefer to deploy manually:

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Create a new Cloudflare Pages project**:
   ```bash
   wrangler pages project create dreamscape-ai
   ```

3. **Set environment variables**:
   ```bash
   wrangler pages env set WATSON_API_KEY "your-key" --project-name="dreamscape-ai"
   wrangler pages env set CLOUDINARY_CLOUD_NAME "your-cloud-name" --project-name="dreamscape-ai"
   wrangler pages env set CLOUDINARY_API_KEY "your-api-key" --project-name="dreamscape-ai"
   wrangler pages env set CLOUDINARY_API_SECRET "your-api-secret" --project-name="dreamscape-ai"
   ```
   
   Repeat the above commands with the `--production` flag to set production variables.

4. **Deploy your site**:
   ```bash
   wrangler pages deploy --project-name="dreamscape-ai"
   ```

## 📱 Testing Your Deployment

After deployment:

1. Visit your Cloudflare Pages URL (shown after deployment)
2. Test the image enhancement functionality
3. Test the speech recognition feature:
   - Click the microphone button in the chat interface
   - Speak into your microphone
   - Verify that your speech is transcribed correctly

## 🔍 Troubleshooting

If you encounter issues:

1. **CORS Errors**: Ensure your Cloudflare Pages Functions are properly set up
2. **API Key Issues**: Verify all environment variables are correctly set in Cloudflare 
3. **Deployment Failures**: Check the Cloudflare Pages build logs for errors

## 🏁 Next Steps

After successful deployment, consider:

1. Setting up a custom domain in the Cloudflare Pages dashboard
2. Enabling automatic GitHub deployments
3. Setting up usage limits for the Watson and Cloudinary services

---

💜 Made with ❤️ by Pink Pixel 