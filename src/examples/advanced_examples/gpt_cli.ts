#!/usr/bin/env -S deno run --allow-net --allow-env --allow-read

/**
 * This script lets you send a text prompt to the OpenAI GPT model and get a
 * response. You can provide the prompt directly as a command-line argument or
 * pipe additional data into the script, which will be appended to the prompt.
 *
 * install:
 * alias askgpt="/path/to/gpt_cli.ts"
 *
 * example:
 * brew ls --cask | askgpt "what are these"
 */

import { parse } from "https://deno.land/std@0.110.0/flags/mod.ts";
import { readAll } from "https://deno.land/std@0.224.0/io/read_all.ts";

import { promptGPT } from "../../shared/openai.ts";
// import * as log from "../../shared/logger.ts";

async function main() {
  const args = parse(Deno.args);
  const prompt = args._.join(" ");

  let pipedData = "";

  if (!Deno.stdin.isTerminal()) {
    const decoder = new TextDecoder();
    const stdinContent = await readAll(Deno.stdin);
    pipedData = decoder.decode(stdinContent).trim();
  }

  if (!prompt && !pipedData) {
    console.error("No prompt provided.");
    Deno.exit(1);
  }

  const fullPrompt =
    `Breifly answer the following question. Format the result for 80 column ascii. Do not add any information not asked for. Do not add an introduction or conclusion. ${prompt} ${pipedData}`
      .trim();

  // log.log("asking gpt", prompt, pipedData ? pipedData : "nothing on pipe");

  const response = await promptGPT(fullPrompt, { max_tokens: 10000 });
  console.log(response);
}

main();
