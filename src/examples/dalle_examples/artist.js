import { say } from "../../shared/cli.ts";
import { promptDalle } from "../../shared/openai.ts";

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

  const imageResponse = await promptDalle(prompt);
  say(imageResponse.url);
}

function p(array) {
  return array[Math.floor(Math.random() * array.length)];
}
