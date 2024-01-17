/**
 * This example asks GPT to answer several questions about a person
 * based only on their name.
 *
 * It might expose assumptions or biases in the model.
 *
 * It also shows how to use the logit_bias parameter to explicitly bias
 * the model's predictions.
 *
 * It is also useful to show that the formating of responses can vary.
 */

import { gptPrompt } from "../shared/openai.js";
import { ask, say } from "../shared/cli.js";

main();

async function main() {
  const name = await ask("What is your name?");

  say("");

  // 4.x
  const prompt = `
  Specific names are more likely to appear in certain groups.
  Consider the name ${name}.
  What gender?
  How old?
  What occupation?
  What race?
  What religion?
  How attractive?
  What political party?

  Answer each question with only a single word.
  Do not answer with "unknown". Always make a guess.
  You must answer each question. 
  `;

  const response = await gptPrompt(prompt, {
    temperature: 0.2,
    //https://platform.openai.com/tokenizer?view=bpe
    logit_bias: {
      16476: -100, // "unknown"
      9987: -100, // " unknown"
      14109: -100, // "Unknown"
      22435: -100, // " Unknown"
      46165: 20, // "Teacher"
    },
  });
  say(`"""\n${response}\n"""`);
}
