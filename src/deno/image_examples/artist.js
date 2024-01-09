import { say } from "../shared/cli.js";
import { makeImage } from "../shared/openai.js";

main();

async function main() {
  say("Generating a painting...");

  const colors = ["red", "silver", "gold", "black", "white"];
  const shapes = ["circle", "square", "triangle"];
  const sizes = ["small", "medium", "large"];
  const locs = ["upper left", "upper right", "lower left", "lower right"];

  const prompt = `A ${p(colors)} background. ` +
    `A ${p(sizes)} ${p(colors)} ${p(shapes)} in the ${p(locs)}. ` +
    `A ${p(sizes)} ${p(colors)} ${p(shapes)} in the ${p(locs)}. ` +
    // `A ${p(sizes)} ${p(colors)} ${p(shapes)} in the ${p(locs)}. ` +
    "Minimalist oil painting.";

  say(prompt);

  const url = await makeImage(prompt);
  say(url);
}

function p(array) {
  return array[Math.floor(Math.random() * array.length)];
}
