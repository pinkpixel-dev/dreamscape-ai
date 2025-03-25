// index.js
// Main entry point for the research tool

import { initResearchUI } from './ui-handlers.js';

/**
 * Initialize the research tool when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing research tool...');
    initResearchUI();
});

// Export all functionality for direct use
export * from './document-generation.js';
export * from './query-variation.js';
export * from './research-core.js';
export * from './ui-handlers.js'; 