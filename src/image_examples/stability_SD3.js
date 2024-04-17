import { decodeBase64 } from "https://deno.land/std@0.207.0/encoding/base64.ts";

import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
const __dirname = new URL(".", import.meta.url).pathname;
const env = await load({ envPath: `${__dirname}/../../.env` });

//await makeImageStability("A painting of a cat in golden armor", { seed: 1 });
await makeImageStability(
  "A cartoon drawing of a girl and a panda playing videogames in front of CRT tv in 80s bedroom. Text on TV says 'ATARI'",
  { seed: 1 },
);

export async function makeImageStability(prompt, c = {}) {
  const path = "https://api.stability.ai/v2beta/stable-image/generate/sd3";

  const headers = {
    Accept: "image/*",
    Authorization: `Bearer ${env.STABILITY_API_KEY}`,
  };

  const formData = new FormData();
  formData.append("prompt", prompt);
  // formData.append("negative_prompt", negative_prompt);
  formData.append("output_format", "jpeg");
  c.seed && formData.append("seed", c.seed);

  const response = await fetch(path, {
    method: "POST",
    validateStatus: undefined,
    responseType: "arraybuffer",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }

  const arrayBuffer = await response.arrayBuffer();

  Deno.writeFileSync(
    `${__dirname}/out/stability_sd3.png`,
    new Uint8Array(arrayBuffer),
    {
      create: true,
    },
  );
}
