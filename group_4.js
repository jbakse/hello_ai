// import { ask, gpt, end } from "./shared.js";

// main();

// async function main() {
//   console.log("Hello, GPT!");

//   let prompt = await ask("What do you want to ask?");

//   let result = await gpt(prompt, { temperature: 0.3 });
//   console.log(`"""\n${result}\n"""`);

//   end();
// }

/**
 * This program prompts the user to enter their name and hometown
 * and then uses GPT-3 language model to generate a limerick about the user.
 */

import { ask, gpt, end } from "./shared.js";

main();

async function main() {
  console.log("Hello, GPT!");

  const food = await ask("What is your favorite food?");
  const place = await ask("What is your ideal vacation spot?");
  const travel = await ask("Preferred mode of transport?");

  console.log("");

  const prompt = `Create a 3-day travel itinerary to ${place} including how long it will take to travel from NYC by ${travel}. Also tell me where to find the best ${food} every day.`;

  const limerick = await gpt(prompt, { temperature: 0.2 });
  console.log(`"""\n${limerick}\n"""`);

  end();
}
