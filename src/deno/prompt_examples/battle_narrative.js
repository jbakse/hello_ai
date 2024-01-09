/**
 * This file implements a simple battle simulation between a fox and a cat
 * using JavaScript basic imperative code. The outcome of each attack is
 * described as a string.
 * After the battle simulation completes, the program prompts the gpt to write
 * a short story about the battle.
 * It then feeds this story back into gpt to summarize it.
 */

import { say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

async function main() {
  const fox = { hp: 10, attack: 12, defense: 6 };
  const cat = { hp: 10, attack: 12, defense: 6 };

  let outline = "";
  while (fox.hp > 0 && cat.hp > 0) {
    outline += "The fox attacks the cat. ";
    if (Math.random() * fox.attack > Math.random() * cat.defense) {
      const damage = 2 + Math.floor(Math.random() * 5);
      cat.hp -= damage;
      outline += `The fox hits the cat doing ${damage} damage. `;
    } else {
      outline += "The fox misses the cat. ";
    }

    outline += "\n";

    outline += "The cat attacks the fox. ";
    if (Math.random() * cat.attack > Math.random() * fox.defense) {
      const damage = 2 + Math.floor(Math.random() * 5);
      fox.hp -= damage;
      outline += `The cat hits the fox doing ${damage} damage. `;
    } else {
      outline += "The cat misses the fox. ";
    }

    outline += "\n";
  }

  outline += `The fox now has ${fox.hp}/10 hp. `;
  outline += `The cat now has ${cat.hp}/10 hp. `;

  say(outline);

  const prompt = `
  Write a short story about a cat and a fox fighting based on the outline below. Use colorful, descriptive language. Don't use any numbers to describe damage or health amounts, use descriptive adjectives instead.
  ${outline}`;

  const response = await gptPrompt(prompt, { max_tokens: 1000 });

  say(`${response}`);

  const prompt2 = `
  Summarize following story in four sentences.
  ${response}
  `;
  const response2 = await gptPrompt(prompt2, { max_tokens: 500 });

  say(`${response2}`);
}

main();
