import process from "node:process";
import ora, { Ora } from "npm:ora@7";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";
import OpenAI from "npm:openai@4";

import * as log from "./logger.ts";
import { isDenoDeployment, loadEnv } from "./util.ts";

const chatParamsDefaults: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
  model: "gpt-4-turbo-preview",
  messages: [],
  frequency_penalty: 0,
  logit_bias: {},
  max_tokens: 128,
  n: 1,
  presence_penalty: 0,
  response_format: { type: "text" },
  seed: null,
  stop: null,
  temperature: 0.8,
  top_p: null,
  stream: false,
};

let total_cost = 0;

let openai: OpenAI;

export function initOpenAI() {
  openai = new OpenAI({ apiKey: getOpenAIKey() });
  return openai;
}

interface GPTOptions {
  showSpinner?: boolean;
  showStats?: boolean;
  showError?: boolean;
  loadingMessage?: string;
  successMessage?: string | false;
  errorMessage?: string | false;
}

const gptOptionsDefaults: GPTOptions = {
  showSpinner: true,
  showStats: true,
  showError: true,
  loadingMessage: undefined,
  successMessage: undefined,
  errorMessage: undefined,
};

export async function gptPrompt(
  prompt: string,
  c: Partial<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming> = {},
  options: GPTOptions = {},
) {
  c.messages = [{ role: "user", content: prompt }];
  const message = await gpt(c, options);
  return (message.content ?? "").trim();
}

export async function gpt(
  c: Partial<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming> = {},
  options: GPTOptions = {},
) {
  if (!openai) initOpenAI();

  // apply defaults to the chatParams
  const chatParams = {
    ...chatParamsDefaults,
    ...c,
  };

  // apply defaults to the options
  options = {
    ...gptOptionsDefaults,
    ...options,
  };

  // optionally start the spinner
  let spinner: Ora | false = false;
  if (options.showSpinner) {
    spinner = ora({
      text: options.loadingMessage ?? chatParams.model,
      discardStdin: false,
      stream: process.stdout,
    });
    spinner.start();
  }

  try {
    // start a performance timer
    const startTime = performance.now();

    // make the request to OpenAI
    const response = await openai.chat.completions.create(chatParams);

    // find the elapsed time
    const seconds = (performance.now() - startTime) / 1000;

    // calculate the cost of the request
    const p_tokens = response.usage?.prompt_tokens ?? 0;
    const c_tokents = response.usage?.completion_tokens ?? 0;
    const cost = calculateCost(chatParams.model, p_tokens, c_tokents);
    total_cost += isNaN(cost) ? 0 : cost;

    // stop the spinner and print the success message
    if (spinner) {
      if (options.successMessage === false) {
        spinner.stop();
      } else {
        let message = options.successMessage ?? "";
        if (options.showStats) {
          message += " " + colors.gray(formatStats(
            chatParams.model,
            p_tokens,
            c_tokents,
            seconds,
            cost,
            total_cost,
          ));
        }
        spinner.succeed(message.trim());
      }
    }
    // respond
    return response.choices[0].message;
    //
  } catch (error) {
    // if there's an error, stop the spinner and print the error message
    if (spinner) {
      if (options.errorMessage === false) {
        spinner.stop();
      } else {
        let message = options.errorMessage ?? "OpenAI API Error:";
        if (options.showError) {
          message += " " + error.message;
        }
        spinner.fail(colors.red(message.trim()));
      }
    }

    // respond
    return {
      content: error.message,
      role: "assistant",
    } as OpenAI.Chat.Completions.ChatCompletionMessage;
  }
}

function calculateCost(
  model: string,
  prompt_tokens: number,
  completion_tokens: number,
) {
  const costs = {
    "gpt-4-turbo-preview": { promptCost: 0.01, completionCost: 0.03 },
    "gpt-4-0125-preview": { promptCost: 0.01, completionCost: 0.03 },
    "gpt-4-1106-preview": { promptCost: 0.01, completionCost: 0.03 },

    "gpt-4": { promptCost: 0.03, completionCost: 0.06 },
    "gpt-4-32k": { promptCost: 0.06, completionCost: 0.12 },

    "gpt-3.5-turbo": { promptCost: 0.0005, completionCost: 0.0015 },

    "gpt-3.5-turbo-0125": { promptCost: 0.0005, completionCost: 0.0015 },
  };

  const mc = costs[model as keyof typeof costs] ??
    { promptCost: undefined, completionCost: undefined };

  const prompt_cost = (prompt_tokens / 1000) * mc.promptCost;
  const completion_cost = (completion_tokens / 1000) * mc.completionCost;

  const cost = prompt_cost + completion_cost ?? 0;
  return cost;
}

function formatStats(
  m: string,
  p_tokens: number,
  c_tokents: number,
  seconds: number,
  cost: number,
  t_cost: number,
) {
  // todo: would be nice to round to number of places needed to see something
  const costF = isNaN(cost) ? "?" : cost.toFixed(4);
  const t_costF = t_cost.toFixed(4);
  const secondsF = seconds.toFixed(2);
  return `${m} ${p_tokens}/${c_tokents}t ${secondsF}s $${costF} $${t_costF}`;
}

export async function makeImage(prompt: string, c = {}) {
  if (!openai) await initOpenAI();

  const defaults: OpenAI.Images.ImageGenerateParams = {
    prompt: "",
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
    text: config.model as string,
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

  spinner.succeed(colors.gray(`${config.model} ${seconds}s $${cost}`));

  log.info(image.data[0].revised_prompt);

  return image.data[0].url;
}

function getOpenAIKey() {
  // look in environment variables first
  if (Deno.env.get("OPENAI_API_KEY")) {
    log.info("OPENAI_API_KEY found in Deno.env");
    return Deno.env.get("OPENAI_API_KEY");
  }

  // then look in .env file
  const env = loadEnv();
  if (env.OPENAI_API_KEY) {
    log.info("OPENAI_API_KEY found in .env file");
    return env.OPENAI_API_KEY;
  }

  // if not found, report and exit
  log.error("OPENAI_API_KEY not found in Deno.env or .env file.");
  if (!isDenoDeployment()) {
    // Deno.exit is not allowed on deno deploy
    log.error("exiting");
    Deno.exit(1);
  }
}
