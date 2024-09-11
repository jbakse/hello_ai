// import node:process for node compatibility needed by ora
import process from "node:process";

// ora is a node library for cli progress spinners
import ora, { Ora } from "npm:ora@7";

// cliffy is a deno library for writing cli apps. colors is for colorising text
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

// this is the openai api library
import OpenAI from "npm:openai@4.55.7";

// local utilities
import * as log from "./logger.ts";
import { isDenoDeployment, loadEnv } from "./util.ts";

let openai: OpenAI;
let total_cost = 0;

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

export async function promptGPT(
  prompt: string,
  params: Partial<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming> = {},
  options: GPTOptions = {},
) {
  params.messages = [{ role: "user", content: prompt }];
  const message = await gpt(params, options);
  return (message.content ?? "").trim();
}

export async function gpt(
  params: Partial<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming> = {},
  options: GPTOptions = {},
) {
  // initialize openai if this is the first call
  if (!openai) initOpenAI();

  // apply defaults to the params sent to OpenAI
  // see https://platform.openai.com/docs/api-reference/chat/create
  // for explination of each parameter
  const paramsDefaults: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
    messages: [],
    model: "gpt-4o",
    frequency_penalty: 0,
    logit_bias: {},
    logprobs: null,
    top_logprobs: null,
    max_tokens: 128,
    n: 1,
    presence_penalty: 0,
    response_format: { type: "text" },
    seed: null,
    stop: null,
    stream: false,
    stream_options: null,
    temperature: 0.8,
    top_p: null,
  };

  const chatParams = {
    ...paramsDefaults,
    ...params,
  };

  // apply defaults to the options for local display
  const optionsDefaults: GPTOptions = {
    showSpinner: true,
    showStats: true,
    showError: true,
    loadingMessage: undefined,
    successMessage: undefined,
    errorMessage: undefined,
  };

  options = {
    ...optionsDefaults,
    ...options,
  };

  // start the spinner
  let spinner: Ora | null = null;
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
    // and wait
    const response = await openai.beta.chat.completions.parse(chatParams);

    // find the elapsed time
    const seconds = (performance.now() - startTime) / 1000;

    // calculate the cost of the request
    const p_tokens = response.usage?.prompt_tokens ?? 0;
    const c_tokents = response.usage?.completion_tokens ?? 0;
    const cost = calculateCost(chatParams.model, p_tokens, c_tokents);
    total_cost += isNaN(cost) ? 0 : cost;

    if (spinner) {
      if (options.successMessage !== false) {
        // stop the spinner and print the success message
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
      } else {
        // stop the spinner with no message
        spinner.stop();
      }
    }

    // return response
    return response.choices[0].message;

    //
  } catch (error) {
    // if there's an error
    if (spinner) {
      if (options.errorMessage) {
        // stop the spinner and print the error message
        let message = options.errorMessage ?? "OpenAI API Error:";
        if (options.showError) {
          message += " " + error.message;
        }
        spinner.fail(colors.red(message.trim()));
      } else {
        // stop the spinner with no error message
        spinner.stop();
      }
    }

    // respond with the error message
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
  // cost per 1000 tokens for each model
  // https://openai.com/api/pricing/
  const model_costs: Record<
    string,
    { promptCost: number; completionCost: number }
  > = {
    "gpt-4o": { promptCost: 0.005, completionCost: 0.015 },
    "gpt-4o-2024-08-06": { promptCost: 0.0025, completionCost: 0.01 },
    "gpt-4o-2024-05-13": { promptCost: 0.005, completionCost: 0.015 },

    "gpt-4o-mini": { promptCost: 0.00015, completionCost: 0.0006 },
    "gpt-4o-mini-2024-07-18": { promptCost: 0.00015, completionCost: 0.0006 },

    "gpt-4-turbo": { promptCost: 0.0100, completionCost: 0.0300 },
    "gpt-4-turbo-2024-04-09": { promptCost: 0.0100, completionCost: 0.0300 },
    "gpt-4": { promptCost: 0.0300, completionCost: 0.0600 },
    "gpt-4-32k": { promptCost: 0.0600, completionCost: 0.1200 },
    "gpt-4-0125-preview": { promptCost: 0.0100, completionCost: 0.0300 },
    "gpt-4-1106-preview": { promptCost: 0.0100, completionCost: 0.0300 },
    "gpt-4-vision-preview": { promptCost: 0.0100, completionCost: 0.0300 },

    "gpt-3.5-turbo-0125": { promptCost: 0.0005, completionCost: 0.0015 },
    "gpt-3.5-turbo-instruct": { promptCost: 0.0015, completionCost: 0.0020 },
    "gpt-3.5-turbo-1106": { promptCost: 0.0010, completionCost: 0.0020 },
    "gpt-3.5-turbo-0613": { promptCost: 0.0015, completionCost: 0.0020 },
    "gpt-3.5-turbo-16k-0613": { promptCost: 0.0030, completionCost: 0.0040 },
    "gpt-3.5-turbo-0301": { promptCost: 0.0015, completionCost: 0.0020 },

    "davinci-002": { promptCost: 0.0020, completionCost: 0.0020 },
    "babbage-002": { promptCost: 0.0004, completionCost: 0.0004 },
  };

  if (model in model_costs) {
    const mc = model_costs[model];
    const prompt_cost = (prompt_tokens / 1000) * mc.promptCost;
    const completion_cost = (completion_tokens / 1000) * mc.completionCost;
    return (prompt_cost + completion_cost);
  } else {
    log.warn(`model ${model} not found in model_costs`);
    return 0;
  }
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
  const isDeployed = isDenoDeployment();

  // Deno.exit is not allowed on deno deploy
  if (isDeployed) {
    log.error("Running in deno deploy, can not exit.");
  } else {
    log.error("Running locally, exiting");
    Deno.exit(1);
  }
}
