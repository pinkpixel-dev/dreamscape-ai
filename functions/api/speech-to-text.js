// functions/api/speech-to-text.js
export async function onRequestPost(context) {
  try {
    console.log("Speech-to-text API endpoint called with POST method");
    
    // Get the Watson credentials from environment variables
    const watsonApiKey = context.env.WATSON_API_KEY;
    const watsonUrl = 'https://api.au-syd.speech-to-text.watson.cloud.ibm.com/v1/recognize';
    
    console.log("Watson API Key available:", !!watsonApiKey);
    console.log("Environment variables available:", Object.keys(context.env).join(", "));
    
    if (!watsonApiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing Watson API Key in environment variables",
        availableVars: Object.keys(context.env).length
      }), {
        status: 200, // Return 200 to avoid CORS issues
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Get the audio data from the request
    const contentType = context.request.headers.get('Content-Type');
    const audioData = await context.request.arrayBuffer();
    
    console.log("Received audio data of size:", audioData.byteLength, "bytes");
    console.log("Content-Type:", contentType);
    
    // Only reject extremely small audio data (just enough to verify it's not empty)
    if (audioData.byteLength < 100) {
      console.log("Audio data too small, likely empty or corrupt");
      return new Response(JSON.stringify({
        success: true,
        results: { results: [] } // Return empty results rather than error
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Create headers for Watson API
    const watsonHeaders = new Headers();
    // Watson is very picky about the exact content-type format (spaces after semicolons, no endian parameter)
    watsonHeaders.append('Content-Type', 'audio/l16; rate=16000; channels=1');
    watsonHeaders.append('Authorization', `Basic ${btoa('apikey:' + watsonApiKey)}`);
    watsonHeaders.append('Accept', 'application/json');
    
    // Add Watson-specific parameters
    const watsonUrlWithParams = new URL(watsonUrl);
    watsonUrlWithParams.searchParams.append('model', 'en-AU_BroadbandModel'); // Changed back to AU model for key compatibility
    watsonUrlWithParams.searchParams.append('smart_formatting', 'true');
    watsonUrlWithParams.searchParams.append('word_confidence', 'true');
    watsonUrlWithParams.searchParams.append('inactivity_timeout', '5'); // Lower inactivity timeout (default is 30)
    watsonUrlWithParams.searchParams.append('max_alternatives', '3'); // Get more alternatives
    
    console.log("Sending request to Watson API:", watsonUrlWithParams.toString());
    console.log("Watson model: en-AU_BroadbandModel, settings: inactivity_timeout=5, max_alternatives=3");
    
    try {
      // Forward request to Watson
      const watsonResponse = await fetch(watsonUrlWithParams.toString(), {
        method: 'POST',
        headers: watsonHeaders,
        body: audioData
      });
      
      // Get Watson's response
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
        
        // Handle 400 errors specially (usually bad audio format or silent audio)
        if (watsonResponse.status === 400) {
          return new Response(JSON.stringify({
            success: true,
            results: { results: [] } // Return empty results rather than error
          }), {
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
        
        return new Response(JSON.stringify({
          success: false,
          error: `Watson API error: ${watsonResponse.status}`,
          details: responseText
        }), {
          status: 200, // Return 200 status but with error flag in response body
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Return the transcription results
      console.log("Watson API success, returning results");
      
      // Check if we have any results
      const hasResults = parsedResponse && 
                        parsedResponse.results && 
                        parsedResponse.results.length > 0 && 
                        parsedResponse.results[0].alternatives && 
                        parsedResponse.results[0].alternatives.length > 0;
      
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
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (fetchError) {
      console.error("Fetch error when calling Watson API:", fetchError);
      return new Response(JSON.stringify({
        success: false,
        error: "Error connecting to Watson API",
        details: fetchError.message
      }), {
        status: 200, // Return 200 instead of 500 to avoid triggering CORS issues
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
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
      status: 200, // Return 200 instead of 500 to avoid triggering CORS issues
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Add CORS preflight handler
export async function onRequestOptions() {
  console.log("Speech-to-text API endpoint called with OPTIONS method");
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
} 