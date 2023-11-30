/**
 * This is a basic example of sending a prompt to GPT and showing the results.
 */

import { ask, say } from "./shared/cli.js";
import { gptPrompt } from "./shared/openai.js";

main();

async function main() {
  say("Hello, GPT!");

  const response = ask("What do you want to ask? ");

  const result = await gptPrompt(response, { temperature: 0.3 });

  say(`\n${result}`);
}
