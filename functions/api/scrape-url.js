// functions/api/scrape-url.js
// Unified endpoint for web scraping using various services

export async function onRequestPost(context) {
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
    // Parse request body
    const body = await context.request.json();
    const { url } = body;

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers }
      );
    }

    console.log(`Scraping URL: ${url}`);

    // First try PhantomJS scraping
    try {
      const phantomScrapeUrl = new URL(context.request.url);
      phantomScrapeUrl.pathname = '/api/phantom-scrape';
      
      const phantomResponse = await fetch(phantomScrapeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (phantomResponse.ok) {
        const phantomData = await phantomResponse.json();
        
        if (phantomData.success && phantomData.content) {
          console.log(`Successfully scraped ${url} with PhantomJS`);
          return new Response(
            JSON.stringify({ 
              success: true, 
              content: phantomData.content,
              title: phantomData.title || url,
              source: 'phantomjs'
            }),
            { headers }
          );
        }
      }
    } catch (phantomError) {
      console.error(`PhantomJS scraping failed for ${url}: ${phantomError.message}`);
    }

    // Try multi-scrape as fallback
    try {
      const multiScrapeUrl = new URL(context.request.url);
      multiScrapeUrl.pathname = '/api/multi-scrape';
      
      const multiResponse = await fetch(multiScrapeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (multiResponse.ok) {
        const multiData = await multiResponse.json();
        
        if (multiData.success && multiData.content) {
          console.log(`Successfully scraped ${url} with multi-scrape`);
          return new Response(
            JSON.stringify({ 
              success: true, 
              content: multiData.content,
              title: multiData.title || url,
              source: multiData.source || 'multi-scrape'
            }),
            { headers }
          );
        }
      }
    } catch (multiError) {
      console.error(`Multi-scrape failed for ${url}: ${multiError.message}`);
    }

    // Try individual services as fallbacks
    const services = [
      { name: 'scraperapi', path: '/api/scraperapi' },
      { name: 'scrapingant', path: '/api/scrapingant' },
      { name: 'firecrawl', path: '/api/firecrawl' }
    ];

    for (const service of services) {
      try {
        const serviceUrl = new URL(context.request.url);
        serviceUrl.pathname = service.path;
        
        const serviceResponse = await fetch(serviceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        
        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json();
          
          if (serviceData.success && serviceData.content) {
            console.log(`Successfully scraped ${url} with ${service.name}`);
            return new Response(
              JSON.stringify({ 
                success: true, 
                content: serviceData.content,
                title: serviceData.title || url,
                source: service.name
              }),
              { headers }
            );
          }
        }
      } catch (serviceError) {
        console.error(`${service.name} scraping failed for ${url}: ${serviceError.message}`);
      }
    }

    // If all services fail, generate a synthetic response
    console.log(`All scraping services failed for ${url}, generating synthetic content`);
    
    // Use Pollinations API to generate synthetic content
    try {
      const pollinationsUrl = new URL(context.request.url);
      pollinationsUrl.pathname = '/api/pollinations-text';
      
      const pollinationsResponse = await fetch(pollinationsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          prompt: `Generate plausible, detailed content about what might be found at the URL: ${url}`,
          system: "You are a web content generator. Create plausible, structured content (in markdown format) that might be found at the given URL. Base your generation on the URL structure, domain name, and any context clues. Include headings, lists, and other formatting as appropriate.",
          max_tokens: 1000
        })
      });
      
      const pollinationsData = await pollinationsResponse.json();
      
      if (pollinationsData.success && pollinationsData.text) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            content: pollinationsData.text,
            title: `Generated content for ${url}`,
            source: 'synthetic',
            synthetic: true
          }),
          { headers }
        );
      }
    } catch (pollinationsError) {
      console.error(`Failed to generate synthetic content: ${pollinationsError.message}`);
    }

    // If even synthetic generation fails
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'All scraping services failed',
        url
      }),
      { status: 500, headers }
    );

  } catch (error) {
    console.error(`Error scraping URL: ${error}`);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers }
    );
  }
} 