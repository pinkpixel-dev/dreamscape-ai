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
const noLogoCheckbox = document.getElementById('nologo');
const privateCheckbox = document.getElementById('private');
const enhancePromptCheckbox = document.getElementById('enhance-prompt');
const enhanceDescription = document.getElementById('enhance-description');
const promptInput = document.getElementById('prompt-input');
const createButton = document.getElementById('create-button');
const resultContainer = document.getElementById('result-container');

// Added new variable to store the enhanced text from the API
let apiEnhancedPrompt = '';
// Added new variable to store the formatted response
let apiFormattedResponse = null;
// Added new variable to store the artwork title
let apiArtworkTitle = null;

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
        const nologo = noLogoCheckbox.checked;
        const isPrivate = privateCheckbox.checked;
        const shouldEnhancePrompt = enhancePromptCheckbox.checked;
        
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
                    
                    if (enhancedText && enhancedText !== prompt) {
                        // Store the enhanced prompt for display
                        apiEnhancedPrompt = enhancedText;
                        // Use the enhanced prompt for image generation
                        processedPrompt = enhancedText;
                        apiEnhanced = true;
                        // If we successfully enhanced with the API, don't use Pollinations enhance parameter
                        usePollinationsEnhance = false;
                        console.log('Successfully enhanced prompt with API using model:', modelUsed);
                    } else {
                        // If API enhancement returned the same prompt, fall back to our manual enhancement
                        console.log('API enhancement returned unchanged prompt, falling back to manual enhancement');
                        if (style && style !== 'none') {
                            processedPrompt = enhancePrompt(prompt, style);
                        }
                        // Keep usePollinationsEnhance as is (true only for 'none' style)
                    }
                } else if (result && result !== prompt) {
                    // For backward compatibility with string return value
                    apiEnhancedPrompt = result;
                    processedPrompt = result;
                    apiEnhanced = true;
                    usePollinationsEnhance = false;
                    console.log('Successfully enhanced prompt with API using default model');
                } else {
                    // If API enhancement returned the same prompt, fall back to our manual enhancement
                    console.log('API enhancement returned unchanged prompt, falling back to manual enhancement');
                    if (style && style !== 'none') {
                        processedPrompt = enhancePrompt(prompt, style);
                    }
                    // Keep usePollinationsEnhance as is (true only for 'none' style)
                }
            } catch (error) {
                console.error('Failed to enhance with API, falling back to manual enhancement:', error);
                // Fall back to manual enhancement
                if (style && style !== 'none') {
                    processedPrompt = enhancePrompt(prompt, style);
                }
                // Keep usePollinationsEnhance as is (true only for 'none' style)
            }
        } else if (style && style !== 'none') {
            // If enhance is not checked but a style is selected, apply style normally
            processedPrompt = enhancePrompt(prompt, style);
        }
        
        // Log the actual prompt being sent (for debugging)
        console.log('Sending to Pollinations:', processedPrompt);
        console.log('Using Pollinations enhancement:', usePollinationsEnhance);
        console.log('API enhanced prompt used:', apiEnhanced);
        console.log('Model used for enhancement:', modelUsed);
        
        // Create the URL for the Pollinations API
        const encodedPrompt = encodeURIComponent(processedPrompt);
        const baseUrl = 'https://image.pollinations.ai/prompt/';
        const params = {
            width,
            height,
            seed,
            nologo: nologo.toString(),
            private: isPrivate.toString(),
            model,
            safe: 'true',  // Always enabled for kids version
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
    }, 30000); // 30 second timeout
    
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
        
        // Add the image
        img.className = 'generated-image';
        img.alt = prompt;
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
        
        // Add download button
        const downloadButton = document.createElement('a');
        downloadButton.className = 'download-button';
        downloadButton.innerHTML = '🌟 Download Creation';
        downloadButton.href = imageUrl;
        // Include the title in the download filename if available
        if (promptInfo.artworkTitle) {
            downloadButton.download = `${promptInfo.artworkTitle.replace(/[^\w\s-]/g, '')}_${seed}.png`;
        } else {
            downloadButton.download = `${prompt.substring(0, 30)}_${seed}.png`;
        }
        downloadButton.target = '_blank';
        resultContainer.appendChild(downloadButton);
        
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

// FINAL ATTEMPT - IMAGE-BASED STARS
function createStarsV4() {
    // All stars code removed
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp); 