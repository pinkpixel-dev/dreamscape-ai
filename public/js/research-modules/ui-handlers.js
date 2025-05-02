// ui-handlers.js
// UI event handlers for the research tool

import { performResearch, createAIMessage, showTypingAnimation, processAIResponse } from './research-core.js';
import { determineIfClarificationNeeded, generateInitialResponse } from './query-variation.js';
import { displayDocument, downloadDocument, copyToClipboard } from './document-generation.js';

let clarificationCount = 0;
let currentQuery = '';
let researchInProgress = false;
let researchComplete = false;
let generatedDocument = '';

/**
 * Initialize the research UI
 */
function initResearchUI() {
    // Reset conversation state
    waitingForFollowUp = false;
    initialResearchQuery = '';

    // Set up event listeners
    const researchForm = document.getElementById('research-form');
    const queryInput = document.getElementById('research-query');
    const messagesContainer = document.getElementById('messages-container');
    const tierSelect = document.getElementById('research-tier');
    const downloadButton = document.getElementById('download-document-button');
    const copyButton = document.getElementById('copy-document-button');
    const startResearchButton = document.getElementById('start-research-button');
    const researchTopicInput = document.getElementById('research-topic');

    // Remove any existing event listeners
    if (researchForm) {
        // Remove all existing event listeners
        const oldForm = researchForm;
        const newForm = oldForm.cloneNode(true);
        oldForm.parentNode.replaceChild(newForm, oldForm);

        // Add the submit handler to the new form
        newForm.addEventListener('submit', handleResearchSubmit);
    }

    if (startResearchButton && researchTopicInput && queryInput) {
        startResearchButton.addEventListener('click', () => {
            const topic = researchTopicInput.value.trim();
            if (topic) {
                queryInput.value = topic;
                // Trigger the form submit event
                const submitEvent = new Event('submit', { cancelable: true });
                // Get the current form (it might have been replaced)
                const currentForm = document.getElementById('research-form');
                if (currentForm) {
                    currentForm.dispatchEvent(submitEvent);
                }
                // Clear the topic input
                researchTopicInput.value = '';
            }
        });
    }

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            if (generatedDocument) {
                downloadDocument(generatedDocument, currentQuery, 'markdown');
            }
        });
    }

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            if (generatedDocument) {
                copyToClipboard(generatedDocument);
            }
        });
    }

    // Initialize other UI elements
    updateUIState();
}

/**
 * Update UI state based on current research status
 */
function updateUIState() {
    const downloadButton = document.getElementById('download-document-button');
    const copyButton = document.getElementById('copy-document-button');
    const researchControls = document.getElementById('research-controls');
    const researchStatus = document.getElementById('research-status');

    if (downloadButton) {
        downloadButton.disabled = !researchComplete;
    }

    if (copyButton) {
        copyButton.disabled = !researchComplete;
    }

    if (researchControls) {
        researchControls.style.display = researchComplete ? 'block' : 'none';
    }

    if (researchStatus) {
        researchStatus.style.display = researchInProgress ? 'block' : 'none';
    }
}

/**
 * Handle research form submission
 * @param {Event} event - Form submit event
 */
async function handleResearchSubmit(event) {
    event.preventDefault();

    const queryInput = document.getElementById('research-query');
    const messagesContainer = document.getElementById('messages-container');

    if (!queryInput || !messagesContainer) return;

    const query = queryInput.value.trim();
    if (!query) return;

    // Create user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<div class="message-content">${query}</div>`;
    messagesContainer.appendChild(userMessage);

    // Create AI message placeholder with typing animation
    const aiMessage = createAIMessage('', messagesContainer);
    showTypingAnimation(aiMessage.querySelector('.message-content'));

    // Clear input field
    queryInput.value = '';

    // Check if this is a follow-up to an initial query
    if (waitingForFollowUp && initialResearchQuery) {
        console.log('Processing follow-up query:', query);

        // Reset the waiting flag
        waitingForFollowUp = false;

        try {
            // Generate an optimized research query based on the initial query and follow-up
            const response = await fetch('/api/pollinations-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'openai',
                    prompt: `Initial research request: "${initialResearchQuery}"\nUser follow-up: "${query}"\n\nBased on this conversation, create an optimized research query that will yield the best results. Return only the optimized query without any explanation or additional text.`,
                    system: "You are a research query optimization expert. Your task is to take a user's initial research request and their follow-up clarification to create the most effective search query possible. Focus on precision and relevance.",
                    max_tokens: 100
                })
            });

            const result = await response.json();
            let optimizedQuery = result.text || initialResearchQuery;

            // Clean up the optimized query (remove quotes, etc.)
            optimizedQuery = optimizedQuery.replace(/^["']|["']$/g, '').trim();

            console.log('Generated optimized query:', optimizedQuery);

            // Acknowledge the follow-up and start research
            processAIResponse(`Thanks for the additional context. I'll research "${optimizedQuery}" for you now...`, aiMessage.querySelector('.message-content'));

            // Start the actual research with the optimized query
            currentQuery = optimizedQuery;
            setTimeout(async () => {
                await startResearch(optimizedQuery, aiMessage);
            }, 1500);

        } catch (error) {
            console.error('Error processing follow-up:', error);
            processAIResponse(`I'll start researching "${initialResearchQuery}" for you now.`, aiMessage.querySelector('.message-content'));

            // If there's an error, just use the initial query
            currentQuery = initialResearchQuery;
            setTimeout(async () => {
                await startResearch(initialResearchQuery, aiMessage);
            }, 1500);
        }
    } else {
        // This is a new initial query
        console.log('Processing new initial query:', query);

        // Reset state for new query
        clarificationCount = 0;
        researchComplete = false;
        generatedDocument = '';
        currentQuery = query;

        // Start with an AI chat interaction
        await startAIChatInteraction(query, aiMessage);
    }

    // Update UI state
    updateUIState();
}

/**
 * Start an AI chat interaction before research
 * @param {string} query - User query
 * @param {HTMLElement} messagePlaceholder - DOM element for message
 */
async function startAIChatInteraction(query, messagePlaceholder) {
    try {
        console.log('Starting AI chat interaction for query:', query);

        // Generate an initial AI response using the language model
        const response = await fetch('/api/pollinations-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai',
                prompt: `The user wants to research "${query}". Respond conversationally, acknowledging their request and asking if there's anything specific they want to know about this topic. Make your response engaging and helpful.`,
                system: "You are a helpful research assistant with a conversational, friendly tone. Your goal is to engage with the user about their research topic before starting the actual research process. Ask thoughtful questions to understand what they're looking for, but keep your response concise (2-3 sentences max).",
                max_tokens: 150
            })
        });

        const result = await response.json();

        // Display the AI response
        processAIResponse(result.text || `I'd be happy to research "${query}" for you. Is there anything specific about this topic you're most interested in learning?`, messagePlaceholder.querySelector('.message-content'));

        // Set up for the follow-up message
        setupResearchContinuation(query);

    } catch (error) {
        console.error('Error in AI chat interaction:', error);
        processAIResponse(`I'll research "${query}" for you right away.`, messagePlaceholder.querySelector('.message-content'));

        // If the chat interaction fails, proceed directly to research
        await startResearch(query, messagePlaceholder);
    }
}

/**
 * Set up a listener for the next user message to continue the research process
 * @param {string} initialQuery - The initial user query
 */
// Store the initial query for the conversation
let initialResearchQuery = '';
// Flag to track if we're waiting for a follow-up
let waitingForFollowUp = false;

/**
 * Set up the continuation of the research process after the initial query
 * @param {string} initialQuery - The initial user query
 */
function setupResearchContinuation(initialQuery) {
    console.log('Setting up research continuation for query:', initialQuery);

    // Store the initial query globally
    initialResearchQuery = initialQuery;

    // Set the waiting flag
    waitingForFollowUp = true;
}

/**
 * Ask a clarifying question
 * @param {string} query - User query
 * @param {HTMLElement} messagePlaceholder - DOM element for message
 */
async function askClarifyingQuestion(query, messagePlaceholder) {
    try {
        // Generate a clarifying question using the language model
        const response = await fetch('/api/pollinations-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai',
                prompt: `The user wants to research "${query}". Ask a single, specific clarifying question to help narrow down what they're looking for.`,
                system: "You are a helpful research assistant. Ask a concise clarifying question to better understand what the user is looking for. Do not explain your reasoning, just ask the direct question.",
                max_tokens: 100
            })
        });

        const result = await response.json();

        // Display the clarifying question
        processAIResponse(result.text || "Could you provide more specific details about what you're looking for?", messagePlaceholder.querySelector('.message-content'));

        // Increment clarification count
        clarificationCount++;

    } catch (error) {
        console.error('Error asking clarifying question:', error);
        processAIResponse("I'll research that for you now.", messagePlaceholder.querySelector('.message-content'));

        // If we can't ask for clarification, proceed with research
        await startResearch(query, messagePlaceholder);
    }
}

/**
 * Start the research process
 * @param {string} query - Research query
 * @param {HTMLElement} messagePlaceholder - DOM element for message
 */
async function startResearch(query, messagePlaceholder) {
    const statusElement = document.getElementById('research-status');
    const tierSelect = document.getElementById('research-tier');
    const toggleDocumentBtn = document.getElementById('toggle-document-btn');

    // Hide the toggle button until research is complete
    if (toggleDocumentBtn) {
        toggleDocumentBtn.style.display = 'none';
    }

    // Display initial response
    const initialResponse = generateInitialResponse(query);
    processAIResponse(initialResponse, messagePlaceholder.querySelector('.message-content'));

    // Set research in progress flag
    researchInProgress = true;
    updateUIState();

    try {
        // Get research tier
        const tier = tierSelect ? tierSelect.value : 'quick';

        // Perform research
        generatedDocument = await performResearch(query, tier, false, statusElement);

        // Display completion message with more conversational tone
        const completionMessages = [
            `Research complete! I've compiled a comprehensive document on "${query}" for you. You can view it below or download it for later reference.`,
            `I've finished researching "${query}" and created a detailed document for you. Feel free to review it below or download a copy.`,
            `Your research on "${query}" is ready! I've organized the information into a document that you can read below or download.`,
            `All done! I've gathered the most relevant information about "${query}" into a document. You can view it now or download it for later.`,
            `Research complete! I've created a detailed document about "${query}" based on multiple sources. You can view or download it below.`
        ];

        // Select a random completion message
        const randomMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)];
        const completionMessage = createAIMessage(randomMessage, document.getElementById('messages-container'));

        // Display document
        displayDocument(generatedDocument, 'markdown');

        // Show the document toggle button
        if (toggleDocumentBtn) {
            toggleDocumentBtn.style.display = 'block';
        }

        // Update flags
        researchComplete = true;
        researchInProgress = false;

    } catch (error) {
        console.error('Error performing research:', error);

        const errorMessage = 'Sorry, there was an error performing the research. Please try again.';
        processAIResponse(errorMessage, messagePlaceholder.querySelector('.message-content'));

        researchInProgress = false;
    }

    // Update UI state
    updateUIState();
}

export {
    initResearchUI,
    handleResearchSubmit,
    updateUIState,
    startAIChatInteraction,
    setupResearchContinuation
};