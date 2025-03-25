// functions/api/pollinations-text.js
export async function onRequestPost(context) {
  try {
    console.log("Pollinations Text API endpoint called with POST method");
    
    // Parse the request body
    const requestBody = await context.request.json();
    const { model, prompt, system, context: contextText, max_tokens } = requestBody;
    
    if (!prompt) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing 'prompt' parameter in request body"
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    console.log("Using model for text generation:", model || "openai");
    
    // Determine if we should use POST or GET format based on model
    let responseText;
    let responseIsJson = false;
    
    if (model === 'searchgpt') {
      // For searchgpt, use GET endpoint format
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 1000);
      const searchUrl = `https://text.pollinations.ai/${encodedPrompt}?model=searchgpt&seed=${seed}&json=true`;
      
      console.log("Using GET endpoint for searchgpt:", searchUrl);
      
      const pollinationsResponse = await fetch(searchUrl);
      
      if (!pollinationsResponse.ok) {
        throw new Error(`Pollinations API returned ${pollinationsResponse.status}: ${pollinationsResponse.statusText}`);
      }
      
      // SearchGPT always returns JSON
      responseText = await pollinationsResponse.text();
      responseIsJson = true;
    } else {
      // For all other models, use the simpler GET approach which is more reliable
      const encodedPrompt = encodeURIComponent(prompt);
      let apiUrl = `https://text.pollinations.ai/${encodedPrompt}?model=${model || 'openai'}`;
      
      // Add system prompt as a parameter if provided
      if (system) {
        const encodedSystem = encodeURIComponent(system);
        apiUrl += `&system=${encodedSystem}`;
      }
      
      // Add max tokens if provided
      if (max_tokens) {
        apiUrl += `&max_tokens=${max_tokens}`;
      }
      
      console.log("Using GET endpoint for text generation:", apiUrl);
      
      const pollinationsResponse = await fetch(apiUrl);
      
      if (!pollinationsResponse.ok) {
        throw new Error(`Pollinations API returned ${pollinationsResponse.status}: ${pollinationsResponse.statusText}`);
      }
      
      // Check content type to determine if response is JSON or text
      const contentType = pollinationsResponse.headers.get('content-type') || '';
      responseIsJson = contentType.includes('application/json');
      
      // Get response as text
      responseText = await pollinationsResponse.text();
    }
    
    console.log("Pollinations API response received successfully");
    console.log("Response is JSON:", responseIsJson);
    
    // Construct our response based on whether we received JSON or plain text
    let resultData = {
      success: true,
      model: model || 'openai'
    };
    
    if (responseIsJson) {
      try {
        // Parse the JSON response
        const jsonData = JSON.parse(responseText);
        
        // Extract the text from the appropriate JSON structure
        if (jsonData.text) {
          resultData.text = jsonData.text;
        } else if (jsonData.content) {
          resultData.text = jsonData.content;
        } else if (jsonData.choices && jsonData.choices[0] && jsonData.choices[0].message) {
          resultData.text = jsonData.choices[0].message.content;
        } else {
          // If we can't find the expected text fields, include the whole response
          resultData.text = JSON.stringify(jsonData);
        }
        
        // Include the raw JSON for debugging
        resultData.raw = jsonData;
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        // If JSON parsing fails, just use the raw text
        resultData.text = responseText;
        resultData.parseError = parseError.message;
      }
    } else {
      // For plain text responses, just use the text directly
      resultData.text = responseText;
    }
    
    // Return our response
    return new Response(JSON.stringify(resultData), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
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
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
} 