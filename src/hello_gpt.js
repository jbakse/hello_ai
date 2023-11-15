import { ask, say, gptChat, end } from "../shared.js";

main();

async function main() {
  say("Hello, GPT!");

  let prompt = await ask("What do you want to ask?");

  let result = await gptChat(prompt, { temperature: 0.3 });

  say(`"""\n${result}\n"""`);

  end();
}
