import * as fal from "npm:@fal-ai/serverless-client";
import dedent from "npm:dedent";

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import { loadEnv } from "../shared/util.ts";
import { gptPrompt, initOpenAI } from "../shared/openai.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";
import * as log from "../shared/logger.ts";

/// Configure Logging
log.setLogLevel(log.LogLevel.INFO);

/// Set Working Directory
Deno.chdir(new URL(".", import.meta.url).pathname);

/// Init FAL API
const env = loadEnv();

const falKey = Deno.env.get("FAL_API_KEY") || env.FAL_API_KEY;

if (!falKey) log.warn("No FAL_API_KEY in Deno.env or .env file");
log.info("FAL_API_KEY: " + falKey);
fal.config({
  credentials: falKey,
});

/// Init OpenAI API
initOpenAI();

/// Init Oak server
const app = new Application();
const router = new Router();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

/// API For Card Generation
router.get("/api/cards", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  const shortPrompt = prompt.slice(0, 128);
  log.info("/api/cards prompt: " + shortPrompt);
  const result = await gptPrompt(
    dedent`
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
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      max_tokens: 256,
    },
  );
  log.info(result);
  ctx.response.body = result;
});

/// API For Art Generation
router.get("/api/art", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  const stylePrompt = "retro comic book illustration";

  const result = await fal.subscribe("fal-ai/fast-lightning-sdxl", {
    input: {
      "prompt": `${prompt}, ${stylePrompt}`,
      "image_size": "square_hd",
      "num_inference_steps": "4",
      "num_images": 1,
      "enable_safety_checker": true,
    },
    logs: false,
  });

  ctx.response.body = result.images[0].url;
});

/// Start Server
log.info("Timeline");
log.info("\nListening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
