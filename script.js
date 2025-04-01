// DOM Elements
const widthSlider = document.getElementById('width');
const heightSlider = document.getElementById('height');
const widthValue = document.getElementById('width-value');
const heightValue = document.getElementById('height-value');
const randomSeedCheckbox = document.getElementById('random-seed');
const seedInput = document.getElementById('seed');
const seedInputGroup = document.getElementById('seed-input-group');
const modelSelect = document.getElementById('model');
const styleSelect = document.getElementById('style');
const styleDescription = document.getElementById('style-description');
const enhancePromptCheckbox = document.getElementById('enhance-prompt');
const enhanceDescription = document.getElementById('enhance-description');
const promptInput = document.getElementById('prompt-input');
const createButton = document.getElementById('create-button');
const resultContainer = document.getElementById('result-container');
// Add lightbox elements
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.style.display = 'none';
document.body.appendChild(lightbox);

// Added new variable to store the enhanced text from the API
let apiEnhancedPrompt = '';
// Added new variable to store the formatted response
let apiFormattedResponse = null;
// Added new variable to store the artwork title
let apiArtworkTitle = null;
// Added variable to store the current image URL for lightbox
let currentImageUrl = '';

// Global flag to track if stars have been initialized
window.starsInitialized = false;

// Initialize the application
function initApp() {
    // Setup event listeners
    widthSlider.addEventListener('input', () => {
        widthValue.textContent = widthSlider.value;
    });
    
    heightSlider.addEventListener('input', () => {
        heightValue.textContent = heightSlider.value;
    });
    
    randomSeedCheckbox.addEventListener('change', () => {
        seedInput.disabled = randomSeedCheckbox.checked;
        if (randomSeedCheckbox.checked) {
            seedInput.value = Math.floor(Math.random() * 1337) + 1;
        }
    });
    
    // Toggle enhance description visibility
    enhanceDescription.style.opacity = enhancePromptCheckbox.checked ? '0.8' : '0';
    enhancePromptCheckbox.addEventListener('change', () => {
        enhanceDescription.style.opacity = enhancePromptCheckbox.checked ? '0.8' : '0';
    });
    
    // Fetch available models from Pollinations
    fetchAvailableModels();
    
    // Populate style options from the styles.js file
    populateStyles();
    
    // Set up the image generation
    createButton.addEventListener('click', generateImage);
    
    // Also trigger image generation on Enter key when the prompt input is focused
    promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateImage();
        }
    });
    
    // Add style change listener
    styleSelect.addEventListener('change', updateStyleDescription);
}

// Fetch available models from Pollinations API
async function fetchAvailableModels() {
    try {
        // Clear existing options
        while (modelSelect.firstChild) {
            modelSelect.removeChild(modelSelect.firstChild);
        }
        
        // Fetch models directly from Pollinations image API
        const response = await fetch('https://image.pollinations.ai/models');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
        }
        
        const models = await response.json();
        
        // Add each model to the select dropdown
        if (Array.isArray(models) && models.length > 0) {
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                
                // Rename "turbo" to "Stable Diffusion XL" for display only
                if (model === 'turbo') {
                    option.textContent = 'Stable Diffusion XL';
                } else {
                option.textContent = model.charAt(0).toUpperCase() + model.slice(1); // Capitalize first letter
                }
                
                modelSelect.appendChild(option);
            });
            
            // Select the first model by default
            if (modelSelect.firstChild) {
                modelSelect.firstChild.selected = true;
            }
        } else {
            // If no models were found, add default fallback models
            addDefaultModels();
        }
    } catch (error) {
        console.error('Error fetching models from Pollinations API:', error);
        // Add default models as fallback
        addDefaultModels();
    }
}

// Add default models if API call fails
function addDefaultModels() {
    const defaultModels = [
        { name: 'Flux', value: 'flux' },
        { name: 'Stable Diffusion XL', value: 'turbo' }
    ];
    
    defaultModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.name;
        modelSelect.appendChild(option);
    });
}

// Populate styles from the styles.js data
function populateStyles() {
    if (typeof STYLE_PROMPTS !== 'undefined') {
        for (const [key, style] of Object.entries(STYLE_PROMPTS)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = style.name;
            styleSelect.appendChild(option);
        }
        
        // Initialize the style description
        updateStyleDescription();
    } else {
        console.error('STYLE_PROMPTS is not defined. Make sure styles.js is loaded properly.');
    }
}

// Update the style description when style changes
function updateStyleDescription() {
    const selectedStyle = styleSelect.value;
    if (STYLE_PROMPTS[selectedStyle]) {
        styleDescription.textContent = STYLE_PROMPTS[selectedStyle].description;
    } else {
        styleDescription.textContent = '';
    }
}

// Enhance the prompt with the selected style
function enhancePrompt(prompt, style) {
    if (!style || style === 'none') {
        return prompt;
    }
    
    const styleInfo = STYLE_PROMPTS[style];
    // Add more emphasis to the user's prompt and place it first
    // This ensures the main subject (like "dog") gets highest priority
    return `a ${prompt.toUpperCase()}, ${styleInfo.prompt}`;
}

// NEW FUNCTION: Fetch available text models from Pollinations
async function fetchAvailableTextModels() {
    try {
        const response = await fetch('https://text.pollinations.ai/models');
        if (!response.ok) {
            throw new Error(`Failed to fetch text models: ${response.status} ${response.statusText}`);
        }
        const models = await response.json();
        console.log('Available text models:', models);
        return models;
    } catch (error) {
        console.error('Error fetching text models:', error);
        return null;
    }
}

// NEW FUNCTION: Enhance prompt using Pollinations text API
async function enhancePromptWithAPI(prompt, style, seed) {
    try {
        // Construct the complete instruction set for the Pollinations text API
        let basePrompt = prompt;
        if (style && style !== 'none') {
            const styleInfo = STYLE_PROMPTS[style];
            basePrompt = `a ${prompt} in ${styleInfo.name} style. ${styleInfo.prompt}`;
        }

        // Build the complete instruction set as provided
        const enhanceInstruction = `
  # Image Generator Instructions

  You are an image generator. The user provides a prompt. Please infer the following parameters for image generation:

  ## Required:
  - **Title:** [title, max 5 words]
  - **Prompt:** [prompt, max 80 words]

  ## Key points:
  - Give the artwork a unique and creative name and return the title with the prompt.
  - Reformat the user's prompt. Add creative details to make it about 50-80 words suitable for an image generator AI.
  - Each seed value creates a unique image for a given prompt.
  - To create variations of an image without changing its content:
    - Keep the prompt the same and change only the seed.
  - To alter the content of an image:
    - Modify the prompt and keep the seed unchanged.
  - Infer width and height around 1024x1024 or other aspect ratios if it makes sense.

  ## Additional instructions:
  - Format your response as a markdown document with the title, prompt, and parameters.
  - Create a markdown image placeholder with the title as the alt text.

  The user's prompt is: ${basePrompt}
`;
        
        console.log('Sending to Pollinations text API with complete instructions and /imagine command');
        console.log('Base prompt being sent:', basePrompt);
        
        // Select the appropriate model based on the task
        // For creative writing and prompt enhancement, we'll prioritize these models in order:
        // 1. openai-large (GPT-4o) - most powerful model available
        // 2. openai (GPT-4o-mini) - good overall performance
        // 3. pixtral - vision capabilities, good for image descriptions
        // 4. llama (Llama 3.3 70B) - powerful open model
        // 5. mistral (fallback) - our current default
        
        // The models below are sorted by preference for creative prompt enhancement
        const preferredModels = ['openai-large', 'openai', 'pixtral', 'llama', 'mistral'];
        let modelToUse = 'mistral'; // Default fallback
        
        // Try to fetch available models
        try {
            const availableModels = await fetchAvailableTextModels();
            if (availableModels && Array.isArray(availableModels)) {
                // Find the first preferred model that's available
                for (const model of preferredModels) {
                    if (availableModels.some(m => m.name === model)) {
                        modelToUse = model;
                        console.log(`Using ${modelToUse} model for text enhancement`);
                        break;
                    }
                }
            }
        } catch (e) {
            console.log('Could not fetch available models, using mistral as fallback');
        }
        
        // Create an AbortController to handle timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Standard 15 second timeout
        
        try {
            // Call the Pollinations text API with timeout
            let response;
            let modelError = null;
            
            try {
                // First try with the selected model
                response = await fetch('https://text.pollinations.ai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: [
                            { role: 'user', content: enhanceInstruction }
                        ],
                        model: modelToUse,
                    }),
                    signal: controller.signal
                });
                
                // If we got a bad response and it's not mistral, try with mistral as fallback
                if (!response.ok && modelToUse !== 'mistral') {
                    console.log(`Model ${modelToUse} failed with status ${response.status}, falling back to mistral`);
                    modelError = `Failed with status ${response.status}`;
                    modelToUse = 'mistral'; // Update the model used
                    
                    // Try again with mistral model
                    response = await fetch('https://text.pollinations.ai', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            messages: [
                                { role: 'user', content: enhanceInstruction }
                            ],
                            model: 'mistral', // Fallback to mistral
                        }),
                        signal: controller.signal
                    });
                }
            } catch (modelFetchError) {
                console.error(`Error with model ${modelToUse}:`, modelFetchError);
                
                // If the error is not a timeout and we're not already using mistral, try mistral
                if (modelFetchError.name !== 'AbortError' && modelToUse !== 'mistral') {
                    console.log('Falling back to mistral model');
                    modelToUse = 'mistral'; // Update the model used
                    
                    response = await fetch('https://text.pollinations.ai', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            messages: [
                                { role: 'user', content: enhanceInstruction }
                            ],
                            model: 'mistral', // Fallback to mistral
                        }),
                        signal: controller.signal
                    });
                } else {
                    // Re-throw if it's already mistral or a timeout
                    throw modelFetchError;
                }
            }
            
            // Clear the timeout
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Failed to enhance prompt: ${response.status} ${response.statusText}`);
            }
            
            // Try to get response as text
            const textResponse = await response.text();
            console.log(`Raw response from text API (${modelToUse}):`, textResponse);
            
            // Clean up and prepare the formatted response
            let formattedResponse = textResponse;
            // Remove any excessive newlines at beginning or end
            formattedResponse = formattedResponse.trim();
            // Remove any trailing code fences without content
            formattedResponse = formattedResponse.replace(/\n\s*```\s*$/g, '');
            // Convert any double or triple+ line breaks to double line breaks
            formattedResponse = formattedResponse.replace(/\n{3,}/g, '\n\n');
            
            let enhancedText = '';
            let artworkTitle = null;
            
            // Extract title if present (format: ![Title](#) or ### Title: or similar)
            const titlePatterns = [
                /!\[(.*?)\]\(#\)/,                  // ![Title](#)
                /###\s+(?:Title:)?\s*["']?(.*?)["']?(?:\s|$)/i,  // ### Title: "Name" or ### "Name"
                /\*Title:\s*(.*?)\*/,              // *Title: Name*
                /Title:\s*["']?(.*?)["']?(?:\s|$)/  // Title: "Name" or Title: Name
            ];
            
            for (const pattern of titlePatterns) {
                const match = textResponse.match(pattern);
                if (match && match[1] && match[1].trim().length > 0) {
                    artworkTitle = match[1].trim();
                    console.log('Extracted artwork title:', artworkTitle);
                    break;
                }
            }
            
            // Try multiple approaches to extract the enhanced prompt
            // First, check if there's a markdown-formatted prompt
            const promptPatterns = [
                /\*Prompt:\*\s*([\s\S]*?)(?=\*\*|\*[\s\S]*?\*|$)/i,     // *Prompt: text*
                /\*\*Prompt:\*\*\s*([\s\S]*?)(?=\*\*|\n\n|$)/i,         // **Prompt:** text
                /\*_(.*?)_\*/,                                          // *_"full prompt text"_*
                /Prompt:\s*([\s\S]*?)(?=\n\n|\n\*\*|\n\*|\n\[|$)/i      // Prompt: text
            ];
            
            for (const pattern of promptPatterns) {
                const match = textResponse.match(pattern);
                if (match && match[1] && match[1].trim().length > 10) {
                    enhancedText = match[1].trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
                    console.log('Extracted enhanced prompt:', enhancedText);
                    break;
                }
            }
            
            // If we couldn't extract a prompt but the response is short and looks like a prompt, use it
            if (!enhancedText && textResponse.length < 1000 && !textResponse.startsWith('```')) {
                // Get the entire response but remove any markdown formatting
                enhancedText = textResponse
                    .replace(/###.*?\n/g, '') // Remove headers
                    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove markdown images
                    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
                    .replace(/\*(.*?)\*/g, '$1') // Remove italics
                    .replace(/\n\n+/g, ' ') // Replace multiple newlines with space
                    .trim();
                console.log('Using cleaned full response as prompt:', enhancedText);
            }
            
            // If we still don't have a good prompt but have a title, create a prompt from the title and original prompt
            if ((!enhancedText || enhancedText.length < 15) && artworkTitle) {
                enhancedText = `A ${artworkTitle} featuring ${prompt}`;
                console.log('Created prompt from title:', enhancedText);
            }
            
            // If we still don't have a good prompt, use the original prompt
            if (!enhancedText || enhancedText.length < 15) {
                console.log('Could not extract a valid prompt, using original prompt');
                return { 
                    enhancedText: prompt, 
                    modelUsed: modelToUse,
                    formattedResponse: null, // Don't show formatted response if we couldn't extract a prompt
                    artworkTitle: artworkTitle
                };
            }
            
            return { 
                enhancedText: enhancedText, 
                modelUsed: modelToUse,
                formattedResponse: formattedResponse,
                artworkTitle: artworkTitle
            };
        } catch (fetchError) {
            // Clear the timeout if there was an error
            clearTimeout(timeoutId);
            
            if (fetchError.name === 'AbortError') {
                console.error('Request timed out after 15 seconds');
            } else {
                console.error('Fetch error:', fetchError);
            }
            
            throw fetchError; // Rethrow to be caught by the outer try/catch
        }
    } catch (error) {
        console.error('Error enhancing prompt with API:', error);
        return { enhancedText: prompt, modelUsed: 'mistral' }; // Return the original prompt if there's an error
    }
}

// Generate image from the prompt
async function generateImage() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('✨ Please share your creative vision...');
        return;
    }
    
    try {
        // Get all the parameters
        const width = widthSlider.value;
        const height = heightSlider.value;
        const seed = randomSeedCheckbox.checked ? Math.floor(Math.random() * 1337) + 1 : seedInput.value;
        const model = modelSelect.value;
        const style = styleSelect.value;
        // Hardcoded values instead of using checkbox UI controls
        const nologo = true;
        const isPrivate = true;
        const shouldEnhancePrompt = enhancePromptCheckbox.checked;
        
        // Reset the artwork title when enhance prompt is disabled
        if (!shouldEnhancePrompt) {
            apiArtworkTitle = null;
            apiFormattedResponse = null;
        }
        
        // Show loading indicator immediately
        showLoading();
        
        // Variable to hold our final prompt
        let processedPrompt = prompt;
        let apiEnhanced = false;
        let modelUsed = 'mistral'; // Default model
        
        // Determine whether to use Pollinations enhancement parameter
        // Only use it when style is 'none', enhance checkbox is checked, and we're not using API enhancement
        let usePollinationsEnhance = shouldEnhancePrompt && (style === 'none' || !style);
        
        // If enhancement is checked, try the text API first - ALWAYS do this when enhance is checked, regardless of style
        if (shouldEnhancePrompt) {
            try {
                console.log('Starting API enhancement process...');
                // Use the API to enhance the prompt
                const result = await enhancePromptWithAPI(prompt, style, seed);
                
                // Check if result is an object (we're returning an object with enhanced text and model used)
                if (result && typeof result === 'object') {
                    const enhancedText = result.enhancedText;
                    modelUsed = result.modelUsed || 'mistral';
                    // Store the formatted response if available
                    apiFormattedResponse = result.formattedResponse;
                    // Store the artwork title if available
                    apiArtworkTitle = result.artworkTitle;
                    
                    // If we got a good enhanced text
                    if (enhancedText && enhancedText.length > 0) {
                        processedPrompt = enhancedText;
                        apiEnhancedPrompt = enhancedText; // Store the enhanced text
                        apiEnhanced = true; // Flag for processing
                        usePollinationsEnhance = false; // Don't use Pollinations enhancement since we have API enhancement
                        console.log('Successfully enhanced with text API:', enhancedText);
                    } else {
                        // We'll use Pollinations enhancement or style-based enhancement
                        console.log('No API enhancement - falling back to local enhancement');
                    }
                } else {
                    console.log('Invalid response from enhancePromptWithAPI, falling back to local enhancement');
                }
            } catch (error) {
                console.error('Error enhancing prompt with text API:', error);
                console.log('Falling back to local enhancement');
            }
        } else {
            // Generate a simple default title for non-enhanced images
            // Get the first few words of the prompt for the title (up to 5 words)
            if (!apiArtworkTitle) {
                const promptWords = prompt.split(' ');
                const titleWords = promptWords.slice(0, Math.min(5, promptWords.length));
                let defaultTitle = titleWords.join(' ');
                
                // Capitalize first letter of each word
                defaultTitle = defaultTitle.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                apiArtworkTitle = defaultTitle;
            }
        }
        
        // If we haven't already API enhanced, and we have a style selected, enhance with style
        if (!apiEnhanced && style && style !== 'none') {
            processedPrompt = enhancePrompt(prompt, style);
            console.log('Enhanced with style:', processedPrompt);
        }
        
        // Encode the processed prompt for the URL
        const encodedPrompt = encodeURIComponent(processedPrompt);
        
        // Construct the URL with parameters
        const baseUrl = 'https://image.pollinations.ai/prompt/';
        const params = {
            width,
            height,
            seed,
            nologo: nologo.toString(),
            private: isPrivate.toString(),
            model,
            safe: 'false',
            enhance: usePollinationsEnhance.toString()  // Only enhance when appropriate
        };
        
        const paramsString = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        
        const url = `${baseUrl}${encodedPrompt}?${paramsString}`;
        
        // Log the complete URL being sent (for debugging)
        console.log('Full Pollinations URL:', url);
        
        // Display the image with prompt info
        displayGeneratedImage(url, processedPrompt, seed, {
            originalPrompt: prompt,
            finalPrompt: processedPrompt,
            isEnhanced: usePollinationsEnhance,
            style: style,
            apiEnhanced: apiEnhanced,
            modelUsed: modelUsed,  // Pass the model information
            artworkTitle: apiArtworkTitle // Pass the artwork title
        });
    } catch (error) {
        console.error('Error in generateImage function:', error);
        resultContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="color: #e74c3c; font-size: 1.2rem; margin-bottom: 1rem;">
                    ✨ An error occurred while generating your image. Please try again.
                </div>
                <div style="color: #e74c3c; font-size: 0.9rem; margin-bottom: 1rem;">
                    Error details: ${error.message || 'Unknown error'}
                </div>
            </div>
        `;
    }
}

// Show loading indicator
function showLoading() {
    // Clear previous results
    resultContainer.innerHTML = '';
    resultContainer.classList.add('active');
    
    // Create loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator active';
    loadingDiv.innerHTML = `
        <div class="loading-text">🎨 Materializing your dreams into reality...</div>
        <div class="spinner"></div>
    `;
    
    resultContainer.appendChild(loadingDiv);
}

// Display the generated image
function displayGeneratedImage(imageUrl, prompt, seed, promptInfo) {
    // Store the current image URL for download
    currentImageUrl = imageUrl;
    
    // Create a new image element
    const img = new Image();
    
    // Add a timeout for image loading
    const imageLoadTimeout = setTimeout(() => {
        console.error('Image loading timed out after 30 seconds');
        resultContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="color: #e74c3c; font-size: 1.2rem; margin-bottom: 1rem;">
                    ✨ The image generation is taking longer than expected. Pollinations might be busy.
                </div>
                <div style="color: #777; font-size: 0.9rem; margin-bottom: 1rem;">
                    You can try again or use a simpler prompt.
                </div>
                <button id="retry-button" style="background-color: var(--primary-color); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
        
        // Add event listener to the retry button
        const retryButton = document.getElementById('retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', generateImage);
        }
    }, 30000);
    
    // Once the image is loaded, remove the loading indicator and show the image
    img.onload = function() {
        // Clear the timeout
        clearTimeout(imageLoadTimeout);
        
        // Clear the result container
        resultContainer.innerHTML = '';
        
        // Create image wrapper
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';
        
        // Add glow effect
        const glowEffect = document.createElement('div');
        glowEffect.className = 'glow-effect';
        imageWrapper.appendChild(glowEffect);
        
        // Add the image with click event for lightbox
        img.className = 'generated-image';
        img.alt = prompt;
        img.style.cursor = 'pointer'; // Add pointer cursor to indicate clickable
        img.addEventListener('click', () => openLightbox(imageUrl, promptInfo.artworkTitle || prompt));
        imageWrapper.appendChild(img);
        
        // Add the image to the result container
        resultContainer.appendChild(imageWrapper);
        
        // If we have an artwork title, display it
        if (promptInfo.artworkTitle) {
            const titleElement = document.createElement('h2');
            titleElement.style.fontSize = '1.5rem';
            titleElement.style.fontWeight = 'bold';
            titleElement.style.margin = '1.2rem 0 0.5rem';
            titleElement.style.color = 'var(--primary-color)';
            titleElement.style.textAlign = 'center';
            titleElement.innerHTML = `"${promptInfo.artworkTitle}"`;
            resultContainer.appendChild(titleElement);
        }
        
        // Create button container for download and view buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '1rem';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.position = 'relative';
        
        // Add download button
        const downloadButton = document.createElement('button');
        downloadButton.className = 'action-button download-button';
        // Create a consistent structure for both buttons with spans
        const downloadSpan = document.createElement('span');
        downloadSpan.style.display = 'inline-block';
        downloadSpan.style.position = 'relative';
        downloadSpan.style.top = '0';
        downloadSpan.style.height = '16px';
        downloadSpan.style.lineHeight = '16px';
        downloadSpan.style.fontSize = '16px';
        downloadSpan.style.marginRight = '4px';
        downloadSpan.textContent = '💾';
        downloadButton.appendChild(downloadSpan);
        downloadButton.appendChild(document.createTextNode(' Download'));
        
        const downloadFilename = promptInfo.artworkTitle 
            ? `${promptInfo.artworkTitle.replace(/[^\w\s-]/g, '')}_${seed}.png`
            : `${prompt.substring(0, 30)}_${seed}.png`;
        
        downloadButton.addEventListener('click', () => {
            downloadImage(imageUrl, downloadFilename);
        });
        
        buttonContainer.appendChild(downloadButton);
        
        // Add view in lightbox button
        const viewButton = document.createElement('button');
        viewButton.className = 'action-button view-button';
        // Create a consistent structure for both buttons with spans
        const viewSpan = document.createElement('span');
        viewSpan.style.display = 'inline-block';
        viewSpan.style.position = 'relative';
        viewSpan.style.top = '0';
        viewSpan.style.height = '16px';
        viewSpan.style.lineHeight = '16px';
        viewSpan.style.fontSize = '16px';
        viewSpan.style.marginRight = '4px';
        viewSpan.textContent = '🔍';
        viewButton.appendChild(viewSpan);
        viewButton.appendChild(document.createTextNode(' View Larger'));
        
        viewButton.addEventListener('click', () => openLightbox(imageUrl, promptInfo.artworkTitle || prompt));
        buttonContainer.appendChild(viewButton);
        
        resultContainer.appendChild(buttonContainer);
        
        // Show prompt info
        const selectedStyle = promptInfo.style;
        const isEnhanceChecked = promptInfo.isEnhanced;
        const originalPrompt = promptInfo.originalPrompt;
        const finalPrompt = promptInfo.finalPrompt;
        const isApiEnhanced = promptInfo.apiEnhanced;
        const modelUsed = promptInfo.modelUsed || 'mistral';
        const artworkTitle = promptInfo.artworkTitle;
        
        // Model name mapping for friendly display
        const modelDisplayNames = {
            'openai-large': 'GPT-4o',
            'openai': 'GPT-4o mini',
            'pixtral': 'Pixtral',
            'llama': 'Llama 3.3',
            'mistral': 'Mistral',

        };
        
        // Get the friendly display name for the model
        const modelDisplayName = modelDisplayNames[modelUsed] || modelUsed;
        
        // Create a stylish container for prompt info
        const promptInfoWrapper = document.createElement('div');
        promptInfoWrapper.className = 'prompt-info-wrapper';
        promptInfoWrapper.style.marginTop = '1rem';
        promptInfoWrapper.style.padding = '0.8rem';
        promptInfoWrapper.style.backgroundColor = 'rgba(157, 78, 221, 0.08)';
        promptInfoWrapper.style.borderRadius = '8px';
        promptInfoWrapper.style.border = '1px solid rgba(157, 78, 221, 0.2)';
        
        // Original prompt
        const originalPromptInfo = document.createElement('p');
        originalPromptInfo.style.fontSize = '0.8rem';
        originalPromptInfo.style.margin = '0 0 0.5rem 0';
        originalPromptInfo.style.color = 'var(--text-light)';
        originalPromptInfo.innerHTML = `<strong>🎯 Original:</strong> ${originalPrompt}`;
        promptInfoWrapper.appendChild(originalPromptInfo);
        
        // If API enhancement was used, show the enhanced prompt
        if (isApiEnhanced && apiEnhancedPrompt) {
            // If we have a formatted response, display that instead
            if (apiFormattedResponse) {
                // Create a container for the formatted response
                const formattedResponseContainer = document.createElement('div');
                formattedResponseContainer.style.fontSize = '0.9rem';
                formattedResponseContainer.style.margin = '0.5rem 0';
                formattedResponseContainer.style.padding = '1rem';
                formattedResponseContainer.style.backgroundColor = 'rgba(157, 78, 221, 0.08)';
                formattedResponseContainer.style.borderRadius = '12px';
                formattedResponseContainer.style.border = '1px solid rgba(157, 78, 221, 0.2)';
                formattedResponseContainer.style.color = 'var(--primary-color)';
                formattedResponseContainer.style.whiteSpace = 'pre-wrap';
                formattedResponseContainer.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
                formattedResponseContainer.style.lineHeight = '1.6';
                formattedResponseContainer.style.boxShadow = '0 4px 6px rgba(157, 78, 221, 0.05)';
                
                // Remove the title line if present (we're already displaying it above)
                let cleanedResponse = apiFormattedResponse;
                if (artworkTitle) {
                    // Remove any lines with the title text to avoid duplication
                    cleanedResponse = cleanedResponse.replace(new RegExp(`!\\[${artworkTitle}\\]\\(#\\)\\s*\\n+`, 'g'), '');
                    cleanedResponse = cleanedResponse.replace(new RegExp(`###\\s+(?:Title:)?\\s*["']?${artworkTitle}["']?(?:\\s|$)`, 'gi'), '');
                    cleanedResponse = cleanedResponse.replace(new RegExp(`\\*Title:\\s*${artworkTitle}\\*`, 'g'), '');
                    cleanedResponse = cleanedResponse.replace(new RegExp(`Title:\\s*["']?${artworkTitle}["']?(?:\\s|$)`, 'g'), '');
                }

                // Remove the duplicate markdown section at the bottom
                cleanedResponse = cleanedResponse.replace(/Below is the markdown version of the image generation parameters:[\s\S]*?```markdown[\s\S]*?```/g, '');

                // Remove any /imagine commands
                cleanedResponse = cleanedResponse.replace(/\/imagine\s+.*/g, '');

                // Remove markdown code block fences (any language, not just markdown)
                cleanedResponse = cleanedResponse.replace(/```(?:markdown|json|[a-z]*)\s*\n/g, ''); // Opening fence with optional language
                cleanedResponse = cleanedResponse.replace(/\n\s*```/g, ''); // Closing fence
                cleanedResponse = cleanedResponse.replace(/```/g, ''); // Any remaining fence markers

                // Convert markdown to HTML
                let formattedHTML = cleanedResponse
                    // Headers
                    .replace(/### (.*?)(?:\n|$)/g, '<h3 style="margin: 0.8rem 0 0.4rem; color: #8e44ad; font-size: 1.1rem;">$1</h3>')
                    .replace(/## (.*?)(?:\n|$)/g, '<h2 style="margin: 1rem 0 0.5rem; color: #8e44ad; font-size: 1.2rem;">$1</h2>')
                    .replace(/# (.*?)(?:\n|$)/g, '<h1 style="margin: 0.6rem 0 1rem; color: #8e44ad; font-size: 1.3rem;">$1</h1>')
                    // Bold text with **
                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                    // Italic text with *
                    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                    // Bullet points
                    .replace(/- (.*?)(?:\n|$)/g, '<li style="margin-left: 1.2rem; margin-bottom: 0.4rem;">$1</li>')
                    // Line breaks (but preserve paragraph structure)
                    .replace(/\n\n/g, '</p><p style="margin: 0.8rem 0;">') // Double line breaks as paragraph breaks
                    .replace(/\n/g, '<br/>'); // Single line breaks
                    
                // Wrap in paragraph tags to maintain consistent styling
                formattedHTML = `<p style="margin: 0;">${formattedHTML}</p>`;
                // Fix any double-wrapped paragraphs
                formattedHTML = formattedHTML.replace(/<p style="margin: 0;"><\/p><p style="margin: 0.8rem 0;">/g, '<p style="margin: 0.8rem 0;">');
                
                // No need for a header since the title is displayed prominently above
                formattedResponseContainer.innerHTML = formattedHTML;
                promptInfoWrapper.appendChild(formattedResponseContainer);
            } else {
                // Display API enhanced prompt
                const enhancedPromptInfo = document.createElement('p');
                enhancedPromptInfo.style.fontSize = '0.9rem';
                enhancedPromptInfo.style.margin = '0.5rem 0';
                enhancedPromptInfo.style.padding = '0.8rem';
                enhancedPromptInfo.style.backgroundColor = 'rgba(157, 78, 221, 0.1)';
                enhancedPromptInfo.style.borderRadius = '8px';
                enhancedPromptInfo.style.border = '1px dashed rgba(157, 78, 221, 0.3)';
                enhancedPromptInfo.style.color = 'var(--primary-color)';
                enhancedPromptInfo.style.lineHeight = '1.5';
                enhancedPromptInfo.innerHTML = `<strong>✨ Enhanced:</strong> ${apiEnhancedPrompt}`;
                promptInfoWrapper.appendChild(enhancedPromptInfo);
            }
            
            // Add a note about the enhancement
            const enhanceMethod = document.createElement('p');
            enhanceMethod.style.fontSize = '0.7rem';
            enhanceMethod.style.fontStyle = 'italic';
            enhanceMethod.style.margin = '0.5rem 0 0 0';
            enhanceMethod.style.color = 'var(--text-light)';
            
            if (selectedStyle && selectedStyle !== 'none') {
                const styleName = STYLE_PROMPTS[selectedStyle] ? STYLE_PROMPTS[selectedStyle].name : selectedStyle;
                enhanceMethod.textContent = `Enhanced using ${modelDisplayName} with ${styleName} style instructions`;
            } else {
                enhanceMethod.textContent = `Enhanced using ${modelDisplayName}`;
            }
            
            promptInfoWrapper.appendChild(enhanceMethod);
            
        } else if (selectedStyle && selectedStyle !== 'none') {
            // If style was applied (but no API enhancement), show the styled prompt
            const styleName = STYLE_PROMPTS[selectedStyle] ? STYLE_PROMPTS[selectedStyle].name : selectedStyle;
            
            // Display style applied note
            const styleInfo = document.createElement('p');
            styleInfo.style.fontSize = '0.8rem';
            styleInfo.style.marginTop = '0.5rem';
            styleInfo.style.fontStyle = 'italic';
            styleInfo.style.color = 'var(--text-light)';
            styleInfo.textContent = `Applied "${styleName}" style to your prompt`;
            promptInfoWrapper.appendChild(styleInfo);
            
            // Final prompt with style name only (no technical details)
            const finalPromptInfo = document.createElement('p');
            finalPromptInfo.style.fontSize = '0.8rem';
            finalPromptInfo.style.margin = '0.5rem 0 0 0';
            finalPromptInfo.style.color = 'var(--primary-color)';
            finalPromptInfo.innerHTML = `<strong>✨ Final prompt:</strong> a ${originalPrompt} (rendered in ${styleName} style)`;
            promptInfoWrapper.appendChild(finalPromptInfo);
            
        } else if (isEnhanceChecked) {
            // No style selected but enhancement is enabled (using Pollinations enhance parameter)
            const finalPromptInfo = document.createElement('p');
            finalPromptInfo.style.fontSize = '0.8rem';
            finalPromptInfo.style.margin = '0.5rem 0 0 0';
            finalPromptInfo.style.color = 'var(--primary-color)';
            finalPromptInfo.innerHTML = `<strong>✨ Final prompt:</strong> ${originalPrompt}*`;
            promptInfoWrapper.appendChild(finalPromptInfo);
            
            // Display the enhance note for Pollinations enhancement
            const enhanceNote = document.createElement('p');
            enhanceNote.style.fontSize = '0.8rem';
            enhanceNote.style.fontStyle = 'italic';
            enhanceNote.style.margin = '0.5rem 0 0 0';
            enhanceNote.style.color = 'var(--text-light)';
            enhanceNote.textContent = '*Used Pollinations AI to completely rewrite and enhance your prompt';
            promptInfoWrapper.appendChild(enhanceNote);
        }
        
        resultContainer.appendChild(promptInfoWrapper);
    };
    
    // Handle image loading error
    img.onerror = function() {
        // Clear the timeout
        clearTimeout(imageLoadTimeout);
        
        console.error('Error loading image from URL:', imageUrl);
        resultContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="color: #e74c3c; font-size: 1.2rem; margin-bottom: 1rem;">
                    ✨ Oops! The magic fizzled. Try again or adjust your prompt.
                </div>
                <div style="color: #777; font-size: 0.9rem; margin-bottom: 1rem;">
                    This might be due to Pollinations being temporarily unavailable or the prompt being too complex.
                </div>
                <button id="retry-button" style="background-color: var(--primary-color); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
        
        // Add event listener to the retry button
        const retryButton = document.getElementById('retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', generateImage);
        }
    };
    
    // Set the image source to start loading
    console.log('Starting to load image from:', imageUrl);
    img.src = imageUrl;
}

// Function to download an image
function downloadImage(imageUrl, filename) {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.style.display = 'none';
    
    // For cross-origin images, we may need to fetch and create a blob
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            link.href = blobUrl;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }, 100);
        })
        .catch(error => {
            console.error("Error downloading image:", error);
            // Fallback to direct download attempt
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}

// Function to open the lightbox
function openLightbox(imageUrl, title) {
    // Create lightbox content with inline styles for the span to ensure consistency
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imageUrl}" alt="${title}" class="lightbox-image">
            <div class="lightbox-title">${title}</div>
            <button class="lightbox-download-btn">
                <span style="display: inline-block; position: relative; top: 0; height: 16px; line-height: 16px; font-size: 16px; margin-right: 4px;">💾</span> 
                Download Image
            </button>
        </div>
    `;
    
    // Show the lightbox
    lightbox.style.display = 'flex';
    
    // Add event listener to close the lightbox
    const closeButton = document.querySelector('.lightbox-close');
    closeButton.addEventListener('click', closeLightbox);
    
    // Add event listener to download button
    const downloadBtn = document.querySelector('.lightbox-download-btn');
    downloadBtn.addEventListener('click', () => {
        downloadImage(imageUrl, `${title.replace(/[^\w\s-]/g, '')}.png`);
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Add ESC key to close lightbox
    document.addEventListener('keydown', handleLightboxKeydown);
}

// Function to close the lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
    // Remove ESC key event listener
    document.removeEventListener('keydown', handleLightboxKeydown);
}

// Handle keydown events for the lightbox
function handleLightboxKeydown(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
}

// Modified createStarsV4 function to handle page-specific issues
function createStarsV4() {
    console.log("createStarsV4 called");
    
    // Prevent multiple initializations
    if (window.starsInitialized) {
        console.log("Stars already initialized, skipping");
        return;
    }
    
    // Get current page name for debugging
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log(`Creating stars for page: ${currentPage}`);
    
    // Handle enhance.html and artistic.html differently
    const isEnhancePage = currentPage === 'enhance.html';
    const isArtisticPage = currentPage === 'artistic.html';
    
    // Apply critical CSS fixes for enhance.html and artistic.html
    if (isEnhancePage || isArtisticPage) {
        console.log(`Applying special fixes for ${currentPage}`);
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .stars, .twinkling, .clouds {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
                display: block !important;
                pointer-events: none !important;
            }
            .stars { 
                z-index: 0 !important;
                background: transparent url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat !important;
                background-size: 1000px 1000px !important;
                opacity: 0.6 !important;
            }
            .twinkling { 
                z-index: 1 !important;
                position: fixed !important;
            }
            /* Removed cloud animation
            .clouds { 
                z-index: 2 !important; 
                opacity: 0.3 !important;
                background: transparent url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png) repeat !important;
                background-size: 2000px 2000px !important;
                animation: move-background 150s linear infinite !important;
            }
            */
            .moon-container {
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                z-index: 3 !important;
                pointer-events: none !important;
            }
            /* Removed move-background animation
            @keyframes move-background {
            */
            /* Ensures content is above backgrounds */
            .app-container {
                position: relative !important;
                z-index: 5 !important;
            }
        `;
        document.head.appendChild(styleEl);
    }
    
    // Set the twinkling container up correctly in all cases
    const twinklingContainer = document.querySelector('.twinkling');
    if (!twinklingContainer) {
        console.error(`CRITICAL: No .twinkling container found on ${currentPage}`);
        return;
    }
    
    // Clear any existing stars to avoid duplicates
    const existingStars = twinklingContainer.querySelectorAll('.star, .shooting-star');
    if (existingStars.length > 0) {
        console.log(`Removing ${existingStars.length} existing stars`);
        existingStars.forEach(star => star.remove());
    }
    
    // Set the number of stars based on the page
    let starCount = 250; // Default for most pages
    
    // For index page, use fewer stars
    if (currentPage === 'index.html' || currentPage === '') {
        starCount = 100; 
        console.log(`Using reduced star count (${starCount}) for index page`);
    }
    
    // Create the twinkling stars
    console.log(`Creating ${starCount} stars for ${currentPage}`);
    for (let i = 0; i < starCount; i++) {
        createTwinklingStar(twinklingContainer);
    }
    
    // Create shooting stars
    createShootingStars();
    
    // Mark as successfully initialized
    window.starsInitialized = true;
    console.log(`Stars successfully initialized for ${currentPage}`);
}

// Create a single twinkling star with random properties
function createTwinklingStar(container) {
    const star = document.createElement('div');
    
    // Randomly choose star size class with weighted distribution
    const rand = Math.random();
    let randomType;
    
    if (rand < 0.3) {
        // 30% chance for smallest stars
        randomType = 'star-1';
    } else if (rand < 0.65) {
        // 35% chance for medium stars
        randomType = 'star-2';
    } else if (rand < 0.9) {
        // 25% chance for larger stars
        randomType = 'star-3';
    } else {
        // 10% chance for the largest stars
        randomType = 'star-4';
    }
    
    star.classList.add('star', randomType);
    
    // Random position
    const x = Math.random() * 100; // percentage of viewport width
    const y = Math.random() * 100; // percentage of viewport height
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    
    // Random delay for animation
    const delay = Math.random() * 9; // 0-9 seconds
    star.style.animationDelay = `${delay}s`;
    
    // Slightly random animation duration
    const durationVariation = Math.random() * 2 - 1; // -1 to +1 seconds
    
    // Apply duration variation to all stars to create more random twinkling
    let baseDuration;
    switch(randomType) {
        case 'star-1': baseDuration = 3; break;
        case 'star-2': baseDuration = 5; break;
        case 'star-3': baseDuration = 7; break;
        case 'star-4': baseDuration = 9; break;
        default: baseDuration = 5;
    }
    
    // Apply variation with limits
    const newDuration = Math.max(2, Math.min(12, baseDuration + durationVariation));
    star.style.animationDuration = `${newDuration}s`;
    
    container.appendChild(star);
    return star;
}

// Create a single shooting star with random properties
function createShootingStar(container) {
    const star = document.createElement('div');
    star.classList.add('shooting-star');
    
    // Random position at top portion of the screen
    const x = Math.random() * 70 + 10; // 10-80% of viewport width
    const y = Math.random() * 30 + 5; // 5-35% of viewport height
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    
    // Random delay before the animation starts
    const delay = Math.random() * 3; // 0-3 seconds
    star.style.animationDelay = `${delay}s`;
    
    // Random size for the shooting star
    const size = Math.random() * 1 + 0.5; // 0.5-1.5px
    star.style.height = `${size}px`;
    
    // Add to container
    container.appendChild(star);
    
    // Remove after animation finishes to prevent DOM cluttering
    setTimeout(() => {
        if (star && star.parentNode) {
            star.remove();
        }
    }, 10000); // 10s is plenty for the animation
    
    return star;
}

function createShootingStars() {
    const twinklingContainer = document.querySelector('.twinkling');
    if (!twinklingContainer) {
        console.error("Cannot create shooting stars: No twinkling container found");
        return;
    }
    
    // Create initial shooting star
    createShootingStar(twinklingContainer);
    
    // Schedule periodic shooting stars
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            createShootingStar(twinklingContainer);
        }
    }, 8000); // Create a new shooting star every 8 seconds
    
    console.log("Shooting stars creation scheduled");
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired");
    initApp();
    
    // Delay star creation for 300ms to ensure everything is loaded
    setTimeout(() => {
        console.log("Attempting star creation from DOMContentLoaded event");
        createStarsV4();
    }, 300);
});

// Alternative initialization method - ensures stars get created even if DOM event already fired
window.addEventListener('load', () => {
    console.log("Window load event fired");
    if (!window.starsInitialized) {
        console.log("Window load event - creating stars if not already done");
        setTimeout(() => {
            createStarsV4();
        }, 500);
    }
});

// Final fallback - check after everything has loaded
setTimeout(() => {
    if (!window.starsInitialized) {
        console.log("FALLBACK: Creating stars 2 seconds after page load");
        createStarsV4();
    }
}, 2000); 