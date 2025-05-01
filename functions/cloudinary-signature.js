// Cloudinary signature generation endpoint
export async function onRequest(context) {
  try {
    // Get the Cloudinary API secret from environment variables
    const apiSecret = context.env.CLOUDINARY_API_SECRET;
    
    // Get the parameters to sign from the request
    const request = await context.request.json();
    const paramsToSign = request.params_to_sign || {};
    
    // Create a string to sign from the parameters
    const params = Object.entries(paramsToSign)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    // Generate the signature using the API secret
    const signature = await generateSHA1(params + apiSecret);
    
    // Return the signature
    return new Response(JSON.stringify({ signature }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate signature' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Function to generate SHA1 hash
async function generateSHA1(message) {
  // Encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  
  // Hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  
  // Convert to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
