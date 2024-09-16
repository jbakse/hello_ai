import { say } from "../../shared/cli.ts";
import { promptDalle, promptGPT } from "../../shared/openai.ts";

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

const result = await promptGPT(
  `breifly describe the visual effect of a spell with these properties: ${color}, ${shape}, ${size} \n\n Your writing should complete the sentence "The witch casts..."`,
  { temperature: 0.8 },
);

say("Generated spell description:");
say(result);

const dalleResponse = await promptDalle(
  result + " Fantasy Art Digital Painting.",
);

say("Dalle, expanded prompt");
say(dalleResponse.revised_prompt);
say("");
say("Dalle, image url");
say(dalleResponse.url);

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}
