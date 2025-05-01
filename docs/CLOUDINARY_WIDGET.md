Upload widget
Last updated: Apr-30-2025


Cloudinary's Upload widget is a complete, interactive user interface that enables your users to upload files from a variety of sources to your website or application. The widget, requiring just a couple lines of code to integrate, eliminates the need to develop in-house interactive media upload capabilities.

Important
Cloudinary supports only the documented configuration and the supplied files with the widget. Any direct changes to the widget code and its elements (for example, CSS and JS files) might break its functionality, and will not be supported.

Upload widget main screen

The Upload widget responsively resizes to fit in the available width, with the display functionality automatically adjusting on the fly for use in mobile applications.

Upload widget main screen

The widget offers uploading from a variety of sources, such as: your local device, a remote URL, the device camera, image search, popular social media accounts and a variety of stock photography sites. The widget supports drag & drop functionality, interactive cropping, upload progress indication, and thumbnail previews. The widget also monitors and handles uploading errors and offers extensive event handling for integrating your own code.

You can implement the widget for unsigned uploading directly from the browser to Cloudinary storage, without involving your servers in the process. The widget sends JavaScript callbacks on successful uploads, so you can integrate the upload process back into your existing media pipeline. You can additionally configure Cloudinary to send server-side callbacks. Advanced users can also use the Upload widget with signed uploads for a more secure process when required.

Once uploaded, images and videos can be resized, cropped and transformed by Cloudinary on the fly so they can be embedded as needed in your website or mobile app.

The Upload widget requires only pure JavaScript to integrate and is easy to use within any web development framework.

On this page:
Quick example
Cloudinary Upload widget video tutorial
How to set up and integrate the Upload widget into your site or app.
Third-party upload sources
API events
Pre-batch validation
Prepare upload parameters
Tagging suggestions
Upload preset selection
Look and feel customization
Localization
Encryption
Notifying server side code
Upload widget reference
Accessible navigation
Rate this page:

    
Quick example
To use Cloudinary's Upload widget in your site with unsigned uploads, include the widget's remote JavaScript file and then specify the following (minimum) information when calling the createUploadWidget method to initialize the widget:

Your product environment cloud name
The upload preset to use for uploading files
Once initialized, the widget is ready to be rendered when needed. The following sample includes code for binding to the click event of a button element in a web page, in order to call the widget's open method and display the initialized widget:

JS

<button id="upload_widget" class="cloudinary-button">Upload files</button>

<script src="https://upload-widget.cloudinary.com/latest/global/all.js" type="text/javascript"></script>  

<script type="text/javascript">  
var myWidget = cloudinary.createUploadWidget({
  cloudName: 'my_cloud_name', 
  uploadPreset: 'my_preset'}, (error, result) => { 
    if (!error && result && result.event === "success") { 
      console.log('Done! Here is the image info: ', result.info); 
    }
  }
)

document.getElementById("upload_widget").addEventListener("click", function(){
    myWidget.open();
  }, false);
</script>
You can try out this simple Upload widget example by clicking the button below:

Upload files
The following buttons were implemented with a few additional parameters to demonstrate additional capabilities.


Crop and upload Upload and display thumbnails
These and many additional options are described on the rest of this page.

Tip Take a look at the profile picture sample project, which demonstrates the use of the Upload widget in a Next.js app.
Code explorer: Upload widget example
Check out the following Upload Widget code explorer that you can fork to try out some sample configuration changes:


Note Due to CORS issues with StackBlitz, you may have errors opening the widget with the preview. Try opening the preview in a new tab to resolve this or use the GitHub link below to run locally.
This code is also available in GitHub.

Try this code explorer in other frameworks:
 React Upload Widget Sandbox (also uses the React SDK for displaying the uploaded image)
Angular Upload Widget Sandbox
Vue Upload Widget Sandbox
Tip Enjoy interactive learning? Check out more code explorers!

Cloudinary Upload widget video tutorial
This video demonstrates how to integrate a basic Upload widget using a code sandbox.

Play Video
This video is brought to you by Cloudinary's video player - embed your own!

Tutorial contents
How to set up and integrate the Upload widget into your site or app.
For most needs, you can set up the Upload widget for unsigned uploads. Using unsigned uploads with your widget makes it quick and simple for you to provide a UI where users can upload content to your site.

Signed uploads require a bit more setup and coding, but provide a more secure upload process when required.

Tip You can use the Cloudinary CLI to generate the basic code for an Upload widget:

cld make upload_widget
Unsigned uploads
Unsigned uploads are somewhat less secure than signed uploads. For example, it is possible for a customer to inspect your client-side HTML code to find your cloud name and preset, and use that information to upload unwanted files to your Cloudinary product environment. For this reason, unsigned uploads have some protective limitations. For example, existing assets cannot be overwritten. The options you set in the unsigned preset can also limit the size or type of files that users can upload to your Cloudinary product environment using that preset.

To setup and add an Upload widget for unsigned uploads:

Include the cloudinary widget JavaScript file in your web page:
https://upload-widget.cloudinary.com/latest/global/all.js

For example:

JS

<script src="https://upload-widget.cloudinary.com/latest/global/all.js" type="text/javascript">  
</script>
Note When using both the Upload Widget and Video Player on the same page, the video player scripts must be loaded first to prevent any conflicts.
Optional. Set your cloud name globally. If you include multiple widgets in your web page, you can use the setCloudName method to instruct all widgets on the page to upload to the same Cloudinary product environment. Alternatively, you can set the product environment cloud name as a parameter of each widget creation call.

Create an unsigned upload preset. In the Upload page of the Console Settings, create a new, unsigned upload preset. This preset serves as a form of security override, allowing client-side unsigned uploads. You supply the preset name in your widget creation call.
Alternatively, you can create an unsigned upload preset using the Admin API.
You can optionally edit the preset to modify its name or apply any of the available upload options, such as applying incoming transformations to control the size or type of asset users can upload using your widget, or to automatically generate certain eager transformations on all uploaded assets. For details, see Upload presets.

Add your widget. Use one of the widget initialization methods to create your widget. When you call the method, you specify the uploadPreset that you created in the previous step, your cloudName (if you did not set it globally), and any additional widget options you want to apply.
For example, in the demo example earlier on this page, the createUploadWidget method call includes the cropping option, which enables users to define cropping coordinates, and the folder option, which uploads all images from the widget to a specified folder:

JS

var myCropWidget = cloudinary.createUploadWidget({
  cloudName: 'demo', uploadPreset: 'preset1', folder: 'widgetUpload', cropping: true}, 
  (error, result) => { console.log(error, result) })
Signed uploads
Instead of providing an upload preset name, you initialize the widget for signed uploads with the public API key and an upload signature that is generated either when the page is loaded or when the upload request is submitted.

To setup and implement the Upload widget for signed uploads:

Follow steps 1-2 above.

Optional. Create a signed upload preset. When you use the Upload widget for signed uploads, an upload preset is not necessary. But you can optionally create a signed preset if you want to define incoming or eager transformations on the uploaded asset. Define the preset as described in Upload presets and supply the preset name in the uploadPreset option when you call the widget creation method.

Select string or function as the upload_signature type and prepare the required code.

String:

Requires your page to connect to the web server on page load to generate the signature.
Requires that all parameters required for signing are known at page load time. If user-input will affect the parameters, for example, if you are using the widget's interactive cropping option, then you must use the function option.
The signature is valid for one hour from the timestamp used in the signature. If a user keeps the page open for a long time, the signature string may expire.
The signature string you provide must be generated from all parameters used, including 'source=uw' (this is a hidden parameter sent automatically by the Upload widget, but must still be included in the string to sign). For example, a string to sign might look like: public_id=dog&source=uw&timestamp=155307631&upload_preset=myPreset.

Note The parameters in the string to sign need to be serialized in alphabetical order and require snake_case, which is in contrast to the camelCase used for the widget parameters. For details on generating the signature string, see Generating authentication signatures.
Function:

Requires you to create a function to generate the signature.
The function runs when the upload request is submitted, therefore, the timestamp does not risk expiring if the user keeps the page open.
The function receives the final parameters of the upload, including any parameters impacted by user interaction.

Sample function:
The following is an example of a function that uses a server-side endpoint to generate the signature.

JS

  <script type="text/javascript">
    var generateSignature = function(callback, params_to_sign){
      $.ajax({
       url     : "https://www.my-domain.com/my_generate_signature",
       type    : "GET",
       dataType: "text",
       data    : { data: params_to_sign},
       complete: function() {console.log("complete")},
       success : function(signature, textStatus, xhr) { callback(signature); },
       error   : function(xhr, status, error) { console.log(xhr, status, error); }
      });
    }
  </script>
Important You must use the timestamp value provided by the widget (passed in params_to_sign) and not create your own timestamp value.
Add your widget. Use one of the widget initialization methods to create your widget. When you call the method, you specify your api_key, your cloudName (if you did not set it globally), the uploadSignature string or function, the uploadSignatureTimestamp (for string signatures only), and any additional widget options you want to apply.
For example, the applyUploadWidget method creates the Upload widget and calls the signature function shown in the previous step:

JS

cloudinary.applyUploadWidget(document.getElementById('upload_widget_opener'), 
  { api_key : "my_api_key", cloudName: "demo", uploadSignature: generateSignature }, 
  (error, result) => { });

Code explorer: Signed uploads using the Upload widget
This Node.js app demonstrates how to perform a signed upload using the Upload widget. The widget is constructed in signed-uploads/public/js/uploadclientwidget.js and the signature is generated in signed-uploads/modules/signuploadwidget.js, using the api_sign_request method.

Run the app
Click Remix to Edit
Enter your Cloudinary product environment credentials in signed-uploads/public/js/config.js
Click View App
Click the Upload Files Using the Upload widget link

See this example in GitHub.

Tip Enjoy interactive learning? Check out more code explorers!
Third-party upload sources
In addition to the 'My Files', 'Web Address', and 'Camera' sources, the Upload widget supports a variety of third‑party upload sources from which your users can upload images and videos. The sources are presented on multiple tabs (web) or options (mobile/responsive) for your users, so they can select the relevant source, browse through their files and select the ones they want to upload. When the number of sources exceeds the available widget width, carousel scrolling arrows are added.

Upload widget sources
The number of sources that can be displayed without scrolling depends on the length of the label values of the selected sources. With the default label texts, 7-8 sources can be displayed at once. However, if you customize or translate the labels, the scrolling arrows may be displayed with more or fewer sources.

At responsive widths narrower than 768px, the widget switches to the mobile display with a collapsible side menu.

Upload widget main screen

The sources parameter
The sources parameter accepts an array of string values defining the source options to add to the Upload widget, where each source defines a new upload tab or source option within the widget. The sources parameter can be included in the method used for creating the Upload widget, and is only specified when you want to limit the available sources (all sources are added by default if this parameter is omitted). The possible values for the sources parameter are as follows:

Value	Description
local	Upload a file from your local device. Adds the My Files source option.
url	Upload a file from a remote location. Adds the Web Address source option.
camera	Upload an image file via the device's camera. Adds the Camera source option.
Note: Desktop/laptop only - a mobile device's camera is accessed through the local (My Files) source option.
dropbox	Upload a file from your Dropbox account. Adds the Dropbox source option.
image_search	Upload a file from the web using Google's Search Engine. Adds the Image Search source option.
shutterstock	Upload an image from a Shutterstock account. Adds the Shutterstock source option.
gettyimages	Upload an image from a Getty Images account. Adds the gettyimages source option.
istock	Upload an image from an iStock account. Adds the iStock source option.
unsplash	Upload an image from Unsplash. Adds the Unsplash source option.
google_drive	Upload a file from a Google Drive account. Adds the Google Drive source option.
The sources are displayed in the same order that you add them to the sources parameter.

Note Beginning July 1, 2023, the Upload widget no longer supports Instagram or Facebook as third-party upload sources. If those sources are requested, they will no longer work.
Image Search source
The image_search option allows your users to select images from the web using your Google Custom Search account, and then upload them to Cloudinary. The search can be optionally confined to specific sites (e.g., your own website) and can be filtered by specified licensing criteria.

Image Search option

Important To enable this search option, you must obtain an API Key from Google. The API Key is free to use within certain search rate limits, and there are various large scale commercial options as well. To enable Google Custom Search and generate your API Key see https://developers.google.com/custom-search/json-api/v1/overview.
To enable the image_search option, add the following parameters to the method you use for creating the Upload Widget:

sources (Array of strings) - Optional. If you add this parameter to limit the available options, make sure to include the image_search option.
searchBySites (Array of Strings) - Optional. The domain names of sites you want to allow for the search. If more than one site is specified then a Search by Site drop-down will be added, so your users can select the site to search. To allow searching the entire web, use the value all. Default value: all
searchByRights (Boolean) - Optional. Set to true to add a drop-down box so that users can select a licensing filter to apply to the image search. Default value: false.
Additionally, you must provide:

googleApiKey (String) - The API key for your Google Custom Search account.
Basic example:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  sources: [ 'local', 'url', 'image_search'],
  googleApiKey: 'AIrFcR8hKiRo' }, (error, result) => { });
Example with sites filter and rights filter:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  sources: [ 'local', 'url', 'image_search'],
  googleApiKey: 'AIrFcR8hKiRo',
  searchBySites: ["all", "cloudinary.com"],
  searchByRights: true }, (error, result) => { });
Image Search select

Dropbox source
The dropbox option allows your users to login to their own Dropbox account, browse through their folders and files, and then select the files to upload to Cloudinary. This option requires that the Upload widget is embedded in a secure (HTTPS) page because the user sign-in to Dropbox must be over a secure connection.

To enable this upload option for your users, you must obtain an App key from Dropbox:

Create a new app on the Dropbox App Console: Click My apps, select the Dropbox API and Full Dropbox options, name your app, and click the Create app button.
On the next page, set the following redirect URI for your Dropbox application: https://widget.cloudinary.com/v2.0/global/auth/index.html
Copy the auto-generated App key for your Dropbox app: this will be configured as the value of the dropboxAppKey parameter when including Dropbox as an upload source in the Upload widget (see below).
Your Dropbox app is initially created in Development status for testing purposes. You can enable additional users with the Enable additional users button, and when your app is ready to go live, you need to click on the Apply for Production status to enable all your users to upload via the Dropbox app.
For more information on creating Dropbox apps, see their documentation and take note of their branding guidelines.
Dropbox SUBTITLE_2
To enable the Dropbox source, add the following parameters to the method you use for creating the Upload widget:

sources (Array of strings) - Optional. If you add this parameter to limit the available options, make sure to include the dropbox option.
dropboxAppKey (String) - The App key to your Dropbox App.
For example:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  sources: [ 'local', 'url', 'dropbox'],
  dropboxAppKey: '1dsf42dl1i2' },  (error, result) => { });
Shutterstock source
The shutterstock option allows your users to log in to their own Shutterstock account, browse the assets and then select the ones to upload to Cloudinary. If they haven't yet purchased the Shutterstock asset they select, they can purchase it as part of this process.

Shutterstock login

To enable the Shutterstock source, add the following parameter to the method you use for creating the Upload widget:

sources (Array of strings) - Optional. If you add this parameter to limit the available options, make sure to include the shutterstock option.
For example:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  sources: [ 'local', 'url', 'shutterstock']}, (error, result) => { });
Getty Images source
The gettyimages option allows your users to log in to their own Getty Images account, browse the assets and then select the ones to upload to Cloudinary. If they have not yet purchased the asset they select, they can purchase it as part of this process.

gettyimages login

To enable the Getty Images source, add the following parameter to the method you use for creating the Upload widget:

sources (Array of strings) - Optional. If you add this parameter to limit the available options, make sure to include the gettyimages option.
For example:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  sources: [ 'local', 'url', 'gettyimages']}, (error, result) => { });
iStock source
The istock option allows your users to log in to their own iStock account, browse the assets and then select the ones to upload to Cloudinary. If they haven't yet purchased the iStock asset they select, they can purchase it as part of this process.

iStock login

To enable the iStock source, add the following parameter to the method you use for creating the Upload widget:

sources (Array of strings) - Optional. If you add this parameter to limit the available options, make sure to include the istock option.
For example:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  sources: [ 'local', 'url', 'istock']}, (error, result) => { });
Unsplash source
The unsplash option allows your users to browse the assets on Unsplash, and then select the ones to upload to your Cloudinary account.

Unsplash login

To enable the Unsplash source, add the following parameter to the method you use for creating the Upload widget:

sources (Array of strings) - Optional. If you add this parameter to limit the available options, make sure to include the unsplash option.
For example:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  sources: [ 'local', 'url', 'unsplash']}, (error, result) => { });
Note
Some of the Unsplash filters are available only after conducting a textual search.

Google Drive source
The google_drive option allows your users to login to their own Google Drive account, browse through their files and then select the files to upload to Cloudinary.

Google Drive source

To enable the Google Drive source, add the following parameters to the method you use for creating the Upload widget:

sources (Array of strings) - Optional. If you add this parameter to limit the available options, make sure to include the google_drive option.
googleDriveClientId (String) - Optional. The Client ID of your own Google Drive application for accessing your users' Google Drive accounts. If not provided, uses the Cloudinary Google Drive app.
For example:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  sources: [ 'local', 'url', 'google_drive'],
  googleDriveClientId: '1wsds35jrt34dsssw21' }, (error, result) => { });
Note
The Google Drive source is not supported by either Internet Explorer 11 or by Safari browsers.

API events
The Upload widget methods include a callback function for implementing event handling. The callback has the following signature: function(error, result), where error is either null if successful or an error message if there was a failure, while result is a JSON object detailing the triggered event.

For example, to log a message to the console when a user clicks the 'show completed' button:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  showCompletedButton: true,  
  }, (error, result) => {
       if (!error && result.event === "show-completed") {
     result.info.items.forEach((item) => {
       console.log(`show completed for item with id:
      ${item.uploadInfo.public_id}`); //uploadInfo is the data returned in the upload response
    });
  }
});
For a full listing of available events, see the Events section in the Upload widget API reference.

Pre-batch validation
If you need to run any validation on the files in the upload queue before they are uploaded to Cloudinary, you can set the preBatch parameter with a function to run beforehand. If the code in your function determines that the upload should be canceled, you can include the cancel boolean parameter set to true when calling the callback function.

For example, to cancel the upload if the file name is 'TopSecret':

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  preBatch: (cb, data) => {
    if (data.files[0].name === "TopSecret") {
      cb({cancel: true}); 
    }
    else { 
      cb(); 
    }
  }, (error, result) => { });
Prepare upload parameters
If you need to do any preparation on the files in the upload queue before they are uploaded to Cloudinary, you can set the prepareUploadParams parameter with a function to run beforehand. Use this function to prepare any upload parameters you might need, such as to specify tags or metadata for each file, or even prepare an upload signature for a signed upload, as in the following example:

JS

cloudinary.openUploadWidget({
  upload_preset: "preset1",
  cloud_name: "demo",
  prepareUploadParams: (cb, params) => {
    params = [].concat(params);  //params can be a single object or an array of objects
    Promise.all(params.map((req) =>
      makeAjaxRequest("https://mysite.example.com/prepare", req)
        .then((response) => Object.assign({
          signature: response.signature,
          apiKey: response.api_key,
        }, response.upload_params))
    ))
      .then((results) =>
        cb(results.length === 1 ? results[0] : results));
  }
}, (error, result) => { });
Notes
The prepareUploadParams callback only supports preparing the following parameters: apiKey, auditContext, context, folder, invalidate, metadata, overwrite, publicId, qualityAnalysis, resourceType, signature, tags, uniqueFilename, uploadPreset uploadSignatureTimestamp, useFilename.
If the prepareUploadParmas parameter is included then the uploadSignature parameter is ignored. If you also need to provide a signature, make sure to include that code in your prepareUploadParams function and pass the signature as part of the data passed to the callback (cb).
If the code in your function determines that the upload should be canceled, you can include the cancel boolean parameter set to true when calling the callback function (the same way you can cancel the upload with Pre-batch validation).
Tagging suggestions
You can add tagging suggestions that appear while your users are typing in the Add a Tag (Advanced options) text field, by providing a function that is called whenever the text changes in the field. Your function should call the callback function with the list of tagging suggestions to display. Add the getTags parameter with the function to call, and make sure to also set the showAdvancedOptions parameter to true.

The following example demonstrates a mini auto-complete function that returns only suggestions matching the current text entered in the field:

JS

const tags = ["extract", "amazing", "apple", "dog", "grass", "planes", "rocket", "rock", "movies", 
  "music", "sad", "light", "open", "mosaic", "entertainment", "test", "testament", "beach", 
  "vacation", "weather", "letter", "orchard"];
const getMyTags = (cb, prefix) => cb(prefix ? tags.filter((t) => !t.indexOf(prefix)) : tags);

cloudinary.openUploadWidget({
  cloudName: "demo", 
  uploadPreset: "preset1",
  showAdvancedOptions: true,        
  getTags: getMyTags, //provide callback to retrieve tagging suggestions
  }, (error, result) => { });
Here's the Upload Widget with tagging enabled:

Upload widget - tagging

Upload preset selection
You can offer your users an additional Advanced option with a selection of Upload Presets to choose from, by providing a function that is called to provide the list of presets to offer. Your function should call the callback function with the list of tagging suggestions to display. Add the getUploadPresets parameter with the function to call, and make sure to also set the showAdvancedOptions parameter to true.

The following example demonstrates a upload preset selection function that returns 3 presets:

JS

const presets = ["signed", "video", "eager"];
const getMyUploadPresets = (cb) => cb(presets);

cloudinary.openUploadWidget({
  cloudName: "demo", 
  uploadPreset: "preset1",   // default preset
  showAdvancedOptions: true,
  getUploadPresets: getMyUploadPresets
  },  (error, result) => { });
Here's the Upload Widget with upload preset selection enabled:

Upload widget - upload preset selection

Look and feel customization
The look & feel of the Upload widget can be fully customized. You can modify the colors, fonts, and other elements by providing your own customization.

Custom styling is specified using the styles parameter, which accepts a JSON structure defining the default elements to override. Styles are further divided as follows:

palette for defining the colors of the various elements as an RGB or RGBA hex triplet or quadruplet, or a 3- or 4-digit RGB/RGBA hex.
fonts for defining the font to use for all the text elements. Currently the widget only supports fonts from Google (available via fonts.googleapis.com).
The following example sets all elements to their default values (for reference purposes) - in practice you only need to include the elements you want to override:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  styles:{
    palette: {
      window: "#FFF",
      windowBorder: "#90A0B3",
      tabIcon: "#0E2F5A",
      menuIcons: "#5A616A",
      textDark: "#000000",
      textLight: "#FFFFFF",
      link:  "#0078FF",
      action:  "#FF620C",
      inactiveTabIcon: "#0E2F5A",
      error: "#F44235",
      inProgress: "#0078FF",
      complete: "#20B832",
      sourceBg: "#E4EBF1"
    },
    frame: {
      background: "#0E2F5B99"
    }
    fonts: {
        "'Cute Font', cursive": "https://fonts.googleapis.com/css?family=Cute+Font",
    }
  }, (error, result) => { });
Tip Use the Upload widget Demo page to visualize the Upload widget customization options, and when you are happy with the colors you have selected, Copy the palette customization code to the clipboard.
Localization
The text used in the Upload widget can be fully customized for different languages. The translations for each language are specified using the text parameter, which accepts a JSON structure defining the value to use for each text element in each language. The language parameter sets which of the language options to use from those defined in the text parameter (en by default). To override any of the default values, you only need to include the elements you want to override.

All the default values can be found at: https://upload-widget.cloudinary.com/global/text.json.

For example, to only customize the queue title, queue title_uploading_with_counter, and the crop title:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  language: "en",  
  text: {
    "en": {
        "queue": {
            "title": "Files to upload",
            "title_uploading_with_counter": "Uploading {{num}} files"
        },
        "crop": {
            "title": "Crop your image"

        }
    }
  }
}, (error, result) => { });
Note Elements that support a variable value (specified inside double braces {{...}}) are replaced with the actual value at runtime. Only the elements that already contain the double braces in the default localization file support variables.
Encryption
Files can be encrypted and then uploaded to Cloudinary as raw files. These files cannot be previewed within Cloudinary and will need to be decrypted after downloading them. To add this feature to the Upload widget, add the encryption parameter and include an encryption key and initialization vector (key and iv).

To encrypt the file, the widget uses the browser's AES-GCM TextEncoder encryption with the SubtleCrypto library.

For example:

JS

cloudinary.openUploadWidget({
  cloudName: "demo", uploadPreset: "preset1",
  encryption: {
    key: "ff234fe526725753fa45b53325", 
    iv: "cd8a46d72e26a365dca78ef"
  }
}, (error, result) => { });
Decryption
Files that are uploaded and encrypted by the widget can be decrypted using the AES-GCM SubtleCrypto library. The library offers methods for decrypting a file using the encryption key and initialization vector provided when uploading the file (the same encryption key and iv configured for the widget).

The decrypt method accepts the key, iv, and a buffer - the file in base64 format:

JS

subtleCrypto.decrypt(
  {
    name: "AES-GCM",
    iv: iv
  },
  key,
  buffer
);
For example, using the decrypt method that passes the "dog.jpg" file in base64 format, a key of "ff234fe526725753fa45b53325", and an iv of "cd8a46d72e26a365dca78ef":

JS

const response = await fetch('https://res.cloudinary.com/demo/image/upload/shirt.jpg');
const buffer = await response.arrayBuffer();
let decryptedFile = await subtleCrypto.decrypt(
  {
    name: "AES-GCM",
    iv: "cd8a46d72e26a365dca78ef"
  },
  'ff234fe526725753fa45b53325', 
  buffer
);
Notifying server side code
If you are implementing the widget and also need to process that information in your server side code, the best solution is to include a notification URL in the uploadPreset parameter for the widget. You can then parse the response you get from the widget upload.

In the following Python example, the widget response is used to store the image model:

Python

from cloudinary import CloudinaryResource

# Retrieve the response sent to the notification_url. 
# The response will have the format of: { "public_id": "test", "type": "upload", . . . }
json_response = # your code to retrieve the JSON response sent to the notification_url 

# Populate a CloudinaryResource object using the upload response
result = CloudinaryResource(public_id=json_response['public_id'], type=json_response['type'], resource_type=json_response['resource_type'], version=json_response['version'], format=json_response['format'])

str_result = result.get_prep_value()  # returns a CloudinaryField string formatted as "<resource_type>/<type>/v<version>/<public_id>.<format>" e.g. "image/upload/v123456789/test.png" 

# Save the result
p = Photo(title="title",image=str_result)
p.save()  # save result in database

Upload widget reference
For details on all the available methods, parameters and events, see the Upload widget reference.

Accessible navigation
The Upload widget enables keyboard accessibility, attending to users who only use a keyboard (unable to use a mouse) or are visually impaired and use a keyboard and a screen reader. Upload widget end users can use the following keyboard actions as set by accessibility standards:

Tab and Shift+Tab to navigate forwards and backwards between the sources tabs, and Enter to select.
On the 'My Files' source tab:
Tab to the 'Select Files' button, and Enter to select.
Keyboard search and navigation in the dialog that opens for selecting a file (as supported by the operating system).
On the preview screen, Tab between Upload, Reset, Back and Close, and Enter to select (keyboard crop is currently not supported).