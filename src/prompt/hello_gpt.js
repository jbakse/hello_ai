/**
 * This is a basic example of sending a prompt to GPT and showing the results.
 */

import { ask, say, end } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

async function main() {
  say("Hello, GPT!");

  let prompt = await ask("What do you want to ask? ");

  let result = await gptPrompt(prompt, { temperature: 0.3 });

  say(`\n${result}`);

  end();
}
