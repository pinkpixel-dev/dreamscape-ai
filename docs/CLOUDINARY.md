Image & Video APIs
Guides
Upload
Client-side uploading
Client-side uploading
Last updated: Apr-30-2025

The upload API method uploads files to Cloudinary via your server-side code. For example, if you have a web form that allows your users to upload media files, the file data is first sent to your server and only then uploaded to Cloudinary.

In some cases, you may prefer to upload user-generated content directly from the browser or your mobile app to Cloudinary instead of going through your servers. This allows for faster uploading and better user experience for your visitors. It also reduces load from your servers and reduces the complexity of your applications.

Client-side uploading can be implemented as follows:

A Direct call to the API for a pure client-side app with no backend, where you want to design your own custom interface for uploading files.
Cloudinary's Upload widget is an interactive, feature rich, simple to integrate method to upload files directly to Cloudinary, eliminating the hassle of developing an in-house interactive file upload solution.
Directly upload from a browser via a Cloudinary backend SDK and Cloudinary's jQuery plugin, while bypassing your own servers.
On this page:
Direct call to the API
Upload widget
Direct uploading from the browser via a backend SDK
Upload multiple assets
Display preview thumbnails and indicate upload progress
Deleting client-side uploaded assets
Rate this page:

    
Direct call to the API
If you don't want to (or can't) use the Cloudinary SDKs for uploading, you have the option to use Cloudinary's REST API directly to upload files to your product environment. The following Code explorers cover some scenarios for uploading using the REST API:

Upload multiple files using a form (unsigned) via an unauthenticated POST request and client-side code.
Chunked asset upload from the client-side for uploading large files using pure client-side code, in this case React.
Upload multiple files using a form (signed) with authenticated requests that need to call a server-side component to generate a signature.
Code explorer: Upload multiple files using a form (unsigned)
This example shows one way to upload selected local files to Cloudinary using a direct call to the REST API without using the SDKs. The call is made via an unauthenticated POST request as this is purely client-side code, so an unsigned upload preset (docs_upload_example_us_preset) is used.


This code is also available in GitHub.

Note For security reasons, the upload preset used in this example sets the access control mode of the uploaded assets to restricted, so the URLs returned in the response will return 404 errors.
Tip Enjoy interactive learning? Check out more code explorers!
Code explorer: Chunked asset upload from the client-side
Although the Cloudinary SDKs include the upload_large method for chunked asset uploading, here's an example of uploading large files using pure client-side code, in this case React. The code explorer makes use of the byte Content-Range entity-header HTTP specification to send the file in multiple calls.

Run the app
To try this out you'll need an unsigned upload preset configured for your product environment.

Set your cloud name and the name of the upload preset in Chunked.tsx.


This code is also available in GitHub.

Tip Enjoy interactive learning? Check out more code explorers!
Code explorer: Upload multiple files using a form (signed)
This example shows one way to upload multiple files to Cloudinary using direct calls to the REST API. To perform an authenticated request, you need to call a server-side component to generate a signature using your API secret, which should never be exposed on the client side. Having obtained the signature and timestamp from your server, you can use similar code to the unauthenticated example, just appending your API key, timestamp and signature to formData. See signed-uploads/public/js/uploadclientform.js in the following example.

Run the app
Click Remix to Edit
Enter your Cloudinary credentials in signed-uploads/public/js/config.js
Click View App
Click the Upload Files Using a Form link

This code is also available in GitHub.

Tip Enjoy interactive learning? Check out more code explorers!
Upload widget
Cloudinary's upload widget is an interactive, feature-rich, simple to integrate method to allow your users to upload media files directly to Cloudinary. The widget eliminates the hassle of developing an in-house interactive file upload solution.

Cloudinary's upload widget includes a complete graphical interface and allows your website visitors to upload files from multiple sources. For example, one or more local files, a remote file (URL) or just snapping a photo directly from the computer or mobile device's camera. The widget supports drag & drop functionality, interactive cropping, upload progress indication and thumbnail previews, and also monitors and handles uploading errors. The upload widget's behavior can be configured and the look & feel can be customized.

Upload widget main screen

Cloudinary's upload widget requires pure JavaScript to integrate and is easy to use with any web development framework. Advanced features are also available when using jQuery.

Integrating the widget in your site is very simple. First, include the remote JavaScript file of the upload widget:

Javascript

<script src="https://upload-widget.cloudinary.com/latest/global/all.js" type="text/javascript"></script>
The upload widget can now be opened programmatically with, for example, the cloudinary.openUploadWidget method:

Javascript

<script type="text/javascript">  
  cloudinary.openUploadWidget({ cloud_name: 'demo', upload_preset: 'a5vxnzbp'}, 
    function(error, result) { console.log(error, result) });
</script>
For more information and specific details, including the parameters used in the openUploadWidget method, see the Upload Widget documentation.


Direct uploading from the browser via a backend SDK
This section gives details on how to use one of Cloudinary's Backend SDKs to upload a file directly to Cloudinary and bypass your own servers. This is enabled by Cloudinary's jQuery plugin, which requires a small setup: including jQuery, Cloudinary's jQuery plugin, jQuery-File-Upload plugin files and defining your cloud name and API Key. For more information on direct uploading from the browser see the relevant SDK integration guide.

Activate signed client-side asset uploading by embedding an upload input field in your HTML pages. The Cloudinary SDKs have helper methods (e.g., the cl_image_upload_tag method) that automatically add a file input field to your form. Selecting or dragging a file to this input field will automatically initiate uploading from the browser to Cloudinary. For example, using Ruby on Rails (other frameworks use the same concept):

Ruby

cl_image_upload_tag(:image_id, options = {})
When uploading is completed, the identifier of the uploaded asset is set as the value of the given input field in your HTML page (the image_id parameter in the example above). You can then process the identifier received by your controller and store it for future use, exactly as if you're using standard server side uploading.

Note If you manually create your own file input field (i.e., you don't use one of Cloudinary's helper methods), make sure to include the name="file" attribute in the input field (e.g., <input id="upload-img" type="file" name="file">)
Upload multiple assets
The file input field can be configured to support multiple file uploading simultaneously by setting the multiple HTML parameter to true. You should manually bind to the cloudinarydone event to handle the results of multiple uploads. Here's an example:

Node.js
Python
PHP
Java
Go
Ruby

cloudinary.uploader.image_upload_tag(
  'image_id', { html: { multiple: 1 } });
Display preview thumbnails and indicate upload progress
Cloudinary's jQuery library also enables an enhanced uploading experience - show a progress bar, display a thumbnail of the uploaded file, drag & drop support and more.

Bind to Cloudinary's cloudinarydone event if you want to be notified when an upload to Cloudinary has completed. You will have access to the full details of the uploaded asset and you can display a cloud-generated thumbnail of the uploaded assets using Cloudinary's jQuery plugin.

The following sample code creates a 150x100 thumbnail of an uploaded image and updates an input field with the public ID of this image.

Javascript

$('.cloudinary-fileupload').bind('cloudinarydone', function(e, data) {  
  $('.preview').html(
    $.cloudinary.image(data.result.public_id, 
      { format: data.result.format, version: data.result.version, 
        crop: 'fill', width: 150, height: 100 })
  );    
  $('.image_public_id').val(data.result.public_id);    
  return true;
});
You can track the upload progress by binding to the following events: fileuploadsend, fileuploadprogress, fileuploaddone and fileuploadfail. You can find more details and options in the documentation of jQuery-File-Upload.

The following JavaScript code updates a progress bar according to the data of the fileuploadprogress event:

Javascript

$('.cloudinary-fileupload').bind('fileuploadprogress', function(e, data) { 
  $('.progress_bar').css('width', Math.round((data.loaded * 100.0) / data.total) + '%'); 
});
You can find some more examples as well as an upload button style customization in our Photo Album sample project.

Deleting client-side uploaded assets
The Cloudinary jQuery library supports using a delete token to delete assets on the client side for a limited time of 10 minutes after being uploaded. After 10 minutes have passed, the image cannot be deleted from the client side, only via the Destroy method of the Upload API or using the delete_resources method of the Admin API.

In order to also receive a deletion token in the upload response, add the return_delete_token parameter to the upload method and set it to true. This parameter is not supported when using unsigned uploads (although it can be set within the upload preset for the unsigned upload).

For example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
iOS
Android

curl https://api.cloudinary.com/v1_1/demo/image/upload -X POST -F 'file=@/path/to/sample.jpg' -F 'return_delete_token=true' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
The delete_token returned in the upload response can be used to delete the uploaded asset using the delete_by_token method of the jQuery SDK. For example:

Javascript

$.cloudinary.delete_by_token(delete_token)
Alternatively, you can access the delete_by_token endpoint directly with a POST request. For example:

Image & Video APIs
Guides
Upload
Customizing uploads
Customizing uploads
Last updated: Apr-30-2025

The upload method request of the Upload API must at least include the source of the file to upload, but Cloudinary also supports a wide range of optional parameters, from naming and storage options, to adding tags and metadata, as well as requesting analyses, moderation, and webhook notifications, calling add-ons, and even transforming the asset before storage. This page provides additional information on some of the most commonly used upload customizations.

Tip For a full listing of ALL the available optional parameters for the upload method, see the Upload API reference.
On this page:
File sources
Identification
Storage
Transformations
Metadata
Moderation
Analysis
Webhook notifications
Asynchronous processing
Events
Evaluating and modifying upload parameters
On Success update script
Rate this page:

    

File sources
Specifying the file to upload is required for all uploads. Cloudinary supports uploading files from various sources, including from a local path, a remote URL, a private storage URL (S3 or Google Cloud storage), a data stream, a Base64 data URI, or an FTP URL.

Upload from a local path
You can upload an asset by specifying the local path of a media file. For example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=@/path/to/sample.jpg&timestamp=173719931&api_key=436464676&signature=a781d61f86a6f818af'
Upload from a remote URL
If your assets are already publicly available online, you can specify their remote HTTP or HTTPS URLs instead of uploading the actual file or file data. In this case, Cloudinary will retrieve the file from its remote URL and upload it directly to Cloudinary. This option allows for a much faster migration of your existing media files. For example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=https://www.example.com/sample.jpg&timestamp=173719931&api_key=436464676&signature=a781d61f86a6f818af'
Upload from a private storage URL (Amazon S3 or Google Cloud)
If you have existing media files in a private storage (Amazon S3 or Google Cloud storage) bucket, you can upload files from a storage bucket URL.

Notes
You can also use your private storage bucket for lazy uploading using the auto-upload mapping functionality or for primary and backup storage.
When using your own backup storage, the backup location should not be touched or modified in any way. Additionally, no archiving policy should be enforced on that location (such as an archive policy to a glacier on S3 buckets).
To enable this option, your storage bucket must be whitelisted. This requires the following steps:

Add an empty file to your bucket with your cloud name as the filename, under the following folder structure: .wellknown/cloudinary/<your_cloud_name>

By adding this file, you indicate that you have access to this bucket and that you permit Cloudinary to access and modify this bucket's contents.
If you want this bucket to be whitelisted for more than one Cloudinary product environment, you can add an appropriately named file for each cloud name.
Provide Cloudinary with read access to your bucket:
- How to set read access on a private Amazon S3 bucket
- How to set read access on a Google Storage bucket

After your storage bucket is whitelisted, you can pass the Amazon S3 (s3://my-bucket/...) or Google Storage (gs://mybucket/...) URL in your upload method.

S3 example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=s3://my-bucket/my-path/example.jpg&timestamp=173719931&api_key=436464676&signature=a781d61f86a6f818af'
Google Cloud example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=gs://my_samples/sample.jpg&timestamp=173719931&api_key=436464676&signature=a781d61f86a6f818af'

How to set read access on a private Amazon S3 bucket
In Amazon's AWS S3 Console, select the relevant bucket.
In the Bucket Policy properties, paste the following policy text.
Keep the Version value as shown below, but change BUCKETNAME to the name of your bucket.
If a policy already exists, append this text to the existing policy:
Javascript

{
  "Version": "2012-10-17",
  "Id": "AWSConsole-AccessLogs-Policy-BUCKETNAME-cloudinary",
  "Statement": [
    {
      "Sid": "AWSConsoleStmt-BUCKETNAME-cloudinary",
       "Effect": "Allow",
       "Principal": {
         "AWS": "232482882421"
      },
       "Action": [
          "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::BUCKETNAME/*"
    }
  ]
}
Note Amazon S3 bucket names containing a . character are not supported for this purpose.

How to set read access on a Google Storage bucket
In your GCP console, go to your Google bucket's main page.
Select to edit bucket permissions.
Add service@cloudinary-gcs-production.iam.gserviceaccount.com as a member and give it the Storage Object Viewer role.
Upload data stream
You can upload an actual data stream (byte array buffer):

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=@/path/to/sample.jpg&timestamp=173719931&api_key=436464676&signature=a781d61f86a6f818af'
Note The Node.js SDK uses the dedicated upload_stream method.
Upload via a Base64 data URI
You can upload a file by specifying the Data URI of the file in Base64 encoding (no larger than 60 MB). For example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==&timestamp=173719931&api_key=436464676&signature=a781d61f86a6f818af'
Upload from an FTP URL
You can upload a media file by specifying a remote FTP URL. For private FTP servers, the username and password must be included as parameters with the FTP URL syntax taking the form: ftp://<user>:<password>@<host>:<port>/<url-path>. For example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=ftp://user1:mypass@ftp.example.com/sample.jpg&timestamp=173719931&api_key=436464676&signature=a781d61f86a6f818af'

Identification
Cloudinary provides various identifiers to help you identify and then deliver your asset.

Public ID - The primary unique identifier that is used to reference the asset as well as for building dynamic delivery and transformation URLs. If you don't specify a public_id, Cloudinary will randomly assign a public ID in the response from the upload API call, although you would generally want to specify a more readable and SEO-friendly public ID.
Asset ID - Cloudinary randomly assigns an asset ID to every uploaded asset, and returns this value in the upload response. This is an automatically generated immutable asset identifier that is fully unique and enables developers to reliably reference the asset programmatically, even if the public ID value changes.
Asset folder - The folder where the asset is located. You can move assets between asset folders and rename an asset folders without affecting the asset's public ID value and delivery URL path.
Display name - You can change the display name without affecting the asset's public ID value and delivery URL path.
Note Asset folder and Display name are not available on product environments using the legacy fixed folder mode
Public ID
Every asset uploaded to Cloudinary is assigned a unique identifier in the form of a public ID, which is a URL-safe string that is used to reference the uploaded resource as well as for building dynamic delivery and transformation URLs. You can also browse and search resources by public IDs in Cloudinary's Media Library web interface.

If you don't supply a public ID in the upload API call, you will receive a randomly assigned public ID in the response from the upload API call. A randomly generated public_id looks something like this: 8jsb1xofxdqamu2rzwt9q. The resulting delivery URL for such an asset would be something like:

https://res.cloudinary.com/cld-docs/image/upload/8jsb1xofxdqamu2rzwt9q.jpg

You can set the public_id parameter when you upload an asset, which is useful when you want your delivery URLs to be more readable and SEO-friendly. For example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST -F 'file=@/path/to/sample.jpg' -F 'public_id=sample_id' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
This section contains the following topics:

Public ID naming preferences
Including a path in the public ID
Public ID naming preferences
To tell Cloudinary to use the original name of the uploaded file as its public ID, include the use_filename parameter and set it to true. The file name will be normalized to include only URL-safe characters, and a set of random characters will also be appended to ensure the uniqueness of the public ID. By also including the unique_filename parameter and setting it to false, you can tell Cloudinary not to attempt to make the public ID unique, and just use the normalized file name. The following code example will upload the image file with the filename, sample_file.jpg and ensure that the public ID of the asset is set to sample_file:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST -F 'file=@/path/to/sample.jpg' -F 'use_filename=true' -F 'unique_filename=false' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
Notes
The public ID value for image and video asset types should not include the file extension. If you include a . character in a public ID, it's simply another character in the public ID value itself. The format (extension) of a media asset is appended to the public_id when it is delivered. For example, if you specify myname.mp4 as the public_id, then the video would be delivered as myname.mp4.mp4.
For raw asset types only, the file extension should be specified as part of the public_id.
Public IDs can be up to 255 characters, including non-English characters, periods (.), forward slashes (/), underscores (_), hyphens (-).
Public ID values cannot begin or end with a space or forward slash (/). Additionally, they cannot include the following characters: ? & # \ % < > +

Including a path in the public ID
The public ID value can include path elements (slashes) for more structured delivery URLs and to assist with SEO. For example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST -F 'file=@/path/to/sample.jpg' -F 'public_id=path1/path2/my_asset_name' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
Notes
You cannot use v followed by numeric characters as the name of a path element in your public ID.
You cannot use /images/ or /videos/ as a path element in your public ID. Those names are reserved for use with dynamic SEO suffixes.
It's recommended to avoid using public ID path names starting with 1-3 characters followed by an underscore, such as my_path. By default, Cloudinary assumes that URL components following that pattern represent a Cloudinary transformation component. If the first path element of a public_id does follow that pattern, then when delivering assets from that path, you must separate the last transformation component from the path element with a version component. For example:

https://res.cloudinary.com/my_cloud/image/upload/t_transf1/t_transf2/v1/my_path/sample.jpg
For details on delivering public IDs in a path structure with or without versions, see Asset versions.
The effect on the Media Library of including path elements in public IDs depends on whether your product environment is using fixed folder mode or dynamic folder mode.
If Dynamic folders mode is enabled on your product environment, slashes in a public ID do not impact how the asset is organized in the Media Library. Additionally, if in this mode, you should use the new asset_folder parameter instead of the folder parameter mentioned above to set the Media Library folder. Whether or not you define an asset folder for purposes of organizing assets in the Media Library, if you also want your public_id to include slashes, make sure to use one of the options available in that mode to set the public ID path.
If your product environment is using the legacy fixed folder mode, then including slashes in a public ID will also create folders in the same structure in the Media Library. If an asset is moved to a different folder in the Media Library, that results in a change to the asset's public ID.
Replacing existing assets
An existing image or video asset will be replaced by a newly uploaded file when overwrite is set to true and:

You upload a new media asset while specifying its public_id to be the same as an existing asset
The asset gets the same public ID as an existing one via the use_filename=true upload option
You use an upload preset where one of the above options is applied
If backups are enabled for your product environment, then when an asset is replaced, the previous version is backed up and can be restored if needed.

However, if the original (older) asset has already been generated and accessed, it might already be cached on the CDN. If an end-user accesses the identical URL soon after you overwrote the asset, they will still be accessing a CDN cached version rather than the new updated one.

You can ensure that a new version of an asset is delivered by setting the optional invalidate parameter to true when you overwrite an existing asset. This invalidates the previous media asset throughout the CDN. Note that it usually takes between a few seconds and a few minutes for the invalidation to fully propagate through the CDN.

Tip An alternative method of ensuring that the latest versions of assets are delivered is to include version values in your delivery URLs. This method requires updating your delivery URLs in your production code when new versions of an asset are uploaded, but the change takes effect immediately. For details, see Asset versions.
Notes
Depending on your product environment setup, overwriting an asset may clear the tags, contextual, and structured metadata values for that asset. If you have a Master admin role, you can change this behavior for your product environment in the Media Library Preferences pane, so that these field values are retained when new version assets overwrite older ones (unless you specify different values for the tags, context, or metadata parameters as part of your upload).
There are a number of important considerations when using the invalidate functionality. For example, if there is no version number in a URL that includes a public ID with slashes, then by default, those URLs are not invalidated. For details on invalidating media assets, see Invalidating cached media assets on the CDN.
See also: Backups and version management

Storage
Cloudinary stores your assets in storage buckets (S3 or Google Cloud Storage) according to its asset type, and also allows you to restrict access to your assets as necessary.

Asset types: Assets are uploaded as type image, video, or raw. You can manually set the type or let Cloudinary automatically do it for you based on the source file.
Delivery types: Access to your assets can be restricted based on the asset's delivery type: upload (public), private, or authenticated.
Asset types
Cloudinary supports many different file formats, which are categorized into three different asset types (resource_type in the API):

image (including animated images, PDFs and 3D models). For supported file formats, see Supported image formats and Uploading 3D models.
video: All video and audio files. For supported file formats, see Supported video formats and Supported audio formats.
raw (any other file type).
This section contains the following topics:

Passing the resource_type parameter to your upload call
The 'auto' resource_type
Uploading videos
Uploading 3D models
Uploading non-media files as raw files
Passing the resource_type parameter to your upload call
When uploading using the REST API, the resource_type is part of your upload endpoint.
When uploading using a backend SDK, image is the default resource_type. When uploading video or raw file types, you must pass the resource_type option either with the value auto or with the relevant specific asset type.
When using direct image uploading from the browser, resource type is set to auto by default.
Uploading a password-protected PDF as an image asset is not supported. If necessary, you can upload a password-protected PDF by setting the resource_type to raw in the upload command. However, keep in mind that like any other raw file, you can deliver a raw PDF as is, but PDF transformations are not supported for raw assets.
Note that for simplicity, many of the examples in this guide demonstrate uploading an image file. If you use these code examples as the basis for your own video or raw file uploads, don't forget to add the resource_type option.

Note If you try to upload a file format that isn't supported for a specified resource_type, then the upload will fail.
The 'auto' resource_type
The upload method also supports supplying auto as a value for the resource_type parameter. When you send this value, Cloudinary automatically detects the asset type of the uploaded file and automatically sets the relevant resource_type value for the stored asset.

For example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/auto/upload -X POST -F 'file=@/path/to/sample_spreadsheet.xls' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
The auto value is especially useful when you don't know what type of files your users will upload, or if you are uploading multiple files of different asset types with the same settings. When using auto as the resource_type along with other upload options, only the upload options relevant to a particular asset type are applied. Any options that work only with a different asset type are silently ignored.

Uploading videos
Uploading videos generally works the same and supports the same options as uploading images. However, when uploading videos, keep the following guidelines in mind:

The default value for the upload method resource_type parameter in SDKs is image, so you must set the resource_type parameter when uploading videos. You can set the resource_type parameter to auto to instruct Cloudinary to automatically detect the asset type, or you can set the parameter to video if you know in advance that you are uploading a video file.
By default, uploading is performed synchronously, and once finished, the uploaded video is immediately available for transformations and delivery. For videos larger than 100 MB, you will need to use chunked uploading.
There are also file-size limits for transforming larger videos on the fly. The exact limits depend on your account plan. Therefore, it's best practice to generate your video transformations eagerly on upload.
Here's a simple video upload example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/video/upload -X POST --data '<parameters>'
Audio files (such as MP3s) can also be uploaded as a video resource. Audio files are treated as video files without a visual element and thus are uploaded in the same way as videos, using video as the resource_type. For example, uploading a local audio file named audio_sample.mp3:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/video/upload -X POST -F 'file=@/path/to/audio_sample.mp3' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
Tip The Cloudinary Video Player provides a feature-rich and customizable interface to present your uploaded videos to your users and allows you to make use of functionality such as adaptive bitrate streaming and much more.
Uploading 3D models
Cloudinary supports 3D models in various formats. Where the format requires a set of files (for example, textures or other images used in the model), you should zip the entire folder and upload the single ZIP file to Cloudinary.

In order to use 3D models in the Product Gallery and perform transformations on them, the 3D model needs to be uploaded as an image asset type to Cloudinary.

ZIP files are normally uploaded as raw files if the asset type is not specified. However, Cloudinary is able to detect some 3D models and upload them as image types, which is especially useful if uploading manually from within your Media Library.

If you are uploading a 3D model programmatically, you can explicitly set resource_type to image. For example, to upload the 3D model archived in the sample_3D.zip file:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST -F 'file=@/path/to/sample_3D.zip' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
Related topics
Using 3D models in the Product Gallery
Transformations on 3D models
Uploading non-media files as raw files
Any file that is not an image or video file is treated as a 'raw' file. Raw files are stored as-is when uploaded to Cloudinary. No transformations on uploaded raw files are available. However, you can deliver your raw assets through a dynamic CDN URL in the same way you deliver image and video assets.

Note Although the public IDs of image and video files do not include the file's extension, public IDs of raw files must include the original file's extension.
cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/raw/upload -X POST -F 'file=@/path/to/sample_spreadsheet.xls' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
Here's a sample response of a raw upload call, which is slightly different from an image or video upload response:

JSON

{
    "asset_id": "6b6f9976e6c3b438df6cdf51734f81e5",
    "public_id": "sample_spreadsheet.xls",
    "version": 1719316399,
    "version_id": "ca83ac916653dbc56f2a535ec11b800f",
    "signature": "99b492e6723b0e2f68e41c986a3fdaa04bb99e33",
    "resource_type": "raw",
    "created_at": "2024-06-25T11:53:19Z",
    "tags": [],
    "bytes": 6144,
    "type": "upload",
    "etag": "6155c9616c0f4701be72e8695710331f",
    "placeholder": false,
    "url": "http://res.cloudinary.com/cld-docs/raw/upload/v1719316399/sample_spreadsheet.xls",
    "secure_url": "https://res.cloudinary.com/cld-docs/raw/upload/v1719316399/sample_spreadsheet.xls",
    "asset_folder": "",
    "display_name": "sample_spreadsheet.xls",
    "original_filename": "sample_spreadsheet",
    "api_key": "614335564976464"
}

Converting raw files
The raw_convert upload parameter enables you to perform content conversion operations on the files you upload. Depending on the option specified for this parameter, you can either convert raw files to other formats or generate related raw files that can be used in conjunction with the image or video file you uploaded. Some of these are asynchronous operations and others are synchronous as detailed below.

For example:

Specify aspose as the value for your raw_convert parameter when uploading an Office document to instruct the Aspose Document Conversion add-on to generate a PDF image file from your raw office document. (Asynchronous)
Specify google_speech when uploading a video to instruct the Google AI Video Transcription add-on to generate an automatic transcript raw file from your uploaded video. (Asynchronous)
Specify extract_text when uploading a PDF file to extract all the text from the PDF file and store it in a raw file. The extracted text is stored in a JSON file with a public ID in the format: [pdf_public_id].extract_text.json. The full URL of the generated JSON file is included in the upload response. Unlike the above raw_convert options, this option doesn't require registering for an add-on. (Synchronous)

Tips:
The text extraction result using the extract_text option may be different than the result you get if you use the OCR text detection and extraction add-on. For example, the OCR add-on includes exact coordinates of each line of text. Additionally, if your PDF contains images with text, the OCR add-on will capture this text, but the raw_convert:"extract_text" option will not.
You apply these options using the Upload Preset > Add-ons page of the Console Settings. This includes the Extract Text option, even though that option doesn't require an add-on.
Delivery types
By default, when uploading assets to Cloudinary, both the original asset and its transformed versions are publicly available through a CDN. One way to restrict access to your assets is based on the asset's delivery type.

Cloudinary supports three different delivery types (type in the API):

upload - The asset is publicly available. This is the default type when uploading files.
private - Original assets are only accessible by a signed URL.
authenticated - Original assets and all their asset derivations are only accessible through signed URLs.
Important This section only shows how to apply the type as part of your upload command. See the Media access methods documentation for more information on all the access control methods features and who can access your files and when.
This section contains the following topics:

Private assets
Authenticated assets
Private assets
You can upload assets as private to restrict access to the original asset and only allow access to derived (transformed) versions of the asset. The original asset can be accessed only with a signed URL, but by default, all derived versions of the asset are accessible. You can further restrict access to the derived asset by activating the Strict Transformations mode. This mode also prevents access to the derived versions of the asset, except for those that have been specifically enabled (e.g., with watermarks) that are then available for public delivery to your users. With Strict Transformations enabled, you need to either eagerly generate all derived assets, mark specific transformations as allowed or use signed URLs.

To upload an asset as a private asset, you set the type parameter to private (instead of the default upload) when uploading the asset to Cloudinary. For example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/private -X POST -F 'file=@/path/to/sample.jpg' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
An asset that was uploaded as 'private' cannot be accessed publicly without a signed URL. For example, the following URL returns an error:

https://res.cloudinary.com/cld-docs/image/private/sample.jpg

Note You can make a private original asset temporarily accessible, for example, to enable a customer to access a stock photo on your site after she purchases it. To do this, you need to deliver a time-limited and signed URL. You can do this directly using the API or you can use the private_download_url Utils method, which generates a time-limited, signed URL link to the original asset, which you can then provide to relevant customers. For details, see Providing time-limited access to private assets.
Authenticated assets
You can upload assets as authenticated to even further restrict access to both the original asset and to the derived (transformed) versions of the asset. Authenticated assets and their derived versions cannot be accessed without some form of authentication. For more information see Authenticated access to media assets.

To upload an asset as an authenticated asset, you set the type (type parameter) to authenticated (instead of the default upload) when uploading the asset to Cloudinary. For example:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/authenticated -X POST -F 'file=@/path/to/sample.jpg' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
If an asset was uploaded as 'authenticated', neither the asset nor any of its derived resources can be accessed without authentication. For example, the following URL returns an error:

https://res.cloudinary.com/cld-docs/image/authenticated/sample.jpg

Transformations
Cloudinary's transformations can be used while uploading an asset in one of two ways:

Eager transformations: Generate transformed assets after the upload completes, so that those transformations will already be available for delivery before your users access them for the first time.
Incoming transformations: Transform the original asset as part of the upload and before storing it in Cloudinary.
Eager transformations
You can eagerly generate transformed assets after the upload completes, so that those transformations will already be available for delivery before your users access them for the first time. These transformations are generated in addition to storing the original asset as is. Eager transformations are useful for pre-generating transformations:

For large images or videos that can take a while to generate.
For AI analyses, or other asynchronous operations, such as those performed by some Cloudinary add-ons.
In the case that you want to enable Strict Transformations and limit access to dynamic URLs.
Tip You can tell Cloudinary to generate eager transformations in the background by setting the eager_async parameter to true and providing an eager_notification_url.
For example, you can eagerly generate transformed assets while uploading them by also specifying the eager parameter in the upload method. The following code uploads the sample.jpg image and then additionally generates two transformed images:

Pad to a width of 400 pixels and height of 300 pixels.
Crop to a width of 260 pixels and a height of 200 pixels with north gravity.
cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=sample.jpg&eager=w_400,h_300,c_pad|w_260,h_200,c_crop,g_north&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af'
The delivery URLs for these eagerly generated transformations:

URL

https://res.cloudinary.com/cld-docs/image/upload/w_400,h_300,c_pad/sample.jpg
URL

https://res.cloudinary.com/cld-docs/image/upload/w_260,h_200,c_crop,g_north/sample.jpg
Incoming transformations
Transform the original asset as part of the upload and before storing it in Cloudinary. This is especially useful to normalize user-generated content, for example to limit the resolution size or clip a long video to a maximum duration.

For example, you can transform an asset while uploading, and before storing, by also specifying the transformation parameter in the upload method. The following code limits the dimensions of an uploaded image to a width of 2000 pixels and a height of 1000 pixels:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=sample.jpg&transformation=w_2000,h_1000,c_limit&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af'
Metadata
There are three types of metadata that can be stored with your assets: structured metadata, contextual metadata, and tags. These types of metadata are useful for searching assets based on a value or field value pair, or as a method of marking assets for a particular purpose in your end-user application.

This enables other users to decide which assets get which field values or tags, while you use custom metadata API methods to implement the application side based on the values they set. Available metadata options include:

Tags: Tags are used to categorize and organize your assets, and can also be used to bulk delete assets, create sprites, ZIP files, JSON lists, and generate PDFs and animated GIFs. Cloudinary also provides various AI-based add-ons to help you automatically tag your assets, where assets are automatically assigned resource tags based on the detected scene categories.
Contextual metadata: custom key-value pairs that you can assign to individual assets.
Structured metadata: custom fields are defined, along with data types and validations, at a global level, and are added to all assets in the product environment. You assign their values per asset.
Tip See the Custom metadata comparison table for more details on the difference between metadata types.
The following example demonstrates using the Google Auto Tagging to automatically tag an uploaded image with all detected categories that have a confidence score higher than 0.6.

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST -F 'file=@/path/to/ice_skating.jpg' -F 'categorization=google_tagging' -F 'auto_tagging=0.6' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
Moderation
It's sometimes important to moderate assets that are uploaded to Cloudinary: to keep out inappropriate or offensive content, reject assets that do not answer your website's needs, or make sure that photos are of high enough quality before making them available on your website. You can manually mark an uploading image or video for moderation or use one of the AI-based add-ons to automatically moderate your assets.

Assets added to the moderation queue can then be reviewed in the Media Library.

For example, you can moderate assets while uploading them by specifying the moderation parameter in the upload method. The following code marks an image for moderation by the WebPurify's Image Moderation add-on and the Cloudinary Duplicate Image Detection add-on:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=user_photo.jpg&moderation=webpurify|duplicate:0&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af'
Analysis
When uploading assets to your Cloudinary product environment, you can request different types of analysis to be performed on the assets. In addition to Image quality analysis, Accessibility analysis, and Semantic data extraction, Cloudinary has a number of add-ons that enable various types of AI-based analyses.

For example, you can request quality and accessibility analysis on assets while uploading them by specifying the quality_analysis and accessibility_analysis parameters in the upload method. The following code uploads the user_photo.jpg image and requests analysis:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=user_photo.jpg&quality_analysis=true&accessibility_analysis=true&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af'
The following is an example of the response returned:

JSON

{
    "asset_id": "3515c6000a548515f1134043f9785c2f",
    "public_id": "gotjephlnz2jgiu20zni",
    "version": 1719307544,
    "version_id": "7d2cc533bee9ff39f7da7414b61fce7e",
    "signature": "d0b1009e3271a942836c25756ce3e04d205bf754",
    "width": 1920,
    "height": 1441,
    "format": "jpg",
    "resource_type": "image",
    "created_at": "2024-06-25T09:25:44Z",
    "tags": [],
    "pages": 1,
    "bytes": 896838,
    "type": "upload",
    "etag": "2a2df1d2d2c3b675521e866599273083",
    "placeholder": false,
    "url": "http://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
    "secure_url": "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
    "asset_folder": "",
    "display_name": "gotjephlnz2jgiu20zni",
    "quality_analysis": {
        "focus": 1.0
    },
    "accessibility_analysis": {
        "colorblind_accessibility_analysis": {
            "distinct_edges": 0.54,
            "distinct_colors": 0.95,
            "most_indistinct_pair": [
                "#DAD9D9",
                "#AFCA9D"
            ]
        },
        "colorblind_accessibility_score": 0.75
    },
    "original_filename": "user_photo",
    "api_key": "614335564976464"
}
Webhook notifications
Cloudinary provides a webhook notification feature for informing your backend about uploads. When the upload is completed, an HTTP POST request can be sent to a public notification URL you provide. The payload contains all the results pertinent to the upload.

For example, you can ask Cloudinary to send a notification when an asset finishes uploading, by specifying the notification_url parameter in the upload method. The following code uploads the sample.jpg image and then sends a notification to https://mysite.example.com/my_notification_endpoint.

Note A notification is sent to the destination you specified via the notification_url parameter in addition to any of the global notification URLs set to handle the upload.
For example, to add a notification_url to a specific upload call:

Node.js
Python
PHP
Java
Go
Ruby
.NET
CLI

cloudinary.v2.uploader
.upload("sample.jpg", 
  { notification_url: "https://mysite.example.com/my_notification_endpoint" })
.then(result=>console.log(result));
Asynchronous processing
By default, Cloudinary's upload works synchronously. Assets are uploaded and the requested processing from most of the added optional parameters is completed synchronously during an upload API call, and then the upload response is returned.

However, in some cases you may want to process the upload asynchronously in the background, especially uploads that require a relatively long time to process and may require your users to actively wait for the processing to finish. As the complete response may not be immediate, it is good practice to use asynchronous handling for these calls.

To make the call asynchronous, set the async parameter of the upload method to true. Cloudinary will return a short response immediately that the upload is pending together with a batch ID to track the upload. Once the upload and all processing completes, a notification is sent to the specified notification_url parameter or the global webhook Notification URL in the Webhook Notifications page of your Cloudinary Console Settings.

Note Some optional parameters will always be processed asynchronously, and the upload response will always come back with a status of "pending" as a status for those parameters (e.g., for moderation, transcription, raw_convert, etc). The async parameter affects when the initial upload response is returned, but even without the async parameter when adding those parameters, you should always include notification URLs to know when the additional processing is finished and available, and the status is no longer pending.
For example, to asynchronously upload an image, request the Content Analysis add-on to analyze the image and suggest a caption, and then send a notification to "https://mysite.example.com/upload_endpoint" when the processing is complete with the full upload response:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST -F 'file=@/path/to/toy_room.jpg' -F 'detection=captioning' -F 'async=true' -F 'notification_url=https://mysite.example.com/upload_endpoint' -F 'timestamp=173719931' -F 'api_key=436464676' -F 'signature=a781d61f86a6f818af'
The immediate response to an asynchronous upload call is short and looks similar to this:

JSON

{
  "status": "pending",
  "type": "upload",
  "batch_id": "a7877927ae1af0d1115485018ce92a6792c97938bb3edb9b0777d4663d6abbee"
}
When the processing is finished, the complete upload response is sent to the notification URL that you specified.

Tip You can also tell Cloudinary to generate eager transformations in the background by setting the eager_async parameter to true and providing an eager_notification_url.
Events
You can inject your own JavaScript code to be evaluated as part of the upload. The upload method offers the following parameters to pass your custom code:

eval - For evaluating and modifying upload parameters. Your code will be evaluated before the file itself is uploaded.
on_success - For executing an update script. Your code will be evaluated after the file itself is uploaded.
Evaluating and modifying upload parameters
The eval parameter allows you to modify upload parameters by specifying custom logic with JavaScript code that is evaluated when uploading a file to Cloudinary. This can be useful for conditionally adding tags, contextual metadata and structured metadata depending on specific criteria of the uploaded file.

The eval parameter accepts a string of up to 4095 characters with the JavaScript code to be evaluated.

Tip If you need to execute eval code larger than 4095 characters, refer to the Storing larger eval payload as an authenticated raw file section for instructions.
There are two variables that can be used within the context of the JavaScript code snippet as follows:

resource_info - to reference the resource info as it would be received in an upload response. For example, resource_info.width returns the width of the uploaded resource.
The currently supported list of queryable resource info fields includes: accessibility_analysis1, asset_folder2, audio_bit_rate, audio_codec, audio_codec_tag, audio_duration, audio_frequency, audio_profile, audio_start_time, avg_frame_rate, bit_rate, bytes, channel_layout, channels, cinemagraph_analysis, codec, codec_tag, compatible, colors1, color_properties, coordinates, display_name2, duration, etag, exif, faces, filename, folder, format, format_duration, frame_rate, grayscale, has_alpha, has_audio, height, ignore_loop, illustration_score, media_metadata1, nb_audio_pckts, nb_frames, pages, phash1, phash_mh, pix_format, predominant, profile, quality_analysis1, quality_score, rotation, r_frame_rate, semi_transparent, start_time, time_base, video_bit_rate, video_duration, video_start_time, width

Footnotes
Available when also requesting Semantic data extraction and/or Accessibility analysis.
Not available on product environments using the legacy fixed folder mode.
upload_options - to assign amended upload parameters as they would be specified in an upload request. For example upload_options.tags = "new_tag". You can also assign values that would be returned in the response. For example upload_options.tags = "${resource_info.quality_score}
The following upload options can NOT be amended: eager_async, upload_preset, resource_type, and type.
For example, to add a tag of 'blurry' to any image uploaded with a quality analysis focus of less than 0.5:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=user_photo.jpg&quality_analysis=true&eval=\"if(resource_info.quality_analysis.focus<0.5){upload_options[\'tags\']=\'blurry\';}\"&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af'
Or, apply an eager transformation (c_fill,w_500,h_500) to images wider than 1000 pixels:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/cld-docs/image/upload -X POST --data 'file=large_image.jpg&eval="if(resource_info.width>1000){upload_options[\\'eager\\']=\\'c_fill,w_500,h_500\\';}"&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af'
Notes
If using the eval parameter in an upload preset and you also want to set the unique_filename parameter to be false, you need to explicitly set it as false in the eval, and not as a separate parameter in the preset (e.g., upload_options['unique_filename']=false).
If using the eval parameter and you also want the upload response to include face coordinates (by adding faces=true), you need to explicitly set the parameter to true in the eval (upload_options['faces'] = true).
You can update multiple metadata fields by separating the values with a pipe (|). For example upload_options.metadata = "quality = ${resource_info.quality_score} | resolution = ${resource_info.quality_analysis.resolution"
Tip Take a look at the profile picture sample project, which demonstrates the use of the eval parameter for quality analysis on upload in a Next.js app.
Storing larger eval payload as an authenticated raw file
When your eval parameter code exceeds the 4095-character limit, you can store it externally as a raw, authenticated file in your Cloudinary product environment. This method allows you to reference the larger payload securely during uploads.

Note Eval payloads stored this way must abide by the following restrictions:
Maximum file size: 10 KB
Avoid CPU-intensive operation
Upload your Javascript file containing the eval payload code to your product environment as a raw authenticated asset.
In the eval parameter of your upload preset or Upload API call, set the value to #RESOURCE_REF:<public_id>, where:
#RESOURCE_REF: indicates that the payload is located in a raw authenticated file within your product environment.
<public_id> is the public ID of the uploaded file. For example, _system/parse_taxonomy_on_upload.js.
On Success update script
The on_success parameter allows you to update an asset using custom JavaScript that is executed after the upload to Cloudinary is completed successfully. This can be useful for adding tags, contextual metadata and structured metadata, depending on the results of using the detection and categorization add-ons, which are only available after the file has already been successfully uploaded.

The on_success parameter accepts a string containing the JavaScript code to be executed. There are two variables that can be used within the context of the JavaScript code snippet as follows:

event or e - an object that encapsulates all the incoming data as follows:

upload_info - an object with all the resource info as it would be received in an upload response. For example, e.upload_info?.width returns the width of the uploaded resource.
status - either 'success' or 'failure'
current_asset - an object that references the asset and currently holds a single method:

update - the method to update that receives a hash of the data to update (data is replaced as a result of the update, not added to). The currently supported data fields include: tags, context, and metadata
For example, to upload an asset and update its contextual metadata (context) with the caption returned from the Cloudinary AI Content Analysis add-on, and add the tag 'autocaption' (current_asset.update({tags: ['autocaption'], context: {caption: e.upload_info?.info?.detection?.captioning?.data?.caption}})):

Upload
Last updated: Apr-30-2025


Using Cloudinary's upload capabilities, you can upload media assets in bulk with a variety of options for customizing how they will be uploaded.

When you upload to Cloudinary, your asset is not only stored, but Cloudinary also automatically analyzes and saves important data about each asset, such as format, size, resolution, prominent colors, etc. This data is also automatically indexed to enable searching on those attributes.

Cloudinary provides a secure and comprehensive API for easily uploading media files from server-side code, directly from the browser or from a mobile application. When needed, you can also use the API to perform unsigned uploads, but with a limited set of available upload parameters as a security precaution.

New to Cloudinary?
This guide provides an in-depth overview of Cloudinary's Upload API capabilities. To get started with the basics of uploading (and more) in 5 minutes or less, we recommend you first run through one of our backend SDK quick starts.

Each quick start gives you the code to configure your SDK, run your first upload, and then perform a few other common Cloudinary operations, all using your favorite programming language or framework.

If you haven't moved over your existing assets to Cloudinary yet, you may also want to check out our Migration guide.

On this page:
Quick examples
Basic uploading
Upload response
Upload considerations
Rate this page:

    
Quick examples
Example 1: Upload the local hat.jpg image, and use the filename to set the public ID.

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
Android

curl https://api.cloudinary.com/v1_1/demo/image/upload -X POST --data 'file=https://www.example.com/hat.jpg&use_filename=true&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af'
Example 2:

Upload a remote image from wikipedia
Set the public ID as "wiki_shirt"
Request color and quality analysis
Run the Google Auto Tagging add-on
Automatically add the detected categories as tags to the asset
cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android

curl https://api.cloudinary.com/v1_1/demo/image/upload -X POST --data 'file=https://www.example.com/https://upload.wikimedia.org/wikipedia/commons/0/01/charvet_shirt.jpg&public_id="wiki_shirt"&quality_analysis=true&colors=true&categorization="google_tagging"&auto_tagging=true&timestamp=173719931&api_key=436464676&signature=a788d68f86a6f868af'

Programmatic upload with the Node.js SDK video tutorial
Watch this video on how to quickly upload images, videos and other media files to Cloudinary using Cloudinary's Node.js SDK.



Play Video

This video is brought to you by Cloudinary's video player - embed your own!

Tutorial contents
Basic uploading
You can upload assets programmatically either by using authenticated uploads that include a signature, or using unauthenticated uploads without a signature but with certain restrictions for security reasons.

The upload API method enables you to upload files with a direct call to Cloudinary by sending an HTTPS POST request to the following Cloudinary REST API URL:

https://api.cloudinary.com/v1_1/<cloud name>/<resource_type>/upload

Where:

cloud name is the name of your Cloudinary product environment.
resource_type is the type of file to upload. Valid values: image, raw, video and auto to automatically detect the file type.
For example, to upload an image file to the Cloudinary 'demo' product environment, send an HTTPS POST request to the following URL:

https://api.cloudinary.com/v1_1/demo/image/upload

The contents of the POST request you send to Cloudinary depends on whether or not you are making an authenticated request or an unauthenticated request.

Uploading is performed synchronously, and once finished, the uploaded asset is immediately available for transformation and delivery.

Tips
Use the auto-upload feature for lazy migration of all your assets from a remote location to Cloudinary with minimal effort on your side.
 Enterprise customers can set up their account to use an EU or AP data center with the endpoints becoming api-eu.cloudinary.com or api-ap.cloudinary.com respectively.
Authenticated requests
Authenticated upload requests are performed over HTTPS using a secure protocol and include an authentication signature that is generated based on your product environment's cloud_name, api_key and api_secret parameters. This signature should be generated on your backend, as you should never expose your api_secret in client-side code.

Required parameters for authenticated requests:

file - The file to upload. Can be the actual data (byte array buffer), the Data URI (Base64 encoded), a remote FTP, HTTP or HTTPS URL of an existing file, or a private storage bucket (S3 or Google Storage) URL of a whitelisted bucket. See File source options for more details.
api_key - The unique API Key of your Cloudinary product environment.
timestamp - Unix time in seconds of the current time (e.g., 1315060076).
signature - A signature of all request parameters including the 'timestamp' parameter but excluding the 'api_key', 'resource_type', 'cloud_name' and 'file' parameters, based on your product environment's API secret. The signature is valid for 1 hour.
Cloudinary's backend SDKs wrap the Upload API and greatly simplify using the API methods, including automatically generating the authentication signature based on the product environment credentials provided in your SDK configuration. When using the SDKs to upload, the only parameter that's required is the file parameter: the api_key, timestamp and signature parameters are automatically added by the SDK.

There are also a large number of optional upload parameters available for customizing your upload, including naming, whether to apply manually specified or automatically generated tags and metadata, whether to apply incoming transformations or other AI-based analysis of the uploaded assets, and much more. See the optional upload parameters reference for the full list.

Note If you can't or don't want to use the SDKs, you can use Cloudinary's REST API directly, but you will need to manually generate the signature. See the Client-side uploading documentation for an example code explorer to upload multiple files from the client-side while using a backend component to generate the signature.
The Cloudinary upload method performs an authenticated upload API call over HTTPS using the following syntax:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android

https://api.cloudinary.com/v1_1/<cloud name>/<resource_type>/upload -X POST --data '<params>'
For example, to upload the sample.jpg file to the Cloudinary demo product environment:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android

curl https://api.cloudinary.com/v1_1/demo/image/upload -X POST --data 'file=sample.jpg&timestamp=173719931&api_key=436464676&signature=a781d61f86a6f818af'

Chunked asset upload
To support the upload of large files, the Cloudinary SDKs include a method which offers a degree of tolerance for network issues. The upload_large method uploads a large file to the cloud in chunks, and is required for any files that are larger than 100 MB. This is often relevant for video files, as they tend to have larger files sizes.

Tip If you can't or don't want to use the SDKs, you can make use of the byte Content-Range entity-header HTTP specification to send the file in multiple calls with the 'upload' endpoint of the REST API. See the Client-side uploading documentation for an example code explorer to upload large files in chunks from the client-side.
By default, when using the upload_large method, files are uploaded as raw files if the resource_type parameter is not specified. For more details about the resource_type option, see Asset types.

Note Any file larger than 20 GB also needs to be uploaded asynchronously by adding the async parameter set to true. If you need to upload very large files you can contact support to increase your upload limit up to 100 GB. You can see your current usage limits in your Console Account Settings.
For example, uploading a large video file named my_large_video.mp4:

Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

cloudinary.v2.uploader.upload_large("my_large_video.mp4", 
   { resource_type: "video" }, 
  function(error, result) {console.log(result, error); });
By default, the chunk size is set to 20 MB but can be set to as low as 5 MB by using the chunk_size parameter. For example, uploading a large video file named my_large_video.mp4 and setting chunk size to 6 MB:

Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

cloudinary.v2.uploader.upload_large("my_large_video.mp4", 
   { resource_type: "video" , 
    chunk_size: 6000000 }, 
  function(error, result) {console.log(result, error); });
Note There are multiple responses to a chunked upload: one after each chunk that only includes basic information plus the done : false parameter, and a full upload response that is returned after the final chunk is uploaded with done: true included in the response.
Unauthenticated requests
Unauthenticated upload requests are an option for performing upload without the need to generate an authentication signature on your backend. However, for security reasons, not all upload parameters can be specified directly when performing unsigned upload calls.

Unsigned upload options are controlled by an upload preset, so in order to use this feature you first need to enable unsigned uploading from the Upload Presets page of the Console Settings. An upload preset is used to define which upload options will be applied to assets that are uploaded unsigned with that preset specified. You can edit the preset at any point in time (or create additional upload presets), to define the parameters that will be used for all assets that are uploaded unsigned from user browsers or mobile applications. For more information on upload presets, see the upload preset guide.

Required parameters for unauthenticated requests:

file - The file to upload. Can be the actual data (byte array buffer), the Data URI (Base64 encoded), a remote FTP, HTTP or HTTPS URL of an existing file, or a private storage bucket (S3 or Google Storage) URL of a whitelisted bucket. See File source options for more details.
upload_preset - The name of an unsigned upload preset that you defined for unsigned uploading.
There are also a large number of optional upload parameters available for customizing your upload, including naming, whether to apply manually specified or automatically generated tags and metadata, whether to apply incoming transformations or other AI-based analysis of the uploaded assets, and much more. For security reasons, only this restricted set of parameters can be used in an unsigned upload request. However, most upload parameters can be defined as part of your unsigned upload preset.

The Cloudinary backend SDKs also support unsigned upload methods as an option for performing unauthenticated requests without the need to generate an authentication signature on your backend.

To perform an unsigned upload, call the unsigned_upload method of the Cloudinary SDKs while setting the upload_preset and cloud_name parameters. For example, to upload the sample.jpg file with the unsigned_1 upload preset:

cURL
Node.js
Python
PHP
Java
Go
Ruby
.NET
iOS
Android
CLI

curl https://api.cloudinary.com/v1_1/demo/image/upload -X POST --data 'file=sample.jpg&upload_preset=unsigned_1'
Tip If you can't or don't want to use the SDKs, you can use Cloudinary's REST API directly. See the Client-side uploading documentation for an example code explorer to upload a file from the client-side using a direct call to the REST API.
Upload response
A successful upload API call returns a response that includes the HTTP and HTTPS URLs for accessing the uploaded file, as well as additional information regarding the uploaded asset. Among these are the assigned public ID and current version of the asset (used in the Media Library, Admin API, and for building transformation and delivery URLs), the asset's dimensions, the file format and a signature for verifying the response. Depending on the optional parameters passed, the response might also include valuable analysis data such as detected faces, prominent colors, exif and other embedded metadata, quality/accessibility and other sophisticated media analysis data.

Important Cloudinary may add more fields to API responses and notifications in the future, so please ensure that your response parsing remains backwards compatible and wont be broken by the presence of unknown fields.
The following is an example of the JSON response returned:

JSON

{
  "asset_id": "3515c6000a548515f1134043f9785c2f",
  "public_id": "gotjephlnz2jgiu20zni",
  "version": 1719307544,
  "version_id": "7d2cc533bee9ff39f7da7414b61fce7e",
  "signature": "d0b1009e3271a942836c25756ce3e04d205bf754",
  "width": 1920,
  "height": 1441,
  "format": "jpg",
  "resource_type": "image",
  "created_at": "2024-06-25T09:25:44Z",
  "tags": [],
  "pages": 1,
  "bytes": 896838,
  "type": "upload",
  "etag": "2a2df1d2d2c3b675521e866599273083",
  "placeholder": false,
  "url": "http://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
  "secure_url": "https://res.cloudinary.com/cld-docs/image/upload/v1719307544/gotjephlnz2jgiu20zni.jpg",
  "asset_folder": "",
  "display_name": "gotjephlnz2jgiu20zni",
  "original_filename": "sample",
  "api_key": "614335564976464"
}
Note Although the URLs returned in the response are given with the version number, including the version in the delivery URL is optional.
Error handling
Once the POST request is received and processed by Cloudinary, the Upload API returns the status of requests using one of the following HTTP status codes:

200 - OK. Successful.
400 - Bad request. Invalid request parameters.
401 - Authorization required.
403 - Not allowed.
404 - Not found.
420 - Rate limited.
500 - Internal error. Contact support.
In the case of wrong usage of the API or an error, Cloudinary's response is returned with a non-OK (not 200) HTTP Status code and a body with the following JSON format:

Javascript

{ error: { message: "<< Error explanation here >>" } }
Upload considerations
There are various ways to upload your resources to your Cloudinary account. Cloudinary supports making both authenticated requests that require a signature generated on your backend, and unauthenticated requests with a restricted set of supported parameters.

The following table summarizes the main options to upload assets and some considerations to take into account for each of them:

Option	Description	Considerations
Cloudinary backend SDKs	The Cloudinary backend SDKs wrap the upload API, including taking care of the upload itself, the signature authentication and the response verification.	✅ Significantly simplifies the upload code compared to directly calling the REST API
✅ Automatically generates an authentication signature and validates the response
✅ Enables you to code in your chosen language
✅ Provides built-in support for uploading large files with chunked uploading
Upload widget	An interactive, feature-rich interface you can embed in your website or application to allow your users to upload assets directly to Cloudinary.	✅ No need to develop an in-house interactive file upload solution
✅ Simple to integrate
✅ Can be used for unauthenticated client-side uploads
✅ Enables uploading directly from a variety of social media & stock photo accounts
'upload' endpoint of the REST API	The upload endpoint of the Cloudinary API supports making both authenticated requests that require a signature be generated on your backend, and unauthenticated requests with a restricted set of supported parameters.	✅ Can be used for unauthenticated client-side requests
✅ Useful when coding in a language not covered by Cloudinary's SDKs
💡 Requires manually coding the upload and validating the response
💡 Requires a function on your backend to generate the signature for authenticated calls
Direct upload from a browser	The Cloudinary Backend SDKs can also be used to automatically add a file input field to your form that uploads files directly to Cloudinary, bypassing your own servers.	✅ Uploads directly to your account, bypassing your own servers
💡 Requires additional setup and configuration
💡 Requires the Cloudinary jQuery plugin
The Cloudinary CLI	The Cloudinary CLI (Command Line Interface) enables you to interact with Cloudinary through the command line and provides additional features and helper commands.	✅ Simple to use
✅ Useful for quickly uploading assets without setting up a formal coding environment
✅ Useful for experimenting with upload parameters and behavior
✅ Upload-specific helper functions (e.g., sync) not directly provided via the other upload options
Lazy migration	Cloudinary's lazy migration with the auto-upload feature enables you to migrate files on demand from a remote location, where each asset is automatically uploaded to Cloudinary the first time the delivery URL for that asset is requested.	✅ Simple to implement
✅ Only upload the assets you really need
💡 Not suitable if there's a deadline when the remote content will be unavailable
Media Library	The Media Library in the Cloudinary Console lets you upload assets to your account using drag and drop or the built-in Upload Widget.	✅ Simple to use
✅ Useful for quickly uploading assets without dealing with code
✅ Useful for experimenting with upload preset behavior
💡 Less suitable as a primary means of uploading assets compared to programmatic solutions
Integrations	Cloudinary has developed built-in integrations with many leading eCommerce, CMS and PIM platforms.	✅ Enables platform users to upload to Cloudinary from directly within the platform UI
💡 Requires initial set up and configuration by a platform administrator
💡 Less suitable as a primary means of uploading assets compared to programmatic solutions
Media Library widget	The Media Library widget enables embedding all the Cloudinary Media Library UI capabilities, including upload, into another application's UI.	✅ Useful for implementing your own Cloudinary integration
💡 Less suitable as a primary means of uploading assets at scale compared to programmatic solutions
Tips:
 MediaFlows, Cloudinary’s drag-and-drop workflow builder for image and video, offers the option to automate image upload with a low-code implementation. See MediaFlow’s documentation on media upload here.
Usage limits for uploading, transforming and delivering files depend on your Cloudinary plan. For details, check the Account tab in your Cloudinary Console Settings.
See also
 Upload API Reference: Provides both REST and SDK syntax, parameter details, and examples for all methods of the Upload API.
 Upload Add-ons: Many of Cloudinary's add-ons can be activated by adding a parameter in your upload call. These add-ons enable you to take advantage of special deep-learning, AI, and other analytical capabilities offered by Cloudinary as well as other vision and image processing partners.
 Asset management: Covers options for managing your uploaded assets programmatically, including various CRUD options, backups and version management, notifications and webhooks, and authentication and signature options.
 User-generated content guide: Upload is a key component of allowing user-generated content to be displayed on your site. Learn about all the features you can take advantage of when handling user-generated content.