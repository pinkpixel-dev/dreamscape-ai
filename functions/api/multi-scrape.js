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
    const { url: targetUrl, renderJs } = body;

    // Validate URL
    if (!targetUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers }
      );
    }

    console.log(`Multi-service scraping: ${targetUrl}`);

    // Try each scraping service in sequence until one succeeds
    const services = [
      { name: 'phantomjs', path: '/api/phantom-scrape' },
      { name: 'scraperapi', path: '/api/scraperapi' },
      { name: 'scrapingant', path: '/api/scrapingant' },
      { name: 'firecrawl', path: '/api/firecrawl' }
    ];

    let lastError = null;
    let serviceResults = [];

    // Try each service
    for (const service of services) {
      try {
        console.log(`Trying ${service.name} service...`);
        
        // Make a request to the appropriate service endpoint
        let serviceUrl;
        if (context.request.url.includes('localhost') || context.request.url.includes('127.0.0.1')) {
          // Local development
          serviceUrl = `http://${context.request.headers.get('host')}${service.path}`;
        } else {
          // Production environment
          const url = new URL(context.request.url);
          serviceUrl = `${url.protocol}//${url.host}${service.path}`;
        }
        
        console.log(`Calling service at: ${serviceUrl}`);
        const serviceResponse = await fetch(serviceUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: targetUrl,
            renderJs: renderJs
          })
        });
        
        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json();
          
          if (serviceData.success && serviceData.content) {
            console.log(`${service.name} service succeeded with ${serviceData.content.length} chars of content`);
            
            // If the service succeeded, return its response
            return new Response(
              JSON.stringify({
                success: true,
                content: serviceData.content,
                service: service.name,
                allResults: serviceResults
              }),
              { headers }
            );
          } else {
            // Service call was successful but content extraction failed
            serviceResults.push({
              service: service.name,
              success: false,
              error: serviceData.error || 'No content returned'
            });
            console.log(`${service.name} service failed: ${serviceData.error || 'No content returned'}`);
          }
        } else {
          // Service call failed
          const errorText = await serviceResponse.text();
          serviceResults.push({
            service: service.name,
            success: false,
            error: `${serviceResponse.status} ${serviceResponse.statusText}: ${errorText}`
          });
          console.log(`${service.name} service failed with status ${serviceResponse.status}: ${errorText}`);
        }
      } catch (serviceError) {
        // Error occurred while calling the service
        serviceResults.push({
          service: service.name,
          success: false,
          error: serviceError.message
        });
        lastError = serviceError;
        console.error(`Error calling ${service.name} service:`, serviceError);
      }
    }

    // If we got here, all services failed
    console.error('All scraping services failed');
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'All scraping services failed',
        lastError: lastError?.message,
        serviceResults: serviceResults
      }),
      { status: 500, headers }
    );
  } catch (error) {
    console.error('Multi-service scraping error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error during multi-service scraping' 
      }),
      { status: 500, headers }
    );
  }
} 