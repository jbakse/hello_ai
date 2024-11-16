/**
 * This script first runs a simple battle simulation between a fox and a cat and creates an outline of each attack in the battle.
 * After the battle simulation completes, the program prompts gpt to write a short story based on the outline.
 * It then feeds this story back into gpt to summarize it.
 */

import { say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";

async function main() {
  /// Simulate Battle
  const fox = { hp: 10, attack: 12, defense: 6 };
  const cat = { hp: 10, attack: 12, defense: 6 };

  let outline = "";
  while (fox.hp > 0 && cat.hp > 0) {
    outline += "The fox attacks the cat. ";
    if (Math.random() * fox.attack > Math.random() * cat.defense) {
      const damage = 2 + Math.floor(Math.random() * 5);
      cat.hp -= damage;
      outline += `The fox hits the cat doing ${damage}/7 damage. `;
    } else {
      outline += "The fox misses the cat. ";
    }

    outline += "\n";

    outline += "The cat attacks the fox. ";
    if (Math.random() * cat.attack > Math.random() * fox.defense) {
      const damage = 2 + Math.floor(Math.random() * 5);
      fox.hp -= damage;
      outline += `The cat hits the fox doing ${damage}/7 damage. `;
    } else {
      outline += "The cat misses the fox. ";
    }

    outline += "\n";
  }

  outline += `The fox now has ${fox.hp}/10 hp. `;
  outline += `The cat now has ${cat.hp}/10 hp. `;

  say("Battle Outline:");
  say(outline);

  /// Create Story
  const prompt = `
  Write a short story about a cat and a fox fighting based on the outline below. Use colorful, descriptive language. Don't use any numbers to describe damage or health amounts, use descriptive adjectives instead.
  ${outline}`;

  const response = await promptGPT(prompt, {
    max_tokens: 1000,
  });

  say("Story:");
  say(`${response}`);

  /// Create Summary
  const prompt2 = `
  Summarize following story in four sentences.
  ${response}
  `;
  const response2 = await promptGPT(prompt2, { max_tokens: 500 });

  say("Summary:");
  say(`${response2}`);
}

main();
