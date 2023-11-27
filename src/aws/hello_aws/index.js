fetch(
  "https://gw1ww2j0x9.execute-api.us-east-1.amazonaws.com/myLambdaFunction",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      width: 1024,
      height: 768,
      // Include any other parameters you need to send
    }),
  },
)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
