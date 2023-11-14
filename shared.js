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

const gpt_config = {
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

export async function gpt(prompt, c = {}) {
  let response = await openai.completions.create({
    ...gpt_config,
    ...c,
    prompt,
  });
  console.log(`gpt() ${gpt_config.model}`);
  return response.choices[0].text?.trim() || "";
}

export async function gptChat(prompt, c = {}) {
  const model = "gpt-4-1106-preview";
  // gpt-3.5-turbo      $.001 / .002
  // gpt-4               .030 / .060
  // gpt-4-1106-preview  .010 / .030

  const promptCosts = {
    "gpt-3.5-turbo": 0.001,
    "gpt-4": 0.03,
    "gpt-4-1106-preview": 0.01,
  };
  const completionCosts = {
    "gpt-3.5-turbo": 0.002,
    "gpt-4": 0.06,
    "gpt-4-1106-preview": 0.03,
  };

  const start = process.hrtime();
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      { role: "user", content: prompt },
    ],
    model,
  });
  const time = process.hrtime(start);
  // calculate seconds to two decimal places
  const seconds = (time[0] + time[1] / 1000000000).toFixed(2);

  const prompt_tokens = response.usage?.prompt_tokens ?? 0;
  const completion_tokens = response.usage?.completion_tokens ?? 0;
  const prompt_cost = (prompt_tokens / 1000) * promptCosts[model];
  const completion_cost = (completion_tokens / 1000) * completionCosts[model];
  const total_cost = prompt_cost + completion_cost;

  console.log(
    chalk.gray(
      `gptChat() ${model} ${prompt_tokens}/${completion_tokens} ${seconds}s $${total_cost.toFixed(
        3
      )}`
    )
  );
  return response.choices[0].message.content.trim() || "";
}
