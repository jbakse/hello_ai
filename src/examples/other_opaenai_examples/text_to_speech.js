import OpenAI from "npm:openai@4";

import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
const env = await load({ envPath: ".env" });

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

async function main() {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input:
      "Nothing is so painful to the human mind as a great and sudden change.",
  });

  const buffer = new Uint8Array(await mp3.arrayBuffer());
  await Deno.writeFile("./out/out.mp3", buffer);

  console.log("Wrote to ./out/out.mp3");
}

main();
