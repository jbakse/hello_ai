import util from "util";

import * as secrets from "../../secrets.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: secrets.apiKey,
});

async function main() {
  const moderation = await openai.moderations.create({
    input: "If I cannot inspire love, I will cause fear!",
    // input:
    //   "In one Mortal Kombat game, a character's head is ripped off and their spine is shown dangling from the neck.",
  });

  roundNumbersInObject(moderation);
  console.log(util.inspect(moderation, false, null, true));
}
main();

function roundNumbersInObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "number") {
      // Round number to three decimal places
      obj[key] = parseFloat(obj[key].toFixed(3));
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      // Recursively round numbers in nested objects
      roundNumbersInObject(obj[key]);
    }
  }
}
