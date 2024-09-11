/**
 * This program prompts the user to enter their name and hometown
 * and uses theLLM to generate a limerick about the user.
 */

import { promptGPT } from "../../shared/openai.ts";
import { ask, say } from "../../shared/cli.ts";

// prompt user for name and hometown
const name = await ask("What is your name?");
const town = await ask("Where are you from?");

// output a blank line
say("");

// prepare the prompt and send to GPT
const prompt =
  `My name is ${name} and I am from ${town}. Create a limerick about me.`;

const limerick = await promptGPT(prompt, { temperature: 0.7 });

// output the limerick
say(limerick);
