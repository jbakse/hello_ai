// Kia: library for creating spinners
import Kia from "https://deno.land/x/kia@0.4.1/mod.ts";

// cliffy: library for writing cli apps. colors is for colorising text
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

// openai: library for openai api
// import OpenAI from "npm:openai@4.60.0";
import OpenAI from "https://deno.land/x/openai@v4.68.2/mod.ts";

// local utilities
import * as log from "./logger.ts";
import { getEnvVariable, roundToDecimalPlaces } from "./util.ts";
import { calculateCost } from "./costs.ts";

let openai: OpenAI;
let totalCost = 0;

/**
 * Initializes the OpenAI client with the API key from environment variables.
 * If the client is already initialized, it returns the existing instance.
 * @returns The initialized OpenAI client instance.
 * @throws An error if the API key is not found in the environment variables.
 */
export function initOpenAI(): OpenAI {
  // set global openai instance if not already set
  if (!openai) {
    const apiKey = getEnvVariable("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OPENAI_API_KEY not found.");

    openai = new OpenAI({ apiKey });
  }

  return openai;
}

type OpenAIChatParams = OpenAI.ChatCompletionCreateParamsNonStreaming;

interface SpinnerOptions {
  show: boolean;
  showStats: boolean;
  showError: boolean;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export async function promptGPT(
  prompt: string,
  params: Partial<OpenAIChatParams> = {},
  options: Partial<SpinnerOptions> = {},
): Promise<string> {
  params.messages = [{ role: "user", content: prompt }];
  const message = await gpt(params, options);
  if (params.response_format?.type === "json_schema") {
    return message.parsed;
  } else {
    return (message.content ?? "").trim();
  }
}

export async function gpt(
  params: Partial<OpenAIChatParams> = {},
  spinnerOptions: Partial<SpinnerOptions> = {},
): Promise<OpenAI.ChatCompletionMessage> {
  // initialize openai if this is the first call
  if (!openai) initOpenAI();

  // apply defaults to the params sent to OpenAI
  // see https://platform.openai.com/docs/api-reference/chat/create
  // for explanation of each parameter
  const paramsDefaults: Readonly<OpenAIChatParams> = {
    messages: [],
    model: "gpt-4o-2024-08-06",
    // frequency_penalty: 0,
    // logit_bias: {},
    // logprobs: null,
    // top_logprobs: null,
    max_tokens: 128,
    // n: 1,
    // presence_penalty: 0,
    // response_format: { type: "text" },
    // seed: null,
    // stop: null,
    // stream: false,
    // stream_options: null,
    // temperature: 0.8,
    // top_p: null,
  };

  const chatParams: OpenAIChatParams = {
    ...paramsDefaults,
    ...params,
  };

  // apply defaults to the options for local display
  const spinnerDefaults: Readonly<SpinnerOptions> = {
    show: true,
    showStats: true,
    showError: true,
  };

  spinnerOptions = {
    ...spinnerDefaults,
    ...spinnerOptions,
  };

  // start the spinner
  let spinner: Kia | undefined;
  if (spinnerOptions.show) {
    spinner = new Kia({
      text: spinnerOptions.loadingMessage ?? chatParams.model,
    });
    spinner.start();
  }

  try {
    // start a performance timer
    const startTime = performance.now();

    // make the request to OpenAI
    // and wait

    // const response = await openai.beta.chat.completions.parse(chatParams);

    const response = chatParams.response_format?.type === "json_schema"
      ? (await openai.beta.chat.completions.parse(chatParams))
      : (await openai.chat.completions.create(chatParams));

    // todo: optionally use beta endpoint to allow structured returns?
    // todo: ^ this might be adding too much to this function.

    // find the elapsed time
    const seconds = (performance.now() - startTime) / 1000;

    // calculate the cost of the request
    const p_tokens = response.usage?.prompt_tokens ?? 0;
    const c_tokens = response.usage?.completion_tokens ?? 0;
    const cost = calculateCost(chatParams.model, p_tokens, c_tokens);
    totalCost += cost;

    // stop the spinner and print the success message
    if (spinner) {
      let message = spinnerOptions.successMessage ?? "";
      if (spinnerOptions.showStats) {
        message += " " + colors.gray(formatStats(
          chatParams.model,
          p_tokens,
          c_tokens,
          seconds,
          cost,
          totalCost,
        ));
      }
      if (message.trim() === "") {
        spinner.stop();
      } else {
        spinner.stopWithFlair(message.trim(), colors.green("✔"));
      }
    }

    // return response
    return response.choices[0].message;

    //
  } catch (error) {
    // if there's an error

    const errorMessage = error instanceof Error
      ? error.message
      : "An error occurred.";

    // stop the spinner and print the error message
    if (spinner) {
      let message = spinnerOptions.errorMessage ?? "";
      if (spinnerOptions.showError) {
        message += " " + errorMessage;
      }
      spinner.stopWithFlair(colors.red(message.trim()), colors.red("✘"));
    }

    // respond with the error message
    return {
      content: errorMessage,
      role: "assistant",
    } as OpenAI.ChatCompletionMessage;
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

type DalleImageParams = OpenAI.Images.ImageGenerateParams;

export async function promptDalle(
  prompt: string,
  params: Partial<DalleImageParams> = {},
): Promise<OpenAI.Images.Image> {
  if (!openai) initOpenAI();

  const defaultParams: DalleImageParams = {
    prompt: "",
    model: "dall-e-3",
    quality: "standard", // "standard" or "hd"
    response_format: "url", // "url" or "b64_json"
    style: "vivid", // "vivid" or "natural", natural is kinda bad.
    size: "1024x1024",
  };

  const dalleParams: DalleImageParams = {
    ...defaultParams,
    ...params,
    prompt,
  };

  const startTime = performance.now();

  const spinner = new Kia({ text: dalleParams.model as string });
  spinner.start();

  const imageResponse = await openai.images.generate(dalleParams);

  const seconds = ((performance.now() - startTime) / 1000).toFixed(2);

  const hd = dalleParams.quality !== "standard";
  const big = dalleParams.size !== "1024x1024";
  let cost = 0.04;
  if (hd && !big) cost = 0.08;
  if (!hd && big) cost = 0.08;
  if (hd && big) cost = 0.12;

  spinner.stopWithFlair(
    colors.gray(`${dalleParams.model} ${seconds}s $${cost}`),
    colors.green("✔"),
  );

  log.info(imageResponse.data[0].revised_prompt);

  return imageResponse.data[0];
}
