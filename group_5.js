import { ask, gpt, end } from "./shared.js";

main();

async function main() {
  console.log("Hello, GPT!");

  let prompt = await ask("What do you want to ask?");

  let result = await gpt(prompt, { temperature: 0.3 });
  console.log(`"""\n${result}\n"""`);

  end();
}
