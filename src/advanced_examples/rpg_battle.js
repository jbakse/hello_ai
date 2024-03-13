/**
 * A text-based role-playing game style battle game.
 * Uses GPT to parse user commands.
 * Provides structure to the battle by tracking HP and MP and enforcing rules.
 *
 * Demonstrates GPT's function calling capabilities.
 * https://platform.openai.com/docs/guides/function-calling
 */

import { Chalk } from "npm:chalk@5";

const chalk = new Chalk({ level: 1 });

import dedent from "npm:dedent";

import { ask, say } from "../shared/cli.ts";
import { gpt } from "../shared/openai.ts";

/////////////////////////////////////////////////////////////////
/// GAME CODE

const game_data = {
  player_hp: 10,
  player_mp: 1,
  enemy_hp: 10,
};

function attack() {
  const damage = randomInt(0, 3);
  game_data.enemy_hp -= damage;
  let summary = `Player attacks: ${damage}/3 damage. `;
  summary += counter();
  summary += sitRep();
  return summary;
}

function magic() {
  if (game_data.player_mp < 1) {
    return "no mana. ";
  }
  const damage = randomInt(3, 5);
  game_data.enemy_hp -= damage;
  game_data.player_mp -= 1;
  let summary = `Player attacks: ${damage}/3 magical damage. `;
  summary += counter();
  summary += sitRep();
  return summary;
}

function counter() {
  if (game_data.enemy_hp <= 0) {
    return "Enemy is killed! ";
  }
  const damage = randomInt(0, 3);
  game_data.player_hp -= damage;
  const summary = `Enemy attacks: ${damage}/3 damage. `;
  return summary;
}

function sitRep() {
  return JSON.stringify(game_data);
}

/////////////////////////////////////////////////////////////////
/// GPT CONFIG

const tools = [
  {
    type: "function",
    function: {
      name: "attack",
      description: "Attack the enemy with a weapon",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "magic",
      description: "Attack the enemy with magic",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
];

const availableFunctions = {
  attack,
  magic,
};

const messages = [
  {
    role: "system",
    content: dedent`
      You assist in running a role-playing text adventure game. You take user commands, call functions to update the game state, and narrate the results.
      
      The player is engaged in battle and can't pursue other activities until it concludes. 
      
      - Narrate only the latest turn.
      - Avoid using numbers in your narration. 
      - Be brief.
      - Frequently include taunts or complaints from the enemy. Use an over-the-top tone.

      The player and the enemy both start with their maximum health: 10.
      If the user looks at the enemy describe its physical condition and health.
      
      The player has two functions available: attack and magic. 

      The character has a short sword.
      The character knows the following spells: firebolt

      The room doesn't have any items.
      The player doesn't have any items.

      When calling functions, choose only the best single function. Never call more than one function at a time.
      
      If a tool returns "unknown function" let the player know they can't do the thing they tried.
      `,
  },
];

/////////////////////////////////////////////////////////////////
/// GAME LOOP

async function game() {
  say(
    `\nWelcome to battle.js. This is a text based fighting game. Your character can attack with a short sword or use magic. There is no specific syntax for commands. Just type what you want to do.\n`,
  );
  // start with some introductory text
  const introText = "A wild goblin appears!";
  messages.push({ role: "assistant", content: introText });
  say(`\n${introText}`);

  // the main game loop
  while (game_data.player_hp > 0 && game_data.enemy_hp > 0) {
    // show the current game state
    console.log(game_data);

    // ask the user for their next command
    const command = await ask();
    messages.push({ role: "user", content: command });

    // use GPT to respond to command
    let responseMessage = await gpt({
      messages,
      tools,
      max_tokens: 256,
    });
    messages.push(responseMessage);

    // if GPT calls tools, handle them
    if (responseMessage.tool_calls) {
      handleToolCalls(responseMessage.tool_calls);
      responseMessage = await gpt({
        messages,
        max_tokens: 256,
      });
      messages.push(responseMessage);
    }

    // show user response
    say(responseMessage.content);
  }
}

function handleToolCalls(tool_calls) {
  for (const tool_call of tool_calls) {
    const functionName = tool_call.function.name;
    const response = availableFunctions[functionName]?.() || "unknown function";
    say(chalk.blue(`${functionName}()`));
    messages.push({
      tool_call_id: tool_call.id,
      role: "tool",
      name: functionName,
      content: response,
    });
  }
}

try {
  await game();
} catch (e) {
  console.error(chalk.red("\nWell, something went wrong."));
  console.error(e);
} finally {
  const shouldLog = await ask("\nLog messages? (y/n) ");
  if (shouldLog === "y") {
    console.log(messages);
  }
  console.log("\n--end--\n");
}

/////////////////////////////////////////////////////////////////
/// UTIL

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
