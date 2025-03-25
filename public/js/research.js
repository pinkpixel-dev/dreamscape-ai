/**
 * Dreamscape AI Research Tool
 * Entry point file that imports functionality from modular components
 */

// Import all research functionality from modules
import {
    // Document generation
    displayDocument,
    formatMarkdown,
    generateIntroduction,
    generateConclusion,
    processSourceContent,
    generateFallbackContent,
    generateSupplementaryContent,
    generateComprehensiveContent,
    downloadDocument,
    copyToClipboard,
    
    // Query variation
    generateQueryVariations,
    determineIfClarificationNeeded,
    generateInitialResponse,
    categorizeSources,
    
    // Research core
    performResearch,
    processAIResponse,
    showTypingAnimation,
    createAIMessage,
    searchInformation,
    extractPageContent,
    chunkContent,
    
    // UI handlers
    initResearchUI,
    handleResearchSubmit,
    updateUIState
} from './research-modules/index.js';

// Initialize the research tool when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Dreamscape Research Tool...');
    initResearchUI();
});

// Export functions for external use
export {
    performResearch,
    displayDocument,
    downloadDocument,
    copyToClipboard,
    initResearchUI
}; 