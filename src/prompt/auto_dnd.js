/**
 * This program builds on dm.js which "fakes" a text adventure game using
 * Javascript and GPT.
 *
 * It extends that example by having GPT decide what to do and play the game
 * itelf.
 */

import { gptPrompt } from "../shared/openai.js";
import { ask, end } from "../shared/cli.js";

main();

async function main() {
  console.log("Hello, Player!");

  let history = [];

  const theme = "wild west";
  const location = "saloon";
  const player = {};
  player.name = await ask("What is your name?");
  player.class = await ask("What is your class?");

  console.log("");

  let turns = 0;
  while (turns++ < 10) {
    const player_prompt = `
    You are playing a text adventure.
    You are a ${player.class} named ${player.name}.
    You can issue commands in the form <verb> <noun>.
    The verbs are look, go, take, talk, and use.
    You can look at things, go to places, take small things, talk to people, and use interactive things.
    You can only use nouns that are mentioned by the game.
    
    Recently: ${history.slice(-10).join(" ")}

    What command do you want to issue?
    `;

    let command = "look";
    if (turns > 1)
      command = await gptPrompt(player_prompt, {
        max_tokens: 10,
        temperature: 1.2,
      });

    history.push(command);
    console.log(`\n ${turns}> ${command}\n`);

    let event = "";
    if (turns === 6) event = "add a new character to the scene";
    let prompt = `
  This is a ${theme} themed text adventure game.
  The player is a ${player.class} named ${player.name}.
  The current setting is ${location}.
 
  Recently: ${history.slice(-3).join(" ")}

  Respond in second person.
  Be breif but descriptive. Avoid narating actions not taken by the player via commands.
  When describing locations mention places the player might go and people present.

  ${event}

  The player command is '${command}'. 
  `;

    let response = await gptPrompt(prompt, {
      max_tokens: 128,
      temperature: 1.0,
    });
    history.push(response);
    console.log(`\n${response}\n`);
  }

  let summary_prompt = `
    Rewrite this text adventrue transcript as an excerpt from a pulp novel. Improve the writing and make it easy to read. Use the third person. Use a lot of description and adjectives. Embelish. Include and expand dialog.
    The hero is a ${player.class} named ${player.name}.
    ${history.join(" ")}
    `;

  let summary = await gptPrompt(summary_prompt, {
    max_tokens: 2048,
    temperature: 0.5,
  });
  console.log(`\nsummary:\n${summary}\n`);

  end();
}
