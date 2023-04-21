import { ask, gpt, end } from "./shared.js";

main();

async function main() {
  console.log("Hello, GPT!");

  const a = await ask("What is variable a");
  const b = await ask("What is variable b");
  const c = await ask("What is variable c");

  console.log("");

  const prompt = `With a = ${a},  b = ${b}, c = ${c}, can you solve the quadratic formula with these numbers?`;

  const formula = await gpt(prompt, { temperature: 0.3 });
  console.log(`"""\n${formula}\n"""`);

  end();
}
