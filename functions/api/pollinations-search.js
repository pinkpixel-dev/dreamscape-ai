// functions/api/pollinations-search.js
export async function onRequest(context) {
  // CORS headers to allow requests from the frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    // Support both GET and POST methods
    let query;

    if (context.request.method === 'GET') {
      // Extract query from URL for GET requests
      const url = new URL(context.request.url);
      query = url.searchParams.get('query');
    } else if (context.request.method === 'POST') {
      // Get query from request body for POST requests
      const body = await context.request.json();
      query = body.query;
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed. Use GET or POST.' }),
        { status: 405, headers }
      );
    }

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
    // Make sure we're using the exact URL format that works in the browser
    const searchUrl = `https://text.pollinations.ai/${encodedQuery}?model=searchgpt&seed=${seed}&json=true`;

    // Log the exact URL for debugging
    console.log(`Using exact URL: ${searchUrl}`);
    console.log(`Calling Pollinations API: ${searchUrl}`);

    // Variable to store the search result
    let searchResult;

    try {
      const searchResponse = await fetch(searchUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        // Removed cache option as it's not supported in Cloudflare Workers
      });

      console.log(`Response status: ${searchResponse.status} ${searchResponse.statusText}`);
      console.log(`Response headers:`, Object.fromEntries([...searchResponse.headers.entries()]));

      if (!searchResponse.ok) {
        throw new Error(`Pollinations searchgpt API returned ${searchResponse.status}: ${searchResponse.statusText}`);
      }

      // Get response text first for debug purposes
      const responseText = await searchResponse.text();
      console.log("Raw response text length:", responseText.length);
      console.log("Raw response text preview:", responseText.substring(0, 200) + "...");

      try {
        searchResult = JSON.parse(responseText);
      } catch (err) {
        console.error("Error parsing response JSON:", err);
        throw new Error("Failed to parse response from Pollinations API");
      }
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);

      // Try direct browser-like GET request as fallback
      console.log("Trying fallback direct GET request...");

      // Create a direct GET request that mimics a browser
      const directResponse = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        // Removed cache option as it's not supported in Cloudflare Workers
      });

      if (!directResponse.ok) {
        throw new Error(`Fallback request failed: ${directResponse.status}: ${directResponse.statusText}`);
      }

      const responseText = await directResponse.text();
      console.log("Fallback response text length:", responseText.length);

      try {
        searchResult = JSON.parse(responseText);
      } catch (err) {
        console.error("Error parsing fallback response JSON:", err);
        throw new Error("Failed to parse response from fallback request");
      }
    }

    if (!searchResult) {
      throw new Error("Failed to obtain search results from Pollinations API");
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