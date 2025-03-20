/**
 * Cloudinary API Integration for Dreamscape AI
 * This file handles the communication with Cloudinary's API for image transformations
 */

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
    cloudName: 'dwa9nkpyq',
    apiKey: '887549877845179',
    apiSecret: 'd37-Vl-1VpdhQficepHl9eY4kzo'
};

// Base URLs
const CLOUDINARY_TRANSFORMATION_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}`;
const CLOUDINARY_FETCH_URL = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/fetch`;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
const CLOUDINARY_DELIVERY_URL = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

/**
 * Generate a SHA-1 hash for Cloudinary signature (if needed)
 * @param {String} str - String to hash
 * @returns {Promise<String>} - Hashed string
 */
async function sha1(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Upload an image to Cloudinary and return the secure URL
 * @param {String|File} imageData - Data URL of the image or File object to upload
 * @param {Boolean} temporary - If true, mark the image for deletion after transformation
 * @returns {Promise<Object>} - Object containing the uploaded image details including URL and public_id
 */
async function uploadImageToCloudinary(imageData, temporary = false) {
    console.log("Uploading image to Cloudinary...");
    
    if (!imageData) {
        console.error("No image data provided for upload");
        throw new Error("No image data provided for upload");
    }
    
    // Prepare form data for upload
    const formData = new FormData();
    
    // Check if imageData is a string (data URL) or File object
    if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        // Convert data URL to Blob for upload
        const blob = await fetch(imageData).then(res => res.blob());
        formData.append('file', blob);
        console.log("Uploading from data URL, converted to blob");
    } else if (imageData instanceof File || imageData instanceof Blob) {
        // Use the File or Blob object directly
        formData.append('file', imageData);
        console.log("Uploading file directly:", imageData.type, "size:", imageData.size);
    } else {
        console.error("Invalid image data format");
        throw new Error("Invalid image data format");
    }
    
    // Add API key
    formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
    
    // Add timestamp for signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    formData.append('timestamp', timestamp);
    
    // Create a params object to build the signature string
    const params = {
        timestamp: timestamp
    };
    
    // Add temporary flag if needed
    if (temporary) {
        params.type = 'private';
    }
    
    // Sort params alphabetically and create signature string
    const signatureParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
    
    // Append API secret to the end (not included in form data)
    const signatureString = signatureParams + CLOUDINARY_CONFIG.apiSecret;
    console.log("Signature string (without secret):", signatureParams);
    
    // Generate SHA1 signature
    const signature = await sha1(signatureString);
    formData.append('signature', signature);
    
    // Add other parameters to form data
    for (const [key, value] of Object.entries(params)) {
        if (key !== 'timestamp') { // Timestamp already added
            formData.append(key, value);
        }
    }
    
    try {
        // Upload to Cloudinary
        console.log("Sending upload to Cloudinary...");
        
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData
        });
        
        // If we get an error, try to get more details from the response
        if (!response.ok) {
            let errorDetails = '';
            try {
                const errorResponse = await response.json();
                errorDetails = JSON.stringify(errorResponse);
            } catch {
                errorDetails = await response.text();
            }
            console.error("Cloudinary upload failed with status:", response.status);
            console.error("Error details:", errorDetails);
            throw new Error(`Upload failed with status: ${response.status}, Details: ${errorDetails}`);
        }
        
        const data = await response.json();
        console.log("Upload successful:", data);
        
        // Store both the secure_url and public_id
        if (data.public_id) {
            return {
                secure_url: data.secure_url,
                public_id: data.public_id,
                version: data.version,
                format: data.format
            };
        } else {
            throw new Error("No public_id in response");
        }
    } catch (error) {
        console.error("Upload error:", error);
        showError(`Failed to upload image: ${error.message}`);
        throw error;
    }
}

/**
 * Try to transform an image using Cloudinary's Fetch API without uploading
 * This is a fallback method when upload fails
 * @param {String} imageUrl - URL of the image to transform (must be publicly accessible)
 * @param {Object|String} params - Enhancement parameters or transformation string
 * @returns {String} The transformation URL
 */
function tryFetchAPITransformation(imageUrl, params) {
    console.log("Trying fetch API transformation as fallback");
    
    if (!imageUrl || !imageUrl.startsWith('http')) {
        console.error("Cannot use fetch API with local file");
        return '';
    }
    
    // If params is already a string, use it directly
    if (typeof params === 'string') {
        const transformationString = params;
        const encodedUrl = encodeURIComponent(imageUrl);
        return `${CLOUDINARY_FETCH_URL}/${transformationString}/${encodedUrl}`;
    }
    
    // Group transformation parameters for efficiency
    const transformationGroups = [];
    
    // Group 1: Size and cropping parameters
    if (params.outputSize && params.outputSize !== 'original') {
        const [width, height] = params.outputSize.split('x');
        transformationGroups.push(`w_${width},h_${height},c_fill,g_auto`);
    }
    
    // Group 2: Enhancement parameters based on type
    const enhancementParams = [];
    
    if (params.enhancementType === 'basic') {
        // Basic adjustments
        if (params.saturation !== 0) enhancementParams.push(`e_saturation:${params.saturation}`);
        if (params.contrast !== 0) enhancementParams.push(`e_contrast:${params.contrast}`);
        if (params.brightness !== 0) enhancementParams.push(`e_brightness:${params.brightness}`);
        if (params.sharpness > 0) enhancementParams.push(`e_sharpen:${params.sharpness * 20}`);
        if (params.vibrance > 0) enhancementParams.push(`e_vibrance:${params.vibrance}`);
    } 
    else if (params.enhancementType === 'auto') {
        // Auto enhancements (group them together)
        const autoParams = [];
        if (params.autoColor) autoParams.push("auto_color");
        if (params.autoContrast) autoParams.push("auto_contrast");
        if (params.autoBrightness) autoParams.push("auto_brightness");
        
        if (autoParams.length > 0) {
            enhancementParams.push(`e_improve:${autoParams.join(":")}`);
        }
        
        if (params.autoSharpen) enhancementParams.push("e_sharpen:auto");
    } 
    else if (params.enhancementType === 'advanced') {
        // Advanced enhancements
        if (params.improve && params.enhance) {
            enhancementParams.push("e_improve:enhance");
        } else {
            if (params.improve) enhancementParams.push("e_improve");
            if (params.enhance) enhancementParams.push("e_enhance");
        }
        
        if (params.qualityAuto) enhancementParams.push("q_auto");
    }
    
    // Add all enhancement params as a single group if there are any
    if (enhancementParams.length > 0) {
        transformationGroups.push(enhancementParams.join(","));
    }
    
    // Check for artistic effect parameters too
    if (params.effectType === 'artistic') {
        const artisticParams = [];
        if (params.artFilter) artisticParams.push(`e_art:${params.artFilter}`);
        if (params.gradientFade) artisticParams.push("e_gradient_fade:symmetric:45");
        if (params.pixelate) artisticParams.push(`e_pixelate:${params.pixelateStrength || 20}`);
        
        if (artisticParams.length > 0) {
            transformationGroups.push(artisticParams.join(","));
        }
    }
    
    // Group 3: Watermark removal (if needed)
    if (params.removeWatermark) {
        transformationGroups.push("e_no_text");
    }
    
    // Join with slashes for path segments
    const transformationString = transformationGroups.join("/");
    
    // Encode the URL and create the final URL
    const encodedUrl = encodeURIComponent(imageUrl);
    const finalUrl = `${CLOUDINARY_FETCH_URL}/${transformationString}/${encodedUrl}`;
    
    console.log("Fetch API transformation URL:", finalUrl);
    return finalUrl;
}

/**
 * Apply enhancement transformations to an image
 * @param {String} imageUrl - The local or remote image URL to transform
 * @param {Object} params - Enhancement parameters
 * @returns {Promise<String>} The transformation URL
 */
async function applyEnhancement(imageUrl, params) {
    console.log("Applying enhancement to image:", imageUrl ? "image URL provided" : "using file object");
    
    try {
        // Variable to store upload result (either URL or object with public_id)
        let uploadResult;
        
        // Check if we have a file object directly in params
        if (params.file && !imageUrl) {
            console.log("Using file object directly for upload");
            uploadResult = await uploadImageToCloudinary(params.file, params.temporaryImage || false);
        } else if (imageUrl) {
            // For base64 data URLs, upload to Cloudinary first to avoid URL length issues
            if (imageUrl.startsWith('data:')) {
                uploadResult = await uploadImageToCloudinary(imageUrl, params.temporaryImage || false);
            } else if (imageUrl.startsWith('http')) {
                // For HTTP URLs, we can try the fetch API directly
                return tryFetchAPITransformation(imageUrl, params);
            }
        }
        
        if (!uploadResult) {
            console.warn("Upload failed, trying fetch API as fallback");
            
            // If we have an HTTP URL, try fetch API as fallback
            if (imageUrl && imageUrl.startsWith('http')) {
                return tryFetchAPITransformation(imageUrl, params);
            }
            
            throw new Error("Could not process image - upload failed and no fallback available");
        }
        
        // Create transformation URL directly using the Cloudinary recommended format
        if (uploadResult.public_id) {
            console.log("Creating transformation URL using public_id:", uploadResult.public_id);
            
            // Using only proven, simple transformations to avoid 400 errors
            const transformations = [];
            
            // Size transformation - this is very standard and should work
            if (params.outputSize && params.outputSize !== 'original') {
                const [width, height] = params.outputSize.split('x');
                transformations.push(`w_${width},h_${height},c_scale`);
            }
            
            // Only add a few very basic transformations that are known to work
            if (params.enhancementType === 'basic') {
                // Use only simple, well-supported transformations
                if (params.saturation !== 0) {
                    transformations.push(`e_saturation:${params.saturation}`);
                }
                if (params.contrast !== 0) {
                    transformations.push(`e_contrast:${params.contrast}`);
                }
            } 
            else if (params.enhancementType === 'auto') {
                // Use just one auto enhancement at a time
                if (params.autoContrast) {
                    transformations.push(`e_auto_contrast`);
                }
            } 
            else if (params.enhancementType === 'advanced') {
                // Just try with quality auto - it's widely supported
                if (params.qualityAuto) {
                    transformations.push(`q_auto`);
                }
            }
            
            // Join transformations with slashes for URL path segments
            const transformationString = transformations.length > 0 ? 
                transformations.join("/") : 
                "c_scale"; // Default to a simple scaling if no transformations
            
            // Construct basic URL - no complex parameters
            const format = uploadResult.format || 'auto';
            const transformationUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformationString}/${uploadResult.public_id}.${format}`;
            
            console.log("Final transformation URL (simplified):", transformationUrl);
            return transformationUrl;
        } else if (typeof uploadResult === 'string') {
            // For backward compatibility, handle case where uploadResult is just a URL
            console.log("Using secure_url from upload for transformations");
            return uploadResult; // Just return the URL with no transformations
        }
        
        throw new Error("Invalid upload result format");
    } catch (error) {
        console.error("Enhancement error:", error);
        throw error;
    }
}

/**
 * Build a transformation string from parameters
 * @param {Object} params - Transformation parameters
 * @returns {String} The transformation string
 */
function buildTransformationString(params) {
    // Create transformations array
    const transformations = {};
    
    // Set output size if not original
    if (params.outputSize && params.outputSize !== 'original') {
        const [width, height] = params.outputSize.split('x');
        transformations.w = width;
        transformations.h = height;
        transformations.c = 'fill';
        transformations.g = 'auto';
    }
    
    // Apply enhancements based on type
    if (params.enhancementType === 'basic') {
        // Basic adjustments
        if (params.saturation !== 0) transformations.e_saturation = params.saturation;
        if (params.contrast !== 0) transformations.e_contrast = params.contrast;
        if (params.brightness !== 0) transformations.e_brightness = params.brightness;
        if (params.sharpness > 0) transformations.e_sharpen = params.sharpness * 20; // Scale to Cloudinary range
        if (params.vibrance > 0) transformations.e_vibrance = params.vibrance;
        if (params.gamma !== 0) transformations.e_gamma = 1 + (params.gamma / 50); // Convert to Cloudinary gamma range
    } 
    else if (params.enhancementType === 'auto') {
        // Auto enhancements
        if (params.autoColor) transformations.e_auto_color = true;
        if (params.autoContrast) transformations.e_auto_contrast = true;
        if (params.autoBrightness) transformations.e_auto_brightness = true;
        if (params.autoSharpen) transformations.e_sharpen = 'auto';
    } 
    else if (params.enhancementType === 'advanced') {
        // Advanced enhancements
        if (params.improve) transformations.e_improve = true;
        if (params.enhance) transformations.e_enhance = true;
        if (params.qualityAuto) transformations.q_auto = true;
    }
    
    // Add remove watermark if enabled
    if (params.removeWatermark) {
        transformations.e_no_text = true;
    }
    
    // Convert transformation object to URL string
    const transformationParts = [];
    for (const [key, value] of Object.entries(transformations)) {
        if (value !== null && value !== undefined && value !== '') {
            if (key.includes('_')) {
                if (value === true) {
                    // For boolean true values, just include the parameter without a value
                    transformationParts.push(key.replace('_', ':'));
                } else {
                    transformationParts.push(key.replace('_', ':') + ":" + value);
                }
            } else {
                transformationParts.push(`${key}_${value}`);
            }
        }
    }
    
    // Join transformations with commas
    return transformationParts.join(',');
}

/**
 * Apply transformations to a Cloudinary URL
 * @param {String} sourceUrl - The source image URL
 * @param {Object} params - Transformation parameters
 * @returns {String} The transformed URL
 */
function applyTransformations(sourceUrl, params) {
    // Create transformations array
    const transformations = {};
    
    // Set output size if not original
    if (params.outputSize && params.outputSize !== 'original') {
        const [width, height] = params.outputSize.split('x');
        transformations.w = width;
        transformations.h = height;
        transformations.c = 'fill';
        transformations.g = 'auto';
    }
    
    // Apply enhancements based on type
    if (params.enhancementType === 'basic') {
        // Basic adjustments
        if (params.saturation !== 0) transformations.e_saturation = params.saturation;
        if (params.contrast !== 0) transformations.e_contrast = params.contrast;
        if (params.brightness !== 0) transformations.e_brightness = params.brightness;
        if (params.sharpness > 0) transformations.e_sharpen = params.sharpness * 20; // Scale to Cloudinary range
        if (params.vibrance > 0) transformations.e_vibrance = params.vibrance;
        if (params.gamma !== 0) transformations.e_gamma = 1 + (params.gamma / 50); // Convert to Cloudinary gamma range
    } 
    else if (params.enhancementType === 'auto') {
        // Auto enhancements
        if (params.autoColor) transformations.e_auto_color = true;
        if (params.autoContrast) transformations.e_auto_contrast = true;
        if (params.autoBrightness) transformations.e_auto_brightness = true;
        if (params.autoSharpen) transformations.e_sharpen = 'auto';
    } 
    else if (params.enhancementType === 'advanced') {
        // Advanced enhancements from TRANSFORMATIONS.md
        if (params.improve) transformations.e_improve = true;
        if (params.enhance) transformations.e_enhance = true;
        if (params.qualityAuto) transformations.q_auto = true;  // Use q_auto format as specified in doc
    }
    
    // Add remove watermark if enabled
    if (params.removeWatermark) {
        transformations.e_no_text = true;
    }
    
    // Convert transformation object to URL string
    const transformationParts = [];
    for (const [key, value] of Object.entries(transformations)) {
        if (value !== null && value !== undefined && value !== '') {
            if (key.includes('_')) {
                if (value === true) {
                    // For boolean true values, just include the parameter without a value
                    transformationParts.push(key.replace('_', ':'));
                } else {
                    transformationParts.push(key.replace('_', ':') + ":" + value);
                }
            } else {
                transformationParts.push(`${key}_${value}`);
            }
        }
    }
    
    // Join transformations with commas
    const transformationString = transformationParts.join(',');
    console.log("Transformation string:", transformationString);
    
    // Create the final URL according to Cloudinary's recommended format
    let finalUrl;
    
    if (sourceUrl.includes('cloudinary.com')) {
        // Extract the cloud name and public ID from the Cloudinary URL
        try {
            // Parse URL and extract components
            const urlParts = sourceUrl.match(/https:\/\/res\.cloudinary\.com\/([^\/]+)\/image\/upload\/(?:v\d+\/)?(.+)$/);
            
            if (urlParts && urlParts.length === 3) {
                const cloudName = urlParts[1];
                const publicId = urlParts[2];
                
                // Construct URL in the exact format Cloudinary recommends
                finalUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
                console.log("Using Cloudinary transformation URL format with public ID");
            } else {
                // Fallback to old method if URL parsing fails
                console.warn("Failed to extract components from Cloudinary URL, using fallback method");
                finalUrl = `${sourceUrl.split('/upload/')[0]}/upload/${transformationString}/${sourceUrl.split('/upload/')[1]}`;
            }
        } catch (error) {
            console.error("Error parsing Cloudinary URL:", error);
            // Fallback to fetch API if we can't parse the URL
            const encodedImageUrl = encodeURIComponent(sourceUrl);
            finalUrl = `${CLOUDINARY_FETCH_URL}/${transformationString}/${encodedImageUrl}`;
        }
    } else {
        // Use fetch API for non-Cloudinary URLs
        const encodedImageUrl = encodeURIComponent(sourceUrl);
        finalUrl = `${CLOUDINARY_FETCH_URL}/${transformationString}/${encodedImageUrl}`;
    }
    
    console.log("Final URL:", finalUrl);
    return finalUrl;
}

/**
 * Apply artistic transformations to a local image URL
 * @param {String} imageUrl - The local or remote image URL to transform
 * @param {Object} params - Artistic parameters
 * @returns {Promise<String>} The transformation URL
 */
async function applyArtistic(imageUrl, params) {
    console.log("Applying artistic effect to image:", imageUrl);
    
    if (!imageUrl) {
        console.error("No image URL provided for artistic effect");
        throw new Error("No image URL provided for artistic effect");
    }
    
    // For base64 data URLs, upload to Cloudinary first to avoid URL length issues
    let uploadResult;
    if (imageUrl.startsWith('data:')) {
        uploadResult = await uploadImageToCloudinary(imageUrl, params.temporaryImage || false);
        if (!uploadResult) {
            throw new Error("Failed to upload image");
        }
    } else if (imageUrl.startsWith('http')) {
        // For HTTP URLs, use the fetch API
        return tryFetchAPITransformation(imageUrl, buildArtisticTransformationString(params));
    }
    
    // Create transformations with public_id if available
    if (uploadResult && uploadResult.public_id) {
        console.log("Creating artistic transformation URL using public_id:", uploadResult.public_id);
        
        // Build transformation parts manually to ensure proper format
        const transformationParts = [];
        
        // Add size parameters
        if (params.outputSize && params.outputSize !== 'original') {
            const [width, height] = params.outputSize.split('x');
            transformationParts.push(`w_${width},h_${height},c_fill,g_auto`);
        }
        
        // Apply effects based on type
        if (params.effectType === 'artistic') {
            // Art filter
            if (params.artFilter) transformationParts.push(`e_art:${params.artFilter}`);
            
            // Gradient fade
            if (params.gradientFade) transformationParts.push("e_gradient_fade:symmetric:45");
            
            // Pixelate
            if (params.pixelate) {
                transformationParts.push(`e_pixelate:${params.pixelateStrength || 20}`);
            }
        } 
        else if (params.effectType === 'cartoon') {
            // Cartoonify
            const cartoonStrength = params.cartoonStrength || 50;
            const lineStrength = params.lineStrength || 50;
            const cartoonEffect = `e_cartoonify:${cartoonStrength}:${lineStrength}`;
            
            // Add color reduction if specified
            if (params.colorReduction) {
                transformationParts.push(`${cartoonEffect}:${params.colorReduction}`);
            } else {
                transformationParts.push(cartoonEffect);
            }
        } 
        else if (params.effectType === 'painting') {
            // Painting style
            if (params.paintingStyle === 'oil_paint') {
                transformationParts.push(`e_oil_paint:${params.effectStrength || 30}`);
            } else if (params.paintingStyle === 'vignette') {
                transformationParts.push(`e_vignette:${params.effectStrength || 30}`);
            } else if (params.paintingStyle === 'blur') {
                transformationParts.push(`e_blur:${params.effectStrength * 500}`);
            }
            
            // Tint
            if (params.tintStrength > 0 && params.tintColor) {
                const tintColor = params.tintColor.replace('#', '');
                transformationParts.push(`e_tint:${params.tintStrength}:${tintColor}`);
            }
        }
        
        // Add remove watermark if enabled
        if (params.removeWatermark) {
            transformationParts.push("e_no_text");
        }
        
        // Join all transformation parts with slashes to create URL path segments
        const transformationString = transformationParts.join("/");
        
        // Construct URL in the recommended format
        const format = uploadResult.format || 'auto';
        const transformationUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformationString}/${uploadResult.public_id}.${format}`;
        
        console.log("Final artistic URL:", transformationUrl);
        return transformationUrl;
    } else if (uploadResult && typeof uploadResult === 'string') {
        // For backward compatibility, handle case where uploadResult is just a URL
        const sourceUrl = uploadResult;
        
        // Create transformations array
        const transformations = {};
        
        // Set output size if not original
        if (params.outputSize && params.outputSize !== 'original') {
            const [width, height] = params.outputSize.split('x');
            transformations.w = width;
            transformations.h = height;
            transformations.c = 'fill';
            transformations.g = 'auto';
        }
        
        // Apply effects based on type
        if (params.effectType === 'artistic') {
            // Art filter
            if (params.artFilter) transformations.e_art = params.artFilter;
            
            // Gradient fade
            if (params.gradientFade) transformations.e_gradient_fade = 'symmetric:45';
            
            // Pixelate
            if (params.pixelate) {
                transformations.e_pixelate = params.pixelateStrength || 20;
            }
        } 
        else if (params.effectType === 'cartoon') {
            // Cartoonify
            const cartoonStrength = params.cartoonStrength || 50;
            const lineStrength = params.lineStrength || 50;
            transformations.e_cartoonify = `${cartoonStrength}:${lineStrength}`;
            
            // Color reduction
            if (params.colorReduction) {
                transformations.e_cartoonify += `:${params.colorReduction}`;
            }
        } 
        else if (params.effectType === 'painting') {
            // Painting style
            if (params.paintingStyle === 'oil_paint') {
                transformations.e_oil_paint = params.effectStrength || 30;
            } else if (params.paintingStyle === 'vignette') {
                transformations.e_vignette = params.effectStrength || 30;
            } else if (params.paintingStyle === 'blur') {
                transformations.e_blur = params.effectStrength * 500; // Scale to Cloudinary range
            }
            
            // Tint
            if (params.tintStrength > 0 && params.tintColor) {
                const tintColor = params.tintColor.replace('#', '');
                transformations.e_tint = `${params.tintStrength}:${tintColor}`;
            }
        }
        
        // Add remove watermark if enabled
        if (params.removeWatermark) {
            transformations.e_no_text = 'true';
        }
        
        // Convert transformation object to URL string
        const transformationParts = [];
        for (const [key, value] of Object.entries(transformations)) {
            if (value !== null && value !== undefined && value !== '') {
                if (key.includes('_')) {
                    transformationParts.push(key.replace('_', ':') + ":" + value);
                } else {
                    transformationParts.push(`${key}_${value}`);
                }
            }
        }
        
        // Join transformations with commas
        const transformationString = transformationParts.join(',');
        console.log("Transformation string:", transformationString);
        
        // Create the final URL with the correct format
        if (sourceUrl.includes('cloudinary.com')) {
            // Extract the cloud name and public ID from the Cloudinary URL
            try {
                const urlParts = sourceUrl.match(/https:\/\/res\.cloudinary\.com\/([^\/]+)\/image\/upload\/(?:v\d+\/)?(.+)$/);
                
                if (urlParts && urlParts.length === 3) {
                    const cloudName = urlParts[1];
                    const publicId = urlParts[2];
                    
                    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
                }
            } catch (error) {
                console.error("Error parsing Cloudinary URL:", error);
            }
            
            // Fallback to old method
            return `${sourceUrl.split('/upload/')[0]}/upload/${transformationString}/${sourceUrl.split('/upload/')[1]}`;
        } else {
            // Use fetch API for non-Cloudinary URLs
            const encodedImageUrl = encodeURIComponent(sourceUrl);
            return `${CLOUDINARY_FETCH_URL}/${transformationString}/${encodedImageUrl}`;
        }
    }
    
    throw new Error("Failed to apply artistic effects");
}

/**
 * Build a transformation string for artistic effects
 * @param {Object} params - Artistic parameters
 * @returns {String} The transformation string
 */
function buildArtisticTransformationString(params) {
    // Create transformations array
    const transformations = {};
    
    // Set output size if not original
    if (params.outputSize && params.outputSize !== 'original') {
        const [width, height] = params.outputSize.split('x');
        transformations.w = width;
        transformations.h = height;
        transformations.c = 'fill';
        transformations.g = 'auto';
    }
    
    // Apply effects based on type
    if (params.effectType === 'artistic') {
        // Art filter
        if (params.artFilter) transformations.e_art = params.artFilter;
        
        // Gradient fade
        if (params.gradientFade) transformations.e_gradient_fade = 'symmetric:45';
        
        // Pixelate
        if (params.pixelate) {
            transformations.e_pixelate = params.pixelateStrength || 20;
        }
    } 
    else if (params.effectType === 'cartoon') {
        // Cartoonify
        const cartoonStrength = params.cartoonStrength || 50;
        const lineStrength = params.lineStrength || 50;
        transformations.e_cartoonify = `${cartoonStrength}:${lineStrength}`;
        
        // Color reduction
        if (params.colorReduction) {
            transformations.e_cartoonify += `:${params.colorReduction}`;
        }
    } 
    else if (params.effectType === 'painting') {
        // Painting style
        if (params.paintingStyle === 'oil_paint') {
            transformations.e_oil_paint = params.effectStrength || 30;
        } else if (params.paintingStyle === 'vignette') {
            transformations.e_vignette = params.effectStrength || 30;
        } else if (params.paintingStyle === 'blur') {
            transformations.e_blur = params.effectStrength * 500; // Scale to Cloudinary range
        }
        
        // Tint
        if (params.tintStrength > 0 && params.tintColor) {
            const tintColor = params.tintColor.replace('#', '');
            transformations.e_tint = `${params.tintStrength}:${tintColor}`;
        }
    }
    
    // Add remove watermark if enabled
    if (params.removeWatermark) {
        transformations.e_no_text = true;
    }
    
    // Convert transformation object to URL string
    const transformationParts = [];
    for (const [key, value] of Object.entries(transformations)) {
        if (value !== null && value !== undefined && value !== '') {
            if (key.includes('_')) {
                if (value === true) {
                    transformationParts.push(key.replace('_', ':'));
                } else {
                    transformationParts.push(key.replace('_', ':') + ":" + value);
                }
            } else {
                transformationParts.push(`${key}_${value}`);
            }
        }
    }
    
    // Join transformations with commas
    return transformationParts.join(',');
}

/**
 * Apply utility transformations to a local image URL
 * @param {String} imageUrl - The local or remote image URL to transform
 * @param {Object} params - Utility parameters
 * @returns {Promise<String>} The transformation URL
 */
async function applyUtility(imageUrl, params) {
    console.log("Applying utility transformation to image:", imageUrl);
    
    if (!imageUrl) {
        console.error("No image URL provided for utility transformation");
        throw new Error("No image URL provided for utility transformation");
    }
    
    // For base64 data URLs, upload to Cloudinary first to avoid URL length issues
    let uploadResult;
    if (imageUrl.startsWith('data:')) {
        uploadResult = await uploadImageToCloudinary(imageUrl, params.temporaryImage || false);
        if (!uploadResult) {
            throw new Error("Failed to upload image");
        }
    } else if (imageUrl.startsWith('http')) {
        // For HTTP URLs, use the fetch API
        return tryFetchAPITransformation(imageUrl, buildUtilityTransformationString(params));
    }
    
    // Create transformations with public_id if available
    if (uploadResult && uploadResult.public_id) {
        console.log("Creating utility transformation URL using public_id:", uploadResult.public_id);
        
        // Build transformation parts manually to ensure proper format
        const transformationParts = [];
        
        // Resize
        if (params.toolType === 'resize') {
            // Create combined resize parameter
            let resizeParams = `w_${params.width},h_${params.height}`;
            
            // Add resize mode
            switch (params.resizeMode) {
                case 'scale':
                    resizeParams += ',c_scale';
                    break;
                case 'fit':
                    resizeParams += ',c_fit';
                    break;
                case 'fill':
                    resizeParams += ',c_fill,g_auto';
                    break;
                case 'crop':
                    resizeParams += `,c_crop,g_${params.cropGravity || 'auto'}`;
                    break;
                default:
                    resizeParams += ',c_scale';
            }
            
            transformationParts.push(resizeParams);
        }
        // Crop
        else if (params.toolType === 'crop') {
            let cropParams = `w_${params.width},h_${params.height},c_crop,g_${params.gravity || 'auto'}`;
            
            // Add zoom if specified
            if (params.zoom) {
                cropParams += `,z_${params.zoom}`;
            }
            
            transformationParts.push(cropParams);
        }
        // Background removal
        else if (params.toolType === 'background') {
            // Set dimensions if specified
            if (params.width && params.height) {
                transformationParts.push(`w_${params.width},h_${params.height},c_scale`);
            }
            
            // Set background type
            switch (params.backgroundType) {
                case 'transparent':
                    transformationParts.push('c_lfill,b_transparent');
                    break;
                case 'color':
                    if (params.backgroundColor) {
                        transformationParts.push(`b_${params.backgroundColor.replace('#', '')}`);
                    }
                    break;
                case 'gradient':
                    if (params.gradientStart && params.gradientEnd) {
                        const start = params.gradientStart.replace('#', '');
                        const end = params.gradientEnd.replace('#', '');
                        transformationParts.push(`b_gradient:${start}:${end}`);
                    }
                    break;
                case 'image':
                    // For image backgrounds, use a simple gradient as fallback
                    transformationParts.push('b_gradient:blue:red');
                    break;
            }
        }
        
        // Output format settings
        if (params.outputFormat && params.outputFormat !== 'auto') {
            transformationParts.push(`f_${params.outputFormat}`);
        } else if (params.outputFormat === 'auto' || params.optimizeQuality) {
            transformationParts.push('q_auto,f_auto');
        }
        
        // Remove watermark
        if (params.removeWatermark) {
            transformationParts.push('e_no_text');
        }
        
        // Join all transformation parts with slashes to create URL path segments
        const transformationString = transformationParts.join("/");
        
        // Construct URL in the recommended format
        const format = uploadResult.format || 'auto';
        const transformationUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformationString}/${uploadResult.public_id}.${format}`;
        
        console.log("Final utility URL:", transformationUrl);
        return transformationUrl;
    } else if (uploadResult && typeof uploadResult === 'string') {
        // Backward compatibility - use the old method
        const sourceUrl = uploadResult;
        return applyTransformations(sourceUrl, params);
    }
    
    throw new Error("Failed to apply utility transformations");
}

/**
 * Build a transformation string for utility transformations
 * @param {Object} params - Utility parameters
 * @returns {String} The transformation string
 */
function buildUtilityTransformationString(params) {
    // Create transformations array
    const transformations = {};
    
    // Resize
    if (params.toolType === 'resize') {
        // Set dimensions
        transformations.w = params.width;
        transformations.h = params.height;
        
        // Set resize mode
        switch (params.resizeMode) {
            case 'scale':
                transformations.c = 'scale';
                break;
            case 'fit':
                transformations.c = 'fit';
                break;
            case 'fill':
                transformations.c = 'fill';
                transformations.g = 'auto';
                break;
            case 'crop':
                transformations.c = 'crop';
                transformations.g = params.cropGravity || 'auto';
                break;
            default:
                transformations.c = 'scale';
        }
    }
    // Crop
    else if (params.toolType === 'crop') {
        transformations.w = params.width;
        transformations.h = params.height;
        transformations.c = 'crop';
        transformations.g = params.gravity || 'auto';
        
        // Add zoom if specified
        if (params.zoom) {
            transformations.z = params.zoom;
        }
    }
    // Background removal
    else if (params.toolType === 'background') {
        // Set dimensions if specified
        if (params.width && params.height) {
            transformations.w = params.width;
            transformations.h = params.height;
            transformations.c = 'scale';
        }
        
        // Set background type
        switch (params.backgroundType) {
            case 'transparent':
                transformations.c = 'lfill';
                transformations.b = 'transparent';
                break;
            case 'color':
                if (params.backgroundColor) {
                    transformations.b = params.backgroundColor.replace('#', '');
                }
                break;
            case 'gradient':
                if (params.gradientStart && params.gradientEnd) {
                    const start = params.gradientStart.replace('#', '');
                    const end = params.gradientEnd.replace('#', '');
                    transformations.b = `gradient:${start}:${end}`;
                }
                break;
            case 'image':
                // For image backgrounds we would use underlay, but that's complex with fetch
                // For simplicity, we'll just do a basic gradient
                transformations.b = 'gradient:blue:red';
                break;
        }
    }
    
    // Output format settings
    if (params.outputFormat && params.outputFormat !== 'auto') {
        transformations.f = params.outputFormat;
    } else if (params.outputFormat === 'auto' || params.optimizeQuality) {
        transformations.q = 'auto';
        transformations.f = 'auto';
    }
    
    // Remove watermark
    if (params.removeWatermark) {
        transformations.e_no_text = true;
    }
    
    // Convert transformation object to URL string
    const transformationParts = [];
    for (const [key, value] of Object.entries(transformations)) {
        if (value !== null && value !== undefined && value !== '') {
            if (key.includes('_')) {
                if (value === true) {
                    transformationParts.push(key.replace('_', ':'));
                } else {
                    transformationParts.push(key.replace('_', ':') + ":" + value);
                }
            } else {
                transformationParts.push(`${key}_${value}`);
            }
        }
    }
    
    // Join transformations with commas
    return transformationParts.join(',');
}

/**
 * Show progress overlay while processing
 * @param {HTMLElement} container - Container element
 * @param {Number} progress - Progress percentage (0-100)
 */
function showProgressOverlay(container, progress) {
    // Remove any existing progress overlay
    container.querySelector('.progress-overlay')?.remove();
    
    const overlay = document.createElement('div');
    overlay.className = 'progress-overlay';
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = `${progress}%`;
    
    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    progressText.textContent = `${progress}% Processing...`;
    
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(progressText);
    overlay.appendChild(progressContainer);
    
    container.appendChild(overlay);
}

/**
 * Download an image
 * @param {String} url - Image URL
 * @param {String} filename - Filename to save as
 */
function downloadImage(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.click();
}

// Error handling
function showError(message) {
    // Log to console for debugging
    console.error(`Cloudinary Error: ${message}`);
    
    // Create a user-friendly error dialog
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.style.position = 'fixed';
    errorContainer.style.top = '20px';
    errorContainer.style.left = '50%';
    errorContainer.style.transform = 'translateX(-50%)';
    errorContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    errorContainer.style.color = '#ff5555';
    errorContainer.style.padding = '15px 20px';
    errorContainer.style.borderRadius = '8px';
    errorContainer.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
    errorContainer.style.zIndex = '1000';
    errorContainer.style.maxWidth = '80%';
    errorContainer.style.textAlign = 'center';
    
    // Simplify technical error messages for users
    let userMessage = message;
    if (message.includes('400')) {
        userMessage = 'Transformation failed. Please try different settings.';
    } else if (message.includes('401')) {
        userMessage = 'Authentication failed. Please check your Cloudinary API key and secret.';
    } else if (message.includes('429')) {
        userMessage = 'Too many requests. Please try again later.';
    } else if (message.includes('500')) {
        userMessage = 'Server error. Please try again later.';
    }
    
    errorContainer.innerHTML = `
        <div style="margin-bottom:8px;font-weight:bold;">⚠️ Error</div>
        <div>${userMessage}</div>
        <div style="margin-top:10px;font-size:12px;opacity:0.7">Tap to dismiss</div>
    `;
    
    // Add click listener to dismiss
    errorContainer.addEventListener('click', () => {
        document.body.removeChild(errorContainer);
    });
    
    // Auto dismiss after 8 seconds
    document.body.appendChild(errorContainer);
    setTimeout(() => {
        if (document.body.contains(errorContainer)) {
            document.body.removeChild(errorContainer);
        }
    }, 8000);
} 