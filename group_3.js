import { ask, gpt, end } from "./shared.js";

main();

async function main() {
  console.log("Hello, GPT!");

  let ques = await ask("What is your favorite color?");
  let ques2 = await ask("What is your least favorite color");

  let prompt = `Why is ${ques} a bad color, and ${ques2} a good color?`;

  let result = await gpt(prompt, { temperature: 0.5 });
  console.log(`"""\n${result}\n"""`);

  end();
}
