/**
 * This example creates an open ended text adventure game that plays itself.
 * It uses GPT to both choose commands and narrate the result.
 */

// deno-lint-ignore-file no-await-in-loop

import { promptGPT } from "../../shared/openai.ts";
import { ask, say } from "../../shared/cli.ts";

main();

async function getAIPlayerCommand(context) {
  const playerPrompt = `
    You are playing a text adventure.
    You are a ${context.player.class} named ${context.player.name}.
    You can issue commands in the form <verb> <noun>.
    The verbs are look, go, take, talk, and use.
    You can look at things, go to places, take small things, talk to people, and use interactive things.
    Avoid using the same command twice in a row.
    You can only use nouns that are mentioned by the game.
    
    Recently: ${context.history.slice(-3).join(" ")}

    What command do you want to issue?
    `;

  let command = await promptGPT(playerPrompt, {
    max_tokens: 10,
    temperature: 1.2,
    model: "gpt-4o-mini",
  });

  command = command.trim();
  // if the command starts with an allowed verb...
  if (["look", "go", "take", "talk", "use"].includes(command.split(" ")[0])) {
    // return it
    return command;
  } else {
    // otherwise, default to default "look"
    return "look";
  }
}

async function getNarratorResponse(
  context,
) {
  const prompt = `
  This is a ${context.theme} themed text adventure game.
  The player is a ${context.player.class} named ${context.player.name}.
  The current setting is ${context.location}.
 
  Recently: ${context.history.slice(-3).join(" ")}

  Respond in second person.
  Be breif but colorful. Avoid narating actions not specificallytaken by the player via commands.
  When describing locations mention places the player might go and people present.
  Keep your response breif. Do not write more than a three sentences.

  The player command is '${context.history[context.history.length - 1]}'. 
  `;

  return await promptGPT(prompt, {
    max_tokens: 128,
    temperature: 1.0,
    model: "gpt-4o-mini",
  });
}

async function main() {
  /// Setup Game State

  const context = {
    history: [],
    theme: "wild west",
    location: "saloon",
    player: {},
  };

  /// Character Creation
  context.player.name = await ask("What is your name?");
  context.player.class = await ask("What is your class?");

  context.history.push("look");

  /// Main Game Loop
  for (let turn = 0; turn < 5; turn++) {
    // Get narrator's response
    const narration = await getNarratorResponse(context);
    context.history.push(narration);
    say(`${narration}`);

    // Get AI player's command
    const command = await getAIPlayerCommand(context);
    context.history.push(command);
    say(`${turn}> ${command}`);
  }
}
