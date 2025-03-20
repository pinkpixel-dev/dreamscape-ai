# Key Cloudinary Transformations for Image Enhancement

## Basic Quality Enhancements
e_saturation:[value] - Adjust color saturation (-100 to 100)
e_brightness:[value] - Adjust brightness (-99 to 100)
e_contrast:[value] - Adjust contrast (-100 to 100)
e_sharpen:[value] - Sharpen image (1 to 2000)
e_unsharp_mask:[radius][amount][threshold] - Fine-tuned sharpening
e_vibrance:[value] - Increase vibrance of muted colors
e_auto_color - Automatic color enhancement
e_auto_brightness - Automatic brightness adjustment
e_auto_contrast - Automatic contrast optimization

## Artistic Effects
e_art:[artistic_filter] - Apply artistic filters (zorro, primavera, athena, etc.)
e_cartoonify:[strength][line_strength] - Cartoonify effect
e_oil_paint:[strength] - Oil painting effect
e_vignette:[strength] - Vignette effect
e_tint:[amount]:[color] - Add a color tint
e_gradient_fade - Apply gradient fade
e_pixelate:[value] - Pixelate effect
e_blur:[strength] - Blur effect

## Advanced Enhancements
e_improve - General image quality improvement
e_enhance - Enhance image colors and contrast
q_auto - Automatic quality optimization

## AI-Powered Add-ons
e_background_removal - AI-powered background removal (requires add-on)

## Deliver Optimizations
w_[value] and h_[value] - Resize to specific dimensions
c_[crop_mode] - Various cropping modes (fill, limit, pad, etc.)

To format API request for transformations using API key, include the API key, API secret, and cloud name in the URL. 
Format:
https://<API_KEY>:<API_SECRET>@api.cloudinary.com/v1_1/<CLOUD_NAME>/transformations/<TRANSFORMATION>
For example, to get details of a transformation that resizes an image to 150x100 pixels using fill crop:
https://<API_KEY>:<API_SECRET>@api.cloudinary.com/v1_1/<CLOUD_NAME>/transformations/w_150,h_100,c_fill

My info: 
api key: 887549877845179
cloud name: dwa9nkpyq
api secret: d37-Vl-1VpdhQficepHl9eY4kzo

https://api.cloudinary.com/v1_1/your_cloud_name/image/upload/<API_KEY>:<API_SECRET>@api.cloudinary.com/v1_1/<CLOUD_NAME>/transformations/<TRANSFORMATION>