// lambda function for api gateway adds two numbers

export async function handler(event) {
  console.log("Handler!");

  // get a and b
  const { a, b } = JSON.parse(event.body);

  const result = a + b;

  return {
    statusCode: 200,
    // add access control headers to allow CORS
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      result,
    }),
  };
}
