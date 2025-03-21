#!/bin/bash

# ASCII Art banner
echo -e "\e[38;5;51m
████████╗███████╗███████╗████████╗    ██╗      ██████╗  ██████╗ █████╗ ██╗     ██╗  ██╗   ██╗
╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝    ██║     ██╔═══██╗██╔════╝██╔══██╗██║     ██║  ╚██╗ ██╔╝
   ██║   █████╗  ███████╗   ██║       ██║     ██║   ██║██║     ███████║██║     ██║   ╚████╔╝ 
   ██║   ██╔══╝  ╚════██║   ██║       ██║     ██║   ██║██║     ██╔══██║██║     ██║    ╚██╔╝  
   ██║   ███████╗███████║   ██║       ███████╗╚██████╔╝╚██████╗██║  ██║███████╗███████╗██║   
   ╚═╝   ╚══════╝╚══════╝   ╚═╝       ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝   
\e[0m"

echo -e "\e[38;5;226m✨ Testing Dreamscape AI APIs locally before deployment\e[0m"

# Check if we have environment variables set
if [ ! -f .env ]; then
    echo -e "\e[38;5;196m❌ No .env file found!\e[0m"
    echo -e "\e[38;5;226m⚠️  Creating a new .env file...\e[0m"
    touch .env
fi

# Watson API Key
if ! grep -q "WATSON_API_KEY" .env; then
    echo -e "\e[38;5;39m🗣️ Enter your Watson Speech to Text API Key:\e[0m"
    read WATSON_API_KEY
    echo "WATSON_API_KEY=$WATSON_API_KEY" >> .env
fi

# Cloudinary credentials
if ! grep -q "CLOUDINARY_CLOUD_NAME" .env; then
    echo -e "\e[38;5;39m☁️ Enter your Cloudinary Cloud Name:\e[0m"
    read CLOUDINARY_CLOUD_NAME
    echo "CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME" >> .env
fi

if ! grep -q "CLOUDINARY_API_KEY" .env; then
    echo -e "\e[38;5;39m🔑 Enter your Cloudinary API Key:\e[0m"
    read CLOUDINARY_API_KEY
    echo "CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY" >> .env
fi

if ! grep -q "CLOUDINARY_API_SECRET" .env; then
    echo -e "\e[38;5;39m🔒 Enter your Cloudinary API Secret:\e[0m"
    read CLOUDINARY_API_SECRET
    echo "CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET" >> .env
fi

# Install wrangler if not present
if ! command -v wrangler &> /dev/null; then
    echo -e "\e[38;5;226m⚠️  Wrangler CLI not found. Installing...\e[0m"
    npm install -g wrangler
fi

# Install jq for JSON parsing if not present
if ! command -v jq &> /dev/null; then
    echo -e "\e[38;5;226m⚠️  jq not found. This is used for parsing JSON responses.\e[0m"
    echo -e "\e[38;5;226m⚠️  Please install jq using your package manager (e.g., apt install jq).\e[0m"
    read -p "Press Enter to continue anyway (some tests may not work properly)..."
fi

# Function to test Watson Speech to Text API
test_watson() {
    echo -e "\e[38;5;226m🔍 Testing Watson Speech to Text API...\e[0m"
    
    # Get the Watson API key from .env file
    WATSON_API_KEY=$(grep WATSON_API_KEY .env | cut -d '=' -f2)
    
    if [ -z "$WATSON_API_KEY" ]; then
        echo -e "\e[38;5;196m❌ Watson API Key not found in .env file!\e[0m"
        return 1
    fi
    
    # Make a simple request to the Watson API to check if the key is valid
    echo -e "\e[38;5;226m📡 Sending request to Watson API...\e[0m"
    
    # Use curl to make a request to the Watson API
    RESPONSE=$(curl -s -X GET \
        -H "Authorization: Basic $(echo -n "apikey:$WATSON_API_KEY" | base64)" \
        "https://api.us-south.speech-to-text.watson.cloud.ibm.com/v1/models")
    
    # Check if the request was successful
    if [[ $RESPONSE == *"models"* ]]; then
        echo -e "\e[38;5;46m✅ Watson API test successful!\e[0m"
        echo -e "\e[38;5;46m✅ Your Watson API key is valid.\e[0m"
        
        # If jq is installed, show available models
        if command -v jq &> /dev/null; then
            echo -e "\e[38;5;226m📋 Available Watson models:\e[0m"
            echo $RESPONSE | jq -r '.models[] | select(.language=="en-US") | .name' | head -5
        else
            echo -e "\e[38;5;226m📋 Success! Install jq to see available models.\e[0m"
        fi
        
        return 0
    else
        echo -e "\e[38;5;196m❌ Watson API test failed!\e[0m"
        echo -e "\e[38;5;196m❌ Response: $RESPONSE\e[0m"
        return 1
    fi
}

# Function to test Cloudinary API
test_cloudinary() {
    echo -e "\e[38;5;226m🔍 Testing Cloudinary API...\e[0m"
    
    # Get Cloudinary credentials from .env file
    CLOUDINARY_CLOUD_NAME=$(grep CLOUDINARY_CLOUD_NAME .env | cut -d '=' -f2)
    CLOUDINARY_API_KEY=$(grep CLOUDINARY_API_KEY .env | cut -d '=' -f2)
    CLOUDINARY_API_SECRET=$(grep CLOUDINARY_API_SECRET .env | cut -d '=' -f2)
    
    if [ -z "$CLOUDINARY_CLOUD_NAME" ] || [ -z "$CLOUDINARY_API_KEY" ] || [ -z "$CLOUDINARY_API_SECRET" ]; then
        echo -e "\e[38;5;196m❌ Cloudinary credentials not found in .env file!\e[0m"
        return 1
    fi
    
    # Make a simple request to the Cloudinary API to check if the credentials are valid
    echo -e "\e[38;5;226m📡 Sending request to Cloudinary API...\e[0m"
    
    # Generate a timestamp and signature
    TIMESTAMP=$(date +%s)
    SIGNATURE=$(echo -n "timestamp=$TIMESTAMP$CLOUDINARY_API_SECRET" | sha1sum | cut -d ' ' -f1)
    
    # Use curl to make a request to the Cloudinary API
    RESPONSE=$(curl -s \
        "https://api.cloudinary.com/v1_1/$CLOUDINARY_CLOUD_NAME/ping?api_key=$CLOUDINARY_API_KEY&timestamp=$TIMESTAMP&signature=$SIGNATURE")
    
    # Check if the request was successful
    if [[ $RESPONSE == *"status"*"ok"* ]]; then
        echo -e "\e[38;5;46m✅ Cloudinary API test successful!\e[0m"
        echo -e "\e[38;5;46m✅ Your Cloudinary credentials are valid.\e[0m"
        
        # Try to get account info
        ACCOUNT_INFO=$(curl -s \
            "https://api.cloudinary.com/v1_1/$CLOUDINARY_CLOUD_NAME/usage?api_key=$CLOUDINARY_API_KEY&timestamp=$TIMESTAMP&signature=$SIGNATURE")
        
        if command -v jq &> /dev/null; then
            PLAN=$(echo $ACCOUNT_INFO | jq -r '.plan' 2>/dev/null)
            if [ ! -z "$PLAN" ]; then
                echo -e "\e[38;5;226m📋 Cloudinary plan: $PLAN\e[0m"
            fi
        else
            echo -e "\e[38;5;226m📋 Success! Install jq to see account details.\e[0m"
        fi
        
        return 0
    else
        echo -e "\e[38;5;196m❌ Cloudinary API test failed!\e[0m"
        echo -e "\e[38;5;196m❌ Response: $RESPONSE\e[0m"
        return 1
    fi
}

# Function to run Wrangler to test the functions locally
test_wrangler() {
    echo -e "\e[38;5;226m🔍 Starting local development server with Wrangler...\e[0m"
    echo -e "\e[38;5;226m⚠️  This will serve the site locally and allow testing the API endpoints.\e[0m"
    echo -e "\e[38;5;226m⚠️  Press Ctrl+C to stop the server when done testing.\e[0m"
    
    # Check if wrangler.toml exists
    if [ ! -f wrangler.toml ]; then
        echo -e "\e[38;5;226m⚠️  No wrangler.toml found. Creating a simple one for testing...\e[0m"
        cat > wrangler.toml << EOF
name = "dreamscape-ai-test"
compatibility_date = "$(date +%Y-%m-%d)"

[site]
bucket = "."
EOF
    fi
    
    # Start wrangler dev server
    echo -e "\e[38;5;226m🚀 Starting Wrangler development server...\e[0m"
    echo -e "\e[38;5;226m⚠️  Note: Your environment variables will be available to the functions.\e[0m"
    
    # Run wrangler in dev mode with the .env file
    wrangler pages dev . --binding "WATSON_API_KEY=$(grep WATSON_API_KEY .env | cut -d '=' -f2)" \
                         --binding "CLOUDINARY_CLOUD_NAME=$(grep CLOUDINARY_CLOUD_NAME .env | cut -d '=' -f2)" \
                         --binding "CLOUDINARY_API_KEY=$(grep CLOUDINARY_API_KEY .env | cut -d '=' -f2)" \
                         --binding "CLOUDINARY_API_SECRET=$(grep CLOUDINARY_API_SECRET .env | cut -d '=' -f2)"
}

# Main testing menu
echo -e "\e[38;5;226m📋 Select what you want to test:\e[0m"
echo -e "\e[38;5;226m1) Test Watson Speech to Text API\e[0m"
echo -e "\e[38;5;226m2) Test Cloudinary API\e[0m"
echo -e "\e[38;5;226m3) Start local development server with Wrangler\e[0m"
echo -e "\e[38;5;226m4) Run all tests and start local server\e[0m"
echo -e "\e[38;5;226m0) Exit\e[0m"

read -p "Enter your choice (0-4): " choice

case $choice in
    1)
        test_watson
        ;;
    2)
        test_cloudinary
        ;;
    3)
        test_wrangler
        ;;
    4)
        test_watson
        test_cloudinary
        test_wrangler
        ;;
    0)
        echo -e "\e[38;5;226m👋 Goodbye!\e[0m"
        exit 0
        ;;
    *)
        echo -e "\e[38;5;196m❌ Invalid choice!\e[0m"
        exit 1
        ;;
esac

echo -e "\e[38;5;141m✨ Made with ❤️ by Pink Pixel\e[0m" 