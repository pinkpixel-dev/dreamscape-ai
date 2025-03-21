// functions/api/speech-to-text.js
export async function onRequestPost(context) {
  try {
    console.log("Speech-to-text API endpoint called with POST method");
    
    // Get the Watson credentials from environment variables
    const watsonApiKey = context.env.WATSON_API_KEY;
    const watsonUrl = 'https://api.au-syd.speech-to-text.watson.cloud.ibm.com/v1/recognize';
    
    console.log("Watson API Key available:", !!watsonApiKey);
    
    if (!watsonApiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing Watson API Key"
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
      return new Response(JSON.stringify({
        success: false,
        error: `Watson API error: ${watsonResponse.status}`,
        details: errorText
      }), {
        status: watsonResponse.status,
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
    
  } catch (error) {
    console.error("Error in speech-to-text function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
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