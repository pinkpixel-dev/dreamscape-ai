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
    // Set up event listeners
    const researchForm = document.getElementById('research-form');
    const queryInput = document.getElementById('research-query');
    const messagesContainer = document.getElementById('messages-container');
    const tierSelect = document.getElementById('research-tier');
    const downloadButton = document.getElementById('download-document-button');
    const copyButton = document.getElementById('copy-document-button');
    const startResearchButton = document.getElementById('start-research-button');
    const researchTopicInput = document.getElementById('research-topic');
    
    if (researchForm) {
        researchForm.addEventListener('submit', handleResearchSubmit);
    }
    
    if (startResearchButton && researchTopicInput && queryInput) {
        startResearchButton.addEventListener('click', () => {
            const topic = researchTopicInput.value.trim();
            if (topic) {
                queryInput.value = topic;
                // Trigger the form submit event
                const submitEvent = new Event('submit', { cancelable: true });
                researchForm.dispatchEvent(submitEvent);
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
    
    // Reset state for new query
    if (currentQuery !== query) {
        clarificationCount = 0;
        researchComplete = false;
        generatedDocument = '';
    }
    
    currentQuery = query;
    
    // Create user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<div class="message-content">${query}</div>`;
    messagesContainer.appendChild(userMessage);
    
    // Create AI message placeholder with typing animation
    const aiMessage = createAIMessage('', messagesContainer);
    showTypingAnimation(aiMessage.querySelector('.message-content'));
    
    // Determine if we need clarification
    if (clarificationCount < 2 && determineIfClarificationNeeded(query)) {
        // We need clarification - ask a follow-up question
        await askClarifyingQuestion(query, aiMessage);
    } else {
        // No clarification needed - proceed with research
        await startResearch(query, aiMessage);
    }
    
    // Clear input field
    queryInput.value = '';
    
    // Update UI state
    updateUIState();
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
        
        // Display completion message
        const completionMessage = createAIMessage('Research complete! You can now download the document or view it below.', document.getElementById('messages-container'));
        
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
    updateUIState
}; 