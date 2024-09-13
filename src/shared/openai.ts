// ora: cli progress spinners
import ora, { Ora } from "npm:ora@7";

// node:process: node compatibility needed by ora
import process from "node:process";

// cliffy: library for writing cli apps. colors is for colorising text
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

// openai: openai api library
import OpenAI from "npm:openai@4.60.0";

// local utilities
// import * as log from "./logger.ts";
import { getEnvVariable, roundToDecimalPlaces } from "./util.ts";
import { calculateCost } from "./costs.ts";

let openai: OpenAI;
let total_cost = 0;

/**
 * Initializes the OpenAI client with the API key from environment variables.
 * If the client is already initialized, it returns the existing instance.
 * @returns The initialized OpenAI client instance.
 * @throws An error if the API key is not found in the environment variables.
 */
export function initOpenAI(): OpenAI {
  if (!openai) {
    const apiKey = getEnvVariable("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OPENAI_API_KEY not found.");
    // set global openai instance
    openai = new OpenAI({ apiKey });
  }

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
): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
  // initialize openai if this is the first call
  if (!openai) initOpenAI();

  // apply defaults to the params sent to OpenAI
  // see https://platform.openai.com/docs/api-reference/chat/create
  // for explanation of each parameter
  const paramsDefaults: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
    messages: [],
    model: "gpt-4o-2024-08-06",
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

    // const response = await openai.beta.chat.completions.parse(chatParams);
    const response = await openai.chat.completions.create(chatParams);
    // todo: optionally use beta endpoint to allow structured returns?
    // todo: ^ this might be adding too much to this function.

    // find the elapsed time
    const seconds = (performance.now() - startTime) / 1000;

    // calculate the cost of the request
    const p_tokens = response.usage?.prompt_tokens ?? 0;
    const c_tokens = response.usage?.completion_tokens ?? 0;
    const cost = calculateCost(chatParams.model, p_tokens, c_tokens);
    total_cost += isNaN(cost) ? 0 : cost;

    if (spinner) {
      if (options.successMessage !== false) {
        // stop the spinner and print the success message
        let message = options.successMessage ?? "";
        if (options.showStats) {
          message += " " + colors.gray(formatStats(
            chatParams.model,
            p_tokens,
            c_tokens,
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

function formatStats(
  m: string,
  p_tokens: number,
  c_tokens: number,
  seconds: number,
  cost: number,
  t_cost: number,
) {
  const costF = isNaN(cost) ? "?" : roundToDecimalPlaces(cost, 2, 4);
  const t_costF = roundToDecimalPlaces(t_cost, 2, 4);
  const secondsF = roundToDecimalPlaces(seconds, 2);
  return `${m} ${p_tokens}/${c_tokens}t ${secondsF}s $${costF} $${t_costF}`;
}

// export async function makeImage(prompt: string, c = {}) {
//   if (!openai) initOpenAI();

//   const defaults: OpenAI.Images.ImageGenerateParams = {
//     prompt: "",
//     model: "dall-e-3",
//     quality: "standard",
//     response_format: "url",
//     style: "vivid",
//     size: "1024x1024",
//   };

//   const config = {
//     ...defaults,
//     ...c,
//   };

//   const startTime = performance.now();

//   const spinner = ora({
//     text: config.model as string,
//     discardStdin: false,
//   }).start();

//   const image = await openai.images.generate({
//     ...config,
//     prompt,
//     n: 1,
//   });

//   const seconds = ((performance.now() - startTime) / 1000).toFixed(2);

//   const hd = config.quality !== "standard";
//   const big = config.size !== "1024x1024";
//   let cost = 0.04;
//   if (hd && !big) cost = 0.08;
//   if (!hd && big) cost = 0.08;
//   if (hd && big) cost = 0.12;

//   spinner.succeed(colors.gray(`${config.model} ${seconds}s $${cost}`));

//   log.info(image.data[0].revised_prompt);

//   return image.data[0].url;
// }
