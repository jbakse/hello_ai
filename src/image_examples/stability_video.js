console.log("This example is expensive! $0.20 per run!");
console.log("It's also very rough code, without any clean up.");
console.log("And the results are not very good.");
console.log("So don't run this unless you really want to.");
console.log("Exiting!");
Deno.exit();

import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
const __dirname = new URL(".", import.meta.url).pathname;
const env = await load({ envPath: `${__dirname}../.env` });
console.log(env.STABILITY_API_KEY);

async function startVideo() {
  // call pollVideo every 10 seconds until it returns something

  const data = new FormData();

  const file = await Deno.readFile(`${__dirname}out/spell.jpg`);
  data.append("image", new Blob([file], { type: "image/jpeg" }), "image.png");
  data.append("seed", "0");
  data.append("cfg_scale", "2.5");
  data.append("motion_bucket_id", "80");

  try {
    const request = new Request(
      "https://api.stability.ai/v2alpha/generation/image-to-video",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.STABILITY_API_KEY}`,
          // Form data headers are automatically set by fetch when passing FormData
        },
        body: data,
      },
    );

    console.log("Request:", request);

    const response = await fetch(request);

    console.log("Response:", response);
    if (!response.ok) {
      const result = await response.json();
      console.log(result);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const generationID = result.id;

    console.log("Generation ID:", generationID);
    return generationID;
  } catch (error) {
    console.error(error);
  }
}

async function pollVideo(id) {
  try {
    console.log("Polling for generation status...");
    const response = await fetch(
      `https://api.stability.ai/v2alpha/generation/image-to-video/result/${id}`,
      {
        method: "GET",
        headers: {
          "accept": "", // Use 'application/json' to receive base64 encoded JSON
          "authorization": "Bearer ${env.STABILITY_API_KEY}",
        },
      },
    );
    console.log(response);

    if (!response.ok) {
      const result = await response.json();
      console.log(result);
      return true;
    }

    if (response.status === 202) {
      console.log("Generation is still running, try again in 10 seconds.");
      return false;
    } else if (response.status === 200) {
      console.log("Generation is complete!");
      const data = new Uint8Array(await response.arrayBuffer());
      await Deno.writeFile(`${__dirname}out/spell.mp4`, data);
      return true;
    }
  } catch (e) {
    console.error(e);
  }
}

const id = await startVideo();
console.log("id:", id);

const interval = setInterval(async () => {
  const result = await pollVideo(id);
  if (result) {
    clearInterval(interval);
  }
}, 10000);
