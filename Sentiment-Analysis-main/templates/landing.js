function predict() {
    // Check if CSV file is present
    var csvFileInput = document.getElementById("csvFileInput");
    var textInput = document.getElementById("textInput");
    var predictionResult = document.getElementById("predictionResult");
    var graphContainer = document.getElementById("graphContainer");

    if (csvFileInput.files.length > 0) {
      // Upload CSV file
      var formData = new FormData();
      formData.append("file", csvFileInput.files[0]);

      fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData
      })
        .then(response => {
          if (response.headers.get('X-Graph-Exists') === 'true') {
            console.log("Graph")
            var graphData = response.headers.get('X-Graph-Data');
            displayGraph(graphData);
          }

          return response.blob();
        })
        .then(blob => {
          console.log("Blob:", blob);

          document.getElementById("downloadBtn").style.display = "block";
          document.getElementById("downloadBtn").onclick = function () {
            console.log("Downloading...");
            var url = URL.createObjectURL(blob);
            console.log("URL:", url);

            var a = document.createElement("a");
            a.href = url;
            a.download = "Predictions.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        })
        .catch(error => {
          console.error("Error:", error);
        });

    } else if (textInput.value.trim() !== "") {
      var jsonvar = JSON.stringify({ "text": textInput.value.trim() }) 
      // Predict on single sentence
      fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
       
        body: jsonvar
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          predictionResult.innerHTML = "Predicted sentiment: " + data.prediction;
        });
    }
  }

  function downloadPredictions() {
    console.log("Download prediction")
  }

  function displayGraph(graphData) {
    predictionResult.innerHTML = "";
    var graphUrl = "data:image/png;base64," + graphData;
    var img = document.createElement('img');
    img.src = graphUrl;
    graphContainer.appendChild(img);
  }