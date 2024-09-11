/**
 * This example collects a prompt from the user, sends it to GPT
 * and relays the response.
 */

import { ask, say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";

const response = await ask("What do you want to ask? ");

const result = await promptGPT(response, {
  temperature: .8,
});

say("");
say(result);
