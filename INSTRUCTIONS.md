# Cloudinary Integration for Image Enhancement

This guide walks you through setting up Cloudinary integration with Cloudflare Pages Functions for your Dreamscape AI project.

## Prerequisites

1. A Cloudinary account (with API key and secret)
2. A Cloudflare account with Pages enabled
3. Git repository for your project

## Step 1: Project Setup

Ensure your project structure looks like this:

dreamscape-ai/
├── functions/
│ └── api/
│ └── enhance.js
├── public/
│ ├── enhance.html
│ ├── css/
│ │ └── enhance.css
│ └── js/
│ └── enhance.js
└── package.json


## Step 2: Sign Up for Cloudinary

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. After signing up, navigate to your dashboard
3. Find your Cloud name, API Key, and API Secret
4. Note these credentials as you'll need them for your Cloudflare Pages environment variables

## Step 3: Set Up Your Local Environment (Optional)

For local development:

1. Install Wrangler (Cloudflare's CLI tool):
   ```bash
   npm install -g wrangler
   ```

2. Create a `.dev.vars` file in your project root:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. Run the project locally:
   ```bash
   wrangler pages dev
   ```

## Step 4: Deploy to Cloudflare Pages

1. Push your code to a GitHub/GitLab repository

2. From your Cloudflare dashboard:
   - Go to Workers & Pages
   - Click "Create Application"
   - Select "Pages"
   - Connect your GitHub/GitLab account
   - Select your repository
   - Configure build settings:
     - Build command: (leave blank if not using a build tool)
     - Build output directory: `public`

3. Add Environment Variables:
   - Go to Settings > Environment variables
   - Add the following variables:
     - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
     - `CLOUDINARY_API_KEY`: Your Cloudinary API key
     - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - Make sure to select both "Production" and "Preview" for each

4. Deploy your site:
   - Click "Save and Deploy"

## Step 5: How It Works

1. User flow:
   - User visits the enhancement page (`enhance.html`)
   - Selects an image and chooses enhancement options
   - Clicks "Enhance Image"
   - The image is sent to your Cloudflare Function
   - The Function uploads it to Cloudinary and applies transformations
   - The enhanced image is displayed and can be downloaded

2. Technical flow:
   - Frontend JS collects selected transformations
   - Sends image and transformation options to your Function
   - Function authenticates with Cloudinary
   - Uploads the image
   - Applies transformations via URL parameters
   - Returns the enhanced image URL

## Step 6: Troubleshooting

If you encounter issues:

1. Check Cloudflare Function logs:
   - In your Cloudflare dashboard, go to Workers & Pages
   - Select your application
   - Click on "Functions" tab
   - Click "View Logs"

2. Common issues:
   - CORS errors: Make sure your Function includes proper headers
   - Missing environment variables: Verify they're set in Cloudflare
   - Image upload failures: Check image size (keep under 10MB)
   - Function not found: Ensure file is in `functions/api/enhance.js`

## Step 7: Costs and Limits

- Cloudinary free tier includes:
  - 25,000 transformations per month
  - 25GB managed storage
  - 25GB monthly bandwidth

- Cloudflare Pages free tier includes:
  - Unlimited sites
  - 500 Function invocations per day
  - 100,000 Function invocations per month

Monitor your usage to avoid unexpected charges.

## Step 8: Customizing

You can customize the enhancement options by:

1. Editing `enhance.html` to add/remove enhancement options
2. Updating `enhance.js` to handle new options
3. Adding new transformations parameters in the Function's code

Consult [Cloudinary's documentation](https://cloudinary.com/documentation/transformation_reference) for more transformation options.