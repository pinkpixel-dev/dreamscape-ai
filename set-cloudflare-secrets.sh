#!/bin/bash

# ASCII Art banner
echo -e "\e[38;5;51m
██████╗ ██████╗ ███████╗ █████╗ ███╗   ███╗███████╗ ██████╗ █████╗ ██████╗ ███████╗
██╔══██╗██╔══██╗██╔════╝██╔══██╗████╗ ████║██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝
██║  ██║██████╔╝█████╗  ███████║██╔████╔██║███████╗██║     ███████║██████╔╝█████╗  
██║  ██║██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║╚════██║██║     ██╔══██║██╔═══╝ ██╔══╝  
██████╔╝██║  ██║███████╗██║  ██║██║ ╚═╝ ██║███████║╚██████╗██║  ██║██║     ███████╗
╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝
                                                                                   
\e[38;5;201m██╗    ██╗ █████╗ ████████╗███████╗ ██████╗ ███╗   ██╗                                   
\e[38;5;201m██║    ██║██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗████╗  ██║                                   
\e[38;5;201m██║ █╗ ██║███████║   ██║   ███████╗██║   ██║██╔██╗ ██║                                   
\e[38;5;201m██║███╗██║██╔══██║   ██║   ╚════██║██║   ██║██║╚██╗██║                                   
\e[38;5;201m╚███╔███╔╝██║  ██║   ██║   ███████║╚██████╔╝██║ ╚████║                                   
\e[38;5;201m ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝                                   
\e[38;5;81m███████╗███████╗████████╗██╗   ██╗██████╗                                              
\e[38;5;81m██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗                                             
\e[38;5;81m███████╗█████╗     ██║   ██║   ██║██████╔╝                                             
\e[38;5;81m╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝                                              
\e[38;5;81m███████║███████╗   ██║   ╚██████╔╝██║                                                  
\e[38;5;81m╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝\e[0m"

echo -e "\e[38;5;226m✨ Setting up Cloudflare Pages Environment Variables for Speech to Text\e[0m"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "\e[38;5;196m❌ Wrangler CLI not found. Please install it with 'npm install -g wrangler'\e[0m"
    exit 1
fi

# Get project name
echo -e "\e[38;5;39m📝 Enter your Cloudflare Pages project name:\e[0m"
read PROJECT_NAME

# Watson API Key
echo -e "\e[38;5;39m🔑 Enter your Watson API Key (or press Enter to use the one from .env):\e[0m"
read WATSON_API_KEY_INPUT

# If user didn't enter a key, try to get it from .env
if [ -z "$WATSON_API_KEY_INPUT" ]; then
    if [ -f .env ]; then
        WATSON_API_KEY=$(grep WATSON_API_KEY .env | cut -d '=' -f2)
        if [ -n "$WATSON_API_KEY" ]; then
            echo -e "\e[38;5;46m✅ Found Watson API Key in .env file\e[0m"
        else
            echo -e "\e[38;5;196m❌ Could not find WATSON_API_KEY in .env file\e[0m"
            exit 1
        fi
    else
        echo -e "\e[38;5;196m❌ No Watson API Key provided and no .env file found\e[0m"
        exit 1
    fi
else
    WATSON_API_KEY=$WATSON_API_KEY_INPUT
fi

# Set environment variables for preview and production
echo -e "\e[38;5;226m🔄 Setting environment variables for preview environment...\e[0m"
wrangler pages env set WATSON_API_KEY "$WATSON_API_KEY" --project-name="$PROJECT_NAME" --preview

echo -e "\e[38;5;226m🔄 Setting environment variables for production environment...\e[0m"
wrangler pages env set WATSON_API_KEY "$WATSON_API_KEY" --project-name="$PROJECT_NAME" --production

echo -e "\e[38;5;46m✅ Environment variables set successfully!\e[0m"
echo -e "\e[38;5;226m⚠️  Remember to deploy your site for the changes to take effect.\e[0m"
echo -e "\e[38;5;39m🚀 Deploy command: wrangler pages deploy\e[0m"

echo -e "\e[38;5;141m✨ Made with ❤️ by Pink Pixel\e[0m" 