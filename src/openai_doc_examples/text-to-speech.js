import fs from "fs";
import path from "path";

import * as secrets from "../../secrets.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: secrets.apiKey,
});

const speechFile = path.resolve("./speech.mp3");

async function main() {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input:
      "Nothing is so painful to the human mind as a great and sudden change.",
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}
// this example isn't finished yet. it works if you uncomment the line below

// main();
