// This program where chatGPT play lateral thinking puzzles with you.
//
// Created by Christine Chang
// Edits by Justin Bakse

import dedent from "npm:dedent@1.5.1";
import { gptPrompt } from "../shared/openai.js";

import {
  Confirm,
  Input,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

const puzzles = [
  {
    setup:
      "A man walks into a bar and asks the bartender for a glass of water. The bartender pulls out a gun and points it at the man. The man says, “Thank you” and walks out.",
    solution:
      "The man had hiccups and the gun scared them out of him, to which he said, “Thank you.”",
  },
  {
    setup:
      "Two piece of rock, a carrot, and a scarf are lying on the lawn. Nobody put them on the lawn but there is a perfectly logical reason why they should be there. What is it?",
    solution:
      "A snowman was built in the yard, and the snow has since melted, leaving the eyes, nose, mouth, and scarf on the ground.",
  },
  {
    setup:
      "A man pushes his car until he reaches a hotel. When he arrives, he realizes he’s bankrupt. What happened?",
    solution:
      "He’s playing Monopoly and his piece is the car. He lands on a space with a hotel and doesn’t have the money to pay the fee.",
  },
];

const evaluationPrompt = (setup, solution, userInput) =>
  dedent`
  You are an AI assisting in a puzzle game. 
  you speaks in a calm, thoughtful manner, often using metaphors.

  The current puzzle for the player to guess is: ${setup}
  The answer is: ${solution}
  
  You should respond to the player’s guesses with only "yes", "no", or "doesn't relate".
  If the player ask something unrelated to the puzzle say "doesn't relate"
  If the player answers correctly say: CORRECT ANSWER!  

  Allow misspellings.
  Be a easy judge on the player's answer.

  player's current guess is: ${userInput}
`;

main();

async function main() {
  // Greet the player
  say("Hello, Player!");
  say(dedent`
    Look at the scenario presented and try to find context clues, you can ask me question related to the scenario, however, I will only answer Yes No or Doesn't relate.
    
    Ask any question realted to the scenario:

    `);

  // loop through all puzzles
  for (const puzzle of puzzles) {
    await playPuzzle(puzzle);

    // play again?
    say("");
    const shouldContinue = await Confirm.prompt(
      "Do you want to continue with the next question? (yes/no)\n>",
    );
    if (!shouldContinue) {
      say("Goodbye!");
      Deno.exit(0);
    }
  }

  say("You've completed all the puzzles. Great job!");
  say("Goodbye!");
}

async function playPuzzle({ setup, solution }) {
  say("");
  say(setup);

  // main player QA loop
  while (true) {
    say("");
    const userInput = await Input.prompt("");

    const prompt = evaluationPrompt(setup, solution, userInput);

    const aiResponse = await gptPrompt(prompt, { temperature: 0.7 });
    say(dedent`
        """
        ${aiResponse}
        """
    `);

    // keep looping until they get the right answer
    if (aiResponse.trim() === "CORRECT ANSWER!") return;
  }
}

function say(...args) {
  console.log(...args);
}
