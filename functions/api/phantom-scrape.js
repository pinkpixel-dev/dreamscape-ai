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

    console.log(`PhantomJS Cloud scraping: ${url}`);

    // Get API key from environment
    const apiKey = context.env.PHANTOMJSCLOUD_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'PhantomJS Cloud API key not configured' }),
        { status: 500, headers }
      );
    }

    // PhantomJS Cloud API URL (updated to v2)
    const apiUrl = `https://phantomjscloud.com/api/browser/v2/${apiKey}/`;
    
    console.log(`Calling PhantomJS Cloud API: ${apiUrl}`);
    console.log(`URL to scrape: ${url}`); // Log the URL to verify it's not null
    
    // Updated approach using the request parameter in JSON format
    try {
      // Create a request following the v2 API format
      const requestData = {
        url: url,
        renderType: renderJs ? 'html' : 'plainText',
        outputAsJson: true,
        requestSettings: {
          maxWait: 30000,
          waitInterval: 1000,
          ignoreImages: true,
          disableJavascript: !renderJs
        },
        renderSettings: {
          viewport: {
            width: 1280,
            height: 1024
          },
          emulateMedia: "screen",
          suppressJavascript: !renderJs
        }
      };
      
      console.log(`PhantomJS request: ${JSON.stringify(requestData, null, 2)}`);
      
      // Make the API request with the correct format
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request: requestData // This is key - the v2 API expects a 'request' parameter
        })
      });
      
      // Log response status
      console.log(`PhantomJS Cloud API response status: ${response.status}`);
      
      if (!response.ok) {
        console.error(`PhantomJS API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text().catch(e => 'Could not read error response');
        console.error(`Error details: ${errorText}`);
        
        // Try fallback approach with GET format 
        console.log('Trying fallback with GET request...');
        const fallbackUrl = `${apiUrl}?url=${encodeURIComponent(url)}&renderType=${renderJs ? 'html' : 'plainText'}`;
        
        const fallbackResponse = await fetch(fallbackUrl);
        if (!fallbackResponse.ok) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `PhantomJS Cloud API failed: ${response.status} ${response.statusText}`,
              details: errorText
            }),
            { status: response.status, headers }
          );
        }
        
        return handlePhantomJsResponse(fallbackResponse, renderJs, headers);
      }
      
      return handlePhantomJsResponse(response, renderJs, headers);
      
    } catch (error) {
      console.error('PhantomJS Cloud API error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message || 'Unknown error during PhantomJS scraping' 
        }),
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error('PhantomJS Cloud scraping error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error during PhantomJS scraping' 
      }),
      { status: 500, headers }
    );
  }
}

// Helper function to handle PhantomJS response
async function handlePhantomJsResponse(response, renderJs, headers) {
  // Check if response is JSON or plain text
  const contentType = response.headers.get('content-type');
  
  let data;
  let content = '';
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
    
    // Extract content from the JSON response
    if (data && data.content) {
      // New API format
      content = data.content;
    } else if (data && data.pageContent) {
      // For backward compatibility
      content = data.pageContent;
    } else {
      // Fallback
      content = JSON.stringify(data);
    }
  } else {
    // Plain text/HTML response
    content = await response.text();
  }
  
  // Process the content
  let processedContent = content;
  
  if (renderJs && (content.includes('<html') || content.includes('<body'))) {
    // Simple HTML cleanup 
    processedContent = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '');
      
    // Extract main content
    const mainMatch = processedContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
                      processedContent.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                      processedContent.match(/<div[^>]*id=["']?content["']?[^>]*>([\s\S]*?)<\/div>/i) ||
                      processedContent.match(/<div[^>]*class=["']?content["']?[^>]*>([\s\S]*?)<\/div>/i);
    
    if (mainMatch && mainMatch[1]) {
      // Found main content
      processedContent = mainMatch[1]
        .replace(/<[^>]*>/g, ' ')       // Replace tags with spaces
        .replace(/\s+/g, ' ')           // Normalize whitespace
        .trim();
    } else {
      // No main content found, remove all HTML tags
      processedContent = processedContent
        .replace(/<[^>]*>/g, ' ')       // Replace tags with spaces
        .replace(/\s+/g, ' ')           // Normalize whitespace
        .trim();
    }
  }
  
  return new Response(
    JSON.stringify({
      success: true,
      content: processedContent,
      service: 'phantomjs',
      raw: typeof content === 'string' ? content.substring(0, 500) + (content.length > 500 ? '...' : '') : JSON.stringify(data || {}).substring(0, 500)
    }),
    { headers }
  );
} 