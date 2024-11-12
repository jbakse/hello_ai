// Simple Deno backend with a static server and a custom route that
// uses the OpenAI API to generate jokes.

// Import the the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import server helper functions from the class library
import { createExitSignal, staticServer } from "./src/shared/server.ts";

// Import the promptGPT function from the class library
import { promptGPT } from "./src/shared/openai.ts";

import { isDenoDeployment } from "./src/shared/deno.ts";
import * as log from "./src/shared/logger.ts";

// tell the shared library code to log everything
log.setLogLevel(log.LogLevel.DEBUG);
log.info("Starting webapp_starter");

// deno deploy uses root of the repo as the current working directory
// so switch to this directory if needed
if (isDenoDeployment()) {
  log.info("deno deploy detcted, cd webapp_starter");
  Deno.chdir("webapp_starter");
}
// log the current working directory and contents
// this helps with debugging deployments
const entries = [];
for await (const dirEntry of Deno.readDir(".")) {
  entries.push(dirEntry.name);
}
log.info(`cwd: ${Deno.cwd()} (${entries.join(", ")})`);

// Create an instance of the Application and Router classes
const app = new Application();
const router = new Router();

// Create a route to handle requests to /api/joke
router.get("/api/joke", async (ctx) => {
  // Get the topic from the query string `?topic=...`
  const topic = ctx.request.url.searchParams.get("topic");

  // Log the request to the terminal
  log.log("someone made a request to /api/joke", topic);

  // Ask GPT to generate a joke about the topic
  const joke = await promptGPT(`Tell me a brief joke about ${topic}.`);

  // Send the joke back to the client
  ctx.response.body = joke;
});

// Tell the app to use the custom routes
app.use(router.routes());
app.use(router.allowedMethods());

// Try serving undefined routes with static files
app.use(staticServer);

// Everything is set up, let's start the server
log.info("\nListening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
