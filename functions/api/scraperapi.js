export async function onRequest(context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    if (context.request.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers }
      );
    }

    // Get URL and options from request body
    const body = await context.request.json();
    const { url, renderJs } = body;

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers }
      );
    }

    console.log(`ScraperAPI scraping: ${url}`);

    // Get API key from environment
    const apiKey = context.env.SCRAPERAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'ScraperAPI key not configured' }),
        { status: 500, headers }
      );
    }

    // Construct ScraperAPI URL (using GET request format)
    const apiUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}${renderJs ? '&render=true' : ''}`;
    
    console.log(`Calling ScraperAPI: ${apiUrl}`);
    
    // Make a GET request to ScraperAPI
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ScraperAPI error (${response.status}): ${errorText}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `ScraperAPI returned ${response.status} ${response.statusText}` 
        }),
        { status: response.status, headers }
      );
    }
    
    // Get content from response
    const content = await response.text();
    
    // Process HTML content - extract main content with improved extraction
    const cleanedHtml = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, '');
    
    // Extract main content using a variety of selectors to increase success chances
    // For modern docs/wikis/blogs, check more tag patterns
    let extractedContent = '';
    
    // Try to find content based on common container patterns
    // 1. Check for article/main content
    const articleMatch = cleanedHtml.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                        cleanedHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    
    // 2. Check for common doc site containers like div with class="content" or id="content"
    const contentDivMatch = cleanedHtml.match(/<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                          cleanedHtml.match(/<div[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/div>/i) ||
                          cleanedHtml.match(/<div[^>]*class=["']container["'][^>]*>([\s\S]*?)<\/div>/i) ||
                          cleanedHtml.match(/<div[^>]*class=["']main["'][^>]*>([\s\S]*?)<\/div>/i);
    
    // 3. Check for documentation-specific elements like markdown containers
    const docMatch = cleanedHtml.match(/<div[^>]*class=["'][^"']*markdown[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                   cleanedHtml.match(/<div[^>]*class=["'][^"']*docs?[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                   cleanedHtml.match(/<div[^>]*class=["'][^"']*documentation[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
                     
    // 4. Try GitHub-specific selectors
    const githubMatch = cleanedHtml.match(/<div[^>]*class=["']readme[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                      cleanedHtml.match(/<article[^>]*class=["']markdown-body[^"']*["'][^>]*>([\s\S]*?)<\/article>/i);
    
    // Use the first successful match
    if (articleMatch && articleMatch[1]) {
      extractedContent = articleMatch[1];
      console.log("Extracted content from article/main tag");
    } else if (docMatch && docMatch[1]) {
      extractedContent = docMatch[1];
      console.log("Extracted content from documentation container");
    } else if (githubMatch && githubMatch[1]) {
      extractedContent = githubMatch[1];
      console.log("Extracted content from GitHub-specific container");
    } else if (contentDivMatch && contentDivMatch[1]) {
      extractedContent = contentDivMatch[1];
      console.log("Extracted content from content div");
    } else {
      // No specific container found, take the body content but remove common non-content areas
      const bodyMatch = cleanedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        let bodyContent = bodyMatch[1];
        
        // Remove common non-content areas
        bodyContent = bodyContent
          .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
          .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
          .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
          .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
          .replace(/<div[^>]*class=["'][^"']*sidebar[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
          .replace(/<div[^>]*class=["'][^"']*menu[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '')
          .replace(/<div[^>]*class=["'][^"']*navigation[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
        
        extractedContent = bodyContent;
        console.log("Falling back to filtered body content");
      } else {
        // Last resort: just use the entire HTML with scripts/styles removed
        extractedContent = cleanedHtml;
        console.log("Using entire page content as fallback");
      }
    }
    
    // Clean up the extracted content - convert to readable text
    // First remove all images, forms, and iframes to reduce noise
    extractedContent = extractedContent
      .replace(/<img[^>]*>/gi, '[IMAGE]')
      .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '');
    
    // Then extract text from the remaining HTML
    const textContent = extractedContent
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '###### $1\n\n')
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '• $1\n')
      .replace(/<a[^>]*href=["']([\s\S]*?)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .replace(/\n\s*\n/g, '\n\n') // Remove excessive newlines
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();
    
    // Only return if we got something substantial (more than just a few characters)
    const MIN_CONTENT_LENGTH = 100; // Minimum characters to consider content valid
    const processedContent = textContent.length > MIN_CONTENT_LENGTH ? textContent : cleanedHtml;
    
    // Return processed content
    return new Response(
      JSON.stringify({
        success: true,
        content: processedContent,
        service: 'scraperapi',
        raw: content.substring(0, 500) + (content.length > 500 ? '...' : '') // Include first 500 chars of raw response for debugging
      }),
      { headers }
    );
  } catch (error) {
    console.error('ScraperAPI scraping error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error during ScraperAPI scraping' 
      }),
      { status: 500, headers }
    );
  }
}

// Helper function to extract main content from HTML
function extractMainContent(html) {
  try {
    // Simple content extraction - look for article, main, or content divs
    const mainContentRegexes = [
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<main[^>]*>([\s\S]*?)<\/main>/i,
      /<div[^>]*id=["']?content["']?[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class=["']?content["']?[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class=["']?main["']?[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*id=["']?main["']?[^>]*>([\s\S]*?)<\/div>/i
    ];
    
    for (const regex of mainContentRegexes) {
      const match = html.match(regex);
      if (match && match[1] && match[1].length > 200) {
        // Found substantive main content
        return match[1]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]*>/g, '');
      }
    }
    
    // No main content found, return cleaned HTML
    return html.replace(/<[^>]*>/g, '');
  } catch (error) {
    console.error('Error extracting main content:', error);
    return html.replace(/<[^>]*>/g, '');
  }
} 