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

# FireCrawl API Key
echo -e "\e[38;5;39m🔥 Enter your FireCrawl API Key:\e[0m"
read FIRECRAWL_API_KEY
if [ -n "$FIRECRAWL_API_KEY" ]; then
    if grep -q "FIRECRAWL_API_KEY" .env; then
        sed -i "s/FIRECRAWL_API_KEY=.*/FIRECRAWL_API_KEY=$FIRECRAWL_API_KEY/" .env
    else
        echo "FIRECRAWL_API_KEY=$FIRECRAWL_API_KEY" >> .env
    fi
    echo -e "\e[38;5;46m✅ FireCrawl API Key added to .env\e[0m"
else
    echo -e "\e[38;5;226m⚠️ FireCrawl API Key not provided, continuing without it\e[0m"
    FIRECRAWL_API_KEY="your-firecrawl-api-key-here"
fi

# ScraperAI API Key
echo -e "\e[38;5;39m🤖 Enter your ScraperAI API Key:\e[0m"
read SCRAPERAI_API_KEY
if [ -n "$SCRAPERAI_API_KEY" ]; then
    if grep -q "SCRAPERAI_API_KEY" .env; then
        sed -i "s/SCRAPERAI_API_KEY=.*/SCRAPERAI_API_KEY=$SCRAPERAI_API_KEY/" .env
    else
        echo "SCRAPERAI_API_KEY=$SCRAPERAI_API_KEY" >> .env
    fi
    echo -e "\e[38;5;46m✅ ScraperAI API Key added to .env\e[0m"
else
    echo -e "\e[38;5;226m⚠️ ScraperAI API Key not provided, continuing without it\e[0m"
    SCRAPERAI_API_KEY="your-scraperapi-key-here"
fi

# ScrapingAnt API Key
echo -e "\e[38;5;39m🐜 Enter your ScrapingAnt API Key:\e[0m"
read SCRAPINGANT_API_KEY
if [ -n "$SCRAPINGANT_API_KEY" ]; then
    if grep -q "SCRAPINGANT_API_KEY" .env; then
        sed -i "s/SCRAPINGANT_API_KEY=.*/SCRAPINGANT_API_KEY=$SCRAPINGANT_API_KEY/" .env
    else
        echo "SCRAPINGANT_API_KEY=$SCRAPINGANT_API_KEY" >> .env
    fi
    echo -e "\e[38;5;46m✅ ScrapingAnt API Key added to .env\e[0m"
else
    echo -e "\e[38;5;226m⚠️ ScrapingAnt API Key not provided, continuing without it\e[0m"
    SCRAPINGANT_API_KEY="your-scrapingant-api-key-here"
fi

# PhantomJsCloud API Key
echo -e "\e[38;5;39m👻 Enter your PhantomJsCloud API Key:\e[0m"
read PHANTOMJSCLOUD_API_KEY
if [ -n "$PHANTOMJSCLOUD_API_KEY" ]; then
    if grep -q "PHANTOMJSCLOUD_API_KEY" .env; then
        sed -i "s/PHANTOMJSCLOUD_API_KEY=.*/PHANTOMJSCLOUD_API_KEY=$PHANTOMJSCLOUD_API_KEY/" .env
    else
        echo "PHANTOMJSCLOUD_API_KEY=$PHANTOMJSCLOUD_API_KEY" >> .env
    fi
    echo -e "\e[38;5;46m✅ PhantomJsCloud API Key added to .env\e[0m"
else
    echo -e "\e[38;5;226m⚠️ PhantomJsCloud API Key not provided, continuing without it\e[0m"
    PHANTOMJSCLOUD_API_KEY="your-phantomjscloud-api-key-here"
fi

# Ask if the user wants to create or update wrangler.toml
echo -e "\e[38;5;39m❓ Do you want to create or update wrangler.toml? (y/n)\e[0m"
read UPDATE_WRANGLER

if [ "$UPDATE_WRANGLER" = "y" ] || [ "$UPDATE_WRANGLER" = "Y" ]; then
    echo -e "\e[38;5;226m⚠️  Creating/updating wrangler.toml...\e[0m"
    cat > wrangler.toml << EOF
name = "$PROJECT_NAME"
compatibility_date = "2025-03-21"
pages_build_output_dir = "."

[vars]
WATSON_API_KEY = "$WATSON_API_KEY"
CLOUDINARY_CLOUD_NAME = "$CLOUDINARY_CLOUD_NAME"
CLOUDINARY_API_KEY = "$CLOUDINARY_API_KEY"
CLOUDINARY_API_SECRET = "$CLOUDINARY_API_SECRET"
FIRECRAWL_API_KEY = "$FIRECRAWL_API_KEY"
SCRAPERAI_API_KEY = "$SCRAPERAI_API_KEY"
SCRAPINGANT_API_KEY = "$SCRAPINGANT_API_KEY"
PHANTOMJSCLOUD_API_KEY = "$PHANTOMJSCLOUD_API_KEY"
EOF
    echo -e "\e[38;5;46m✅ Created/updated wrangler.toml file\e[0m"
else
    echo -e "\e[38;5;226m⚠️  Skipping wrangler.toml creation/update.\e[0m"

    # If wrangler.toml doesn't exist, create a minimal version without environment variables
    if [ ! -f wrangler.toml ]; then
        echo -e "\e[38;5;226m⚠️  No wrangler.toml found. Creating a minimal version...\e[0m"
        cat > wrangler.toml << EOF
name = "$PROJECT_NAME"
compatibility_date = "2025-03-21"
pages_build_output_dir = "."
EOF
        echo -e "\e[38;5;46m✅ Created minimal wrangler.toml file\e[0m"
    fi
fi

# Check if wrangler.toml is in .gitignore and add it if not
if [ -f .gitignore ]; then
    if ! grep -q "wrangler.toml" .gitignore; then
        echo -e "\e[38;5;226m⚠️  Adding wrangler.toml to .gitignore to protect your API keys\e[0m"
        echo "wrangler.toml" >> .gitignore
        echo -e "\e[38;5;46m✅ Added wrangler.toml to .gitignore\e[0m"
    else
        echo -e "\e[38;5;46m✅ wrangler.toml is already in .gitignore\e[0m"
    fi
else
    echo -e "\e[38;5;226m⚠️  Creating .gitignore file to protect your API keys\e[0m"
    echo "wrangler.toml" > .gitignore
    echo -e "\e[38;5;46m✅ Created .gitignore with wrangler.toml\e[0m"
fi

# Create an example file without actual keys
echo -e "\e[38;5;226m🔄 Creating wrangler.toml.example template file...\e[0m"
cat > wrangler.toml.example << EOF
name = "$PROJECT_NAME"
compatibility_date = "2025-03-21"
pages_build_output_dir = "."

[vars]
WATSON_API_KEY = "your-watson-api-key-here"
CLOUDINARY_CLOUD_NAME = "your-cloudinary-cloud-name-here"
CLOUDINARY_API_KEY = "your-cloudinary-api-key-here"
CLOUDINARY_API_SECRET = "your-cloudinary-api-secret-here"
FIRECRAWL_API_KEY = "your-firecrawl-api-key-here"
SCRAPERAI_API_KEY = "your-scraperapi-key-here"
SCRAPINGANT_API_KEY = "your-scrapingant-api-key-here"
PHANTOMJSCLOUD_API_KEY = "your-phantomjscloud-api-key-here"
EOF
echo -e "\e[38;5;46m✅ Created wrangler.toml.example template file\e[0m"
echo -e "\e[38;5;226m⚠️  SECURITY WARNING: wrangler.toml contains your API keys. Never commit this file to git!\e[0m"

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
echo -e "\e[38;5;226m🔄 Checking if environment variables need to be set...\e[0m"

# Ask if the user wants to update environment variables
echo -e "\e[38;5;39m❓ Do you want to update environment variables in Cloudflare Pages? (y/n)\e[0m"
read UPDATE_ENV_VARS

if [ "$UPDATE_ENV_VARS" = "y" ] || [ "$UPDATE_ENV_VARS" = "Y" ]; then
    echo -e "\e[38;5;226m🔄 Setting environment variables for preview environment...\e[0m"
    wrangler pages env set WATSON_API_KEY "$WATSON_API_KEY" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set Watson API Key for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set CLOUDINARY_CLOUD_NAME "$CLOUDINARY_CLOUD_NAME" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary Cloud Name for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set CLOUDINARY_API_KEY "$CLOUDINARY_API_KEY" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary API Key for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set CLOUDINARY_API_SECRET "$CLOUDINARY_API_SECRET" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary API Secret for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set FIRECRAWL_API_KEY "$FIRECRAWL_API_KEY" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set FireCrawl API Key for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set SCRAPERAI_API_KEY "$SCRAPERAI_API_KEY" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set ScraperAI API Key for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set SCRAPINGANT_API_KEY "$SCRAPINGANT_API_KEY" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set ScrapingAnt API Key for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set PHANTOMJSCLOUD_API_KEY "$PHANTOMJSCLOUD_API_KEY" --project-name="$PROJECT_NAME" --preview || echo -e "\e[38;5;226m⚠️  Couldn't set PhantomJsCloud API Key for preview. Try setting it manually in the Cloudflare dashboard.\e[0m"

    echo -e "\e[38;5;226m🔄 Setting environment variables for production environment...\e[0m"
    wrangler pages env set WATSON_API_KEY "$WATSON_API_KEY" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set Watson API Key for production. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set CLOUDINARY_CLOUD_NAME "$CLOUDINARY_CLOUD_NAME" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary Cloud Name for production. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set CLOUDINARY_API_KEY "$CLOUDINARY_API_KEY" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary API Key for production. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set CLOUDINARY_API_SECRET "$CLOUDINARY_API_SECRET" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set Cloudinary API Secret for production. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set FIRECRAWL_API_KEY "$FIRECRAWL_API_KEY" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set FireCrawl API Key for production. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set SCRAPERAI_API_KEY "$SCRAPERAI_API_KEY" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set ScraperAI API Key for production. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set SCRAPINGANT_API_KEY "$SCRAPINGANT_API_KEY" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set ScrapingAnt API Key for production. Try setting it manually in the Cloudflare dashboard.\e[0m"
    wrangler pages env set PHANTOMJSCLOUD_API_KEY "$PHANTOMJSCLOUD_API_KEY" --project-name="$PROJECT_NAME" --production || echo -e "\e[38;5;226m⚠️  Couldn't set PhantomJsCloud API Key for production. Try setting it manually in the Cloudflare dashboard.\e[0m"
else
    echo -e "\e[38;5;226m⚠️  Skipping environment variable updates. Using existing variables in Cloudflare Pages.\e[0m"
fi

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