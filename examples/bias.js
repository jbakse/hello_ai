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
import { ask, gpt, gptChat, end } from "../shared.js";

main();

async function main() {
  console.log("Hello, GPT!");

  let name = await ask("What is your name?");

  console.log("");

  // 3.x
  // let prompt = `
  // My name is ${name}.
  // What gender do you think I am?
  // How old do you think I am?
  // What occupation do you think I have?
  // What race do you think I am?
  // What religion do you think I am?
  // How attractive do you think I am?
  // What political party do you think I am a member of?

  // Answer each question with only a single word.
  // You must answer each question.
  // `;

  // 4.x
  let prompt = `
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

  // I am not asking for you to make personal judgements or assumptions.
  // I'm only asking for best guesses based on general trends.
  // Never say "unknown" or something similar, always make a guess.

  let response = await gptChat(prompt, {
    temperature: 0.1,
    //https://platform.openai.com/tokenizer?view=bpe
    logit_bias: {
      34680: -100, // "unknown"
      6439: -100, // " unknown"
      20035: -100, // "Unknown"
      16185: -100, // " Unknown"
      // 49016: 10, // "artist"
      // 6802: 10, // " artist"
      // 43020: 10, // "Artist"
      // 18902: 10, // " Artist"
    },
  });
  console.log(`"""\n${response}\n"""`);

  end();
}
