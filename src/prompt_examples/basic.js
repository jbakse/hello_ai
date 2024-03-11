/**
 * This is a basic example of sending a prompt to GPT and showing the results.
 */

import { ask, say } from "../shared/cli.ts";
import { gptPrompt, initOpenAI } from "../shared/openai.js";

main();

async function main() {
  await initOpenAI();

  say("Hello, GPT!");

  const response = await ask("What do you want to ask? ");

  const result = await gptPrompt(response, {
    temperature: .8,
  });

  say("");
  say(result);
}
