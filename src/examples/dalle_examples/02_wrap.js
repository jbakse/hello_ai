/**
 * This example collects a prompt from the user, sends it to GPT
 * and relays the response.
 */

import { ask, say } from "../../shared/cli.ts";
import { promptDalle } from "../../shared/openai.ts";

const userPrompt = await ask("What do you want from Dall•e?");

// sent prompt to gpt and relay response
const response = await promptDalle(userPrompt);

say("");
say("URL");
say(response.url);
