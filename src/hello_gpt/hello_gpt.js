/**
 * This is a basic example of sending a prompt to GPT and showing the results.
 */

import { ask, say } from "../shared/cli.ts";
import { gptPrompt } from "../shared/openai.ts";

main();

async function main() {
  say("Hello, GPT!");

  const response = await ask("What do you want to ask? ");

  const result = await gptPrompt(response, { temperature: 0.3 });

  say(`${result}`);
}
