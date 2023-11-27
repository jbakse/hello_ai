import OpenAI from "openai"; //  { OpenAIError }

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// lambda function
export async function handler(event) {
  // get prompt from event
  const body = JSON.parse(event.body);
  const data = {
    response: await gpt(body.prompt),
  };
  return JSON.stringify(data);
}

async function gpt(prompt = "") {
  const defaults = {
    frequency_penalty: 0,
    logit_bias: {},
    max_tokens: 128,
    n: 1,
    presence_penalty: 0,
    response_format: { type: "text" },
    seed: null,
    stop: null,
    stream: false,
    temperature: 0.8,
    top_p: null,
  };

  const model = "gpt-4-1106-preview";
  const messages = [{ role: "user", content: prompt }];

  const startTime = performance.now();

  // Call the OpenAI API
  const response = await openai.chat.completions.create({
    ...defaults,
    model,
    messages,
  });

  // Calculate how long it took
  const seconds = ((performance.now() - startTime) / 1000).toFixed(2);

  console.log(`seconds: ${seconds}`);

  // Return the response
  return response.choices[0].message;
}
