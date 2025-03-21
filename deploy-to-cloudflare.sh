#!/bin/bash

# ASCII Art banner
echo -e "\e[38;5;51m
██████╗ ██████╗ ███████╗ █████╗ ███╗   ███╗███████╗ ██████╗ █████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗ ████║██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝
██║  ██║██████╔╝█████╗  ███████║██╔████╔██║███████╗██║     ███████║██████╔╝█████╗  
██║  ██║██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║╚════██║██║     ██╔══██║██╔═══╝ ██╔══╝  
██████╔╝██║  ██║███████╗██║  ██║██║ ╚═╝ ██║███████║╚██████╗██║  ██║██║     ███████╗
╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝
\e[0m
\e[38;5;183m██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗███╗   ███╗███████╗███╗   ██╗████████╗
██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝████╗ ████║██╔════╝████╗  ██║╚══██╔══╝
██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝ ██╔████╔██║█████╗  ██╔██╗ ██║   ██║   
██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║   
██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║   ██║ ╚═╝ ██║███████╗██║ ╚████║   ██║   
╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝\e[0m"

echo -e "\e[38;5;226m✨ Setting up Cloudflare Pages deployment with Speech to Text & Cloudinary\e[0m"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "\e[38;5;196m❌ Wrangler CLI not found. Installing...\e[0m"
    npm install -g wrangler
fi

# Get project name
echo -e "\e[38;5;39m📝 Enter your new Cloudflare Pages project name:\e[0m"
read PROJECT_NAME

# Check if .env file exists, create if not
if [ ! -f .env ]; then
    echo -e "\e[38;5;226m⚠️  No .env file found. Creating one now...\e[0m"
    touch .env
fi

# Watson API Key
echo -e "\e[38;5;39m🗣️ Enter your Watson Speech to Text API Key:\e[0m"
read WATSON_API_KEY
if [ -n "$WATSON_API_KEY" ]; then
    # Store in .env file
    if grep -q "WATSON_API_KEY" .env; then
        sed -i "s/WATSON_API_KEY=.*/WATSON_API_KEY=$WATSON_API_KEY/" .env
    else
        echo "WATSON_API_KEY=$WATSON_API_KEY" >> .env
    fi
    echo -e "\e[38;5;46m✅ Watson API Key added to .env\e[0m"
else
    echo -e "\e[38;5;196m❌ Watson API Key is required\e[0m"
    exit 1
fi

# Cloudinary credentials
echo -e "\e[38;5;39m☁️ Enter your Cloudinary Cloud Name:\e[0m"
read CLOUDINARY_CLOUD_NAME
if [ -n "$CLOUDINARY_CLOUD_NAME" ]; then
    if grep -q "CLOUDINARY_CLOUD_NAME" .env; then
        sed -i "s/CLOUDINARY_CLOUD_NAME=.*/CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME/" .env
    else
        echo "CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME" >> .env
    fi
    echo -e "\e[38;5;46m✅ Cloudinary Cloud Name added to .env\e[0m"
else
    echo -e "\e[38;5;196m❌ Cloudinary Cloud Name is required\e[0m"
    exit 1
fi

echo -e "\e[38;5;39m🔑 Enter your Cloudinary API Key:\e[0m"
read CLOUDINARY_API_KEY
if [ -n "$CLOUDINARY_API_KEY" ]; then
    if grep -q "CLOUDINARY_API_KEY" .env; then
        sed -i "s/CLOUDINARY_API_KEY=.*/CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY/" .env
    else
        echo "CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY" >> .env
    fi
    echo -e "\e[38;5;46m✅ Cloudinary API Key added to .env\e[0m"
else
    echo -e "\e[38;5;196m❌ Cloudinary API Key is required\e[0m"
    exit 1
fi

echo -e "\e[38;5;39m🔒 Enter your Cloudinary API Secret:\e[0m"
read CLOUDINARY_API_SECRET
if [ -n "$CLOUDINARY_API_SECRET" ]; then
    if grep -q "CLOUDINARY_API_SECRET" .env; then
        sed -i "s/CLOUDINARY_API_SECRET=.*/CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET/" .env
    else
        echo "CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET" >> .env
    fi
    echo -e "\e[38;5;46m✅ Cloudinary API Secret added to .env\e[0m"
else
    echo -e "\e[38;5;196m❌ Cloudinary API Secret is required\e[0m"
    exit 1
fi

# Create/update wrangler.toml if it doesn't exist
if [ ! -f wrangler.toml ]; then
    echo -e "\e[38;5;226m⚠️  No wrangler.toml found. Creating one now...\e[0m"
    cat > wrangler.toml << EOF
name = "$PROJECT_NAME"
compatibility_date = "$(date +%Y-%m-%d)"

[site]
bucket = "."

[build]
command = ""

[env.production]
EOF
    echo -e "\e[38;5;46m✅ Created wrangler.toml file\e[0m"
fi

# Create a GitHub workflow file for automatic deployment
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << EOF
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy --project-name=$PROJECT_NAME
EOF
echo -e "\e[38;5;46m✅ Created GitHub workflow for automatic deployment\e[0m"

# Set up Wrangler configuration for local development
echo -e "\e[38;5;226m🔄 Setting up local development environment...\e[0m"

# Create initial Cloudflare Pages project if it doesn't exist yet
echo -e "\e[38;5;226m🚀 Creating Cloudflare Pages project...\e[0m"
echo -e "\e[38;5;226m⚠️  You'll need to authenticate with Cloudflare if you haven't already.\e[0m"
echo -e "\e[38;5;226m⚠️  Press Enter to continue and follow the authentication prompts.\e[0m"
read

# Create the Cloudflare Pages project
wrangler pages project create $PROJECT_NAME --production-branch=main || echo -e "\e[38;5;226m⚠️  Project may already exist or couldn't be created automatically. Continuing anyway...\e[0m"

# Set environment variables for preview and production
echo -e "\e[38;5;226m🔄 Setting environment variables for preview environment...\e[0m"
wrangler pages env set WATSON_API_KEY "$WATSON_API_KEY" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set Watson API Key for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"
wrangler pages env set CLOUDINARY_CLOUD_NAME "$CLOUDINARY_CLOUD_NAME" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary Cloud Name for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"
wrangler pages env set CLOUDINARY_API_KEY "$CLOUDINARY_API_KEY" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary API Key for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"
wrangler pages env set CLOUDINARY_API_SECRET "$CLOUDINARY_API_SECRET" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary API Secret for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"

echo -e "\e[38;5;226m🔄 Setting environment variables for production environment...\e[0m"
wrangler pages env set WATSON_API_KEY "$WATSON_API_KEY" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set Watson API Key for production. Try setting it manually in the Cloudflare dashboard.\e[0m" 
wrangler pages env set CLOUDINARY_CLOUD_NAME "$CLOUDINARY_CLOUD_NAME" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary Cloud Name for production. Try setting it manually in the Cloudflare dashboard.\e[0m"
wrangler pages env set CLOUDINARY_API_KEY "$CLOUDINARY_API_KEY" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary API Key for production. Try setting it manually in the Cloudflare dashboard.\e[0m"
wrangler pages env set CLOUDINARY_API_SECRET "$CLOUDINARY_API_SECRET" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary API Secret for production. Try setting it manually in the Cloudflare dashboard.\e[0m"

# Deploy to Cloudflare Pages
echo -e "\e[38;5;226m🚀 Ready to deploy your site to Cloudflare Pages!\e[0m"
echo -e "\e[38;5;226m⚠️  Would you like to deploy now? (y/n)\e[0m"
read DEPLOY_NOW

if [ "$DEPLOY_NOW" = "y" ] || [ "$DEPLOY_NOW" = "Y" ]; then
    echo -e "\e[38;5;226m🚀 Deploying to Cloudflare Pages...\e[0m"
    wrangler pages deploy --project-name="$PROJECT_NAME"
    echo -e "\e[38;5;46m✅ Deployment complete!\e[0m"
else
    echo -e "\e[38;5;226m⚠️  Deployment skipped. You can deploy manually later with:\e[0m"
    echo -e "\e[38;5;39m  wrangler pages deploy --project-name=\"$PROJECT_NAME\"\e[0m"
fi

echo -e "\e[38;5;46m✅ Setup complete!\e[0m"
echo -e "\e[38;5;226m⚠️  Remember to check your Cloudflare Pages dashboard to verify your project settings.\e[0m"
echo -e "\e[38;5;226m⚠️  Make sure your environment variables are correctly set in both preview and production environments.\e[0m"

echo -e "\e[38;5;141m✨ Made with ❤️ by Pink Pixel\e[0m" 