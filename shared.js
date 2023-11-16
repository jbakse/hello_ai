import util from "util";
import chalk from "chalk";
import wrapAnsi from "wrap-ansi";

//////////////////////////////
// CLI HELPERS

import * as readline from "readline/promises";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function ask(prompt = "\n> ") {
  return await rl.question(prompt);
}

export function end() {
  rl.close();
}

export function say(text, wrap = 80) {
  console.log(wrapAnsi(text, wrap));
}

export function inspect(obj) {
  console.log(util.inspect(obj, false, null, true));
}

//////////////////////////////
// OPEN AI

import * as secrets from "./secrets.js";
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
const config = {
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

// export async function gptChat(prompt, c = {}) {
//   // Choose the model
//   const model = c.model ?? "4.0-turbo";

//   if (!models[model]) {
//     throw new Error(`Unknown model: ${model}`);
//   }

//   // Start a timer to measure how long it takes to get the response
//   const startTime = performance.now();

//   // Call the OpenAI API
//   const response = await openai.chat.completions.create({
//     ...config,
//     ...c,
//     model: models[model].name,
//     messages: [{ role: "user", content: prompt }],
//   });

//   // Calculate how long it took
//   const seconds = ((performance.now() - startTime) / 1000).toFixed(2);

//   // Log the results
//   logUsage(
//     model,
//     response.usage?.prompt_tokens ?? 0,
//     response.usage?.completion_tokens ?? 0,
//     seconds,
//   );

//   // Return the response
//   return response.choices[0].message.content.trim() ?? "";
// }

export async function gptChat(prompt, c = {}) {
  c.messages = [{ role: "user", content: prompt }];
  const message = await gptFunction(c);
  return message.content.trim() ?? "";
}

export async function gptFunction(c = {}) {
  // Choose the model
  const model = c.model ?? "4.0-turbo";

  if (!models[model]) {
    throw new Error(`Unknown model: ${model}`);
  }

  // Start a timer to measure how long it takes to get the response
  const startTime = performance.now();

  // Call the OpenAI API
  const response = await openai.chat.completions.create({
    ...config,
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

// import fs from "fs";

// export async function makeImageStability(prompt, c = {}) {
//   const path =
//     "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

//   const headers = {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     Authorization: `Bearer ${secrets.stabilityKey}`,
//   };

//   const body = {
//     steps: 30,
//     width: 1024,
//     height: 1024,
//     seed: 0,
//     cfg_scale: 5,
//     samples: 1,
//     // style_preset: "fantasy-art",
//     // clip_guidance_preset: "FAST_BLUE",
//     text_prompts: [
//       {
//         text: prompt,
//         weight: 1,
//       },
//     ],
//   };

//   const response = await fetch(path, {
//     headers,
//     method: "POST",
//     body: JSON.stringify(body),
//   });

//   if (!response.ok) {
//     throw new Error(`Non-200 response: ${await response.text()}`);
//   }

//   const responseJSON = await response.json();

//   responseJSON.artifacts.forEach((image, index) => {
//     fs.writeFileSync(
//       `./out/txt2img_${image.seed}.png`,
//       Buffer.from(image.base64, "base64"),
//     );
//   });
// }
