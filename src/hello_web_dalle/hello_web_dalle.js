import * as fal from "npm:@fal-ai/serverless-client";

import { loadEnv } from "../shared/util.ts";
import * as log from "../shared/logger.ts";

const env = loadEnv();
if (!env.FAL_API_KEY) log.warn("No FAL_API_KEY in .env file");

fal.config({
  credentials: env.FAL_API_KEY, // or a$function that returns a string
});

// Oak is a middleware framework for Deno's http server, it makes it easier to
// write web apps in Deno.
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

import { makeImage } from "../shared/openai.ts";

// static server serves files from the public directory
// exitSignal is used to shut down the server when the process exits (ctrl-c)
import { createExitSignal, staticServer } from "../shared/server.ts";

// create web server
const app = new Application();
const router = new Router();

// add the DALL•E route
router.get("/api/dalle", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  console.log("Request received");
  console.log(prompt);
  const shortPrompt = prompt.slice(0, 1024);
  const result = await makeImage(shortPrompt);
  ctx.response.body = result;
});

router.get("/api/fal", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  console.log("Request received");
  console.log(prompt);
  const shortPrompt = prompt.slice(0, 1024);
  const result = await fal.subscribe("fal-ai/stable-cascade", {
    input: {
      "prompt": shortPrompt,
      "negative_prompt": "",
      "first_stage_steps": 20,
      "second_stage_steps": 10,
      "guidance_scale": 4,
      "image_size": "square_hd",
      "num_images": 1,
      "loras": [],
      "enable_safety_checker": true,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        // update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  });
  console.log("result", result);
  ctx.response.body = result.images[0].url;
});

router.get("/api/falfast", async (ctx) => {
  const prompt = ctx.request.url.searchParams.get("prompt");
  console.log("Request received");
  console.log(prompt);
  const shortPrompt = prompt.slice(0, 1024);
  const result = await fal.subscribe("fal-ai/fast-lightning-sdxl", {
    input: {
      "prompt": shortPrompt,
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
  console.log("result", result);
  ctx.response.body = result.images[0].url;
});

// install routes
app.use(router.routes());
app.use(router.allowedMethods());

// set it up to serve static files from public
app.use(staticServer);

// tell the user we are about to start
console.log("\nListening on http://localhost:8000");

// start the web server
await app.listen({ port: 8000, signal: createExitSignal() });
