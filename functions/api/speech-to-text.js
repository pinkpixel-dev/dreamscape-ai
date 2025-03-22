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
        status: 500,
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
    watsonUrlWithParams.searchParams.append('model', 'en-AU_BroadbandModel');
    watsonUrlWithParams.searchParams.append('smart_formatting', 'true');
    
    console.log("Sending request to Watson API:", watsonUrlWithParams.toString());
    
    try {
      // Forward request to Watson
      const watsonResponse = await fetch(watsonUrlWithParams.toString(), {
        method: 'POST',
        headers: watsonHeaders,
        body: audioData
      });
      
      // Get Watson's response
      if (!watsonResponse.ok) {
        const errorText = await watsonResponse.text();
        console.log("Watson API error:", watsonResponse.status, errorText);
        
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
          details: errorText
        }), {
          status: 200, // Return 200 status but with error flag in response body
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Return the transcription results
      const transcriptionResult = await watsonResponse.json();
      console.log("Watson API success, returning results");
      return new Response(JSON.stringify({
        success: true,
        results: transcriptionResult
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