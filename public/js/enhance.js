// This file contains enhancement functionality for the enhance.html page
// The Cloudinary widget initialization is now handled directly in the HTML file

// Note: We're keeping this file for compatibility with any code that might reference it,
// but the widget initialization has been moved to inline scripts in the HTML files.

// Function to prevent default drag and drop behavior
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Function to handle file drops
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Function to handle files
function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (!file.type.match('image.*')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            displayPreview(e.target.result);
            document.getElementById('enhance-button').disabled = false;
        };

        reader.readAsDataURL(file);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - enhance.js');

    // DOM Elements
    const uploadContent = document.getElementById('upload-content');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const enhanceButton = document.getElementById('enhance-button');
    const resultContainer = document.getElementById('result-container');
    const originalImage = document.getElementById('original-image');
    const enhancedImage = document.getElementById('enhanced-image');
    const enhancementPrompt = document.getElementById('enhancement-prompt');
    const downloadButton = document.getElementById('download-button');
    const removeWatermark = document.getElementById('remove-watermark');
    const customSeed = document.getElementById('custom-seed');
    const seedValue = document.getElementById('seed-value');
    const loadingOverlay = document.createElement('div');
    const outputSizeSelect = document.getElementById('output-size');

    // Set up loading overlay
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="spinner">
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
        </div>
        <p class="loading-text">Enhancing your image with AI magic...</p>
    `;

    function highlight(e) {
        if (uploadArea) {
            uploadArea.classList.add('highlight');
        }
    }

    function unhighlight(e) {
        if (uploadArea) {
            uploadArea.classList.remove('highlight');
        }
    }

    function displayPreview(src) {
        if (uploadContent && previewContainer && previewImage) {
            uploadContent.style.display = 'none';
            previewContainer.style.display = 'flex';
            previewImage.src = src;

            if (!document.getElementById('remove-preview')) {
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove Image';
                removeButton.className = 'remove-button';
                removeButton.id = 'remove-preview';
                removeButton.onclick = resetUpload;
                previewContainer.appendChild(removeButton);
            }
        }
    }

    function resetUpload() {
        if (uploadContent && previewContainer && previewImage && fileInput && enhanceButton && resultContainer) {
            uploadContent.style.display = 'block';
            previewContainer.style.display = 'none';
            previewImage.src = '';
            fileInput.value = '';
            enhanceButton.disabled = true;
            resultContainer.style.display = 'none';
        }
    }

    // Image enhancement controls - get all the slider elements
    const saturationControl = document.getElementById('saturation-control');
    const contrastControl = document.getElementById('contrast-control');
    const brightnessControl = document.getElementById('brightness-control');
    const sharpnessControl = document.getElementById('sharpness-control');
    const vignetteControl = document.getElementById('vignette-control');
    const blurControl = document.getElementById('blur-control');

    // Default enhancement prompts
    const defaultPrompts = {
        "enhance": "enhance this image, high quality, detailed, sharp focus",
        "artistic": "transform into artistic painting, vibrant colors, detailed brushstrokes",
        "realistic": "make hyper-realistic, professional photography, sharp details, perfect lighting",
        "dreamy": "dreamy ethereal atmosphere, soft glow, fantasy elements, magical",
        "anime": "convert to anime style, detailed, vibrant colors, studio ghibli inspired",
        "sketch": "pencil sketch, detailed linework, professional drawing, artistic"
    };

    // Initialize the prompt with the default value
    if (enhancementPrompt) {
        enhancementPrompt.value = defaultPrompts["enhance"];
    }

    // Event listeners for the enhancement type selection
    document.querySelectorAll('input[name="enhancement-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const promptType = e.target.value;
            if (enhancementPrompt) {
                enhancementPrompt.value = defaultPrompts[promptType] || '';
            }
        });
    });

    // Toggle custom seed input visibility
    if (customSeed && seedValue) {
        customSeed.addEventListener('change', () => {
            const parent = seedValue.parentElement;
            if (parent) {
                parent.style.display = customSeed.checked ? 'block' : 'none';
            }
        });
    }

    // Drag and drop functionality
    if (uploadArea) {
        // Setup drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight events
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        // Drop handling
        uploadArea.addEventListener('drop', handleDrop, false);

        // Click handling for Cloudinary widget
        uploadArea.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Upload area clicked');

            if (!myWidget && typeof cloudinary !== 'undefined') {
                console.log('Widget not initialized, trying to initialize...');
                initializeWidget();
            }

            if (myWidget) {
                console.log('Opening widget...');
                try {
                    await myWidget.open();
                } catch (error) {
                    console.error('Error opening widget:', error);
                }
            } else {
                console.error('Cloudinary widget not available');
            }
        });
    }

    // File upload handling
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }

    // Enhancement process
    if (enhanceButton) {
        enhanceButton.addEventListener('click', async () => {
            if (!previewImage || !previewImage.src) {
                alert('Please upload an image first');
                return;
            }

            // Get enhancement options
            const sizeOption = outputSizeSelect ? outputSizeSelect.value.split('x') : ['1024', '1024'];
            const width = parseInt(sizeOption[0]);
            const height = parseInt(sizeOption[1]);

            // Get slider values for enhancements
            const saturation = saturationControl ? parseInt(saturationControl.value) : 0;
            const contrast = contrastControl ? parseInt(contrastControl.value) : 0;
            const brightness = brightnessControl ? parseInt(brightnessControl.value) : 0;
            const sharpness = sharpnessControl ? parseInt(sharpnessControl.value) : 0;
            const vignette = vignetteControl ? parseInt(vignetteControl.value) : 0;
            const blur = blurControl ? parseInt(blurControl.value) : 0;

            // Show loading overlay
            if (uploadArea) {
                uploadArea.appendChild(loadingOverlay);
            }
            if (enhanceButton) {
                enhanceButton.disabled = true;
            }

            try {
                // Process image with Cloudinary
                const enhancedImageUrl = await enhanceImageWithCloudinary(
                    previewImage.src,
                    width,
                    height,
                    saturation,
                    contrast,
                    brightness,
                    sharpness,
                    vignette,
                    blur
                );

                // Display results
                if (resultContainer && originalImage && enhancedImage) {
                    resultContainer.style.display = 'block';
                    originalImage.src = previewImage.src;
                    enhancedImage.src = enhancedImageUrl;

                    // Enable download button
                    if (downloadButton) {
                        downloadButton.onclick = () => {
                            downloadImage(enhancedImageUrl, 'enhanced-image.jpg');
                        };
                    }

                    // Scroll to results
                    resultContainer.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.error('Enhancement failed:', error);
                alert('Image enhancement failed. Please try again.');
            } finally {
                // Remove loading overlay
                if (loadingOverlay.parentElement) {
                    loadingOverlay.parentElement.removeChild(loadingOverlay);
                }
                if (enhanceButton) {
                    enhanceButton.disabled = false;
                }
            }
        });
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // File upload handling
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // Set up click handler for the upload area
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Upload area clicked');

            // If widget isn't initialized yet, try to initialize it
            if (!myWidget && typeof cloudinary !== 'undefined') {
                console.log('Widget not initialized, trying to initialize...');
                initializeWidget();
            }

            if (myWidget) {
                console.log('Opening widget...');
                try {
                    await myWidget.open();
                } catch (error) {
                    console.error('Error opening widget:', error);
                }
            } else {
                console.error('Cloudinary widget not available');
            }
        });
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (!file.type.match('image.*')) {
                alert('Please upload an image file');
                return;
            }

            const reader = new FileReader();

            reader.onload = function(e) {
                displayPreview(e.target.result);
                enhanceButton.disabled = false;
            };

            reader.readAsDataURL(file);
        }
    }

    function displayPreview(src) {
        uploadContent.style.display = 'none';
        previewContainer.style.display = 'flex';
        previewImage.src = src;

        // Add remove button if it doesn't exist
        if (!document.getElementById('remove-preview')) {
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove Image';
            removeButton.className = 'remove-button';
            removeButton.id = 'remove-preview';
            removeButton.onclick = resetUpload;
            previewContainer.appendChild(removeButton);
        }
    }

    function resetUpload() {
        uploadContent.style.display = 'block';
        previewContainer.style.display = 'none';
        previewImage.src = '';
        fileInput.value = '';
        enhanceButton.disabled = true;
        resultContainer.style.display = 'none';
    }

    // Enhancement process
    enhanceButton.addEventListener('click', async () => {
        if (!previewImage.src) {
            alert('Please upload an image first');
            return;
        }

        // Get enhancement options
        const sizeOption = outputSizeSelect.value.split('x');
        const width = parseInt(sizeOption[0]);
        const height = parseInt(sizeOption[1]);

        // Get slider values for enhancements
        const saturation = saturationControl ? parseInt(saturationControl.value) : 0;
        const contrast = contrastControl ? parseInt(contrastControl.value) : 0;
        const brightness = brightnessControl ? parseInt(brightnessControl.value) : 0;
        const sharpness = sharpnessControl ? parseInt(sharpnessControl.value) : 0;
        const vignette = vignetteControl ? parseInt(vignetteControl.value) : 0;
        const blur = blurControl ? parseInt(blurControl.value) : 0;

        // Show loading overlay
        uploadArea.appendChild(loadingOverlay);
        enhanceButton.disabled = true;

        try {
            // Process image with Cloudinary
            const enhancedImageUrl = await enhanceImageWithCloudinary(
                previewImage.src,
                width,
                height,
                saturation,
                contrast,
                brightness,
                sharpness,
                vignette,
                blur
            );

            // Display results
            resultContainer.style.display = 'block';
            originalImage.src = previewImage.src;
            enhancedImage.src = enhancedImageUrl;

            // Enable download button
            downloadButton.onclick = () => {
                downloadImage(enhancedImageUrl, 'enhanced-image.jpg');
            };

            // Scroll to results
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Enhancement failed:', error);
            alert('Image enhancement failed. Please try again.');
        } finally {
            // Remove loading overlay
            if (loadingOverlay.parentElement) {
                loadingOverlay.parentElement.removeChild(loadingOverlay);
            }
            enhanceButton.disabled = false;
        }
    });

    /**
     * Enhance an image using Cloudinary
     * @param {string} imageDataUrl - Base64 encoded image data
     * @param {number} width - Output width
     * @param {number} height - Output height
     * @param {number} saturation - Saturation adjustment (-100 to 100)
     * @param {number} contrast - Contrast adjustment (-100 to 100)
     * @param {number} brightness - Brightness adjustment (-100 to 100)
     * @param {number} sharpness - Sharpness adjustment (0 to 100)
     * @param {number} vignette - Vignette effect (0 to 100)
     * @param {number} blur - Blur effect (0 to 100)
     * @returns {Promise<string>} - URL of the enhanced image
     */
    async function enhanceImageWithCloudinary(imageDataUrl, width, height, saturation, contrast, brightness, sharpness, vignette, blur) {
        // For demonstration purposes, we're simulating the Cloudinary integration
        // In a real application, you'd upload the image to Cloudinary first using their API

        // Your Cloudinary credentials
        const cloudName = 'dwa9nkpyq';

        // Build transformation parameters with chaining
        let transformations = [];

        // Add resize transformation
        transformations.push(`w_${width},h_${height},c_fill`);

        // Add enhancements if values are non-zero
        if (saturation !== 0) {
            transformations.push(`e_saturation:${saturation}`);
        }

        if (contrast !== 0) {
            transformations.push(`e_contrast:${contrast}`);
        }

        if (brightness !== 0) {
            transformations.push(`e_brightness:${brightness}`);
        }

        if (sharpness > 0) {
            transformations.push(`e_sharpen:${sharpness}`);
        }

        if (vignette > 0) {
            transformations.push(`e_vignette:${vignette}`);
        }

        if (blur > 0) {
            transformations.push(`e_blur:${blur}`);
        }

        // Add auto-quality and format optimizations
        transformations.push('q_auto');
        transformations.push('f_auto');

        // Add watermark removal if selected
        if (removeWatermark && removeWatermark.checked) {
            transformations.push('fl_nologo');
        }

        // In a real implementation, we would:
        // 1. Upload the image to Cloudinary using their upload API
        // 2. Get the public_id of the uploaded image
        // 3. Construct a URL with the transformations

        // For demo purposes, just returning the original image
        // In production, you'd return something like:
        // return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join('/')}/your_uploaded_image_id`;

        // Simulate enhanced image for demonstration
        console.log('Applied transformations:', transformations.join('/'));
        return imageDataUrl;
    }

    /**
     * Download an image from a URL
     * @param {string} url - Image URL
     * @param {string} filename - Download filename
     */
    function downloadImage(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
  });