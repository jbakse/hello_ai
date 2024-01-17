// A dice roller that works with plain language descriptions of dice rolls.
// powered by https://dice-roller.github.io/documentation/

// try: "roll two six-sided dice and keep the highest result"
// try: "ten exploding tenners"
// try: "un dé à 20 faces et un dé à six faces"

import { DiceRoll } from "https://cdn.skypack.dev/@dice-roller/rpg-dice-roller";

import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

say("Dice!");

while (true) {
  const description = await ask("\n\nWhat do you want to roll? ");
  if (!description || description === "exit") break;
  const response = await descriptionToNotation(description);
  say(`The notation is: ${response}`);
  roll(response);
}

function roll(notation) {
  try {
    const roll = new DiceRoll(notation);
    say(`You rolled ${roll.output}`);
  } catch (e) {
    say("The notation didn't work.");
    say(e.message);
  }
}

async function descriptionToNotation(description) {
  const response = await gptPrompt(
    `You are an assistant that helps people write the correct RPG Dice Notation for their dice rolls. You are given a plain language prompt of the dice roll and you must write the correct notation for it. Respond with only the notation, no explinations.
Examples:
Roll 1 six-sided die: 1d6
Roll 2 six-sided dice: 2d6
Roll 2 twenty-sided dice and keep the highest result: 2d20kh1
Roll 1 twenty-sided die, exploding: 1d20!
1d6: 1d6

Prompt:
${description}: `,
  );
  return response;
}
