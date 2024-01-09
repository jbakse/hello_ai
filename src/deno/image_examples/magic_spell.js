import { say } from "../shared/cli.js";
import { gptPrompt, makeImage } from "../shared/openai.js";

main();

async function main() {
  say("Generating a spell...");

  const color = pick([
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "silver",
    "gold",
    "black",
    "white",
  ]);
  const shape = pick([
    "circle",
    "square",
    "triangle",
    "star",
    "bear",
    "wolf",
    "machine",
    "earth",
    "fire",
    "water",
    "air",
    "light",
    "darkness",
  ]);
  const size = pick(["small", "medium", "large", "huge"]);

  say(`color: ${color} shape: ${shape} size: ${size}`);

  const result = await gptPrompt(
    `breifly describe the visual effect of a spell with these properties: ${color}, ${shape}, ${size} \n\n Your writing should complete the sentence "The witch casts..."`,
    { temperature: 0.8 },
  );

  say(result);

  const url = await makeImage(result + " Fantasy Art Digital Painting.");

  say(url);
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}
