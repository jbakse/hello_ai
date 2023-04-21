import { ask, gpt, end } from "./shared.js";
// GROUP 1: Reshma, Sahiti, Shayla

main();

async function main() {
  console.log("ChatGPT: Can you help me? I'm trying to figure out who I am...");

  const prompt = await ask("What is my name?");
  // const result = await gpt(prompt + " is your name", { temperature: 0.3 });
  //console.log(`"""\n${result}\n"""`);

  const prompt2 = await ask("How do you know if I am right?");
  // const result2 = await gpt(prompt2, { temperature: 0.3 });
  //console.log(`"""\n${result2}\n"""`);

  const prompt3 = await ask("Who are my parents?");
  // const result3 = await gpt(prompt3, { temperature: 0.3 });
  //console.log(`"""\n${result3}\n"""`);

  //Write a story
  //const result3 = await gpt(prompt3, { temperature: 0.3 });
  const queryForGPT = `Pretend you don't know who you are, and someone tells you that ${prompt} is your name, you know you are right because ${prompt2}, and your parents are ${prompt3}. Write a summary of who you are. Write a note appreciating this imaginary life you have, mentioning the etymology of your name, and the history of your parents. End with a rhetorical question reflecting on your future, based on why you are right.`;
  const finalResult = await gpt(queryForGPT, { temperature: 0.3 });
  console.log(`"""\n${finalResult}\n"""`);

  //  const prompt = `My name is ${name} and I am from ${town}. Create a limerick about me.`;

  end();
  //ctrl c to exit
}
