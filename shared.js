// setup CLI interface
import * as readline from "readline/promises";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// setup OpenAI API client
import * as secrets from "./secrets.js";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: secrets.apiKey,
});
const openai = new OpenAIApi(configuration);

const config = {
  // https://platform.openai.com/docs/models/gpt-3

  model: "text-davinci-003",
  //  model: "text-curie-001",
  //  model: "text-babbage-001",
  //  model: "text-ada-001",

  // https://platform.openai.com/docs/api-reference/completions
  prompt: "",
  suffix: null,
  max_tokens: 512,
  temperature: 0.2,
  top_p: 1,
  n: 1,
  stream: false,
  stop: null,
  presence_penalty: 0,
  frequency_penalty: 0,
};

export async function ask(prompt) {
  return await rl.question(`${prompt} `);
}

export async function gpt(prompt, c = {}) {
  let response = await openai.createCompletion({
    ...config,
    ...c,
    prompt,
  });
  return response.data.choices[0].text.trim();
}

export function end() {
  rl.close();
}
