/**
 * This is a basic example of sending a prompt to GPT and showing the results.
 */

import { say } from "../shared/cli.ts";
import * as log from "../shared/logger.ts";
import { gptPrompt, initOpenAI } from "../shared/openai.ts";

main();

async function main() {
  log.setLogLevel(log.LogLevel.INFO);
  initOpenAI();

  const prompt = "Just say 'yes'";
  say(`Prompt: ${prompt}`);

  const response = await gptPrompt("Just say 'yes'.");

  say("");
  say(`Response: ${response}`);
}
