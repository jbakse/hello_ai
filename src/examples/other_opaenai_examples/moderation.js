import OpenAI from "npm:openai@4";

import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
const env = await load({ envPath: ".env" });

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const input = "You are big dummy.";
// const input =  "If I cannot inspire love, I will cause fear!",
// const input =  "In one Mortal Kombat game, a character's head is ripped off and their spine is shown dangling from the neck.",

async function main() {
  console.log(input);
  const moderation = await openai.moderations.create({
    input,
  });

  roundNumbersInObject(moderation);
  console.log(moderation);
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
