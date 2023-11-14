import chalk from "chalk";
import wrapAnsi from "wrap-ansi";

// setup CLI interface
import * as readline from "readline/promises";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function ask(prompt) {
  return await rl.question(wrapAnsi(prompt, 80) + " ");
}

export function end() {
  rl.close();
}

// setup OpenAI API client
import * as secrets from "./secrets.js";
import OpenAI, { OpenAIError } from "openai";

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

export async function gptChat(prompt, c = {}) {
  const model = c.model || "4.0-turbo";
  if (!models[model]) {
    throw new Error(`Unknown model: ${model}`);
  }

  const startTime = performance.now();
  const response = await openai.chat.completions.create({
    ...config,
    ...c,
    model: models[model].name,
    messages: [{ role: "user", content: prompt }],
  });

  const seconds = ((performance.now() - startTime) / 1000).toFixed(2);

  const prompt_tokens = response.usage?.prompt_tokens ?? 0;
  const completion_tokens = response.usage?.completion_tokens ?? 0;
  const prompt_cost = (prompt_tokens / 1000) * models[model].promptCost;
  const completion_cost =
    (completion_tokens / 1000) * models[model].completionCost;
  const total_cost = prompt_cost + completion_cost;

  console.log(
    chalk.gray(
      `gptChat() ${model} ${prompt_tokens}/${completion_tokens} ${seconds}s $${total_cost.toFixed(
        3,
      )}`,
    ),
  );

  return response.choices[0].message.content.trim() || "";
}
