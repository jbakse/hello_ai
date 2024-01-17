import { decodeBase64 } from "https://deno.land/std@0.207.0/encoding/base64.ts";

import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
const __dirname = new URL(".", import.meta.url).pathname;
const env = await load({ envPath: `${__dirname}/../.env` });

await makeImageStability("A painting of a cat in golden armor", { seed: 1 });

export async function makeImageStability(prompt, c = {}) {
  const path =
    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${env.STABILITY_API_KEY}`,
  };

  const body = {
    steps: 30,
    width: 1024,
    height: 1024,
    seed: 1,
    cfg_scale: 5,
    samples: 1,
    text_prompts: [
      {
        text: prompt,
        weight: 1,
      },
    ],
    ...c,
  };

  const response = await fetch(path, {
    headers,
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }

  const responseJSON = await response.json();

  responseJSON.artifacts.forEach(async (image) => {
    console.log(image);

    // create .out directory if it doesn't exist
    await Deno.mkdir("./out", { recursive: true });

    // write the image to a file
    await Deno.writeFile(
      `${__dirname}/out/stability_${image.seed}_${body.steps}.png`,
      decodeBase64(image.base64),
      { create: true },
    );
  });
}
