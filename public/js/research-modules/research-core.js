// research-core.js
// Core research functionality that integrates with API functions

import { generateQueryVariations, categorizeSources, generateInitialResponse } from './query-variation.js';
import {
    processSourceContent,
    generateIntroduction,
    generateConclusion,
    generateFallbackContent
} from './document-generation.js';

/**
 * Process AI response during research
 * @param {string} response - AI response text
 * @param {HTMLElement} messagePlaceholder - DOM element for message
 */
function processAIResponse(response, messagePlaceholder) {
    if (!messagePlaceholder) return;

    // Clear typing animation if present
    messagePlaceholder.innerHTML = '';

    // Format and display the message
    if (typeof response === 'string') {
        messagePlaceholder.textContent = response;
    } else {
        messagePlaceholder.textContent = 'Received response';
    }
}

/**
 * Show typing animation in container
 * @param {HTMLElement} container - DOM element for animation
 */
function showTypingAnimation(container) {
    if (!container) return;
    container.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
}

/**
 * Create an AI message in container
 * @param {string} text - Message text
 * @param {HTMLElement} container - DOM element to append message
 */
function createAIMessage(text, container) {
    if (!container) return;

    const message = document.createElement('div');
    message.className = 'message ai-message';
    message.innerHTML = `<div class="message-content">${text}</div>`;
    container.appendChild(message);
    container.scrollTop = container.scrollHeight;

    return message;
}

/**
 * Search for information using Pollinations search API
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of search results
 */
async function searchInformation(query) {
    console.log(`Searching for: ${query}`);

    try {
        // Try GET request first (more reliable with Pollinations API)
        const encodedQuery = encodeURIComponent(query);
        const url = `/api/pollinations-search?query=${encodedQuery}`;
        console.log(`Making GET request to: ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
            // Removed cache option as it may cause issues
        });

        // If GET fails, fall back to POST
        if (!response.ok) {
            console.warn(`GET request failed with status ${response.status}, trying POST as fallback...`);

            const postResponse = await fetch('/api/pollinations-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            if (!postResponse.ok) {
                console.error(`Both GET and POST requests failed: ${postResponse.status}`);

                // Last resort: Try direct call to Pollinations API
                console.log("Attempting direct call to Pollinations API as last resort...");
                try {
                    // Prepare query - ensure it starts with "research" for better results
                    const enhancedQuery = query.toLowerCase().startsWith('research') ? query : `research ${query}`;
                    const directEncodedQuery = encodeURIComponent(enhancedQuery);
                    const seed = 924; // Use the same seed as the backend

                    // Direct call to Pollinations API - using exact URL format that works in browser
                    const directUrl = `https://text.pollinations.ai/research${directEncodedQuery}provideurls?model=searchgpt&seed=${seed}&json=true`;
                    console.log(`Attempting direct API call with URL: ${directUrl}`);

                    const directResponse = await fetch(directUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        },
                        mode: 'cors'
                        // Removed cache option as it may cause issues
                    });

                    if (!directResponse.ok) {
                        throw new Error(`Direct API call failed: ${directResponse.status}`);
                    }

                    const directText = await directResponse.text();
                    const directData = JSON.parse(directText);

                    // Extract URLs from the direct response
                    let directUrls = [];

                    if (directData.urls && Array.isArray(directData.urls)) {
                        directUrls = directData.urls.map(item => {
                            if (typeof item === 'string') {
                                return { title: item, url: item };
                            } else {
                                return {
                                    title: item.title || 'No title',
                                    url: item.url || item,
                                    snippet: item.snippet
                                };
                            }
                        });
                    }

                    if (directUrls.length > 0) {
                        console.log(`Direct API call succeeded with ${directUrls.length} results`);
                        return directUrls;
                    }
                } catch (directError) {
                    console.error("Direct API call failed:", directError);
                }

                // If we get here, all attempts have failed
                return [];
            }

            const postData = await postResponse.json();

            if (!postData.success || !postData.urls || postData.urls.length === 0) {
                console.error('POST search failed or returned no results:', postData);
                return [];
            }

            return postData.urls;
        }

        const data = await response.json();

        if (!data.success || !data.urls || data.urls.length === 0) {
            console.error('GET search failed or returned no results:', data);
            return [];
        }

        return data.urls;
    } catch (error) {
        console.error('Error searching for information:', error);
        return [];
    }
}

/**
 * Extract content from a webpage
 * @param {string} url - URL to scrape
 * @returns {Promise<Object>} Object with scraped content
 */
async function extractPageContent(url) {
    if (!url) {
        console.error('No URL provided for scraping');
        return null;
    }

    try {
        // Here we would call a serverless function for scraping
        // For now, we'll use a mockup that would typically be handled by the API

        // This endpoint should exist in the functions/api directory
        const response = await fetch('/api/scrape-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error(`Scraping failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            console.error('Scraping failed:', data.error);
            return null;
        }

        return {
            url,
            content: data.content,
            title: data.title || url
        };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return null;
    }
}

/**
 * Chunk content into manageable pieces
 * @param {string} content - Content to chunk
 * @param {number} maxChunkSize - Maximum chunk size
 * @returns {Array} Array of content chunks
 */
function chunkContent(content, maxChunkSize = 5000) {
    if (!content || content.length <= maxChunkSize) {
        return [content];
    }

    const chunks = [];

    // Look for natural break points like headers
    const sections = content.split(/(?=^#{1,3} .*$)/m);

    let currentChunk = "";
    for (const section of sections) {
        if (currentChunk.length + section.length <= maxChunkSize) {
            currentChunk += section;
        } else {
            if (currentChunk) {
                chunks.push(currentChunk);
            }

            // If a section is larger than maxChunkSize, break it into smaller pieces
            if (section.length > maxChunkSize) {
                const paragraphs = section.split(/\n\n+/);
                currentChunk = "";

                for (const para of paragraphs) {
                    if (currentChunk.length + para.length + 2 <= maxChunkSize) {
                        currentChunk += para + "\n\n";
                    } else {
                        if (currentChunk) {
                            chunks.push(currentChunk);
                        }
                        currentChunk = para + "\n\n";
                    }
                }
            } else {
                currentChunk = section;
            }
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}

/**
 * Display sources list in the sidebar
 * @param {Array} sources - Array of source objects
 */
function showSourcesList(sources) {
    const sourcesListContainer = document.getElementById('sources-list');
    const sourcesContainer = document.getElementById('sources-container');

    if (!sourcesListContainer || !sourcesContainer) return;

    // Create source list HTML
    const sourcesList = sources.map(source =>
        `<div class="source-item" style="margin-bottom: 10px;">
            <a href="${source.url}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: none; font-weight: 500;">
                ${source.title || source.url}
            </a>
            ${source.type ? `<span class="source-type" style="margin-left: 8px; font-size: 12px; padding: 2px 6px; border-radius: 4px; background: var(--secondary-color-light); color: var(--text-color);">${source.type}</span>` : ''}
        </div>`
    ).join('');

    // Update the sources list
    sourcesListContainer.innerHTML = sourcesList;

    // Show the sources container
    sourcesContainer.style.display = 'block';
}

/**
 * Main research function
 * @param {string} query - Research query
 * @param {string} tier - Research tier (quick, extended, deep)
 * @param {boolean} includeImages - Whether to include images
 * @param {HTMLElement} statusElement - Status element for updates
 * @returns {Promise<string>} Generated research document
 */
async function performResearch(query, tier = 'quick', includeImages = false, statusElement = null) {
    // Show research status if element provided
    const updateStatus = (message) => {
        console.log(message);
        if (statusElement) {
            statusElement.textContent = message;
        }
    };

    updateStatus(`🔍 Starting research on "${query}"`);

    // Step 1: Generate query variations based on research tier
    updateStatus(`Generating query variations for ${tier} research...`);
    const queryVariations = await generateQueryVariations(query, tier);

    // Step 2: Search for information using each query variation
    updateStatus('Searching for relevant sources...');
    let allUrls = [];

    for (let i = 0; i < queryVariations.length; i++) {
        const variation = queryVariations[i];
        updateStatus(`Searching with query variation ${i+1}/${queryVariations.length}...`);

        const searchResults = await searchInformation(variation);
        if (searchResults && searchResults.length > 0) {
            allUrls = [...allUrls, ...searchResults];
        }
    }

    // Deduplicate URLs
    const uniqueUrls = [...new Set(allUrls.map(item => item.url || item))];

    // Limit URLs based on tier
    let urlLimit = 5; // Default for quick
    if (tier === 'extended') urlLimit = 10;
    if (tier === 'deep') urlLimit = 20;

    const limitedUrls = uniqueUrls.slice(0, urlLimit);

    if (limitedUrls.length === 0) {
        updateStatus('❌ No search results found.');
        return generateFallbackContent(query);
    }

    updateStatus(`Found ${limitedUrls.length} sources to analyze.`);

    // Step 3: Extract content from each URL
    const extractedContent = [];
    const processedSources = [];

    for (let i = 0; i < limitedUrls.length; i++) {
        const url = limitedUrls[i];
        updateStatus(`Extracting content from source ${i+1}/${limitedUrls.length}: ${url}`);

        const content = await extractPageContent(url);
        if (content) {
            extractedContent.push(content);
            processedSources.push({
                url: content.url,
                title: content.title || content.url,
                type: 'Web'
            });
        }
    }

    // Show the sources in the UI
    showSourcesList(processedSources);

    if (extractedContent.length === 0) {
        updateStatus('❌ Failed to extract content from any sources.');
        return generateFallbackContent(query);
    }

    // Step 4: Categorize sources
    const categorizedSources = categorizeSources(extractedContent);

    // Sort by priority (higher value first)
    categorizedSources.sort((a, b) => b.priority - a.priority);

    // Step 5: Generate document sections
    updateStatus('Generating comprehensive document...');

    // Generate introduction
    const introduction = await generateIntroduction(query, 'markdown');

    // Generate content sections from each source
    let documentSections = [introduction];

    for (let i = 0; i < categorizedSources.length; i++) {
        updateStatus(`Generating document section ${i+1}/${categorizedSources.length}...`);

        const section = await processSourceContent(
            categorizedSources[i],
            query,
            i,
            categorizedSources.length,
            'markdown'
        );

        if (section) {
            documentSections.push(section);
        }
    }

    // Generate conclusion with source references
    const conclusion = await generateConclusion(
        query,
        categorizedSources.map(source => source.url),
        'markdown'
    );

    documentSections.push(conclusion);

    // Combine all sections
    const fullDocument = documentSections.join('\n\n');

    updateStatus('✅ Research document complete!');

    return fullDocument;
}

// Export functions for use in other modules
export {
    performResearch,
    processAIResponse,
    showTypingAnimation,
    createAIMessage,
    searchInformation,
    extractPageContent,
    chunkContent,
    showSourcesList
};