import process from "node:process";
import ora from "npm:ora@7";
import chalk from "npm:chalk@5";
import OpenAI from "npm:openai@4";

import * as path from "https://deno.land/std@0.214.0/path/mod.ts";

import { load } from "https://deno.land/std@0.214.0/dotenv/mod.ts";
import { existsSync } from "https://deno.land/std@0.214.0/fs/mod.ts";

let openai = null;

export async function initOpenAI(printDebugInfo = true) {
  // get the directory of the current module
  // the following includes a problematic leading slash on Windows
  // const __dirname = new URL(".", import.meta.url).pathname;
  // see https://stackoverflow.com/questions/61829367/node-js-dirname-filename-equivalent-in-deno

  // the following should work on all platforms

  const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
  const parentDir = path.dirname(__dirname);
  printDebugInfo && console.log("openai.js - parentDir is", parentDir);

  // determine if running on the deno deploy platform
  const isDeployed = Deno.env.get("DENO_DEPLOYMENT_ID") ?? false;
  printDebugInfo && console.log(
    `openai.js - running in ${isDeployed ? "deployed" : "local"} environment`,
  );

  // check if .env exists
  if (existsSync(`${parentDir}/.env`)) {
    printDebugInfo &&
      console.log("openai.js -", chalk.green(`Found .env in ${parentDir}`));
  } else {
    printDebugInfo && console.log(
      "openai.js - ",
      chalk.yellow(`Did not find .env in ${parentDir}`),
    );
  }

  // load it
  const env = await load({ envPath: `${parentDir}/.env` });

  // get the openai api key from .env fallback to Deno.env
  const openaiAPIKey = env.OPENAI_API_KEY ?? Deno.env.get("OPENAI_API_KEY");

  // bail if no key
  if (!openaiAPIKey) {
    console.error(chalk.red("OPENAI_API_KEY not found in .env or Deno.env"));
    if (!isDeployed) {
      // Deno.exit is not allowed on deno deploy
      console.log("exiting");
      Deno.exit(1);
    }
  }

  // ! if apiKey is undefined, `new OpenAI` constructor will try to find
  // ! an environment variable called OPENAI_API_KEY
  openai = new OpenAI({
    apiKey: openaiAPIKey,
  });
}

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

export async function gptPrompt(prompt, c = {}, settings = {}) {
  c.messages = [{ role: "user", content: prompt }];
  const message = await gpt(c, settings);
  return message.content.trim() ?? "";
}

export async function gpt(c = {}, settings = {}) {
  if (!openai) await initOpenAI();

  const model = c.model ?? "4.0-turbo";

  if (!models[model]) {
    throw new Error(`Unknown model: ${model}`);
  }

  const startTime = performance.now();

  const spinner = ora({
    text: settings?.loadingMessage ?? model,
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

  if (settings?.successMessage === false) {
    spinner.stop();
  } else {
    spinner.succeed(
      settings?.successMessage ??
        chalk.gray(
          formatUsage(model, p_tokens, c_tokents, seconds, cost, total_cost),
        ),
    );
  }

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
  if (!openai) initOpenAI();

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
