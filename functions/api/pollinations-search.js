// functions/api/pollinations-search.js
export async function onRequest(context) {
  // CORS headers to allow requests from the frontend
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
    // Verify the request is a POST
    if (context.request.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        { status: 405, headers }
      );
    }

    // Get the request body
    const body = await context.request.json();
    const { query } = body;

    // Validate query
    if (!query) {
      return new Response(
        JSON.stringify({ success: false, error: 'Search query is required' }),
        { status: 400, headers }
      );
    }

    console.log(`Pollinations searchgpt query: ${query}`);

    // Prepare query - ensure it starts with "research" for better results
    const enhancedQuery = query.toLowerCase().startsWith('research') ? query : `research ${query}`;
    const encodedQuery = encodeURIComponent(enhancedQuery);
    
    // Use a fixed seed that's known to work (from screenshot: 924)
    const seed = 924;
    
    // Call Pollinations searchgpt API with GET format
    const searchUrl = `https://text.pollinations.ai/${encodedQuery}?model=searchgpt&seed=${seed}&json=true`;
    console.log(`Calling Pollinations API: ${searchUrl}`);
    
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!searchResponse.ok) {
      throw new Error(`Pollinations searchgpt API returned ${searchResponse.status}: ${searchResponse.statusText}`);
    }
    
    // Get response text first for debug purposes
    const responseText = await searchResponse.text();
    console.log("Raw response text:", responseText);
    
    let searchResult;
    try {
      searchResult = JSON.parse(responseText);
    } catch (err) {
      console.error("Error parsing response JSON:", err);
      throw new Error("Failed to parse response from Pollinations API");
    }
    
    console.log("Search result structure:", Object.keys(searchResult));
    
    // Extract URLs from the search results
    let urls = [];
    
    // Check for urls directly in the response
    if (searchResult.urls && Array.isArray(searchResult.urls)) {
      console.log("Found urls array in root of response");
      urls = searchResult.urls.map(item => {
        if (typeof item === 'string') {
          // Handle case where url is just a string
          return {
            title: item,
            url: item
          };
        } else {
          // Handle case where url is an object with title, url, etc.
          return {
            title: item.title || 'No title',
            url: item.url || item,
            snippet: item.snippet
          };
        }
      });
    } else {
      // This is a fallback for nested structures
      // Find the first key that contains an array (should be the search results)
      const resultsKey = Object.keys(searchResult).find(key => 
        Array.isArray(searchResult[key]) && 
        searchResult[key].length > 0
      );
      
      if (resultsKey && searchResult[resultsKey]) {
        urls = searchResult[resultsKey].map(item => {
          if (typeof item === 'string') {
            return {
              title: item,
              url: item
            };
          } else {
            return {
              title: item.title || 'No title',
              url: item.url || item,
              snippet: item.snippet
            };
          }
        });
      }
    }
    
    console.log(`Found ${urls.length} URLs in search results:`, urls);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        urls,
        rawContent: JSON.stringify(searchResult)
      }),
      { headers }
    );
  } catch (error) {
    console.error('Pollinations searchgpt error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message
      }),
      { status: 500, headers }
    );
  }
} 