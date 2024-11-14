/**
 * This example collects a prompt from the user, sends it to GPT
 * and relays the response.
 */

import { ask, say } from "../../shared/cli.ts";
import { promptDalle } from "../../shared/openai.ts";

const animal = await ask("Choose an animal");
const conainer = await ask("Choose a container");
const adj1 = await ask("Choose an adjective");
const color = await ask("Choose a color");

// sent prompt to gpt and relay response
const response = await promptDalle(
  `A photograph of a ${adj1} ${animal} in a ${color} ${conainer}`,
);

say("");
say("URL");
say(response.url);
