# Dreamscape AI Research Tool Implementation Plan ✨

## Flow Summary

- Chat Flow:
User enters query
Query goes to search process
Search returns links to scrape
Scraping returns results
LM processes results and generates a comprehensive detailed response
User can view document in sidebar, copy or download

- Document Generation Flow:
User selects research depth (quick, extended, deep)
Query sent to SearchGPT 1, 2, or 4 times to get 5, 10, or 20 links
Scraping begins on these sites
Data sent to LM in chunks for processing
Document is displayed in sidebar
Final document available for download or copy

## Current Implementation Status

As of June 2024, we have implemented key components of the research tool:

### Completed
1. **Web Search Integration**: 
   - Implemented Pollinations searchgpt API integration
   - Added fallback mechanisms for CORS and API failures
   - Implemented topic-specific hardcoded results for consistent testing

2. **Multi-Service Web Scraping**:
   - Added robust error handling and multiple fallback mechanisms
   - Implemented ScraperAPI and ScrapingAnt as primary scraping services
   - Created specialized extraction for GitHub repositories and documentation sites
   - Added synthetic content generation for failed scraping attempts

3. **Document Generation**:
   - Implemented document generation with proper formatting
   - Added source categorization and prioritization
   - Created fallback content generation for failed searches
   - Added copy and download functionality

4. **User Interface**:
   - Created research.html with document sidebar
   - Implemented simplified research interface
   - Added sources display with categorization
   - Created progress indicators for visual feedback
   - Added document viewer with markdown formatting

5. **Code Organization**:
   - Restructured code into modular components
   - Created separate modules for document generation, query variation, and UI handlers
   - Established proper import/export structure
   - Implemented unified scraping endpoint

### In Progress / Known Issues
1. **API Integration**: 
   - PhantomJS Cloud and FireCrawl APIs not working correctly
   - POST endpoints to Pollinations API sometimes return 404/500 errors 

2. **UI Refinement**: 
   - Document viewer should be wider or resizable
   - Document downloads twice when button is clicked
   - Chat output needs improved formatting

3. **Content Quality**:
   - Document length sometimes shorter than expected
   - Need to add image generation to documents

## Planned Improvements

### 1. Document Enhancement
- **Image Integration**: Add AI-generated images to documents
  - Use section headings to generate relevant image prompts
  - Position images strategically through the document
  - Add option to disable images

- **Document Formatting**: Improve document presentation
  - Enhanced markdown rendering with syntax highlighting
  - Better source citation formatting
  - Table of contents generation

### 2. API Integration Fixes
- **PhantomJS Cloud**: Fix integration issues
  - Debug and resolve errors in API communication
  - Update authentication and request formatting
  - Implement retry logic for failed requests

- **FireCrawl API**: Fix integration issues
  - Resolve rate limiting issues
  - Improve error handling and retry logic
  - Update token authentication

- **POST Endpoints**: Investigate and fix 404/500 errors
  - Debug network issues with Pollinations API
  - Implement improved error recovery
  - Add fallback language model options

### 3. UI Improvements
- **Document Viewer**: Make the sidebar resizable
  - Add drag handle for width adjustment
  - Remember user preferences
  - Implement responsive design for different screen sizes

- **Download Function**: Fix double-download issue
  - Debug event handling in document-generation.js
  - Prevent duplicate click events
  - Add download confirmation

- **Chat Output**: Improve formatting
  - Enhance markdown rendering in chat
  - Add syntax highlighting for code blocks
  - Improve citation formatting

### 4. Conversational Flow
- **Clarifying Questions**: Implement limit on questions before proceeding with research
  - Add max questions parameter
  - Improve question relevance with proper prompting
  - Ensure user experience remains smooth

### 5. Performance Optimization
- **Caching**: Implement caching for scraped content
  - Store results in LocalStorage with TTL
  - Add option to refresh cached results
  - Implement intelligent cache invalidation

- **Parallel Processing**: Improve scraping speed
  - Process multiple URLs concurrently
  - Implement timeout handling
  - Add better progress indicators

## Test Locally with:
npx wrangler pages dev . --compatibility-date=2023-03-21 --port=8123 --binding WATSON_API_KEY=FnlwFRc4RcTWmHhTvvtN2UQO3zty2TgMAQDB316iT4wu --binding CLOUDINARY_CLOUD_NAME=dwa9nkpyq --binding CLOUDINARY_API_KEY=887549877845179 --binding CLOUDINARY_API_SECRET=d37-Vl-1VpdhQficepHl9eY4kzo --binding FIRECRAWL_API_KEY=fc-5dac78325943466cbb18bfd2ccf57fed --binding SCRAPERAI_API_KEY=4428476e091460e284e7dc8b4e71d669 --binding SCRAPINGANT_API_KEY=71e592aa381940859d6bcd1c8238da7a --binding PHANTOMJSCLOUD_API_KEY=ak-kxraf-37dez-say2f-5hpfh-ygrxf

## API docs:
@https://docs.scrapingant.com/ 
@https://www.scraperapi.com/documentation/ 
@https://phantomjscloud.com/docs/ 
@https://docs.firecrawl.dev/introduction 

## Overview

This document outlines our plan to build a comprehensive web research tool that leverages web crawling and the Pollinations API for intelligent search and document generation. The tool will generate detailed, well-formatted research documents on any topic using a tiered approach for different research depths.

## Research Tiers

### 1. Quick Research (Basic)
- Single searchgpt query
- Returns 5 most relevant sites
- Best for:
  - Quick fact-checking
  - Topic overviews
  - Initial research phase

### 2. Extended Research (Medium)
- 2 searchgpt queries with intelligent variations
- 10 unique sites total (5 from each query)
- Query variation examples:
  - Original: "machine learning deployment best practices"
  - Variation: "machine learning production deployment guides"
- Features:
  - Duplicate removal
  - Source type diversity
  - Relevance ranking

### 3. Deep Research (Comprehensive)
- 4 searchgpt queries with smart variations
- 20 unique sites total
- Advanced query modification:
  - Different perspectives (academic, practical, case studies)
  - Time-based variations (recent vs established content)
  - Depth variations (overview vs technical detail)
- Features:
  - Priority source ranking
  - Comprehensive coverage
  - Source type balancing

## Smart Query Generation

### Query Variation Strategies
```javascript
async function generateQueryVariations(baseQuery, tier) {
  const variations = {
    extended: [
      {
        focus: "practical",
        template: "${topic} practical examples and guides"
      },
      {
        focus: "technical",
        template: "${topic} technical documentation and tutorials"
      }
    ],
    deep: [
      {
        focus: "academic",
        template: "${topic} research papers and studies"
      },
      {
        focus: "practical",
        template: "${topic} best practices and implementation"
      },
      {
        focus: "case_studies",
        template: "${topic} real world examples and case studies"
      },
      {
        focus: "current",
        template: "latest developments in ${topic} 2024"
      }
    ]
  };

  // Use Pollinations API to enhance query variations
  const enhancedQueries = await Promise.all(
    variations[tier].map(async (variation) => {
      const prompt = `Generate a search query variation for "${baseQuery}" 
                     focusing on ${variation.focus} aspects, 
                     using this template: ${variation.template}`;
      
      // Call Pollinations API for query enhancement
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "searchgpt",
          prompt: prompt,
          max_tokens: 50
        })
      });
      
      return response.text();
    })
  );

  return [baseQuery, ...enhancedQueries];
}
```

### Source Diversity Management
```javascript
const sourceTypes = {
  documentation: {
    priority: 5,
    patterns: ['/docs/', 'documentation', 'reference']
  },
  academic: {
    priority: 4,
    patterns: ['.edu', 'research', 'paper', 'journal']
  },
  tutorial: {
    priority: 3,
    patterns: ['tutorial', 'guide', 'how-to']
  },
  blog: {
    priority: 2,
    patterns: ['blog', 'article', 'post']
  },
  discussion: {
    priority: 1,
    patterns: ['forum', 'discussion', 'thread']
  }
};

function categorizeSources(urls) {
  return urls.map(url => {
    let maxPriority = 0;
    let type = 'other';

    for (const [sourceType, meta] of Object.entries(sourceTypes)) {
      if (meta.patterns.some(pattern => url.toLowerCase().includes(pattern))) {
        if (meta.priority > maxPriority) {
          maxPriority = meta.priority;
          type = sourceType;
        }
      }
    }

    return {
      url,
      type,
      priority: maxPriority
    };
  });
}
```

## Web Scraping Service Integration

### Multi-Service Scraping Strategy
We'll implement a cascading fallback approach across multiple scraping services to ensure reliability and maximize free tier usage. Each service has different strengths and limitations.

```javascript
// Track usage across services to avoid exceeding free tier limits
const serviceUsage = {
  phantomjs: { daily: 0, limit: 500, reset: 'daily' },
  scraperapi: { monthly: 0, limit: 1000, reset: 'monthly' },
  scrapingant: { monthly: 0, limit: 10000, reset: 'monthly' },
  firecrawl: { minutely: 0, limit: 1, reset: 'minute' }
};

// Main scraping function with fallback logic
async function scrapeUrl(url, options = {}) {
  console.log(`🔍 Scraping ${url}`);
  
  // Service order: PhantomJS → ScraperAPI → ScrapingAnt → Firecrawl
  try {
    // 1. Try PhantomJS Cloud first (fastest with JS support)
    if (serviceUsage.phantomjs.daily < serviceUsage.phantomjs.limit) {
      try {
        const content = await scrapeWithPhantomJS(url, options);
        serviceUsage.phantomjs.daily++;
        return content;
      } catch (error) {
        console.log(`PhantomJS Cloud failed for ${url}: ${error.message}`);
      }
    }
    
    // 2. Fall back to ScraperAPI
    if (serviceUsage.scraperapi.monthly < serviceUsage.scraperapi.limit) {
      try {
        const content = await scrapeWithScraperAPI(url, options);
        serviceUsage.scraperapi.monthly++;
        return content;
      } catch (error) {
        console.log(`ScraperAPI failed for ${url}: ${error.message}`);
      }
    }
    
    // 3. Try ScrapingAnt (slower but high credit limit)
    if (serviceUsage.scrapingant.monthly < serviceUsage.scrapingant.limit) {
      try {
        const content = await scrapeWithScrapingAnt(url, options);
        serviceUsage.scrapingant.monthly++;
        return content;
      } catch (error) {
        console.log(`ScrapingAnt failed for ${url}: ${error.message}`);
      }
    }
    
    // 4. Last resort: Firecrawl (if available)
    // Check if a minute has passed since last request
    const now = Date.now();
    if (now - serviceUsage.firecrawl.lastRequestTime > 60000) {
      try {
        const content = await scrapeWithFirecrawl(url, options);
        serviceUsage.firecrawl.lastRequestTime = now;
        return content;
      } catch (error) {
        console.log(`Firecrawl failed for ${url}: ${error.message}`);
      }
    }
    
    // All services failed
    throw new Error(`All scraping services failed for ${url}`);
  } catch (error) {
    console.error(`Failed to scrape ${url}: ${error.message}`);
    return null;
  }
}
```

### 1. PhantomJS Cloud Integration
```javascript
// PhantomJS Cloud Integration (500 pages/day, full JS rendering)
async function scrapeWithPhantomJS(url, options = {}) {
  const apiKey = process.env.PHANTOMJS_API_KEY || 'a-demo-key-with-low-quota-per-ip-address';
  const renderType = options.renderType || 'html';
  
  const apiUrl = `https://phantomjscloud.com/api/browser/v2/${apiKey}/?url=${encodeURIComponent(url)}&renderType=${renderType}`;
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`PhantomJS Cloud returned ${response.status}: ${response.statusText}`);
    }
    
    // PhantomJS Cloud returns the rendered HTML directly
    return await response.text();
  } catch (error) {
    console.error('PhantomJS Cloud error:', error);
    throw error;
  }
}
```

### 2. ScraperAPI Integration
```javascript
// ScraperAPI Integration (1000 requests/month, 5 concurrent requests)
async function scrapeWithScraperAPI(url, options = {}) {
  const apiKey = process.env.SCRAPERAPI_API_KEY;
  
  if (!apiKey) {
    throw new Error('ScraperAPI key not configured');
  }
  
  const renderJs = options.renderJs ? 'true' : 'false';
  const apiUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(url)}&render=${renderJs}`;
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`ScraperAPI returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('ScraperAPI error:', error);
    throw error;
  }
}
```

### 3. ScrapingAnt Integration
```javascript
// ScrapingAnt Integration (10,000 requests, sequential processing)
async function scrapeWithScrapingAnt(url, options = {}) {
  const apiKey = process.env.SCRAPINGANT_API_KEY;
  
  if (!apiKey) {
    throw new Error('ScrapingAnt key not configured');
  }
  
  const browser = options.renderJs ? 'true' : 'false';
  const apiUrl = `https://api.scrapingant.com/v2/general?url=${encodeURIComponent(url)}&browser=${browser}`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'x-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`ScrapingAnt returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.content || data.text || '';
  } catch (error) {
    console.error('ScrapingAnt error:', error);
    throw error;
  }
}
```

### 4. Firecrawl Integration (Fallback)
```javascript
// Firecrawl integration (fallback only, 1 request per minute)
async function scrapeWithFirecrawl(url, options = {}) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  
  if (!apiKey) {
    throw new Error('Firecrawl API key not configured');
  }
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: url,
        javascript: options.renderJs || true,
        markdown: true,
        elements: true
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`Firecrawl scraping failed: ${data.status}`);
    }
    
    return data.data?.markdown || data.data?.text || 'No content extracted';
  } catch (error) {
    console.error('Error during Firecrawl scraping:', error);
    throw error;
  }
}
```

## Technology Stack

1. **Web Search:** Pollinations searchgpt API
2. **Web Scraping:** Multi-service approach (PhantomJS Cloud, ScraperAPI, ScrapingAnt, Firecrawl)
3. **Image Generation:** Pollinations API
4. **Frontend:** Adapted from existing chat.html template (research.html)
5. **Document Formatting:** Leveraging existing markdown formatting & chunking techniques

## Implementation Plan

### 1. Web Scraping Integration

```javascript
// Process extracted content into manageable chunks
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
```

### 2. Document Generation with LLM

```javascript
// Function to generate a document section using LLM
async function generateDocumentSection(content, topic, sectionIndex, totalSections, format = 'markdown') {
  // Construct prompt for document section generation
  let systemPrompt = '';
  
  if (sectionIndex === 0) {
    systemPrompt = `
      Generate the FIRST PART of a comprehensive ${format} document about "${topic}".
      
      Focus on:
      - Overview and definition of the topic
      - Historical background and origins
      - Core concepts and fundamentals
      
      Create a substantial section with proper headings, examples, and detailed explanations.
      Preserve all technical details and important specifics from the source material.
    `;
  } else if (sectionIndex === totalSections - 1) {
    systemPrompt = `
      Generate the FINAL PART of a comprehensive ${format} document about "${topic}".
      
      Focus on:
      - Current developments and future directions
      - Applications and impact
      - Conclusion and key takeaways
      
      Create a substantial section with proper headings, examples, and detailed explanations.
      Preserve all technical details and important specifics from the source material.
    `;
  } else {
    systemPrompt = `
      Generate the NEXT PART (part ${sectionIndex + 1} of ${totalSections}) of a comprehensive ${format} document about "${topic}".
      
      Create a substantial section with proper headings, examples, and detailed explanations.
      Preserve all technical details and important specifics from the source material.
    `;
  }
  
  // We'll use Pollinations text API for LLM processing
  const encodedPrompt = encodeURIComponent(systemPrompt);
  
  try {
    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai-reasoning',
        prompt: systemPrompt,
        system: `You are generating part ${sectionIndex + 1} of ${totalSections} of a comprehensive research document about "${topic}" based on the following content. Create well-structured, detailed content in ${format} format with proper headings and organization.`,
        context: content,
        max_tokens: 4000
      })
    });
    
    const result = await response.json();
    return result.text || result.content || '';
  } catch (error) {
    console.error('Error generating document section:', error);
    return '';
  }
}
```

### 3. Image Generation with Pollinations

```javascript
// Generate an image based on a keyword/topic using Pollinations
function generatePollinationsImage(keyword, width = 1024, height = 768) {
  // Clean and encode the keyword
  const cleanKeyword = keyword.trim().replace(/[^\w\s-]/g, '');
  const encodedKeyword = encodeURIComponent(`${cleanKeyword}, professional, high quality, detailed`);
  
  // Generate a random seed for variety
  const seed = Math.floor(Math.random() * 9999);
  
  // Construct the Pollinations image URL
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedKeyword}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
  
  return {
    url: imageUrl,
    alt: cleanKeyword,
    width: width,
    height: height
  };
}
```

### 4. Main Research Function

```javascript
// Main research function
async function performResearch(query, tier = 'quick', includeImages = true) {
  // Show progress indicator
  showResearchStatus('🔍 Starting research on ' + query);
  
  // Step 1: Get URLs based on research tier
  let urls;
  
  if (tier === 'quick') {
    // Quick research - single search query
    showResearchStatus('🔍 Performing quick search...');
    urls = await pollinationsSearch(query);
    urls = urls.slice(0, 5); // Limit to 5 URLs
  } else if (tier === 'extended') {
    // Extended research - 2 search queries
    showResearchStatus('🔍 Performing extended search with variations...');
    const variations = await generateQueryVariations(query, 'extended');
    const results = await Promise.all(variations.map(q => pollinationsSearch(q)));
    urls = [...new Set(results.flat())].slice(0, 10); // Deduplicate and limit to 10
  } else if (tier === 'deep') {
    // Deep research - 4 search queries
    showResearchStatus('🔍 Performing comprehensive search with multiple variations...');
    const variations = await generateQueryVariations(query, 'deep');
    const results = await Promise.all(variations.map(q => pollinationsSearch(q)));
    urls = [...new Set(results.flat())].slice(0, 20); // Deduplicate and limit to 20
  }
  
  if (!urls || urls.length === 0) {
    showResearchStatus('❌ No search results found');
    return null;
  }
  
  // Step 2: Categorize and prioritize sources
  const categorizedUrls = categorizeSources(urls);
  
  // Sort by priority (higher value first)
  categorizedUrls.sort((a, b) => b.priority - a.priority);
  
  // Step 3: Extract content from each source
  const extractedContent = [];
  
  for (let i = 0; i < categorizedUrls.length; i++) {
    const source = categorizedUrls[i];
    showResearchStatus(`🌐 Extracting content from ${i+1}/${categorizedUrls.length}: ${source.url} (${source.type})`);
    
    const content = await scrapeUrl(source.url, { renderJs: true });
    
    if (content) {
      extractedContent.push({
        url: source.url,
        type: source.type,
        content: content
      });
    }
  }
  
  if (extractedContent.length === 0) {
    showResearchStatus('❌ Failed to extract content from any sources');
    return null;
  }
  
  // Step 4: Process and chunk content
  showResearchStatus('📝 Processing extracted content...');
  
  let combinedContent = '';
  for (const content of extractedContent) {
    combinedContent += `## Source: ${content.url} (${content.type})\n\n${content.content}\n\n`;
  }
  
  const contentChunks = chunkContent(combinedContent);
  
  // Step 5: Generate document sections with LLM
  showResearchStatus('🧠 Generating comprehensive document...');
  
  let documentSections = [];
  
  for (let i = 0; i < contentChunks.length; i++) {
    showResearchStatus(`📄 Generating document section ${i+1}/${contentChunks.length}...`);
    
    const section = await generateDocumentSection(
      contentChunks[i], 
      query, 
      i, 
      contentChunks.length
    );
    
    documentSections.push(section);
  }
  
  // Step 6: Combine document sections
  let fullDocument = documentSections.join('\n\n');
  
  // Step 7: Add title if not present
  if (!fullDocument.startsWith('# ')) {
    fullDocument = `# ${query}\n\n${fullDocument}`;
  }
  
  // Step 8: Add images if requested
  if (includeImages) {
    showResearchStatus('🖼️ Adding relevant images to document...');
    fullDocument = insertImagesInDocument(fullDocument, query);
  }
  
  // Step 9: Add sources/citations
  const sourcesSection = `\n\n## Sources\n\n${extractedContent.map(source => 
    `- [${source.url}](${source.url}) (${source.type})`).join('\n')}`;
  
  fullDocument += sourcesSection;
  
  // Done!
  showResearchStatus('✅ Research document complete!');
  
  return fullDocument;
}

// Helper function to show research status
function showResearchStatus(message) {
  const statusElement = document.getElementById('research-status');
  if (statusElement) {
    statusElement.textContent = message;
  }
  console.log(message);
}
```

## Frontend Modifications

### research.html Changes

1. Update title and description
2. Add research-specific controls:
   - Tier selector (Quick, Extended, Deep)
   - Include images toggle
   - Format selector (markdown, HTML)
3. Update UI text and layout
4. Add document output formatting
5. Include progress indicators for research steps

## Testing Strategy

1. Test each scraping service individually:
   - PhantomJS Cloud
   - ScraperAPI
   - ScrapingAnt
   - Fallback to Firecrawl
   
2. Test search and document generation:
   - Different tiers (Quick, Extended, Deep)
   - Various topics (technical, general, specialized)
   - Different output formats
   
3. End-to-end testing:
   - Complete research process
   - Graceful handling of service failures
   - Performance under load

## Optimizations & Future Improvements

1. **Performance**
   - Implement cache for scraped content
   - Optimize content extraction process
   - Use service worker for background processing
   
2. **UI Enhancements**
   - Dark/light mode toggle
   - Customizable document templates
   - Export options (PDF, DOCX)
   
3. **Content Quality**
   - Implement fact-checking against multiple sources
   - Add option for citation styles (APA, MLA, etc.)
   - Allow user to refine/edit generated content

## Implementation Timeline

1. **Phase 1: Core Functionality**
   - Pollinations searchgpt integration
   - Multi-service web scraping
   - Basic document generation
   
2. **Phase 2: Tiered Research System**
   - Implement Quick/Extended/Deep research
   - Smart query variation
   - Source categorization
   
3. **Phase 3: UI & UX**
   - Frontend implementation
   - Progress indicators
   - Document viewer & download
   
4. **Phase 4: Optimizations**
   - Caching system
   - Advanced error handling
   - Performance improvements

## Resources

- [Pollinations API Documentation](https://pollinations.ai/docs)
- [PhantomJS Cloud Documentation](https://phantomjscloud.com/docs/)
- [ScraperAPI Documentation](https://www.scraperapi.com/documentation/)
- [ScrapingAnt Documentation](https://docs.scrapingant.com/)
- [Firecrawl Documentation]([text](https://docs.firecrawl.dev/introduction))
- [Markdown Formatting Guide](https://www.markdownguide.org) 