// document-generation.js
// Document generation functions for the research tool

/**
 * Formats markdown text for display
 * @param {string} markdown - Markdown text to format
 * @returns {string} HTML formatted content
 */
function formatMarkdown(markdown) {
    if (!markdown) return '';
    
    // Basic markdown formatting (can be enhanced)
    let html = markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n/gim, '<br>')
        .replace(/^-(.*$)/gim, '<li>$1</li>');
    
    return html;
}

/**
 * Generate an introduction for a document
 * @param {string} topic - Main research topic
 * @param {string} format - Output format
 * @param {string} context - Additional context
 * @returns {string} Introduction content
 */
async function generateIntroduction(topic, format, context = '') {
    return `# ${topic}\n\n## Introduction\n\nThis document provides a comprehensive overview of ${topic}, exploring key concepts, applications, and developments in this area. The following sections include information gathered from various credible sources to provide a thorough understanding of the topic.\n\n`;
}

/**
 * Generate a conclusion for a document
 * @param {string} topic - Main research topic
 * @param {Array} sources - Source URLs used
 * @param {string} format - Output format
 * @param {string} context - Additional context
 * @returns {string} Conclusion content
 */
async function generateConclusion(topic, sources, format, context = '') {
    let conclusion = `## Conclusion\n\n${topic} is a complex and evolving field with many facets and applications. This document has presented a comprehensive overview based on research from multiple sources.\n\n`;
    
    // Add sources section
    conclusion += `## Sources\n\n`;
    if (sources && sources.length) {
        sources.forEach((source, index) => {
            conclusion += `${index + 1}. [${source}](${source})\n`;
        });
    } else {
        conclusion += `No sources were available for this document.`;
    }
    
    return conclusion;
}

/**
 * Process content from a source and generate a document section
 * @param {Object} source - Source object with url and content
 * @param {string} topic - Research topic
 * @param {number} sectionIndex - Current section index
 * @param {number} totalSections - Total number of sections
 * @param {string} format - Output format
 * @returns {string} Generated document section
 */
async function processSourceContent(source, topic, sectionIndex, totalSections, format) {
    if (!source || !source.content) {
        return generateFallbackContent(topic);
    }
    
    try {
        // Use the pollinations-text API endpoint for text generation
        const response = await fetch('/api/pollinations-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai-large',
                prompt: `Generate a detailed section for a research document about "${topic}" based on the provided content.`,
                system: `You are generating part ${sectionIndex + 1} of ${totalSections} of a comprehensive research document about "${topic}" based on the following content. Create well-structured, detailed content in ${format} format with proper headings and organization. Maintain technical accuracy and include specific details from the source.`,
                context: source.content,
                max_tokens: 2000
            })
        });
        
        const result = await response.json();
        
        if (!result.success || !result.text || result.text.trim().length < 100) {
            console.log('Failed to generate content from source, using fallback', result);
            return generateFallbackContent(topic);
        }
        
        // Add source attribution
        let content = result.text;
        if (!content.includes(`Source: ${source.url}`)) {
            content += `\n\n*Source: [${source.url}](${source.url})*\n\n`;
        }
        
        return content;
    } catch (error) {
        console.error('Error generating document section:', error);
        return generateFallbackContent(topic);
    }
}

/**
 * Generate fallback content for when scraping fails
 * @param {string} topic - Research topic
 * @returns {string} Generated fallback content
 */
function generateFallbackContent(topic) {
    return `## Information about ${topic}

Unfortunately, detailed content for this section could not be retrieved. Here's some general information about ${topic}:

${topic} is a subject with various aspects and applications. While specific information could not be accessed at this time, this document includes other sections with relevant details about this topic.

For more comprehensive information, we recommend exploring specialized resources and academic publications related to ${topic}.
`;
}

/**
 * Generate supplementary content for a topic
 * @param {string} topic - Research topic
 * @returns {string} Generated supplementary content
 */
function generateSupplementaryContent(topic) {
    return `## Additional Information about ${topic}

This supplementary section provides extra context about ${topic}:

- Key concepts and terminology related to ${topic}
- Historical development and evolution of ${topic}
- Modern applications and relevance of ${topic}
- Common challenges and solutions in the field of ${topic}

`;
}

/**
 * Generate comprehensive content for a topic
 * @param {string} topic - Research topic
 * @returns {string} Generated comprehensive content
 */
function generateComprehensiveContent(topic) {
    return `# Comprehensive Overview of ${topic}

## Introduction
${topic} encompasses a broad range of concepts, methodologies, and applications. This section provides a comprehensive overview of the key aspects of ${topic}.

## Key Components
The fundamental elements of ${topic} include various interconnected systems and concepts that work together to form a cohesive framework.

## Practical Applications
${topic} has numerous practical applications across different industries and sectors, demonstrating its versatility and importance.

## Challenges and Considerations
Like any advanced field, ${topic} comes with its own set of challenges and considerations that practitioners must address.

## Future Directions
The field of ${topic} continues to evolve, with new developments and innovations emerging regularly.

## Resources for Further Study
To deepen your understanding of ${topic}, consider exploring these types of resources:
- Academic journals and publications
- Industry reports and case studies
- Online courses and educational materials
- Professional communities and forums

`;
}

/**
 * Display a document in the specified format
 * @param {string} documentContent - The content of the document
 * @param {string} format - The format of the document ('markdown' or 'html')
 */
function displayDocument(documentContent, format = 'markdown') {
    const documentContainer = document.getElementById('document-container');
    const toggleDocumentBtn = document.getElementById('toggle-document-btn');
    const documentSidebar = document.getElementById('document-sidebar');
    
    if (!documentContainer) return;
    
    // Set document content
    if (format === 'markdown') {
        // For markdown, we need to handle some basic formatting
        const formattedContent = formatMarkdown(documentContent);
        documentContainer.innerHTML = formattedContent;
    } else {
        // For HTML, we can set it directly
        documentContainer.innerHTML = documentContent;
    }
    
    // Show the document sidebar toggle button
    if (toggleDocumentBtn) {
        toggleDocumentBtn.style.display = 'block';
    }
    
    // Automatically open the document sidebar
    if (documentSidebar) {
        documentSidebar.classList.add('visible');
    }
}

/**
 * Download the generated document
 * @param {string} content - Document content
 * @param {string} filename - Filename to save as
 * @param {string} format - Output format
 */
function downloadDocument(content, filename, format) {
    let downloadContent = content;
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    if (format === 'html') {
        downloadContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; margin-top: 30px; }
        h3 { color: #2980b9; }
        a { color: #3498db; }
        img { max-width: 100%; height: auto; }
        blockquote { border-left: 4px solid #3498db; padding-left: 15px; color: #7f8c8d; }
        code { background: #f4f6f6; padding: 2px 5px; border-radius: 3px; }
        pre { background: #f4f6f6; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    ${formatMarkdown(content)}
</body>
</html>`;
        mimeType = 'text/html';
        extension = 'html';
    } else if (format === 'markdown') {
        mimeType = 'text/markdown';
        extension = 'md';
    }
    
    const blob = new Blob([downloadContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('Document copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}

// Export functions for use in other modules
export {
    formatMarkdown,
    generateIntroduction,
    generateConclusion,
    processSourceContent,
    generateFallbackContent,
    generateSupplementaryContent,
    generateComprehensiveContent,
    displayDocument,
    downloadDocument,
    copyToClipboard
}; 