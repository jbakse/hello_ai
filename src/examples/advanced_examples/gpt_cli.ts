#!/usr/bin/env -S deno run --allow-net --allow-env --allow-read

/**
 * This script takes text input from the command line, sends it to the OpenAI GPT model,
 * and outputs the result. If the user pipes data to the script, the piped data is appended
 * to the prompt.
 *
 * Usage:
 *   deno run --allow-net --allow-env src/advance_examples/gpt_cli.ts "Your prompt here"
 *
 * Example with piped input:
 *   echo "Additional context" | deno run --allow-net --allow-env src/advance_examples/gpt_cli.ts "Your prompt here"
 */

import { parse } from "https://deno.land/std@0.110.0/flags/mod.ts";
import { readAll } from "https://deno.land/std/io/read_all.ts";

import { promptGPT } from "../../shared/openai.ts";
import * as log from "../../shared/logger.ts";

async function main() {
  const args = parse(Deno.args);
  const prompt = args._.join(" ");

  let pipedData = "";
  if (!Deno.stdin.isTerminal) {
    const decoder = new TextDecoder();
    const stdinContent = await readAll(Deno.stdin);
    pipedData = decoder.decode(stdinContent).trim();
  }

  const fullPrompt = `${prompt} ${pipedData}`.trim();
  if (!fullPrompt) {
    console.error("No prompt provided.");
    Deno.exit(1);
  }

  log.log("asking gpt", prompt, pipedData ? pipedData : "nothing on pipe");

  const response = await promptGPT(fullPrompt);
  console.log(response);
}

main();
