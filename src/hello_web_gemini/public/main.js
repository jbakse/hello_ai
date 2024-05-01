console.log("Hello Web Gemini!");
console.log(Dropzone);

Dropzone.options.imageUpload = {
  paramName: "file",
  maxFilesize: 2,
  disablePreviews: true,
  success: function (file) {
    const data = file.dataURL.split(",", 2)[1];
    console.log("File Uploaded");
    console.log(file);
    fetch("/api/vision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, type: file.type }),
    })
      .then((response) => response.text())
      .then((responseText) => {
        const responseElement = document.createElement("p");
        responseElement.innerText = responseText;
        document.body.appendChild(responseElement);
      });
  },
};
