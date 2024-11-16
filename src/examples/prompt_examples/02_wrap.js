/**
 * This example collects a prompt from the user, sends it to GPT
 * and prints the response.
 */

import { ask, say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";

const prompt = await ask("What do you want to ask? ");
const result = await promptGPT(prompt, {
  temperature: .8,
  max_tokens: 100,
});
say(result);
