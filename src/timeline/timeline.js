import * as fal from "npm:@fal-ai/serverless-client";

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import { loadEnv } from "../shared/util.ts";
import { gptPrompt } from "../shared/openai.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";

const env = loadEnv();
if (!env.FAL_API_KEY) log.warn("No FAL_API_KEY in .env file");

fal.config({
  credentials: env.FAL_API_KEY, // or a$function that returns a string
});

const app = new Application();
const router = new Router();

// API routes
router.get("/api/art", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");

  const result = await fal.subscribe("fal-ai/fast-lightning-sdxl", {
    input: {
      "prompt": prompt + ", retro comic book illustration",
      "image_size": "square_hd",
      "num_inference_steps": "4",
      "num_images": 1,
      "enable_safety_checker": true,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        // update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  });

  ctx.response.body = result.images[0].url;
});
router.get("/api/cards", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  const shortPrompt = prompt.slice(0, 128);
  const result = await gptPrompt(
    `
  You create cards for a game where people arrange historical events in order.
  Cards contain...
  title: a brief, punchy title. less than six words
  year: year the event happened. always an exact year or estimate prefixed with "c." examples: 1979, c.1000, 2025, 2010s
  art: a description of the art to be used on the card

  Create a JSON object of 5 cards for important events related to the given prompt.

  {
    cards: [
      {
        "title": "Newton's Laws of Motion",
        "year": 1687,
        "art": "Isaac Newton should be in a contemplative pose, holding an apple"
      },
      {
        "title": "Theory of Evolution",
        "year": 1859,
        "art": "Charles Darwin studies a finch"
      },
      // Add more cards here
    ]
  }

  prompt: ${shortPrompt}
  `,
    {
      // model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      max_tokens: 4096,
    },
  );
  console.log("result: ", result);
  ctx.response.body = result;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log("\nListening on http://localhost:8000");

await app.listen({ port: 8000, signal: createExitSignal() });
