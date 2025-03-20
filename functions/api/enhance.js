// functions/api/enhance.js
export async function onRequestPost(context) {
    try {
      // Parse the form data from the request
      const formData = await context.request.formData();
      const imageFile = formData.get('image');
      const transformationsString = formData.get('transformations') || '{}';
      let transformations;
      
      try {
        transformations = JSON.parse(transformationsString);
      } catch (e) {
        transformations = {};
      }
      
      // Access environment variables from Cloudflare Pages
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
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Convert image file to base64 for Cloudinary upload
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const base64Image = btoa(String.fromCharCode.apply(null, buffer));
      const dataURI = `data:${imageFile.type};base64,${base64Image}`;
      
      // Generate timestamp and signature for Cloudinary
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = await generateSignature(`timestamp=${timestamp}${apiSecret}`);
      
      // Create form for Cloudinary upload
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', dataURI);
      cloudinaryFormData.append('api_key', apiKey);
      cloudinaryFormData.append('timestamp', timestamp);
      cloudinaryFormData.append('signature', signature);
      cloudinaryFormData.append('folder', 'dreamscape-ai-enhanced');
      
      // Upload image to Cloudinary
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
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
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      const uploadResult = await uploadResponse.json();
      
      // Build transformation URL
      const transformationParts = [];
      
      // Process all transformations
      Object.entries(transformations).forEach(([key, value]) => {
        if (value === true) {
          transformationParts.push(key);
        } else {
          transformationParts.push(`${key}:${value}`);
        }
      });
      
      // Ensure we have basic sizing if nothing else
      if (transformationParts.length === 0) {
        transformationParts.push('c_fill,w_768,h_768');
        transformationParts.push('q_auto,f_auto');
      } else {
        // Add quality optimization to all transformations
        transformationParts.push('q_auto,f_auto');
      }
      
      // Build the final URL
      const transformationString = transformationParts.join('/');
      const enhancedImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${uploadResult.public_id}`;
      
      return new Response(JSON.stringify({
        success: true,
        original: uploadResult.secure_url,
        enhanced: enhancedImageUrl,
        public_id: uploadResult.public_id
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
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
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
  
  // Helper function to generate signature
  async function generateSignature(string) {
    // Convert string to an Uint8Array to digest
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    
    // Hash the data using SHA-1
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }