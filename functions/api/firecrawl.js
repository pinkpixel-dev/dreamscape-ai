// functions/api/firecrawl.js
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

    console.log(`FireCrawl scraping: ${url}`);

    // Get API key from environment
    const apiKey = context.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'FireCrawl API key not configured' }),
        { status: 500, headers }
      );
    }

    // Make POST request to FireCrawl API
    console.log(`Calling FireCrawl API for ${url}`);
    
    const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url: url,
        javascript: renderJs === true,
        markdown: true,     // Get markdown formatted content
        elements: true,     // Get page elements
        wait_for: 2000      // Wait for 2 seconds for JavaScript to execute
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`FireCrawl API error (${response.status}): ${errorText}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `FireCrawl API returned ${response.status} ${response.statusText}` 
        }),
        { status: response.status, headers }
      );
    }
    
    // Get content from response
    const data = await response.json();
    
    if (!data.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: data.error || 'FireCrawl crawling failed' 
        }),
        { status: 400, headers }
      );
    }
    
    // Extract the content - prefer markdown, fall back to text or HTML
    const content = data.data?.markdown || data.data?.text || data.data?.html || '';
    
    return new Response(
      JSON.stringify({
        success: true,
        content: content,
        title: data.data?.title || '',
        service: 'firecrawl',
        raw: JSON.stringify(data).substring(0, 500) // Include first 500 chars of raw response for debugging
      }),
      { headers }
    );
  } catch (error) {
    console.error('FireCrawl scraping error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error during FireCrawl scraping' 
      }),
      { status: 500, headers }
    );
  }
} 