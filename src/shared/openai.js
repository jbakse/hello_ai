import chalk from "chalk";
import * as secrets from "../../secrets.js";
import OpenAI from "openai"; //  { OpenAIError }

const openai = new OpenAI({
  apiKey: secrets.apiKey,
});

const models = {
  "3.5-turbo": {
    name: "gpt-3.5-turbo",
    promptCost: 0.001,
    completionCost: 0.002,
  },
  "4.0": {
    name: "gpt-4",
    promptCost: 0.03,
    completionCost: 0.06,
  },
  "4.0-turbo": {
    name: "gpt-4-1106-preview",
    promptCost: 0.01,
    completionCost: 0.03,
  },
};

// https://platform.openai.com/docs/api-reference/chat/create
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

export async function gptPrompt(prompt, c = {}) {
  c.messages = [{ role: "user", content: prompt }];
  const message = await gpt(c);
  return message.content.trim() ?? "";
}

/**
 * Calls the OpenAI API to generate a completion based on the provided configuration.
 *
 * @param {Object} c - The configuration for the OpenAI API call. If a model is not provided, "4.0-turbo" is used by default.
 * @throws {Error} Will throw an error if the provided model is not known.
 * @returns {string} The message from the first choice in the response from the OpenAI API.
 */

export async function gpt(c = {}) {
  // Choose the model
  const model = c.model ?? "4.0-turbo";

  if (!models[model]) {
    throw new Error(`Unknown model: ${model}`);
  }

  // Start a timer to measure how long it takes to get the response
  const startTime = performance.now();

  // Call the OpenAI API
  const response = await openai.chat.completions.create({
    ...defaults,
    ...c,
    model: models[model].name,
  });

  // Calculate how long it took
  const seconds = ((performance.now() - startTime) / 1000).toFixed(2);

  // Log the results
  logUsage(
    model,
    response.usage?.prompt_tokens ?? 0,
    response.usage?.completion_tokens ?? 0,
    seconds,
  );

  // Return the response
  return response.choices[0].message;
}

function calculateCost(model, prompt_tokens, completion_tokens) {
  const prompt_cost = (prompt_tokens / 1000) * models[model].promptCost;
  const completion_cost =
    (completion_tokens / 1000) * models[model].completionCost;

  const cost = prompt_cost + completion_cost ?? 0;
  return cost;
}

function logUsage(model, p_tokens, c_tokents, seconds) {
  const total_cost = calculateCost(model, p_tokens, c_tokents).toFixed(3);

  console.log(
    chalk.gray(`${model} ${p_tokens}/${c_tokents} ${seconds}s $${total_cost}`),
  );
}

// generate an image for the given prompt
export async function makeImage(prompt, c = {}) {
  // pricing
  // 3    1024x1024  $0.04
  // 3 HD 1024x1024  $0.08

  const defaults = {
    // prompt
    model: "dall-e-3",
    // n
    quality: "standard",
    response_format: "url",
    style: "vivid",
    size: "1024x1024",
  };

  const config = {
    ...defaults,
    ...c,
  };

  const startTime = performance.now();

  const image = await openai.images.generate({
    ...config,
    prompt,
    n: 1,
  });

  const seconds = ((performance.now() - startTime) / 1000).toFixed(2);

  // Calculate the cost
  const hd = config.quality != "standard";
  const big = config.size != "1024x1024";
  let cost = 0.04;
  if (hd && !big) cost = 0.08;
  if (!hd && big) cost = 0.08;
  if (hd && big) cost = 0.12;

  // Log the results
  console.log(chalk.gray(`images/generations ${seconds}s $${cost}`));
  console.log(chalk.gray(image.data[0].revised_prompt));

  return image.data[0].url;
}
