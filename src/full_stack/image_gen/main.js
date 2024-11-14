/// IMPORTS

// load the environment variables from the .env file
// this includes the API Keys
import { loadEnv } from "shared/util.ts";
const env = loadEnv();

import * as log from "shared/logger.ts";

// import the FAL api and configure it
import * as fal from "npm:@fal-ai/serverless-client";
if (!env.FAL_API_KEY) log.warn("No FAL_API_KEY in .env file");
fal.config({
  credentials: env.FAL_API_KEY, // or a$function that returns a string
});

/// set working directory
// set working directory to this script's directory so ./public can be found regardless of where the script is run from
Deno.chdir(import.meta.dirname);

// import helper function for calling DALL•E from share
import { promptDalle as makeImageDalle } from "shared/openai.ts";

// Oak is a middleware framework for Deno's http server, it makes it easier to
// write web apps in Deno.
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// static server serves files from the public directory
// exitSignal is used to shut down the server when the process exits (ctrl-c)
import { createExitSignal, staticServer } from "shared/server.ts";

/// IMPORTS

// create web server
const app = new Application();
const router = new Router();

// add the DALL•E route
router.get("/api/openai/dalle3", async (ctx) => {
  // clean up input
  const prompt = ctx.request.url.searchParams.get("prompt");
  const shortPrompt = prompt.slice(0, 1024);
  console.log(`/api/openai/dalle3: ${prompt}`);

  // call the api
  const result = await makeImageDalle(shortPrompt);

  // return the result
  console.log("result:", result);
  ctx.response.body = result.url;
});

//
router.get("/api/fal/cascade", async (ctx) => {
  // clean up input
  const prompt = ctx.request.url.searchParams.get("prompt");
  const shortPrompt = prompt.slice(0, 1024);
  console.log(`/api/fal/cascade: ${prompt}`);

  // call the api
  const result = await fal.subscribe("fal-ai/stable-cascade", {
    input: {
      "prompt": shortPrompt,
      "negative_prompt": "",
      "first_stage_steps": 20,
      "second_stage_steps": 10,
      "guidance_scale": 4,
      "image_size": "square_hd",
      "enable_safety_checker": true,
      "num_images": 1,
      "seed": 1337,
      "loras": [],
    },
  });

  // return the result
  console.log("result:", result);
  ctx.response.body = result.images[0].url;
});

router.get("/api/fal/lightning", async (ctx) => {
  // clean up input
  const prompt = ctx.request.url.searchParams.get("prompt");
  const shortPrompt = prompt.slice(0, 1024);
  console.log(`/api/fal/lightning: ${prompt}`);

  // call the api
  const result = await fal.subscribe("fal-ai/fast-lightning-sdxl", {
    input: {
      "prompt": shortPrompt,
      "image_size": "square_hd",
      "num_inference_steps": "4",
      "num_images": 1,
      "enable_safety_checker": true,
      "seed": 1337,
    },
  });

  // return the result
  console.log("result:", result);
  ctx.response.body = result.images[0].url;
});

router.get("/api/fal/aura", async (ctx) => {
  // clean up input
  const prompt = ctx.request.url.searchParams.get("prompt");
  const shortPrompt = prompt.slice(0, 1024);
  console.log(`/api/fal/aura: ${prompt}`);

  // call the api
  const result = await fal.subscribe("fal-ai/aura-flow", {
    input: {
      "prompt": shortPrompt,
      "num_images": 1,
      "enable_safety_checker": true,
      "seed": 1337,
    },
  });

  // return the result
  console.log("result:", result);
  ctx.response.body = result.images[0].url;
});

router.get("/api/fal/flux", async (ctx) => {
  // clean up input
  const prompt = ctx.request.url.searchParams.get("prompt");
  const shortPrompt = prompt.slice(0, 1024);
  console.log(`/api/fal/flux: ${prompt}`);

  // call the api
  const result = await fal.subscribe("fal-ai/flux/dev", {
    input: {
      "prompt": shortPrompt,
      "num_images": 1,
      "enable_safety_checker": true,
      "seed": 1337,
    },
  });

  // return the result
  console.log("result:", result);
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
