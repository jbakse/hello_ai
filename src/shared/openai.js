import process from "node:process";
import ora from "npm:ora@7";
import chalk from "npm:chalk@5";
import OpenAI from "npm:openai@4";

import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
const __dirname = new URL(".", import.meta.url).pathname;
const env = await load({ envPath: `${__dirname}/../.env` });

// ! if apiKey is undefined, `new OpenAI` constructor will try to find
// ! an environment variable called OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
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

let total_cost = 0;

export async function gptPrompt(prompt, c = {}) {
  c.messages = [{ role: "user", content: prompt }];
  const message = await gpt(c);
  return message.content.trim() ?? "";
}

export async function gpt(c = {}) {
  const model = c.model ?? "4.0-turbo";

  if (!models[model]) {
    throw new Error(`Unknown model: ${model}`);
  }

  const startTime = performance.now();

  const spinner = ora({
    text: model,
    discardStdin: false,
    stream: process.stdout,
  }).start();

  const response = await openai.chat.completions.create({
    ...defaults,
    ...c,
    model: models[model].name,
  });

  const seconds = ((performance.now() - startTime) / 1000).toFixed(2);

  const p_tokens = response.usage?.prompt_tokens ?? 0;
  const c_tokents = response.usage?.completion_tokens ?? 0;
  const cost = calculateCost(model, p_tokens, c_tokents);
  total_cost += cost;

  spinner.succeed(
    chalk.gray(
      formatUsage(model, p_tokens, c_tokents, seconds, cost, total_cost),
    ),
  );

  return response.choices[0].message;
}

function calculateCost(model, prompt_tokens, completion_tokens) {
  const prompt_cost = (prompt_tokens / 1000) * models[model].promptCost;
  const completion_cost = (completion_tokens / 1000) *
    models[model].completionCost;

  const cost = prompt_cost + completion_cost ?? 0;
  return cost;
}

function formatUsage(m, p_tokens, c_tokents, seconds, cost, t_cost) {
  cost = cost.toFixed(3);
  t_cost = t_cost.toFixed(3);
  return `${m} ${p_tokens}/${c_tokents}t ${seconds}s $${cost} $${t_cost}`;
}

export async function makeImage(prompt, c = {}) {
  const defaults = {
    model: "dall-e-3",
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

  const spinner = ora({
    text: config.model,
    discardStdin: false,
  }).start();

  const image = await openai.images.generate({
    ...config,
    prompt,
    n: 1,
  });

  const seconds = ((performance.now() - startTime) / 1000).toFixed(2);

  const hd = config.quality !== "standard";
  const big = config.size !== "1024x1024";
  let cost = 0.04;
  if (hd && !big) cost = 0.08;
  if (!hd && big) cost = 0.08;
  if (hd && big) cost = 0.12;

  spinner.succeed(chalk.gray(`${config.model} ${seconds}s $${cost}`));

  console.log(chalk.gray(image.data[0].revised_prompt));

  return image.data[0].url;
}
