import { makeImage, say, gptChat, end } from "../shared.js";

main();

async function main() {
  say("Generating a spell...");

  let color = pick([
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
  let shape = pick([
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
  let size = pick(["small", "medium", "large", "huge"]);

  say(`color: ${color} shape: ${shape} size: ${size}`);

  let result = await gptChat(
    `breifly describe the visual effect of a spell with these properties: ${color}, ${shape}, ${size} \n\n Your writing should complete the sentence "The witch casts..."`,
    { temperature: 0.8 },
  );

  say(result);

  const url = await makeImage(result + " Fantasy Art Digital Painting.");

  say(url);

  end();
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}
