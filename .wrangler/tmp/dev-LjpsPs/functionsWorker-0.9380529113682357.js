var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-UETRbs/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/pages-jGo0im/functionsWorker-0.9380529113682357.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var urls2 = /* @__PURE__ */ new Set();
function checkURL2(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls2.has(url.toString())) {
      urls2.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL2, "checkURL");
__name2(checkURL2, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL2(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});
async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const imageFile = formData.get("image");
    const transformationsString = formData.get("transformations") || "{}";
    let transformations;
    try {
      transformations = JSON.parse(transformationsString);
    } catch (e) {
      transformations = {};
    }
    const cloudName = context.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = context.env.CLOUDINARY_API_KEY;
    const apiSecret = context.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing Cloudinary credentials"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const base64Image = btoa(String.fromCharCode.apply(null, buffer));
    const dataURI = `data:${imageFile.type};base64,${base64Image}`;
    const timestamp = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3);
    const signature = await generateSignature(`timestamp=${timestamp}${apiSecret}`);
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", dataURI);
    cloudinaryFormData.append("api_key", apiKey);
    cloudinaryFormData.append("timestamp", timestamp);
    cloudinaryFormData.append("signature", signature);
    cloudinaryFormData.append("folder", "dreamscape-ai-enhanced");
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudinaryFormData
    });
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to upload to Cloudinary",
        details: errorData
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const uploadResult = await uploadResponse.json();
    const transformationParts = [];
    Object.entries(transformations).forEach(([key, value]) => {
      if (value === true) {
        transformationParts.push(key);
      } else {
        transformationParts.push(`${key}:${value}`);
      }
    });
    if (transformationParts.length === 0) {
      transformationParts.push("c_fill,w_768,h_768");
      transformationParts.push("q_auto,f_auto");
    } else {
      transformationParts.push("q_auto,f_auto");
    }
    const transformationString = transformationParts.join("/");
    const enhancedImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${uploadResult.public_id}`;
    return new Response(JSON.stringify({
      success: true,
      original: uploadResult.secure_url,
      enhanced: enhancedImageUrl,
      public_id: uploadResult.public_id
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(onRequestPost, "onRequestPost");
__name2(onRequestPost, "onRequestPost");
async function generateSignature(string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
__name(generateSignature, "generateSignature");
__name2(generateSignature, "generateSignature");
async function onRequestPost2(context) {
  try {
    console.log("Pollinations Text API endpoint called with POST method");
    const requestBody = await context.request.json();
    const { model, prompt, system, context: contextText, max_tokens } = requestBody;
    if (!prompt) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing 'prompt' parameter in request body"
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    console.log("Using model for text generation:", model || "openai");
    let responseText;
    let responseIsJson = false;
    if (model === "searchgpt") {
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 1e3);
      const searchUrl = `https://text.pollinations.ai/${encodedPrompt}?model=searchgpt&seed=${seed}&json=true`;
      console.log("Using GET endpoint for searchgpt:", searchUrl);
      const pollinationsResponse = await fetch(searchUrl);
      if (!pollinationsResponse.ok) {
        throw new Error(`Pollinations API returned ${pollinationsResponse.status}: ${pollinationsResponse.statusText}`);
      }
      responseText = await pollinationsResponse.text();
      responseIsJson = true;
    } else {
      const encodedPrompt = encodeURIComponent(prompt);
      let apiUrl = `https://text.pollinations.ai/${encodedPrompt}?model=${model || "openai"}`;
      if (system) {
        const encodedSystem = encodeURIComponent(system);
        apiUrl += `&system=${encodedSystem}`;
      }
      if (max_tokens) {
        apiUrl += `&max_tokens=${max_tokens}`;
      }
      console.log("Using GET endpoint for text generation:", apiUrl);
      const pollinationsResponse = await fetch(apiUrl);
      if (!pollinationsResponse.ok) {
        throw new Error(`Pollinations API returned ${pollinationsResponse.status}: ${pollinationsResponse.statusText}`);
      }
      const contentType = pollinationsResponse.headers.get("content-type") || "";
      responseIsJson = contentType.includes("application/json");
      responseText = await pollinationsResponse.text();
    }
    console.log("Pollinations API response received successfully");
    console.log("Response is JSON:", responseIsJson);
    let resultData = {
      success: true,
      model: model || "openai"
    };
    if (responseIsJson) {
      try {
        const jsonData = JSON.parse(responseText);
        if (jsonData.text) {
          resultData.text = jsonData.text;
        } else if (jsonData.content) {
          resultData.text = jsonData.content;
        } else if (jsonData.choices && jsonData.choices[0] && jsonData.choices[0].message) {
          resultData.text = jsonData.choices[0].message.content;
        } else {
          resultData.text = JSON.stringify(jsonData);
        }
        resultData.raw = jsonData;
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        resultData.text = responseText;
        resultData.parseError = parseError.message;
      }
    } else {
      resultData.text = responseText;
    }
    return new Response(JSON.stringify(resultData), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Error in Pollinations Text API endpoint:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Unknown error occurred"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(onRequestPost2, "onRequestPost2");
__name2(onRequestPost2, "onRequestPost");
async function onRequestPost3(context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  try {
    const body = await context.request.json();
    const { url } = body;
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers }
      );
    }
    console.log(`Scraping URL: ${url}`);
    try {
      const phantomScrapeUrl = new URL(context.request.url);
      phantomScrapeUrl.pathname = "/api/phantom-scrape";
      const phantomResponse = await fetch(phantomScrapeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
              source: "phantomjs"
            }),
            { headers }
          );
        }
      }
    } catch (phantomError) {
      console.error(`PhantomJS scraping failed for ${url}: ${phantomError.message}`);
    }
    try {
      const multiScrapeUrl = new URL(context.request.url);
      multiScrapeUrl.pathname = "/api/multi-scrape";
      const multiResponse = await fetch(multiScrapeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
              source: multiData.source || "multi-scrape"
            }),
            { headers }
          );
        }
      }
    } catch (multiError) {
      console.error(`Multi-scrape failed for ${url}: ${multiError.message}`);
    }
    const services = [
      { name: "scraperapi", path: "/api/scraperapi" },
      { name: "scrapingant", path: "/api/scrapingant" },
      { name: "firecrawl", path: "/api/firecrawl" }
    ];
    for (const service of services) {
      try {
        const serviceUrl = new URL(context.request.url);
        serviceUrl.pathname = service.path;
        const serviceResponse = await fetch(serviceUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    console.log(`All scraping services failed for ${url}, generating synthetic content`);
    try {
      const pollinationsUrl = new URL(context.request.url);
      pollinationsUrl.pathname = "/api/pollinations-text";
      const pollinationsResponse = await fetch(pollinationsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          prompt: `Generate plausible, detailed content about what might be found at the URL: ${url}`,
          system: "You are a web content generator. Create plausible, structured content (in markdown format) that might be found at the given URL. Base your generation on the URL structure, domain name, and any context clues. Include headings, lists, and other formatting as appropriate.",
          max_tokens: 1e3
        })
      });
      const pollinationsData = await pollinationsResponse.json();
      if (pollinationsData.success && pollinationsData.text) {
        return new Response(
          JSON.stringify({
            success: true,
            content: pollinationsData.text,
            title: `Generated content for ${url}`,
            source: "synthetic",
            synthetic: true
          }),
          { headers }
        );
      }
    } catch (pollinationsError) {
      console.error(`Failed to generate synthetic content: ${pollinationsError.message}`);
    }
    return new Response(
      JSON.stringify({
        success: false,
        error: "All scraping services failed",
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
__name(onRequestPost3, "onRequestPost3");
__name2(onRequestPost3, "onRequestPost");
async function onRequestPost4(context) {
  try {
    console.log("Speech-to-text API endpoint called with POST method");
    const watsonApiKey = context.env.WATSON_API_KEY;
    const watsonUrl = "https://api.au-syd.speech-to-text.watson.cloud.ibm.com/v1/recognize";
    console.log("Watson API Key available:", !!watsonApiKey);
    console.log("Environment variables available:", Object.keys(context.env).join(", "));
    if (!watsonApiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing Watson API Key in environment variables",
        availableVars: Object.keys(context.env).length
      }), {
        status: 200,
        // Return 200 to avoid CORS issues
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const contentType = context.request.headers.get("Content-Type");
    const audioData = await context.request.arrayBuffer();
    console.log("Received audio data of size:", audioData.byteLength, "bytes");
    console.log("Content-Type:", contentType);
    if (audioData.byteLength < 100) {
      console.log("Audio data too small, likely empty or corrupt");
      return new Response(JSON.stringify({
        success: true,
        results: { results: [] }
        // Return empty results rather than error
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    const watsonHeaders = new Headers();
    watsonHeaders.append("Content-Type", "audio/l16; rate=16000; channels=1");
    watsonHeaders.append("Authorization", `Basic ${btoa("apikey:" + watsonApiKey)}`);
    watsonHeaders.append("Accept", "application/json");
    const watsonUrlWithParams = new URL(watsonUrl);
    watsonUrlWithParams.searchParams.append("model", "en-AU_BroadbandModel");
    watsonUrlWithParams.searchParams.append("smart_formatting", "true");
    watsonUrlWithParams.searchParams.append("word_confidence", "true");
    watsonUrlWithParams.searchParams.append("inactivity_timeout", "5");
    watsonUrlWithParams.searchParams.append("max_alternatives", "3");
    console.log("Sending request to Watson API:", watsonUrlWithParams.toString());
    console.log("Watson model: en-AU_BroadbandModel, settings: inactivity_timeout=5, max_alternatives=3");
    try {
      const watsonResponse = await fetch(watsonUrlWithParams.toString(), {
        method: "POST",
        headers: watsonHeaders,
        body: audioData
      });
      const responseText = await watsonResponse.text();
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
        console.log("Watson raw response:", JSON.stringify(parsedResponse).substring(0, 200) + "...");
      } catch (parseError) {
        console.log("Failed to parse Watson response:", responseText.substring(0, 200));
        parsedResponse = { results: [] };
      }
      if (!watsonResponse.ok) {
        console.log("Watson API error:", watsonResponse.status, responseText);
        if (watsonResponse.status === 400) {
          return new Response(JSON.stringify({
            success: true,
            results: { results: [] }
            // Return empty results rather than error
          }), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          });
        }
        return new Response(JSON.stringify({
          success: false,
          error: `Watson API error: ${watsonResponse.status}`,
          details: responseText
        }), {
          status: 200,
          // Return 200 status but with error flag in response body
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      console.log("Watson API success, returning results");
      const hasResults = parsedResponse && parsedResponse.results && parsedResponse.results.length > 0 && parsedResponse.results[0].alternatives && parsedResponse.results[0].alternatives.length > 0;
      if (hasResults) {
        console.log("Detected transcript:", parsedResponse.results[0].alternatives[0].transcript);
      } else {
        console.log("No speech detected in audio");
      }
      return new Response(JSON.stringify({
        success: true,
        results: parsedResponse
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (fetchError) {
      console.error("Fetch error when calling Watson API:", fetchError);
      return new Response(JSON.stringify({
        success: false,
        error: "Error connecting to Watson API",
        details: fetchError.message
      }), {
        status: 200,
        // Return 200 instead of 500 to avoid triggering CORS issues
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  } catch (error) {
    console.error("Error in speech-to-text function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      status: 200,
      // Return 200 instead of 500 to avoid triggering CORS issues
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
__name(onRequestPost4, "onRequestPost4");
__name2(onRequestPost4, "onRequestPost");
async function onRequestOptions() {
  console.log("Speech-to-text API endpoint called with OPTIONS method");
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400"
    }
  });
}
__name(onRequestOptions, "onRequestOptions");
__name2(onRequestOptions, "onRequestOptions");
async function onRequest(context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  try {
    if (context.request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        { status: 405, headers }
      );
    }
    const body = await context.request.json();
    const { url, renderJs } = body;
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers }
      );
    }
    console.log(`FireCrawl scraping: ${url}`);
    const apiKey = context.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "FireCrawl API key not configured" }),
        { status: 500, headers }
      );
    }
    console.log(`Calling FireCrawl API for ${url}`);
    const response = await fetch("https://api.firecrawl.dev/v1/crawl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url,
        javascript: renderJs === true,
        markdown: true,
        // Get markdown formatted content
        elements: true,
        // Get page elements
        wait_for: 2e3
        // Wait for 2 seconds for JavaScript to execute
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
    const data = await response.json();
    if (!data.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: data.error || "FireCrawl crawling failed"
        }),
        { status: 400, headers }
      );
    }
    const content = data.data?.markdown || data.data?.text || data.data?.html || "";
    return new Response(
      JSON.stringify({
        success: true,
        content,
        title: data.data?.title || "",
        service: "firecrawl",
        raw: JSON.stringify(data).substring(0, 500)
        // Include first 500 chars of raw response for debugging
      }),
      { headers }
    );
  } catch (error) {
    console.error("FireCrawl scraping error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error during FireCrawl scraping"
      }),
      { status: 500, headers }
    );
  }
}
__name(onRequest, "onRequest");
__name2(onRequest, "onRequest");
async function onRequest2(context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  try {
    if (context.request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        { status: 405, headers }
      );
    }
    const body = await context.request.json();
    const { url: targetUrl, renderJs } = body;
    if (!targetUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers }
      );
    }
    console.log(`Multi-service scraping: ${targetUrl}`);
    const services = [
      { name: "phantomjs", path: "/api/phantom-scrape" },
      { name: "scraperapi", path: "/api/scraperapi" },
      { name: "scrapingant", path: "/api/scrapingant" },
      { name: "firecrawl", path: "/api/firecrawl" }
    ];
    let lastError = null;
    let serviceResults = [];
    for (const service of services) {
      try {
        console.log(`Trying ${service.name} service...`);
        let serviceUrl;
        if (context.request.url.includes("localhost") || context.request.url.includes("127.0.0.1")) {
          serviceUrl = `http://${context.request.headers.get("host")}${service.path}`;
        } else {
          const url = new URL(context.request.url);
          serviceUrl = `${url.protocol}//${url.host}${service.path}`;
        }
        console.log(`Calling service at: ${serviceUrl}`);
        const serviceResponse = await fetch(serviceUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            url: targetUrl,
            renderJs
          })
        });
        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json();
          if (serviceData.success && serviceData.content) {
            console.log(`${service.name} service succeeded with ${serviceData.content.length} chars of content`);
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
            serviceResults.push({
              service: service.name,
              success: false,
              error: serviceData.error || "No content returned"
            });
            console.log(`${service.name} service failed: ${serviceData.error || "No content returned"}`);
          }
        } else {
          const errorText = await serviceResponse.text();
          serviceResults.push({
            service: service.name,
            success: false,
            error: `${serviceResponse.status} ${serviceResponse.statusText}: ${errorText}`
          });
          console.log(`${service.name} service failed with status ${serviceResponse.status}: ${errorText}`);
        }
      } catch (serviceError) {
        serviceResults.push({
          service: service.name,
          success: false,
          error: serviceError.message
        });
        lastError = serviceError;
        console.error(`Error calling ${service.name} service:`, serviceError);
      }
    }
    console.error("All scraping services failed");
    return new Response(
      JSON.stringify({
        success: false,
        error: "All scraping services failed",
        lastError: lastError?.message,
        serviceResults
      }),
      { status: 500, headers }
    );
  } catch (error) {
    console.error("Multi-service scraping error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error during multi-service scraping"
      }),
      { status: 500, headers }
    );
  }
}
__name(onRequest2, "onRequest2");
__name2(onRequest2, "onRequest");
async function onRequest3(context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  try {
    if (context.request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        { status: 405, headers }
      );
    }
    const body = await context.request.json();
    const { url, renderJs } = body;
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers }
      );
    }
    console.log(`PhantomJS Cloud scraping: ${url}`);
    const apiKey = context.env.PHANTOMJSCLOUD_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "PhantomJS Cloud API key not configured" }),
        { status: 500, headers }
      );
    }
    const apiUrl = `https://phantomjscloud.com/api/browser/v2/${apiKey}/`;
    console.log(`Calling PhantomJS Cloud API: ${apiUrl}`);
    console.log(`URL to scrape: ${url}`);
    try {
      const requestData = {
        url,
        renderType: renderJs ? "html" : "plainText",
        outputAsJson: true,
        requestSettings: {
          maxWait: 3e4,
          waitInterval: 1e3,
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
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          request: requestData
          // This is key - the v2 API expects a 'request' parameter
        })
      });
      console.log(`PhantomJS Cloud API response status: ${response.status}`);
      if (!response.ok) {
        console.error(`PhantomJS API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text().catch((e) => "Could not read error response");
        console.error(`Error details: ${errorText}`);
        console.log("Trying fallback with GET request...");
        const fallbackUrl = `${apiUrl}?url=${encodeURIComponent(url)}&renderType=${renderJs ? "html" : "plainText"}`;
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
      console.error("PhantomJS Cloud API error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || "Unknown error during PhantomJS scraping"
        }),
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error("PhantomJS Cloud scraping error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error during PhantomJS scraping"
      }),
      { status: 500, headers }
    );
  }
}
__name(onRequest3, "onRequest3");
__name2(onRequest3, "onRequest");
async function handlePhantomJsResponse(response, renderJs, headers) {
  const contentType = response.headers.get("content-type");
  let data;
  let content = "";
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
    if (data && data.content) {
      content = data.content;
    } else if (data && data.pageContent) {
      content = data.pageContent;
    } else {
      content = JSON.stringify(data);
    }
  } else {
    content = await response.text();
  }
  let processedContent = content;
  if (renderJs && (content.includes("<html") || content.includes("<body"))) {
    processedContent = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, "").replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "").replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "");
    const mainMatch = processedContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || processedContent.match(/<article[^>]*>([\s\S]*?)<\/article>/i) || processedContent.match(/<div[^>]*id=["']?content["']?[^>]*>([\s\S]*?)<\/div>/i) || processedContent.match(/<div[^>]*class=["']?content["']?[^>]*>([\s\S]*?)<\/div>/i);
    if (mainMatch && mainMatch[1]) {
      processedContent = mainMatch[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    } else {
      processedContent = processedContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }
  }
  return new Response(
    JSON.stringify({
      success: true,
      content: processedContent,
      service: "phantomjs",
      raw: typeof content === "string" ? content.substring(0, 500) + (content.length > 500 ? "..." : "") : JSON.stringify(data || {}).substring(0, 500)
    }),
    { headers }
  );
}
__name(handlePhantomJsResponse, "handlePhantomJsResponse");
__name2(handlePhantomJsResponse, "handlePhantomJsResponse");
async function onRequest4(context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  try {
    if (context.request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        { status: 405, headers }
      );
    }
    const body = await context.request.json();
    const { query } = body;
    if (!query) {
      return new Response(
        JSON.stringify({ success: false, error: "Search query is required" }),
        { status: 400, headers }
      );
    }
    console.log(`Pollinations searchgpt query: ${query}`);
    const enhancedQuery = query.toLowerCase().startsWith("research") ? query : `research ${query}`;
    const encodedQuery = encodeURIComponent(enhancedQuery);
    const seed = 924;
    const searchUrl = `https://text.pollinations.ai/${encodedQuery}?model=searchgpt&seed=${seed}&json=true`;
    console.log(`Calling Pollinations API: ${searchUrl}`);
    const searchResponse = await fetch(searchUrl, {
      headers: {
        "Accept": "application/json"
      }
    });
    if (!searchResponse.ok) {
      throw new Error(`Pollinations searchgpt API returned ${searchResponse.status}: ${searchResponse.statusText}`);
    }
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
    let urls22 = [];
    if (searchResult.urls && Array.isArray(searchResult.urls)) {
      console.log("Found urls array in root of response");
      urls22 = searchResult.urls.map((item) => {
        if (typeof item === "string") {
          return {
            title: item,
            url: item
          };
        } else {
          return {
            title: item.title || "No title",
            url: item.url || item,
            snippet: item.snippet
          };
        }
      });
    } else {
      const resultsKey = Object.keys(searchResult).find(
        (key) => Array.isArray(searchResult[key]) && searchResult[key].length > 0
      );
      if (resultsKey && searchResult[resultsKey]) {
        urls22 = searchResult[resultsKey].map((item) => {
          if (typeof item === "string") {
            return {
              title: item,
              url: item
            };
          } else {
            return {
              title: item.title || "No title",
              url: item.url || item,
              snippet: item.snippet
            };
          }
        });
      }
    }
    console.log(`Found ${urls22.length} URLs in search results:`, urls22);
    return new Response(
      JSON.stringify({
        success: true,
        urls: urls22,
        rawContent: JSON.stringify(searchResult)
      }),
      { headers }
    );
  } catch (error) {
    console.error("Pollinations searchgpt error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { status: 500, headers }
    );
  }
}
__name(onRequest4, "onRequest4");
__name2(onRequest4, "onRequest");
async function onRequest5(context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  try {
    if (context.request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        { status: 405, headers }
      );
    }
    const body = await context.request.json();
    const { url, renderJs } = body;
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers }
      );
    }
    console.log(`ScraperAPI scraping: ${url}`);
    const apiKey = context.env.SCRAPERAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "ScraperAPI key not configured" }),
        { status: 500, headers }
      );
    }
    const apiUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}${renderJs ? "&render=true" : ""}`;
    console.log(`Calling ScraperAPI: ${apiUrl}`);
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
    const content = await response.text();
    const cleanedHtml = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, "");
    let extractedContent = "";
    const articleMatch = cleanedHtml.match(/<article[^>]*>([\s\S]*?)<\/article>/i) || cleanedHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const contentDivMatch = cleanedHtml.match(/<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<div[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<div[^>]*class=["']container["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<div[^>]*class=["']main["'][^>]*>([\s\S]*?)<\/div>/i);
    const docMatch = cleanedHtml.match(/<div[^>]*class=["'][^"']*markdown[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<div[^>]*class=["'][^"']*docs?[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<div[^>]*class=["'][^"']*documentation[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    const githubMatch = cleanedHtml.match(/<div[^>]*class=["']readme[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<article[^>]*class=["']markdown-body[^"']*["'][^>]*>([\s\S]*?)<\/article>/i);
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
      const bodyMatch = cleanedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        let bodyContent = bodyMatch[1];
        bodyContent = bodyContent.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "").replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "").replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "").replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "").replace(/<div[^>]*class=["'][^"']*sidebar[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "").replace(/<div[^>]*class=["'][^"']*menu[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "").replace(/<div[^>]*class=["'][^"']*navigation[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "");
        extractedContent = bodyContent;
        console.log("Falling back to filtered body content");
      } else {
        extractedContent = cleanedHtml;
        console.log("Using entire page content as fallback");
      }
    }
    extractedContent = extractedContent.replace(/<img[^>]*>/gi, "[IMAGE]").replace(/<form[^>]*>[\s\S]*?<\/form>/gi, "").replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "").replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "");
    const textContent = extractedContent.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n").replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n").replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n").replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "#### $1\n\n").replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "##### $1\n\n").replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "###### $1\n\n").replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\u2022 $1\n").replace(/<a[^>]*href=["']([\s\S]*?)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)").replace(/<[^>]*>/g, "").replace(/\n\s*\n/g, "\n\n").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim();
    const MIN_CONTENT_LENGTH = 100;
    const processedContent = textContent.length > MIN_CONTENT_LENGTH ? textContent : cleanedHtml;
    return new Response(
      JSON.stringify({
        success: true,
        content: processedContent,
        service: "scraperapi",
        raw: content.substring(0, 500) + (content.length > 500 ? "..." : "")
        // Include first 500 chars of raw response for debugging
      }),
      { headers }
    );
  } catch (error) {
    console.error("ScraperAPI scraping error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error during ScraperAPI scraping"
      }),
      { status: 500, headers }
    );
  }
}
__name(onRequest5, "onRequest5");
__name2(onRequest5, "onRequest");
async function onRequest6(context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  try {
    if (context.request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        { status: 405, headers }
      );
    }
    const body = await context.request.json();
    const { url, renderJs } = body;
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers }
      );
    }
    console.log(`ScrapingAnt scraping: ${url}`);
    const apiKey = context.env.SCRAPINGANT_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "ScrapingAnt API key not configured" }),
        { status: 500, headers }
      );
    }
    console.log(`Calling ScrapingAnt API for ${url}`);
    const response = await fetch(`https://api.scrapingant.com/v2/general?url=${encodeURIComponent(url)}&browser=${renderJs ? "true" : "false"}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ScrapingAnt API error (${response.status}): ${errorText}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: `ScrapingAnt API returned ${response.status} ${response.statusText}`
        }),
        { status: response.status, headers }
      );
    }
    const content = await response.text();
    const cleanedHtml = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, "");
    let extractedContent = "";
    const articleMatch = cleanedHtml.match(/<article[^>]*>([\s\S]*?)<\/article>/i) || cleanedHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const contentDivMatch = cleanedHtml.match(/<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<div[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<div[^>]*class=["']container["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<div[^>]*class=["']main["'][^>]*>([\s\S]*?)<\/div>/i);
    const docMatch = cleanedHtml.match(/<div[^>]*class=["'][^"']*markdown[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<div[^>]*class=["'][^"']*docs?[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<div[^>]*class=["'][^"']*documentation[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    const githubMatch = cleanedHtml.match(/<div[^>]*class=["']readme[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || cleanedHtml.match(/<article[^>]*class=["']markdown-body[^"']*["'][^>]*>([\s\S]*?)<\/article>/i);
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
      const bodyMatch = cleanedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        let bodyContent = bodyMatch[1];
        bodyContent = bodyContent.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "").replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "").replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "").replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "").replace(/<div[^>]*class=["'][^"']*sidebar[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "").replace(/<div[^>]*class=["'][^"']*menu[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "").replace(/<div[^>]*class=["'][^"']*navigation[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "");
        extractedContent = bodyContent;
        console.log("Falling back to filtered body content");
      } else {
        extractedContent = cleanedHtml;
        console.log("Using entire page content as fallback");
      }
    }
    extractedContent = extractedContent.replace(/<img[^>]*>/gi, "[IMAGE]").replace(/<form[^>]*>[\s\S]*?<\/form>/gi, "").replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "").replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "");
    const textContent = extractedContent.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n").replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n").replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n").replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "#### $1\n\n").replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "##### $1\n\n").replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "###### $1\n\n").replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\u2022 $1\n").replace(/<a[^>]*href=["']([\s\S]*?)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)").replace(/<[^>]*>/g, "").replace(/\n\s*\n/g, "\n\n").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim();
    const MIN_CONTENT_LENGTH = 100;
    const processedContent = textContent.length > MIN_CONTENT_LENGTH ? textContent : cleanedHtml;
    return new Response(
      JSON.stringify({
        success: true,
        content: processedContent,
        service: "scrapingant",
        raw: content.substring(0, 500) + (content.length > 500 ? "..." : "")
        // Include first 500 chars of raw response for debugging
      }),
      { headers }
    );
  } catch (error) {
    console.error("ScrapingAnt scraping error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error during ScrapingAnt scraping"
      }),
      { status: 500, headers }
    );
  }
}
__name(onRequest6, "onRequest6");
__name2(onRequest6, "onRequest");
async function onRequest7(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  return context.next();
}
__name(onRequest7, "onRequest7");
__name2(onRequest7, "onRequest");
var routes = [
  {
    routePath: "/api/enhance",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/pollinations-text",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/scrape-url",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/speech-to-text",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/speech-to-text",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/firecrawl",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/multi-scrape",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/phantom-scrape",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/api/pollinations-search",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/api/scraperapi",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/api/scrapingant",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "",
    middlewares: [onRequest7],
    modules: []
  }
];
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
__name2(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name2(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name2(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name2(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name2(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name2(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
__name2(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
__name2(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name2(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
__name2(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
__name2(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
__name2(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
__name2(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
__name2(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
__name2(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
__name2(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");
__name2(pathToRegexp, "pathToRegexp");
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
__name2(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name2(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name2(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name2((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
var drainBody = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
__name2(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name2(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
__name2(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
__name2(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");
__name2(__facade_invoke__, "__facade_invoke__");
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  static {
    __name(this, "___Facade_ScheduledController__");
  }
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name2(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name2(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name2(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
__name2(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name2((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name2((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
__name2(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;

// ../../../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default2 = drainBody2;

// ../../../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError2(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError2(e.cause)
  };
}
__name(reduceError2, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError2(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default2 = jsonError2;

// .wrangler/tmp/bundle-UETRbs/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__2 = [
  middleware_ensure_req_body_drained_default2,
  middleware_miniflare3_json_error_default2
];
var middleware_insertion_facade_default2 = middleware_loader_entry_default;

// ../../../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__2 = [];
function __facade_register__2(...args) {
  __facade_middleware__2.push(...args.flat());
}
__name(__facade_register__2, "__facade_register__");
function __facade_invokeChain__2(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__2(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__2, "__facade_invokeChain__");
function __facade_invoke__2(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__2(request, env, ctx, dispatch, [
    ...__facade_middleware__2,
    finalMiddleware
  ]);
}
__name(__facade_invoke__2, "__facade_invoke__");

// .wrangler/tmp/bundle-UETRbs/middleware-loader.entry.ts
var __Facade_ScheduledController__2 = class ___Facade_ScheduledController__2 {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__2)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler2(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__2(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__2(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler2, "wrapExportedHandler");
function wrapWorkerEntrypoint2(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__2 === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__2.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__2) {
    __facade_register__2(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__2(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__2(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint2, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY2;
if (typeof middleware_insertion_facade_default2 === "object") {
  WRAPPED_ENTRY2 = wrapExportedHandler2(middleware_insertion_facade_default2);
} else if (typeof middleware_insertion_facade_default2 === "function") {
  WRAPPED_ENTRY2 = wrapWorkerEntrypoint2(middleware_insertion_facade_default2);
}
var middleware_loader_entry_default2 = WRAPPED_ENTRY2;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__2 as __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default2 as default
};
//# sourceMappingURL=functionsWorker-0.9380529113682357.js.map
