import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
import OpenAI from "npm:openai@4";

const env = await load();

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

let total_cost = 0;

export async function gptPrompt(prompt, c = {}) {
  c.messages = [{ role: "user", content: prompt }];
  const message = await gpt(c);
  return message.content.trim() ?? "";
}

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

  // Calculate the cost
  const p_tokens = response.usage?.prompt_tokens ?? 0;
  const c_tokents = response.usage?.completion_tokens ?? 0;
  const cost = calculateCost(model, p_tokens, c_tokents);
  total_cost += cost;

  console.log(
    formatUsage(model, p_tokens, c_tokents, seconds, cost, total_cost),
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

function formatUsage(model, p_tokens, c_tokents, seconds, cost, total_cost) {
  cost = cost.toFixed(3);
  total_cost = total_cost.toFixed(3);
  return `${model} ${p_tokens}/${c_tokents}t ${seconds}s $${cost} $${total_cost}`;
}
