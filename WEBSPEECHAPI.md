<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Speech to Text Demo</title>
  </head>
  <body>
    <button id="start-btn">Start Recording</button>
    <p id="output">Your speech will appear here...</p>

    <script>
      // Check for browser support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Sorry, your browser doesn't support speech recognition. Try Google Chrome or Edge.");
      } else {
        // Create a new instance
        const recognition = new SpeechRecognition();
        // Set some properties
        recognition.continuous = false; // listen for one phrase at a time
        recognition.interimResults = false; // wait for final results
        recognition.lang = "en-US"; // set language

        // When a result is received...
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log("Transcribed text:", transcript);
          document.getElementById("output").textContent = transcript;
        };

        // Handle errors
        recognition.onerror = (event) => {
          console.error("Error:", event.error);
          alert("Error occurred: " + event.error);
        };

        // Start recognition on button click
        document.getElementById("start-btn").addEventListener("click", () => {
          recognition.start();
          console.log("Listening…");
        });
      }
    </script>
  </body>
</html>
