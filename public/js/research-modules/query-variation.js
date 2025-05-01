// query-variation.js
// Functions for generating query variations for research

/**
 * Generate variations of a search query for deeper research
 * @param {string} baseQuery - The original search query
 * @param {string} tier - Research depth tier (quick, extended, deep)
 * @returns {Promise<Array>} Array of query variations
 */
async function generateQueryVariations(baseQuery, tier = 'quick') {
    console.log(`Generating query variations for tier: ${tier}`);
    
    // For quick tier, just return the original query
    if (tier === 'quick') {
        return [baseQuery];
    }
    
    // Default variations to use if API call fails
    const defaultVariations = {
        extended: [
            `${baseQuery} practical examples and implementation`,
            `${baseQuery} technical documentation and guides`
        ],
        deep: [
            `${baseQuery} research papers and academic resources`,
            `${baseQuery} best practices and implementation techniques`,
            `${baseQuery} real-world case studies and examples`,
            `latest developments in ${baseQuery}`
        ]
    };

    try {
        // Use the pollinations-text API endpoint for generating variations
        const response = await fetch('/api/pollinations-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai',
                prompt: `Generate ${tier === 'extended' ? '2' : '4'} different search query variations for the topic "${baseQuery}" that will help find diverse, high-quality information. Each variation should focus on different aspects or approaches to the topic. Return each query on a new line without numbering.`,
                system: "You are an expert search query optimizer. Create variations that will discover different aspects of a topic for research purposes.",
                max_tokens: 1000
            })
        });
        
        const result = await response.json();
        
        if (!result.success || !result.text) {
            console.log('Failed to generate query variations, using defaults');
            return [baseQuery, ...defaultVariations[tier]];
        }
        
        // Parse the response to get individual queries
        const variations = result.text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.match(/^\d+\./)); // Remove any numbered items
        
        if (variations && variations.length > 0) {
            // Add the original query and deduplicate
            return [...new Set([baseQuery, ...variations])];
        } else {
            return [baseQuery, ...defaultVariations[tier]];
        }
    } catch (error) {
        console.error('Error generating query variations:', error);
        return [baseQuery, ...defaultVariations[tier]];
    }
}

/**
 * Determine if a query needs clarification based on its content
 * @param {string} query - The search query
 * @returns {boolean} True if clarification is needed
 */
function determineIfClarificationNeeded(query) {
    if (!query) return true;
    
    // Check for very short queries
    if (query.length < 10) return true;
    
    // Check for queries without spaces (likely a single term)
    if (!query.includes(' ')) return true;
    
    // Check for very generic queries
    const genericTerms = ['how', 'what', 'who', 'why', 'when', 'where', 'is', 'are', 'can', 'do'];
    if (genericTerms.some(term => query.toLowerCase() === term)) return true;
    
    return false;
}

/**
 * Generate an initial research response message
 * @param {string} query - The search query
 * @returns {string} Initial response message
 */
function generateInitialResponse(query) {
    return `I'll research "${query}" for you. This should take just a moment...`;
}

/**
 * Categorize sources based on URL patterns
 * @param {Array} sources - Array of source objects
 * @returns {Array} Array of categorized source objects
 */
function categorizeSources(sources) {
    if (!sources || !Array.isArray(sources)) return [];
    
    const sourceTypes = {
        documentation: {
            priority: 5,
            patterns: ['/docs/', 'documentation', 'reference', 'manual', 'guide']
        },
        academic: {
            priority: 4,
            patterns: ['.edu', 'research', 'paper', 'journal', 'study', 'academia']
        },
        tutorial: {
            priority: 3,
            patterns: ['tutorial', 'guide', 'how-to', 'howto', 'learn']
        },
        blog: {
            priority: 2,
            patterns: ['blog', 'article', 'post', 'news']
        },
        discussion: {
            priority: 1,
            patterns: ['forum', 'discussion', 'thread', 'community', 'stackoverflow', 'reddit']
        }
    };

    return sources.map(source => {
        let maxPriority = 0;
        let type = 'other';
        // Ensure url is a string and handle various url formats
        const urlString = typeof source.url === 'string'
            ? source.url.toLowerCase()
            : typeof source.url === 'object' && source.url.href
                ? source.url.href.toLowerCase()
                : '';

        for (const [sourceType, meta] of Object.entries(sourceTypes)) {
            if (meta.patterns.some(pattern => urlString.includes(pattern))) {
                if (meta.priority > maxPriority) {
                    maxPriority = meta.priority;
                    type = sourceType;
                }
            }
        }

        return {
            ...source,
            type,
            priority: maxPriority
        };
    });
}

export {
    generateQueryVariations,
    determineIfClarificationNeeded,
    generateInitialResponse,
    categorizeSources
}; 