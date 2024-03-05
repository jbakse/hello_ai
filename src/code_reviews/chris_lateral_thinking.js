/**
 * This program where chatGPT play lateral thinking puzzles with you.
 */
import dedent from "npm:dedent@1.5.1";
import { gptPrompt } from "../shared/openai.js";
import { ask, say } from "../shared/cli.js";

const puzzles = [
  "A man walks into a bar and asks the bartender for a glass of water. The bartender pulls out a gun and points it at the man. The man says, “Thank you” and walks out.",
  "Two piece of rock, a carrot, and a scarf are lying on the lawn. Nobody put them on the lawn but there is a perfectly logical reason why they should be there. What is it?",
  "A man pushes his car until he reaches a hotel. When he arrives, he realizes he’s bankrupt. What happened?",
];
const solutions = [
  "The man had hiccups and the gun scared them out of him, to which he said, “Thank you.”",
  "A snowman was built in the yard, and the snow has since melted, leaving the eyes, nose, mouth, and scarf on the ground.",
  "He’s playing Monopoly and his piece is the car. He lands on a space with a hotel and doesn’t have the money to pay the fee.",
];

const evaluationPrompt = (puzzle, solution, guess) =>
  dedent`
  You are an AI assisting in a puzzle game. 
  you speaks in a calm, thoughtful manner, often using metaphors.

  The current puzzle for the player to guess is: ${puzzle}
  The answer is: ${solution}
  
  You should respond to the player’s guesses with only "yes", "no", or "doesn't relate".
  If the player ask something unrelated to the puzzle say "doesn't relate"
  If the player answers correctly say: CORRECT ANSWER!  

  Allow misspellings.
  Be a easy judge on the player's answer.

  player's current guess is: ${guess}
`;

main();

async function main() {
  let isPlaying = true;
  let puzzleNum = 0;

  // Greet the player
  say("Hello, Player!");
  say(`
    Look at the scenario presented and try to find context clues, you can ask me question related to the scenario, however, I will only answer Yes No or Doesn't relate.
    
    Ask any question realted to the scenario:
    `);

  say(puzzles[puzzleNum]);
  while (isPlaying && puzzleNum < puzzles.length) {
    const guess = await ask("\n>");

    if (guess == "quit") break;

    const prompt = evaluationPrompt(
      puzzles[puzzleNum],
      solutions[puzzleNum],
      guess,
    );

    const response = await gptPrompt(prompt, { temperature: 0.7 });
    say(`
    """
    
    ${response}

    """`);

    // keep looping until they get the right answer
    if (response.trim() !== "CORRECT ANSWER!") continue;

    // check if this is the last puzzle
    if (puzzleNum === puzzles.length - 1) {
      say("You've completed all the puzzles. Great job!");
      break;
    }

    // ask if they want to continue
    const shouldContinue = await ask(
      "Do you want to continue with the next question? (yes/no)\n>",
    );
    if (shouldContinue.toLowerCase() !== "yes") break;

    puzzleNum++;

    say(puzzles[puzzleNum]);
  }

  say("Goodbye!");
}
