/**
 * This program "fakes" a text adventure game using Javascript and GPT.
 * It provides a basic loop which prompts the user for commands and then prompts
 * GPT with some high level instructions, the last few GPT responses
 * for context, and the user's command.
 *
 * If the user "plays along" the experience is suprisingly similar to a true
 * text adventure game. But the user can easily "break" the game by issuing
 * outlandish commands.
 */

// deno-lint-ignore-file no-await-in-loop

import { promptGPT } from "../../shared/openai.ts";
import { ask, say } from "../../shared/cli.ts";

main();

async function main() {
  const context = {
    history: [],
    location: "woods",
    player: {},
  };

  say("Hello, Player!");
  context.player.name = await ask("What is your name?");
  context.player.class = await ask("What is your class?");

  say("");

  while (true) {
    const command = await ask("What do you want to do?");
    if (command === "quit") break;

    const prompt = `
  This is a text adventure game.
  The player is a ${context.player.class} named ${context.player.name}.
  The current setting is ${context.location}.
 
  Recently: ${context.history.slice(-3).join(" ")}

  Respond in second person.
  Be breif, and avoid narating actions not taken by the player via commands.
  When describing locations mention places the player might go.

  

  The player command is '${command}'. 
  `;

    const response = await promptGPT(prompt, {
      max_tokens: 128,
      temperature: 0.5,
    });
    context.history.push(response);
    say(`\n${response}\n`);
  }
}
